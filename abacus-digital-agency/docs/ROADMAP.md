# Roadmap & Version 2 Improvements

What this build deliberately does not include, and where the project
could reasonably go next, organized by how much value each adds
relative to effort.

## Near-term (highest value, most straightforward to add)

- **Real analytics integration**: the dashboard's traffic/revenue charts
  are explicitly labeled simulated placeholders (see
  docs/PHASE4_FEATURES.md, Performance section). Wiring Google Analytics
  4's Reporting API (the measurement ID field already exists in
  Settings) or a privacy-first alternative like Plausible/Fathom would
  replace these with real numbers.
- **Error tracking**: ErrorBoundary currently logs to the browser
  console only. Adding Sentry (or Bugsnag) is a small integration that
  pays for itself the first time something breaks in production and you
  don't have to rely on a user reporting it.
- **Full 2FA verification flow**: the backend already has the schema and
  toggle endpoints ready — completing it means adding TOTP generation
  and verification (the otplib npm package is a good fit), a QR code
  shown at enable time, and a verification-code prompt inserted into the
  login flow when 2FA is enabled for that admin.
- **Legal pages**: Privacy Policy, Terms of Service, and a cookie notice
  are not included (see Production Checklist) — straightforward to add
  as either static pages or a new lightweight CMS resource if you want
  them admin-editable.
- **Blog draft preview**: admins can currently only see a blog post's
  final rendering by publishing it. A preview-as-draft link would let
  writers proof-read in context before going live.

## Medium-term (meaningful new capability)

- **Multi-language / i18n**: the entire content model is single-language
  today. Adding i18n would mean either duplicating fields per locale
  across models or introducing a separate translations collection —
  worth deciding based on how many languages you actually need before
  building it.
- **Client portal**: a logical extension of the existing application
  patterns — a lightweight authenticated area where actual clients can
  view project status, invoices, or shared files, reusing the existing
  JWT auth infrastructure with a new client role.
- **Advanced search**: the current global search is a simple regex query
  suitable for this site's scale (a deliberate choice, documented in
  PHASE4_FEATURES.md). If content volume grows substantially, migrating
  to a dedicated search service such as MongoDB Atlas Search (a drop-in
  addition to an existing Atlas cluster) would add typo-tolerance and
  relevance ranking.
- **Webhooks / automation integrations**: letting contact form
  submissions or new applications trigger external automations (Slack
  notification, CRM sync) without custom code per integration.
- **A/B testing infrastructure**: for a growth-stage agency wanting to
  test hero copy or pricing presentation against conversion rate.

## Long-term / larger investment

- **Full automated test suite**: this build was verified via manual and
  scripted syntax, boot, and build checks at every phase, but there is
  no automated test suite (Jest/Vitest unit tests, Playwright/Cypress
  end-to-end tests) committed. For a team maintaining this long-term,
  that is the highest-leverage infrastructure investment not yet made —
  the Testing Checklist in this repo is a strong starting point for what
  an end-to-end suite should cover.
- **CI/CD pipeline**: a GitHub Actions workflow (or equivalent) running
  lint, build, and eventually tests on every pull request, with
  automatic deploy previews. Deployment is currently manual per the
  Deployment Guide.
- **Multi-region / CDN strategy**: for an agency serving genuinely global
  clients, evaluating a CDN in front of the API and MongoDB Atlas's
  global cluster options for write locality.
- **Headless CMS extraction**: if content modeling needs eventually
  outgrow what is practical to hand-roll, migrating the CMS layer to
  something like Payload or Strapi while keeping the custom public
  frontend is a viable path — the clean frontend/backend separation in
  this architecture makes that swap contained rather than a full
  rewrite.
- **Native mobile app**: the PWA already covers "installable, works
  offline" reasonably well for most use cases; a true native app would
  only be worth it for capabilities a PWA genuinely cannot provide.

## Explicitly out of scope by design (not gaps, deliberate choices)

- **Payment processing**: pricing is presented informationally with a
  talk-to-us flow, not a self-serve checkout — appropriate for a
  bespoke-engagement agency model, not an oversight.
- **Real-time features** such as live chat or WebSocket notifications:
  the admin notification bell polls on an interval rather than using
  WebSockets or Server-Sent Events — simpler and sufficient at this
  scale; worth revisiting only if a real-time delay genuinely matters
  for the team's workflow.
