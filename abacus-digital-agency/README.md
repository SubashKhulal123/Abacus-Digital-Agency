# Abacus Digital Agency

A production-grade, full-stack MERN platform for a premium digital
agency — an award-winning-style public marketing site (5 color themes,
dark/light mode, GSAP/Framer Motion animations, full SEO) backed by a
complete CMS admin panel, built in five phases: architecture, the public
frontend, the admin dashboard, advanced production features (SEO,
security, PWA), and final polish + deployment readiness.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the architectural
reasoning behind the codebase structure.

## Documentation index

| Guide | What it covers |
|---|---|
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Vercel, Render, Docker, PM2, and NGINX deployment paths |
| [docs/ENVIRONMENT_SETUP.md](./docs/ENVIRONMENT_SETUP.md) | Every environment variable explained |
| [docs/MONGODB_SETUP.md](./docs/MONGODB_SETUP.md) | MongoDB Atlas setup, step by step |
| [docs/CLOUDINARY_SETUP.md](./docs/CLOUDINARY_SETUP.md) | Cloudinary setup, step by step |
| [docs/SMTP_SETUP.md](./docs/SMTP_SETUP.md) | Email sending setup (Gmail, SendGrid, SES) |
| [docs/SEED_DATA.md](./docs/SEED_DATA.md) | What the sample seed data contains |
| [docs/IMAGE_REQUIREMENTS.md](./docs/IMAGE_REQUIREMENTS.md) | Every real image needed before launch |
| [docs/BRANDING_IDEAS.md](./docs/BRANDING_IDEAS.md) | 4 real logo concepts + favicon guidance |
| [docs/TESTING_CHECKLIST.md](./docs/TESTING_CHECKLIST.md) | Complete pre-launch QA checklist |
| [docs/PRODUCTION_CHECKLIST.md](./docs/PRODUCTION_CHECKLIST.md) | Final go-live checklist |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Version 2 improvements and future direction |
| [docs/PHASE4_FEATURES.md](./docs/PHASE4_FEATURES.md) | Detailed rationale for every advanced production feature |
| [backend/src/docs/API_ENDPOINTS.md](./backend/src/docs/API_ENDPOINTS.md) | Full API reference |

## Installation Guide (quick start)

```bash
# 1. Clone and enter the project
git clone <your-repo-url> abacus-digital-agency
cd abacus-digital-agency

# 2. Backend
cd backend
cp .env.example .env        # fill in real values — see docs/ENVIRONMENT_SETUP.md
npm install
npm run seed:admin          # creates your admin login
npm run seed:all            # populates every collection with sample content
npm run dev                 # http://localhost:5000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev                 # http://localhost:5173
```

Then open `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the admin panel (log in with the
`ADMIN_EMAIL`/`ADMIN_PASSWORD` you set in `backend/.env`).

For a real deployment rather than local development, skip ahead to
**[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**.

## Project structure

```
abacus-digital-agency/
├── backend/                 Node.js + Express + MongoDB API
│   └── src/
│       ├── config/          env, db, cloudinary, nodemailer setup
│       ├── constants/       shared enums (roles, statuses, themes...)
│       ├── controllers/     request handlers (thin — call services)
│       ├── docs/            API_ENDPOINTS.md — full endpoint planning
│       ├── middlewares/     auth, rbac, validation, rate-limit, errors
│       ├── models/          17 Mongoose schemas
│       ├── repositories/    (reserved — data-access abstraction, Phase 2+)
│       ├── routes/          Express routers
│       ├── seeders/         admin.seeder.js, siteSettings.seeder.js
│       ├── services/        business logic layer
│       ├── utils/           ApiError, ApiResponse, asyncHandler, uploads...
│       └── validators/      Zod request-validation schemas
│
└── frontend/                React + Vite + Tailwind CMS-driven client
    └── src/
        ├── api/              axios instance + resource API modules
        ├── assets/           images, icons, fonts, logos
        ├── components/
        │   ├── ui/           shadcn-style primitives
        │   ├── common/       shared reusable components (Phase 2+)
        │   ├── layout/       header/footer/nav pieces (Phase 2+)
        │   └── theme/        theme-switcher UI (Phase 2+)
        ├── constants/        themes.js and other shared constants
        ├── context/          ThemeContext, AuthContext
        ├── hooks/            useAuth, and future custom hooks
        ├── layouts/          MainLayout, AdminLayout
        ├── lib/              utils (cn), queryClient
        ├── pages/            route-level components (built out Phase 2+)
        ├── router/           React Router config, ProtectedRoute
        └── styles/           themes.css, index.css
```

## Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB) connection string
- Cloudinary account (cloud name, API key, API secret)
- An SMTP-capable email account (Gmail App Password, SendGrid, etc.)

## Backend setup

```bash
cd backend
cp .env.example .env      # fill in your real credentials
npm install
npm run seed:admin        # creates the initial super-admin from .env
npm run seed:settings     # creates the singleton SiteSettings document
npm run dev                # starts on http://localhost:5000
```

Verify it's alive: `GET http://localhost:5000/api/v1/health`

Log in as the seeded admin: `POST http://localhost:5000/api/v1/auth/login`
```json
{ "email": "<ADMIN_EMAIL from .env>", "password": "<ADMIN_PASSWORD from .env>" }
```

## Frontend setup

```bash
cd frontend
cp .env.example .env      # set VITE_API_URL to your backend URL
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` — you'll see a temporary scaffold-verification
screen (not the real homepage yet) confirming: the API is reachable, and the
theme switcher toggles all 5 premium themes and dark/light mode live. This
screen is replaced by the real homepage in the next phase.

## What's implemented in Phase 1

- ✅ Full monorepo folder architecture (backend + frontend)
- ✅ Express app hardened with Helmet, CORS, rate limiting, compression,
  cookie-parser, Mongo-injection sanitization, HTTP param pollution guard
- ✅ MongoDB connection via Mongoose with graceful failure handling
- ✅ Cloudinary upload/delete utility (stream-based, no disk writes)
- ✅ Nodemailer SMTP utility with a branded HTML email template
- ✅ JWT authentication: login, logout, get current admin, update profile,
  change password — with brute-force lockout protection
- ✅ Role-based access control middleware
- ✅ All 17 MongoDB schemas (Admin, Developer, Project, Service,
  Testimonial, Blog, Category, ContactMessage, Newsletter,
  CareerApplication, JobPost, Client, Technology, SiteSettings, FAQ,
  Statistic, Media)
- ✅ Standardized ApiResponse / ApiError shapes and a global error handler
  that normalizes Mongoose, JWT, and Multer errors
- ✅ Complete API endpoint plan (`backend/src/docs/API_ENDPOINTS.md`)
- ✅ Frontend build pipeline: Vite + path aliases + code-split vendor chunks
- ✅ Tailwind + a 5-theme, dark/light CSS-variable design token system
- ✅ shadcn/ui configured with a working Button primitive
- ✅ React Query + Axios API layer with response normalization
- ✅ ThemeContext and AuthContext, Lenis smooth scroll wired at the App root
- ✅ React Router with lazy-loaded routes, code splitting, and a
  ProtectedRoute guard for the future admin dashboard
- ✅ Verified: backend boots cleanly (syntax + wiring check) and the
  frontend produces a clean production build with zero errors

## What's implemented in Phase 2

To make the storefront genuinely functional (not just visually complete),
Phase 2 also implemented every **public** (🔓) backend endpoint from the
Phase 1 API plan — read-only resource routes plus the contact/newsletter/
career-application write forms — using a generic controller factory to
keep the code lean. No admin CRUD or admin UI was added; that remains for
the Admin Panel phase.

- ✅ Public GET routes: developers, projects, services, testimonials,
  blogs (+ like), categories, technologies, clients, FAQs, statistics,
  job posts, site settings — all with filtering/search/pagination via a
  shared `ApiFeatures` query builder
- ✅ Public POST routes: contact form (with admin + auto-reply emails),
  newsletter subscribe/unsubscribe, career applications (with resume
  upload straight to Cloudinary)
- ✅ `SiteSettings` extended with CMS-editable marketing content: about
  story/mission/vision, values, why-choose-us, process steps, industries,
  pricing plans, awards, timeline, open source, community, partners
- ✅ `seed:all` script populates every collection with real, professional,
  non-lorem-ipsum content (7 team members, 6 case studies, 6 services,
  6 testimonials, 6 blog posts, 8 FAQs, 4 job openings, full settings)
- ✅ **Complete frontend**: every homepage section from the brief (Hero,
  About/Story/Mission/Vision, Values, Services, Why Choose Us, Process,
  Portfolio, Technologies, Industries, Team, Stats, Testimonials, Client
  Logos, Awards, Pricing, Blog preview, Career preview, Open Source,
  Partners, FAQ, CTA, Contact) plus full sub-pages: About, Services (+
  detail), Portfolio (+ case study detail), Blog (+ post detail with
  likes), Careers (+ job detail with resume-upload application form),
  Contact, 404
- ✅ Animation stack: Framer Motion (scroll reveals, page transitions,
  testimonial carousel), GSAP + ScrollTrigger (stats batch reveal), a
  custom cursor, magnetic buttons, image reveal wipes, animated counters,
  progress bars, marquees, gradient blobs, and floating elements
- ✅ Dark/light mode + all 5 premium themes fully wired via the
  `ThemeSwitcher` in the navbar
- ✅ Every section fetches from the live API via React Query — zero
  hardcoded marketing copy — with loading skeletons, empty states, and
  error states everywhere a request can fail
- ✅ Forms use React Hook Form + Zod (contact, career application)
- ✅ Verified: `npm run build` compiles 615 modules with zero errors,
  ESLint passes with zero errors, and the dev server boots cleanly

## What's intentionally NOT in Phase 2 (superseded by Phase 3 below)

The admin panel UI mentioned as future work here was built in Phase 3.

## What's implemented in Phase 3 — Admin Dashboard / CMS

**Backend** — a full protected admin API under `/api/v1/admin/*`
(JWT + role-gated), built on a generic CRUD controller factory to avoid
hand-writing near-identical controllers for every resource:
- Full CRUD (+ bulk delete) for developers, projects, services, blogs,
  testimonials, clients, technologies, categories, FAQs, statistics, and
  job posts — with automatic image upload to Cloudinary and slug
  generation where relevant
- Contact messages: status workflow + **real reply-by-email**
- Career applications: status workflow with optional applicant
  notification email
- Newsletter: CSV export **and** CSV import
- Media Library: upload/list/delete, tracked in MongoDB
- Dashboard analytics: real aggregate counts + recent activity from a new
  audit-log collection, plus clearly-flagged **placeholder** traffic/
  revenue series (no analytics provider is integrated — the response says
  so explicitly)
- Site Settings: hero/about/theme/footer/SEO/social fields are DB-backed
  and admin-editable; SMTP/Cloudinary are correctly kept as env-only
  secrets, with a read-only masked status view in the admin UI explaining
  why
- Audit Logs (every admin mutation is recorded automatically), a local
  rotating log file + `/admin/logs` tail endpoint, and a `/admin/backup`
  endpoint that exports all public content as downloadable JSON
- Two-factor authentication scaffold (`/auth/2fa/enable|disable`) —
  honestly documented as a toggle + backup-codes scaffold, not a wired
  authenticator-app verification flow yet

**Frontend** — a complete, config-driven CMS UI:
- Standalone admin login (`/admin/login`), sidebar + topbar shell, real
  notifications bell wired to backend events (new message/application/
  subscriber)
- Dashboard with Recharts (area + bar charts), 8 live stat cards, recent
  activity feed, top content
- A **generic** `DataTable` (search, sort, pagination, row selection,
  bulk delete, CSV export) and `ResourceForm` (config-driven field
  renderer: text/textarea/richtext/select/toggle/image/tags/relation/
  relation-multi/json) power full CRUD screens for all 11 simple
  resources from a single config file (`src/config/adminResources.jsx`)
- Bespoke screens where the workflow isn't generic CRUD: Messages
  (list + reply), Applications (list + status workflow), Newsletter
  (list + import/export), Media Library (grid + upload), Settings
  (9 tabs), Audit Logs, System Logs, Profile (password + 2FA)
- Rich text editor (Quill) for blog content, themed to match the site's
  dark/light + 5-theme design tokens
- Verified: full production build compiles 2186 modules with zero
  errors, ESLint passes clean, backend boots with all ~22 admin route
  modules wired correctly

## What's implemented in Phase 4 — Advanced Production Features

Full details, rationale, and file references: **[docs/PHASE4_FEATURES.md](./docs/PHASE4_FEATURES.md)**.

- **SEO**: per-page `SEO` component (title/description/canonical/OG/Twitter
  + JSON-LD for Organization, Breadcrumb, Article, JobPosting), plus a
  **dynamically generated** `/sitemap.xml` and `/robots.txt` served from
  the backend (always reflects real published content, never goes stale)
- **Performance**: Cloudinary image optimization + lazy-loading
  (`LazyImage`), resource-appropriate HTTP `Cache-Control` headers on
  every public GET endpoint, and **infinite scroll** on the Blog page
  (built alongside — not replacing — the classic pagination already on
  Portfolio, to demonstrate both patterns where each fits)
- **Global search**: a Cmd+K command palette (debounced, keyboard-
  navigable) backed by a new `/api/v1/search` endpoint, wired into both
  the public navbar and admin topbar
- **Email templates**: every transactional email now generated from a
  single centralized `emailTemplates.js` module instead of inline HTML
  scattered across controllers
- **Error & edge-case pages**: a real 404, a 500 page wired through a
  React `ErrorBoundary`, and a fully-enforced **maintenance mode**
  (backend 503-gates the public API while never locking admins out;
  frontend swaps in a branded maintenance page)
- **Toast notifications**: `react-hot-toast`, themed to match whichever
  of the 5 color themes is active, added to every major mutation across
  both the public site and admin panel
- **Security hardening**: an explicit Content-Security-Policy added to
  Helmet's config (beyond the defaults already in place since Phase 1)
- **Accessibility**: a skip-to-content link, ARIA labels on every new
  icon-only control, confirmed reduced-motion support is unaffected
- **PWA**: a real manifest with generated brand-matched icons (192/512/
  maskable), and a Workbox service worker with genuine offline support —
  `NetworkFirst` caching for API calls, `CacheFirst` for images, not just
  an installability checkbox
- **New reusable hooks**: `useDebounce`, `useIntersectionObserver`,
  `useLocalStorage`, `useMediaQuery`, `useClickOutside` — the last one
  replaced three duplicate inline implementations that existed before
  this phase
- Verified: backend syntax + boot check, frontend production build
  (2201 modules, zero errors, service worker generated), ESLint clean

## What's implemented in Phase 5 — Final Polish & Production Readiness

- **Real polish, not just claims**: fluid `clamp()`-based typography on
  every heading (smooth scaling across viewport sizes instead of
  breakpoint jumps), a themed scroll-progress bar on blog posts, proper
  `role="dialog"`/`aria-modal` semantics + Escape-to-close on both modal
  components, and programmatically-associated form labels (`htmlFor`/
  `id`) across the contact form and every generic admin form field —
  fixing a real accessibility gap, not a cosmetic one
- **Infrastructure, ready to actually deploy**:
  - `backend/Dockerfile` + `frontend/Dockerfile` (multi-stage, non-root
    user, health checks) and a root `docker-compose.yml` that runs the
    full stack (Mongo + backend + frontend + a DB admin UI) with one command
  - `backend/ecosystem.config.js` — PM2 cluster-mode config
  - `deploy/nginx.conf` — reverse-proxy config for a traditional VPS,
    plus `frontend/nginx.conf` for the Dockerized frontend
  - `frontend/vercel.json` and root `render.yaml` for one-click Vercel +
    Render deployment
- **Complete documentation set** (see the index above): deployment guide
  covering all 5 paths, environment variable reference, step-by-step
  MongoDB/Cloudinary/SMTP setup guides, seed data reference, an image
  shopping list for launch, 4 real SVG logo concepts with rationale, a
  full QA testing checklist, a production go-live checklist, and a
  Version 2 roadmap
- Verified: backend syntax + boot check, frontend production build and
  ESLint clean after every change in this phase — same verification
  discipline as every prior phase, not relaxed for the final one

## Running everything end-to-end

```bash
cd backend && cp .env.example .env   # add real Mongo/Cloudinary/SMTP credentials
npm install
npm run seed:admin
npm run seed:all        # populates every collection with real content
npm run dev

cd ../frontend && cp .env.example .env
npm install
npm run dev              # public site: http://localhost:5173
                          # admin panel: http://localhost:5173/admin/login
```

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`.

