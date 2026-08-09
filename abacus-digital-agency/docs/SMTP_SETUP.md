# SMTP Setup

The backend sends real transactional email: contact form notifications +
auto-replies, newsletter welcome emails, career application
confirmations, admin replies to messages, and application status updates.
Pick one provider below.

## Option A — Gmail (fastest for testing, fine for low volume)

1. Enable 2-Step Verification on the Google account you'll send from:
   [myaccount.google.com/security](https://myaccount.google.com/security).
2. Create an **App Password**:
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   → App: "Mail", Device: "Other (Custom name)" → name it "Abacus
   Digital Agency" → Generate. Copy the 16-character password.
3. Set in `backend/.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=youraddress@gmail.com
   SMTP_PASSWORD=<the 16-character app password, no spaces>
   ```

**Gmail's sending limits** (~500/day on a free account) make this fine
for a launch-stage site's contact form + newsletter volume, but not for
bulk sending — see Option B/C if you expect higher volume.

## Option B — SendGrid (recommended for production)

1. Sign up at [sendgrid.com](https://sendgrid.com) (free tier: 100 emails/day).
2. **Settings → API Keys → Create API Key** — Full Access is simplest to
   start; restrict to "Mail Send" only once you're comfortable with the
   dashboard.
3. Verify a sender identity: **Settings → Sender Authentication** — either
   verify a single sender email, or (better long-term, improves
   deliverability) authenticate your whole domain via the provided DNS
   records.
4. Set in `backend/.env`:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_EMAIL=apikey
   SMTP_PASSWORD=<your SendGrid API key, starts with SG.>
   SMTP_FROM_EMAIL=no-reply@yourdomain.com
   ```
   Note `SMTP_EMAIL` is literally the string `apikey` for SendGrid's SMTP
   relay — that's not a placeholder, it's what their SMTP auth expects.

## Option C — Amazon SES (cheapest at scale)

1. In the AWS Console, go to **Simple Email Service → SMTP Settings →
   Create SMTP Credentials** — this generates an IAM user scoped to SES
   sending, with its own SMTP username/password (different from your AWS
   access keys).
2. Verify your sending domain or email address under **Verified
   identities**.
3. If your account is in the SES Sandbox, you can only send to verified
   addresses — request **Production Access** (Account dashboard → a form,
   usually approved within a day) before going live.
4. Set in `backend/.env`:
   ```
   SMTP_HOST=email-smtp.<your-region>.amazonaws.com
   SMTP_PORT=587
   SMTP_EMAIL=<the generated SMTP username>
   SMTP_PASSWORD=<the generated SMTP password>
   ```

## Verifying it works

```bash
cd backend && npm run dev
```
In development mode, the backend verifies the SMTP connection at boot
and logs either `SMTP transporter is ready to send emails` or a warning
with the specific error. Then submit the public contact form once — you
should receive both the admin notification (at whatever email is set in
**Admin → Settings → Footer → Contact Email**) and the visitor's
auto-reply (at the email you submitted the form with).

## Email templates

Every email this project sends is generated from one place:
`backend/src/utils/emailTemplates.js`. To change wording/branding across
all transactional emails, edit that file rather than hunting through
controllers — see `docs/PHASE4_FEATURES.md` for the full list of
templates and where each is triggered.

## Deliverability tips for production

- Set up **SPF, DKIM, and DMARC** DNS records for your sending domain —
  SendGrid and SES both provide the exact records to add during sender
  authentication; Gmail's app-password approach doesn't support custom
  domain authentication (another reason to move to SendGrid/SES once
  volume grows).
- Keep `SMTP_FROM_EMAIL` on your real domain (`no-reply@yourdomain.com`),
  not a generic Gmail address, once you've moved past Option A — it
  meaningfully improves inbox placement.
- Monitor bounce/complaint rates in your provider's dashboard; sustained
  high bounce rates can get a sending domain throttled or blocked.
