# Deployment Guide

This guide covers five deployment paths. Pick the one that matches your
infrastructure — they're not mutually exclusive (e.g. Vercel for the
frontend + Render for the backend is the fastest path to a live URL;
Docker + PM2 + NGINX is the path for a self-managed VPS).

**Before any of these**, complete:
- [Environment Setup](./ENVIRONMENT_SETUP.md) — every variable explained
- [MongoDB Setup](./MONGODB_SETUP.md) — get a connection string
- [Cloudinary Setup](./CLOUDINARY_SETUP.md) — get upload credentials
- [SMTP Setup](./SMTP_SETUP.md) — get email sending credentials

---

## Option A — Vercel (frontend) + Render (backend)

The fastest path to a live, production-grade deployment with zero server
management. This is the recommended default for most teams.

### 1. Backend on Render
1. Push this repo to GitHub.
2. In the [Render dashboard](https://dashboard.render.com), click **New +
   → Blueprint** and select the repo — Render reads `render.yaml` at the
   repo root and provisions the API service automatically.
3. When prompted, fill in the secret environment variables (`MONGO_URI`,
   `SMTP_*`, `CLOUDINARY_*`, `CLIENT_URL`, `ADMIN_*`) — see
   [Environment Setup](./ENVIRONMENT_SETUP.md) for what each one needs.
4. Deploy. Render gives you a URL like
   `https://abacus-digital-agency-api.onrender.com`.
5. Verify: `GET https://<your-render-url>/api/v1/health` should return
   `{ "success": true, ... }`.
6. Seed the database once, from your local machine, pointed at the same
   `MONGO_URI` you gave Render:
   ```bash
   cd backend && cp .env.example .env   # fill in the same MONGO_URI as Render
   npm install
   npm run seed:admin
   npm run seed:all
   ```

### 2. Frontend on Vercel
1. In the [Vercel dashboard](https://vercel.com/new), import the same
   repo, set **Root Directory** to `frontend`.
2. Vercel auto-detects Vite (the committed `frontend/vercel.json` also
   pins the framework and rewrite rules explicitly).
3. Add an environment variable: `VITE_API_URL` =
   `https://<your-render-url>/api/v1`.
4. Deploy. Vercel gives you a URL like `https://abacus-digital-agency.vercel.app`.
5. Go back to Render and update the backend's `CLIENT_URL` env var to
   your real Vercel URL (needed for CORS + email links), then redeploy
   the backend.
6. Attach a custom domain in both dashboards if you have one — Vercel
   and Render both support this from their respective settings pages.

---

## Option B — Docker Compose (local or a single VPS)

Runs MongoDB, the backend, and the frontend together with one command —
good for local full-stack testing or a small single-server deployment.

```bash
cp backend/.env.example backend/.env   # fill in real Cloudinary/SMTP values
docker compose up --build -d
```

- Frontend: `http://localhost:8080`
- Backend health check: `http://localhost:5000/api/v1/health`
- Mongo Express (DB browser UI): `http://localhost:8081` (user `admin`,
  password `changeme` — **change this** in `docker-compose.yml` before
  exposing it beyond localhost)

Seed the database (once the containers are up):
```bash
docker compose exec backend npm run seed:admin
docker compose exec backend npm run seed:all
```

For real production traffic, prefer MongoDB Atlas over the containerized
`mongodb` service in `docker-compose.yml` — see
[MongoDB Setup](./MONGODB_SETUP.md) for why, and simply remove the
`mongodb` service and point `MONGO_URI` at your Atlas cluster instead.

---

## Option C — Docker images without Compose (any container host)

Build and push each image independently — useful for ECS, Cloud Run,
Kubernetes, Fly.io, etc.

```bash
# Backend
cd backend
docker build -t your-registry/abacus-api:latest .
docker push your-registry/abacus-api:latest

# Frontend (bake the API URL in at build time)
cd ../frontend
docker build --build-arg VITE_API_URL=https://api.yourdomain.com/api/v1 \
  -t your-registry/abacus-web:latest .
docker push your-registry/abacus-web:latest
```

Both images include a `HEALTHCHECK` instruction, so orchestrators that
respect Docker healthchecks (ECS, Swarm) will automatically detect and
replace unhealthy containers.

---

## Option D — Self-managed VPS with PM2 + NGINX (no Docker)

Full control, lowest cost at scale, most operational responsibility.
Tested against Ubuntu 22.04/24.04.

### 1. Server prep
```bash
sudo apt update && sudo apt install -y nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Clone and build
```bash
sudo mkdir -p /var/www/abacus-digital-agency
sudo chown $USER:$USER /var/www/abacus-digital-agency
git clone <your-repo-url> /var/www/abacus-digital-agency
cd /var/www/abacus-digital-agency

# Backend
cd backend
cp .env.example .env   # fill in real values
npm ci --omit=dev
npm run seed:admin
npm run seed:all

# Frontend
cd ../frontend
cp .env.example .env   # VITE_API_URL=https://yourdomain.com/api/v1
npm ci
npm run build
```

### 3. Start the backend with PM2
```bash
cd ../backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the printed instructions to enable boot persistence
```

### 4. Configure NGINX
```bash
sudo cp ../deploy/nginx.conf /etc/nginx/sites-available/abacus
# edit /etc/nginx/sites-available/abacus — set your real domain and the
# frontend root path (/var/www/abacus-digital-agency/frontend/dist)
sudo ln -s /etc/nginx/sites-available/abacus /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. HTTPS
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot rewrites the NGINX config to add the SSL server block and sets
up auto-renewal via a systemd timer — no further action needed.

### 6. Deploying updates
```bash
cd /var/www/abacus-digital-agency && git pull
cd backend && npm ci --omit=dev && pm2 reload abacus-api   # zero-downtime
cd ../frontend && npm ci && npm run build                  # NGINX serves the new build immediately
```

---

## Post-deployment checklist

Regardless of which option you chose:
- [ ] `GET /api/v1/health` returns 200
- [ ] `GET /sitemap.xml` and `GET /robots.txt` resolve at your domain root
- [ ] Admin login works at `/admin/login` with your seeded admin credentials
- [ ] A test contact form submission arrives in your inbox (verifies SMTP)
- [ ] A test image upload in the admin Media Library succeeds (verifies Cloudinary)
- [ ] `CLIENT_URL` on the backend matches your real frontend domain exactly
  (mismatches break CORS and cookie-based auth)
- [ ] Change the seeded admin password immediately after first login
- [ ] See [Production Checklist](./PRODUCTION_CHECKLIST.md) for the full
  go-live list
