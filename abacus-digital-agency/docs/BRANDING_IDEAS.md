# Branding Ideas - Logo & Favicon Concepts

Four real, ready-to-use SVG logo mark concepts live in this folder
(docs/branding/) - not just descriptions. Concept 2 (the angular "A"
monogram) is already wired in as the site's live favicon and PWA icons
(frontend/public/favicon.svg and frontend/public/icons/); the other
three are alternate directions worth considering before a final brand
decision, since a logo is expensive to change once it's live everywhere.

## Concept 1 - Abacus Beads (logo-concept-1-beads.svg)

Three horizontal rods with beads in the brand's signature violet -
literally depicts an abacus. This is the most ownable and distinctive
direction: nobody else in the "digital agency" space can use this exact
visual metaphor without directly referencing your name.

- Best for: a brand that wants to lean into its name rather than
  abstract it away - works especially well as an animated loading
  indicator (beads sliding into place) elsewhere on the site.
- Risk: slightly more complex than a monogram, so it needs more
  breathing room at very small sizes (test at 16x16 favicon size before
  committing).

## Concept 2 - Angular "A" Monogram (logo-concept-2-monogram.svg) - currently live

A bold, geometric letterform. Maximum legibility at every size from
favicon to billboard, which is exactly why it was chosen as the
placeholder default for this build.

- Best for: safety and versatility - this is the "can't go wrong"
  choice if you want to ship now and revisit branding later.
- Risk: a solid angular "A" is a common shape in the monogram-logo
  space; pair it with a truly distinctive typeface in the wordmark
  lockup (next to the icon) to differentiate it further.

## Concept 3 - Node Mark (logo-concept-3-nodes.svg)

An "A" built from connected nodes and edges - visually reads as both a
letterform and a network/circuit diagram.

- Best for: leaning into the engineering side of the brand (vs.
  Concept 1's more playful/craft feel) - this is the most "technical"
  of the four.
- Risk: at very small sizes the node circles can visually merge with
  the connecting lines - test before using below ~24px.

## Concept 4 - Bracket Mark (logo-concept-4-bracket.svg)

Code brackets fused around an "A" - directly signals "we write code"
while still resolving as a monogram.

- Best for: agencies wanting to signal engineering credibility
  immediately, at a glance, before a visitor reads any copy.
- Risk: bracket marks are a fairly common trope in dev-agency branding -
  differentiate via color/weight if chosen.

## Choosing and applying a final mark

Once you pick a direction (or commission a professional designer to
refine one of these into a final identity):

1. Replace frontend/public/favicon.svg with the final mark.
2. Regenerate the PWA icon PNGs (frontend/public/icons/icon-192.png,
   icon-512.png, icon-maskable-512.png, apple-touch-icon.png) at their
   required sizes - any design tool's export function handles this, or
   a Python + Pillow script similar to the one used to generate the
   current placeholders.
3. Upload the full-color wordmark version via Admin -> Settings (logo
   upload) - this drives the navbar and footer logo, independent of the
   favicon/PWA files above.
4. Update the Open Graph default image referenced in
   frontend/src/components/common/SEO.jsx to a branded 1200x630 share
   image once you have one.

## Favicon-specific guidance

Favicons are the least forgiving format - they're viewed at 16-32px more
often than any other size. Whichever concept you choose:
- Test legibility at actual 16x16 rendering, not just scaled down on
  screen.
- Prefer 1-2 colors over gradients or fine detail - favicons compress
  detail poorly at browser-tab size.
- Keep a perfect square aspect ratio with consistent padding - all four
  concepts here already follow this.
