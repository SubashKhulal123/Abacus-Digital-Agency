# MongoDB Setup

The project needs a MongoDB connection string in `MONGO_URI`. **MongoDB
Atlas** (managed, free tier available) is strongly recommended over
self-hosting — you get automated backups, monitoring, and failover
without operating a database server yourself.

## 1. Create a free Atlas account
Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
and sign up (Google/GitHub SSO both work).

## 2. Create a cluster
1. Click **Build a Database**.
2. Choose **M0 Free** (512MB — plenty for launch; upgrade later without
   downtime if you outgrow it).
3. Pick a cloud provider/region close to where your backend will be
   hosted (e.g. same AWS region as your Render/VPS instance) to minimize
   latency.
4. Name the cluster (e.g. `abacus-production`) and create it — takes
   1–3 minutes to provision.

## 3. Create a database user
1. In the left sidebar: **Database Access → Add New Database User**.
2. Authentication method: **Password**.
3. Set a username and a strong, generated password (save it somewhere
   safe — you'll need it in the connection string).
4. Built-in role: **Read and write to any database** is sufficient.

## 4. Allow network access
1. **Network Access → Add IP Address**.
2. For platform-hosted backends (Render, Vercel serverless, etc.) whose
   outbound IPs aren't fixed, use **Allow Access from Anywhere**
   (`0.0.0.0/0`) — Atlas still requires the username/password from step 3,
   so this is standard practice for PaaS deployments, not a security hole
   by itself.
3. For a VPS with a static IP, add that specific IP instead for tighter
   scoping.

## 5. Get your connection string
1. **Database → Connect → Drivers**.
2. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with your step-3 credentials,
   and insert a database name before the `?`:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/abacus_digital_agency?retryWrites=true&w=majority
   ```
4. Paste the full string into `MONGO_URI` in `backend/.env`.

## 6. Verify the connection
```bash
cd backend && npm run dev
```
A successful connection logs `MongoDB connected: cluster0-xxxxx.../abacus_digital_agency`.
If it instead logs `MongoDB initial connection failed`, double-check:
- The password doesn't contain characters that need URL-encoding (`@`,
  `#`, `%`, etc. — if it does, either regenerate a password with only
  alphanumeric characters or percent-encode the special characters)
- Your current IP is allow-listed under Network Access (or you used
  `0.0.0.0/0`)
- The database user's role includes write access

## 7. Seed initial data
```bash
npm run seed:admin   # creates your login
npm run seed:all     # populates every collection with real demo content
```
See [Seed Data](./SEED_DATA.md) for exactly what gets created.

## 8. (Optional) Backups
Atlas M0 doesn't include automated backups. Once you upgrade past M0
(M10+), enable **Cloud Backup** under cluster settings for continuous,
point-in-time recovery. Until then, use the admin panel's
**Settings → Backup** tab periodically, which exports all public content
as a downloadable JSON file — a lightweight supplement, not a replacement
for real database-level backups once you're handling real customer data.

## 9. Production monitoring
Atlas's **Metrics** tab (connections, operation latency, disk usage) is
available free on every tier — worth checking weekly once live, and set
up an **Alert** (Atlas → Alerts) for connection count or disk usage
thresholds so you hear about problems before users do.
