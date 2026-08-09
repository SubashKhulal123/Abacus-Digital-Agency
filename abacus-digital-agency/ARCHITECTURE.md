# Architecture — Abacus Digital Agency

## 1. Overall approach

This is a **decoupled MERN monorepo**: an Express/MongoDB REST API and a
Vite/React SPA that communicate exclusively over HTTP/JSON. Nothing on the
frontend is hardcoded — every piece of site content (services, projects,
blog posts, team members, testimonials, FAQs, statistics, site branding) is
modeled in MongoDB and served through the API, so the entire site is
CMS-driven from the admin panel being built in later phases.

Two architectural priorities shaped every decision below: **security by
default** (nothing sensitive in source control, every write path
authenticated/validated/rate-limited) and **scalability of the codebase
itself** (a new engineer should be able to add a new resource — e.g.
"Case Studies" — by following the exact same five-file pattern used by
every existing resource, without touching unrelated code).

## 2. Backend layered architecture

```
Route → Middleware (auth/validate/rate-limit) → Controller → Service → Model
```

- **Routes** only wire HTTP verbs + paths to middleware and controllers.
  They contain zero business logic.
- **Middlewares** are single-purpose and composable: `auth.middleware.js`
  verifies identity, `role.middleware.js` verifies authorization,
  `validate.middleware.js` verifies shape (via Zod), `rateLimiter` protects
  against abuse. Each can be added/removed from a route independently.
- **Controllers** are thin — they extract request data, call a service, and
  format the response via `ApiResponse`. They never touch Mongoose
  directly for anything beyond trivial reads.
- **Services** hold business logic that's more than a single-line DB call —
  e.g. `auth.service.js` implements brute-force lockout logic. This is
  where a `repositories/` layer would slot in for very large teams that
  want to abstract Mongoose entirely behind an interface; the folder is
  reserved but intentionally not overused in Phase 1 to avoid premature
  abstraction on top of straightforward CRUD.
- **Models** are the single source of truth for data shape, defaults, and
  indexes. Every model most consumers care about includes `isActive`
  and `order` fields so the CMS can toggle visibility and control display
  order without deleting data.

### Why this shape

It mirrors how mid-to-large Node teams actually organize code (NestJS-style
layering without the framework overhead), which means: (a) it's easy for
another senior engineer to onboard onto instantly, and (b) it scales past
Phase 1 — new resources add files in the same five folders rather than
growing existing files.

## 3. Security posture

- **Nothing sensitive is hardcoded.** Every secret (JWT secret, DB URI,
  SMTP credentials, Cloudinary keys, cookie secret, admin bootstrap
  credentials) is read exclusively through `config/env.js`, which
  fails fast at boot if a required variable is missing — this catches
  misconfiguration in CI/deployment before it becomes a runtime bug.
- **Defense in depth on every request**: Helmet (secure headers),
  CORS locked to `CLIENT_URL`, `express-mongo-sanitize` (blocks NoSQL
  operator injection like `{ "$gt": "" }`), `hpp` (blocks parameter
  pollution), and a custom sanitizer that strips HTML from URL query/
  route params. Deliberately, request **bodies** are *not* blanket
  HTML-stripped globally — CMS resources like blog posts and service
  descriptions legitimately store rich-text HTML, and a naive global
  strip would silently corrupt that content. Plain-text-only endpoints
  (contact form, newsletter, applications) opt into
  `sanitizePlainTextBody` explicitly instead.
- **Auth**: JWTs are issued on login and delivered as a signed,
  httpOnly, sameSite cookie (immune to XSS token theft and CSRF via
  `sameSite`), with an `Authorization: Bearer` fallback for non-browser
  API clients. Passwords are hashed with bcrypt at cost factor 12.
  Failed logins increment a counter and temporarily lock the account
  after 5 attempts — standard brute-force mitigation.
- **Rate limiting** is tiered: a generous global limiter, a strict
  10-attempts/15-minutes limiter on `/auth/login`, and a separate
  limiter reserved for public write endpoints (contact form, newsletter,
  job applications) to stop spam without punishing normal browsing.
- **Uploads** go straight from a Multer memory buffer to Cloudinary via a
  stream — files never touch local disk, which matters for stateless/
  containerized deployment (Render, Railway, ECS, etc. can all redeploy
  or scale without losing uploaded state).

## 4. Error handling & API contract

Every response — success or failure — follows one predictable shape
(`ApiResponse` / the error handler's JSON output), documented in
`backend/src/docs/API_ENDPOINTS.md`. The global error handler normalizes
Mongoose `CastError`, `ValidationError`, duplicate-key errors, JWT errors,
and Multer errors into the same `ApiError` shape, so frontend code never
has to special-case error formats per endpoint. `asyncHandler` removes
try/catch boilerplate from every controller by forwarding rejected
promises straight to that handler.

## 5. Frontend architecture

- **Vite** for the build, with path aliases (`@components`, `@pages`,
  `@context`, etc.) so imports stay readable as the app grows and never
  degrade into `../../../../` chains.
- **Code splitting is real, not aspirational**: `vite.config.js` manually
  chunks vendor code (React core, animation libs, React Query/Axios, form
  libs) separately from app code, and every route is `React.lazy`-loaded
  through a single `withSuspense` helper in `router/index.jsx`. The
  production build (verified during this phase) confirms this actually
  produces separate chunks rather than one monolithic bundle.
- **Theming** is CSS-variable-driven, not JS-driven: `ThemeContext` only
  toggles two `data-*` attributes on `<html>`, and `themes.css` defines
  10 palettes (5 themes × dark/light) as RGB triplets that Tailwind
  consumes via `rgb(var(--x) / <alpha-value>)`. This means theme switches
  cost a CSS recalculation, not a React re-render of the whole tree, and
  a flash-of-wrong-theme on load is prevented by a tiny inline script in
  `index.html` that sets the attributes before React ever hydrates.
- **Data fetching** goes exclusively through React Query + a single Axios
  instance whose response interceptor unwraps the backend's
  `{ success, data, message }` envelope and normalizes errors, so
  components consume plain data/error objects, never raw Axios shapes.
- **Auth state** (`AuthContext`) is a thin wrapper around a React Query
  `useCurrentAdmin` query plus login/logout mutations — session state and
  server cache are the same source of truth, so there's no risk of the
  two drifting out of sync.

## 6. What changes in later phases (by design)

Resource routes beyond `/auth` (developers, projects, services, blogs,
categories, technologies, clients, contact, newsletter, careers, FAQs,
statistics, media, settings) are fully planned in
`backend/src/docs/API_ENDPOINTS.md` and their Mongoose models already
exist — implementing each one is now a matter of repeating the established
route → middleware → controller → service → model pattern per resource,
not inventing new architecture. Frontend pages, the admin dashboard UI,
animations, and the theme-switcher component itself are deliberately not
built yet, per this phase's scope.
