# Testing Checklist

A complete pre-launch QA pass. Work through each section against a
staging deployment (not just localhost) before going live.

## Functional - Public Site

- [ ] Home page loads with real data in every section (Hero stats, About
      story, Services, Portfolio, Team, Testimonials, Pricing, FAQ, Blog
      preview, Career preview)
- [ ] Every nav link (About, Services, Work, Blog, Careers, Contact)
      resolves correctly on desktop and mobile menu
- [ ] Services list page loads; clicking into a service shows its full
      detail, process steps, and technologies
- [ ] Portfolio grid loads; category filter buttons actually filter;
      clicking a project shows its full case study with gallery
- [ ] Blog list loads; infinite scroll fetches additional pages when
      scrolling to the bottom; category filter works; clicking a post
      shows full content with working Like button
- [ ] Careers list loads; clicking a job shows the full description and
      application form
- [ ] Job application form: submitting without a resume shows a
      validation error; submitting with a resume succeeds and the
      applicant receives a confirmation email
- [ ] Contact form: client-side validation catches invalid email and
      short messages; successful submission shows the inline success
      state, fires a toast, and both the visitor and site admin receive
      email
- [ ] Newsletter signup (footer and dedicated section): valid email
      succeeds and sends a welcome email; duplicate email shows the
      "already subscribed" message rather than erroring
- [ ] Global search (Cmd+K or the search icon): returns relevant results
      across projects, blogs, services, and team; keyboard arrow
      navigation plus Enter works; Escape closes it
- [ ] Theme switcher: all 5 color themes apply correctly in both dark
      and light mode; the choice persists across a page reload
- [ ] 404 page appears for an unmatched route and offers a way back home

## Functional - Admin Panel

- [ ] Login with valid credentials succeeds; invalid credentials show an
      error and don't leak whether the email exists
- [ ] Repeated wrong-password attempts lock the account temporarily
      (brute-force protection)
- [ ] Dashboard loads with real counts and the recent-activity feed
      populated after performing a few admin actions
- [ ] For every CRUD resource (Developers, Services, Projects, Blogs,
      Testimonials, Clients, Technologies, Categories, FAQs, Statistics,
      Job Posts): create, edit, and delete all work; image upload fields
      preview correctly; bulk-select plus bulk-delete works; CSV export
      downloads a valid file where available
- [ ] Blog editor: the rich text toolbar (headings, bold, italic, lists,
      links, images) all function; saving preserves formatting on the
      public blog post
- [ ] Contact Messages: opening a message marks it read; replying
      actually sends an email to the original sender and updates status
      to replied
- [ ] Applications: changing status to shortlisted, hired, or rejected
      with notify-applicant checked sends the applicant an email
- [ ] Newsletter: CSV export downloads correctly; CSV import with a
      sample file adds new subscribers and correctly skips duplicates
- [ ] Media Library: upload works, delete removes both the database
      record and the Cloudinary asset, copy-URL button works
- [ ] Settings: every tab (Hero, About, Theme, Footer, SEO, Social, SMTP
      read-only view, Cloudinary read-only view, Backup) saves correctly
      and reflects on the public site after a refresh
- [ ] Backup download produces a valid, non-empty JSON file
- [ ] Audit Logs shows entries for the actions performed during this
      test pass
- [ ] System Logs shows real log lines and the level filter works
- [ ] Profile: name and email update works; password change works and a
      subsequent login requires the new password; 2FA enable generates
      backup codes, disable requires the correct password
- [ ] Logging out actually clears the session (visiting the admin area
      afterward redirects to the login page)

## Responsive and Cross-Device

- [ ] Test at 375px (small phone), 768px (tablet), 1024px (small
      laptop), 1440px (desktop), and 1920px-plus (large monitor) for
      every page above
- [ ] Mobile navigation menu opens and closes correctly and doesn't trap
      scroll
- [ ] Admin sidebar collapses correctly on smaller viewports; tables
      scroll horizontally rather than breaking layout
- [ ] Touch targets (buttons, links) are comfortably tappable on mobile
      with no accidental mis-taps on adjacent elements
- [ ] Test on at least one real iOS device and one real Android device,
      not just browser devtools emulation - font rendering, safe-area
      insets, and tap behavior can differ meaningfully

## Cross-Browser

- [ ] Chrome, Firefox, Safari, Edge - latest versions
- [ ] Safari specifically: verify backdrop-blur (glassmorphism panels),
      the custom cursor, and smooth scroll all degrade gracefully if
      unsupported

## Accessibility

- [ ] Full keyboard-only pass: Tab through every interactive element on
      the homepage and confirm a visible focus ring at every stop, in a
      logical order
- [ ] Skip-to-content link appears on first Tab press and actually jumps
      focus past the navbar
- [ ] Run an automated pass (axe DevTools or Lighthouse's Accessibility
      audit) on the homepage, a blog post, and the admin dashboard, and
      address anything flagged as serious or critical
- [ ] Screen reader spot-check (VoiceOver on Mac, or NVDA on Windows):
      confirm form labels are announced correctly, icon-only buttons
      announce their purpose, and the global search dialog announces
      itself as a dialog
- [ ] Confirm prefers-reduced-motion is respected (enable it in OS
      settings and verify animations are minimized, not just faster)
- [ ] Check color contrast in all 5 themes and both modes for body text
      against its background (WCAG AA minimum of 4.5 to 1 for normal
      text)

## Performance

- [ ] Run Lighthouse (Chrome DevTools, or PageSpeed Insights against the
      live staging URL) on the homepage, a blog post, and the portfolio
      page, and address anything it flags
- [ ] Confirm images are lazy-loading (Network tab: below-the-fold
      images shouldn't fire until scrolled near)
- [ ] Confirm the production bundle is actually code-split (Network tab:
      separate chunk files should load per-route, not one giant bundle)

## Security

- [ ] Attempt to access any admin route while logged out and confirm
      redirect to login
- [ ] Attempt to hit an admin API endpoint directly with no auth cookie
      or header and confirm a 401 response
- [ ] Submit the contact form rapidly many times and confirm rate
      limiting kicks in with a 429 response
- [ ] Attempt a NoSQL-injection-style payload in a search or filter
      field and confirm it is sanitized rather than reflected as a query
      operator
- [ ] Confirm the .env file is not committed to git and not publicly
      accessible at your deployed domain

## Email

- [ ] Every email template (contact notification, contact auto-reply,
      contact reply, newsletter welcome, application confirmation,
      application status update) renders correctly in at least Gmail and
      Outlook's web clients, since HTML email rendering varies more than
      regular web pages
- [ ] Links inside emails point to the correct production domain, not
      localhost
