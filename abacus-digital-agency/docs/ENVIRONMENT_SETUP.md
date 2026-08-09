# Environment Setup

Every environment variable used across the project, what it does, and
where to get its value. Copy `backend/.env.example` → `backend/.env` and
`frontend/.env.example` → `frontend/.env`, then fill these in — never
commit the real `.env` files (both are gitignored already).

---

## Backend (`backend/.env`)

### Server
| Variable | Required | Example | Notes |
|---|---|---|---|
| `NODE_ENV` | ✅ | `production` | `development` enables verbose logging + Morgan `dev` format |
| `PORT` | ✅ | `5000` | The port the API listens on |
| `CLIENT_URL` | ✅ | `https://abacusdigital.agency` | Used for CORS allow-origin **and** links in transactional emails — must exactly match your live frontend URL (scheme + host, no trailing slash) |

### Database
| Variable | Required | Example | Notes |
|---|---|---|---|
| `MONGO_URI` | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/abacus_digital_agency` | See [MongoDB Setup](./MONGODB_SETUP.md) |

### Authentication
| Variable | Required | Example | Notes |
|---|---|---|---|
| `JWT_SECRET` | ✅ | 64+ random hex chars | Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` — never reuse across environments |
| `JWT_EXPIRE` | ✅ | `7d` | Access token lifetime |
| `JWT_COOKIE_EXPIRE` | ✅ | `7` | Cookie lifetime in **days** |
| `COOKIE_SECRET` | ✅ | 64+ random hex chars | Used to sign the auth cookie; generate the same way as `JWT_SECRET` (use a *different* value) |

### Initial admin (used only by `npm run seed:admin`)
| Variable | Required | Example | Notes |
|---|---|---|---|
| `ADMIN_NAME` | ✅ | `Jane Doe` | |
| `ADMIN_EMAIL` | ✅ | `admin@yourdomain.com` | Your login email |
| `ADMIN_PASSWORD` | ✅ | strong password | **Change this immediately after first login** via the admin Profile page |

### SMTP (email)
| Variable | Required | Example | Notes |
|---|---|---|---|
| `SMTP_HOST` | ✅ | `smtp.gmail.com` | See [SMTP Setup](./SMTP_SETUP.md) for provider options |
| `SMTP_PORT` | ✅ | `587` | `465` for implicit TLS, `587` for STARTTLS |
| `SMTP_EMAIL` | ✅ | `no-reply@yourdomain.com` | The sending account |
| `SMTP_PASSWORD` | ✅ | app password / API key | **Not** your regular account password for Gmail — see SMTP Setup |
| `SMTP_FROM_NAME` | optional | `Abacus Digital Agency` | Display name on outgoing emails |
| `SMTP_FROM_EMAIL` | optional | defaults to `SMTP_EMAIL` | Override if your sending address differs from the auth account |

### Cloudinary (image/file storage)
| Variable | Required | Example | Notes |
|---|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | ✅ | `abacus-digital` | See [Cloudinary Setup](./CLOUDINARY_SETUP.md) |
| `CLOUDINARY_API_KEY` | ✅ | `123456789012345` | |
| `CLOUDINARY_API_SECRET` | ✅ | secret string | Never expose this client-side — it stays backend-only |

### Rate limiting
| Variable | Required | Example | Notes |
|---|---|---|---|
| `RATE_LIMIT_WINDOW_MINUTES` | optional | `15` | Global limiter window |
| `RATE_LIMIT_MAX_REQUESTS` | optional | `200` | Max requests per window per IP |

---

## Frontend (`frontend/.env`)

| Variable | Required | Example | Notes |
|---|---|---|---|
| `VITE_API_URL` | ✅ | `https://api.yourdomain.com/api/v1` | Must point at your deployed backend's versioned API root. Local dev: `http://localhost:5000/api/v1` |
| `VITE_SITE_NAME` | optional | `Abacus Digital Agency` | Currently informational; site name is otherwise sourced from the CMS Settings |
| `VITE_GA_MEASUREMENT_ID` | optional | `G-XXXXXXXXXX` | Reserved for a future direct GA integration — the admin Settings → SEO & Analytics tab already stores this value in the database for that purpose |

**Important**: Vite only exposes variables prefixed `VITE_` to client-side
code — this is intentional (anything without that prefix would be
invisible to the browser build, which is correct, since secrets should
never reach the frontend anyway).

---

## Generating strong secrets

```bash
# Run twice — once for JWT_SECRET, once for COOKIE_SECRET (use different values)
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Verifying your setup

After filling in `.env`, confirm the backend can actually boot against
your real values:
```bash
cd backend && npm install && npm run dev
```
Watch the console: `MongoDB connected: ...` confirms `MONGO_URI` is
correct, and (in development) `SMTP transporter is ready to send emails`
confirms your SMTP credentials work. A Cloudinary misconfiguration won't
surface until the first upload attempt (there's no separate "verify"
step for it) — test it via the admin Media Library after logging in.
