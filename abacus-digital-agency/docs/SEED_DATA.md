# Sample Seed Data

Running `npm run seed:all` (after `npm run seed:admin`) populates every
public-facing collection with realistic, professionally-written sample
content — no lorem ipsum anywhere. This document is the reference for
exactly what gets created, so you know what to expect and what to
eventually replace with your agency's real content.

Source: `backend/src/seeders/seedAll.js`. Images are placeholder photos
from Picsum (a free placeholder image service) — replace these with real
assets before launch; see [Image Requirements](./IMAGE_REQUIREMENTS.md).

## What gets created

| Collection | Count | Highlights |
|---|---|---|
| Categories | 11 | 6 project categories (Web Applications, Mobile Apps, E-Commerce, SaaS, AI & Automation, Brand & Identity) + 5 blog categories |
| Technologies | 20 | React, Next.js, Vue, TypeScript, Node.js, NestJS, Python, Django, GraphQL, MongoDB, PostgreSQL, Redis, Docker, Kubernetes, AWS, Figma, React Native, Flutter, Swift, TailwindCSS |
| Developers | 7 | Full team profiles — name, role, bio, skills, experience, social links, department |
| Clients | 8 | Fictional companies across logistics, healthcare, fintech, travel, retail, robotics, finance, media |
| Projects | 6 | Full case studies with challenges/solutions/results/metrics, tied to real clients, technologies, and team members |
| Services | 6 | Product Design, Web Development, Mobile Development, E-Commerce, Brand Identity, AI & Automation — each with a 4-step process |
| Testimonials | 6 | Tied to specific clients and projects, with realistic quotes referencing actual project outcomes |
| Blog Posts | 6 | Full-length articles (600-900 words each) on engineering and design topics, with real HTML content |
| FAQs | 8 | Covering general, pricing, process, and technical questions |
| Statistics | 4 | Projects Delivered, Client Retention Rate, Avg. Team Experience, Countries Served |
| Job Posts | 4 | Senior Frontend Engineer, Product Designer, DevOps Engineer, Backend Engineer — each with real responsibilities/requirements and salary ranges |
| Site Settings | 1 singleton | Full hero copy, about story/mission/vision, values, why-choose-us, process steps, industries, pricing plans, awards, timeline, open source repos, community links, partners |

## Re-running the seeder

`seedAll.js` is destructive and idempotent for the collections it
manages — it deletes existing documents in those collections before
re-inserting, so running it twice doesn't create duplicates. It does
not touch the Admin collection (run `seed:admin` separately, which skips
creation if an admin already exists) or SiteSettings beyond a
findOneAndUpdate upsert (safe to re-run).

```bash
npm run seed:admin   # once - creates your login (skips if one exists)
npm run seed:all     # safe to re-run any time to reset demo content
```

## Using this as a template for your real content

The cleanest path from demo data to real content:
1. Log into /admin.
2. Go through each resource (Developers, Projects, Services, etc.) and
   either edit the seeded entries in place with your real content, or
   delete them and create your own - the admin CRUD screens are
   identical either way.
3. Update Settings (all 9 tabs) with your real hero copy, about story,
   values, pricing, and social links.
4. Replace every seeded image via each resource's image upload field -
   see Image Requirements for exactly which images you'll need and at
   what dimensions.
