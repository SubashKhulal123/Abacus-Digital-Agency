# Professional Images Needed for Launch

Every image currently on the site (via seed data) is a placeholder from
Picsum. This is the complete shopping list of real photography/assets
needed before a genuine public launch, organized by priority.

## Priority 1 — Brand identity (needed first, everything else depends on it)

| Asset | Dimensions | Format | Notes |
|---|---|---|---|
| Primary logo (light backgrounds) | SVG preferred, min 800px wide raster fallback | SVG/PNG | Used in navbar, footer |
| Primary logo (dark backgrounds) | Same as above | SVG/PNG | For light-mode pages / dark navbar states |
| Favicon | 32×32, 16×16 | SVG or ICO | Browser tab icon |
| App icon (PWA) | 192×192, 512×512, and a 512×512 maskable variant | PNG | Already scaffolded with a placeholder "A" monogram — replace via Settings once you have a final logo, then regenerate `frontend/public/icons/*` |
| Open Graph / social share image | 1200×630 | JPG/PNG | Shown when the site is shared on social/Slack/iMessage — currently defaults to a Picsum placeholder in `SEO.jsx` |

See [Branding Ideas](./BRANDING_IDEAS.md) for concept directions and 4
ready-to-use starter SVG marks already included in this repo.

## Priority 2 — Team (Developers collection)

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Team member headshots | 1 per team member (7 seeded) | 500×500 min, square crop | Consistent lighting/background across the whole team reads far more premium than mismatched photos — a single photoshoot session or a consistent AI-headshot service both work |

## Priority 3 — Portfolio (Projects collection)

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Project thumbnail | 1 per project (6 seeded) | 1200×800, 3:2 ratio | The card image on the Portfolio grid |
| Project gallery images | 2-5 per project | 1200×800+ | Real product screenshots, device mockups, or before/after comparisons — this is what makes case studies credible |

**Tip**: Real screenshots in styled browser/device frames (e.g. via
Cleanshot, Shots.so, or Figma mockup frames) look dramatically more
premium than raw unframed screenshots.

## Priority 4 — Services

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Service cover image | 1 per service (6 seeded) | 1200×800 | Abstract/conceptual imagery works fine here (unlike portfolio, which needs real product shots) |

## Priority 5 — Clients & Testimonials

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Client logos | 1 per client (8 seeded) | SVG preferred, 300×120 PNG fallback, transparent background | Get these directly from each client's brand assets page — never re-create a client's logo yourself |
| Testimonial avatars | 1 per testimonial (6 seeded) | 300×300, square | Real photos of the quoted person substantially increase credibility over generic avatars |

## Priority 6 — Blog

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Cover image | 1 per post (6 seeded, plus 1 per future post) | 1200×700, ~16:9.3 | Can be illustrative/abstract; doesn't need to be literal |

## Priority 7 — Partners (Settings → marketing content)

| Asset | Count needed | Dimensions | Notes |
|---|---|---|---|
| Partner/technology-badge logos | 6 seeded (Vercel, MongoDB, AWS, Stripe, Cloudinary, Figma) | 240×100, transparent PNG/SVG | Only include partners you have an actual relationship/integration with — don't imply partnerships that don't exist |

## Where to source real photography

- **Team headshots**: an actual photoshoot (best), or a consistent
  AI-headshot generator if the team is fully remote/distributed — just
  keep style consistent across everyone.
- **Product screenshots**: your own shipped work — the whole point of a
  portfolio is that it's real.
- **Abstract/conceptual imagery** (services, blog covers where no real
  screenshot applies): licensed stock (Unsplash+, Adobe Stock) or a
  consistent AI image generation pipeline — avoid mixing many different
  visual styles across the site, which reads as unpolished.

## Where these get uploaded

Every image above has a corresponding upload field in the admin panel —
no code changes are needed to swap them in. Developers → avatar,
Projects → thumbnail/gallery, Services → cover image, Clients → logo,
Testimonials → client avatar, Blog → cover image, Settings → logo/
favicon and the Partners section.
