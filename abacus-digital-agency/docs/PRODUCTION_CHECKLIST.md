# Production Checklist

The final go/no-go list before pointing a real domain at this project
and telling clients about it.

## Infrastructure
- [ ] MongoDB Atlas cluster created, network access properly scoped (see
      [MongoDB Setup](./MONGODB_SETUP.md))
- [ ] Backend deployed (Render/Docker/VPS) and `/api/v1/health` returns
      200 from the public internet, not just localhost
- [ ] Frontend deployed (Vercel/NGINX) and loads over HTTPS
- [ ] Custom domain attached and DNS propagated for both frontend and
      backend (or a single domain with `/api` reverse-proxied — see
      Deployment Guide Option D)
- [ ] SSL/TLS certificate valid and auto-renewing (Vercel/Render handle
      this automatically; Certbot on a VPS needs its renewal timer
      confirmed active via `systemctl status certbot.timer`)
- [ ] `CLIENT_URL` on the backend exactly matches the live frontend
      domain (mismatches silently break CORS and cookie auth)

## Credentials & Secrets
- [ ] `JWT_SECRET` and `COOKIE_SECRET` are unique, long, random values,
      not the placeholder/example values
- [ ] Real Cloudinary credentials in place, verified via a test upload
- [ ] Real SMTP credentials in place, verified via a test contact form
      submission
- [ ] Default seeded admin password has been changed via the Profile page
- [ ] `.env` files are not committed to git and are not publicly
      downloadable from either deployment

## Content
- [ ] Seeded demo content replaced with real content — every resource
      in [Seed Data](./SEED_DATA.md) reviewed and updated
- [ ] Real images uploaded per [Image Requirements](./IMAGE_REQUIREMENTS.md),
      with no placeholder images remaining in production
- [ ] Real logo/favicon in place per [Branding Ideas](./BRANDING_IDEAS.md)
- [ ] Site Settings fully filled in: hero copy, about story, contact
      info, social links, footer text
- [ ] At least one real, published blog post and one real, published
      project case study exist
- [ ] Legal pages exist if required for your jurisdiction (Privacy
      Policy, Terms of Service, Cookie Notice) — not included in this
      build and should be added before collecting personal data at scale

## SEO
- [ ] `/sitemap.xml` resolves and lists real published content
- [ ] `/robots.txt` resolves correctly
- [ ] Site verified in Google Search Console and the sitemap submitted
- [ ] Open Graph preview tested and confirmed to render title,
      description, and image correctly
- [ ] Default OG/social share image replaced with a real branded
      1200×630 image
- [ ] Google Analytics measurement ID added under Settings → SEO &
      Analytics, if applicable

## Performance & Reliability
- [ ] Full [Testing Checklist](./TESTING_CHECKLIST.md) completed against
      the actual staging/production URL
- [ ] Lighthouse run on the live URL with no unaddressed red flags
- [ ] Rate limiting confirmed active
- [ ] A monitoring/uptime check configured against `/api/v1/health`
- [ ] Error tracking considered — this build logs to console/file only;
      wiring a service like Sentry is a recommended Version 2 addition

## Backups
- [ ] MongoDB Atlas backups enabled if on a paid tier
- [ ] A recent export downloaded via Admin → Settings → Backup
- [ ] Confirmed you know how to restore before you need to under pressure

## Operational Readiness
- [ ] At least one team member other than the original builder can log
      into the admin panel and publish content
- [ ] SMTP sending domain has SPF/DKIM/DMARC configured if using
      SendGrid/SES
- [ ] A process exists for who responds to contact form submissions and
      how quickly
- [ ] PM2/Docker restart policies confirmed so the backend survives a
      server reboot without manual intervention

## Final Sign-off
- [ ] Full click-through of the entire public site on a real mobile
      device, not just desktop devtools
- [ ] Full click-through of the entire admin panel by someone who didn't
      build it
- [ ] Domain, SSL, and email all verified working from a network outside
      your own office/home
