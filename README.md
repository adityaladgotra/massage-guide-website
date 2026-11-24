# Massage Guide Redesign — V7 Static Website

Complete HTML + CSS + JavaScript website. No React build is required for the local HTML preview.
The root folder remains named **massage-guide-redesign**.

## Checkout — edit only checkout-config.js

Open `checkout-config.js` and fill the empty `checkoutUrl` field with your own public checkout page URL:

```js
window.SITE_CONFIG = {
  checkoutUrl: 'https://your-real-checkout-url.com',
  offerEndAt: ''
};
```

**All** buttons with `data-checkout` use this one link. The build copies `checkout-config.js` directly into `dist/`; `.env` is not used for checkout.

## Countdown behavior

The default countdown starts at **00:10:00** on a visitor's first visit, then counts down to **00:00:00**, persisting across refreshes in the same browser. It does **not** automatically reset at zero. This is a **per-visitor timer**, not a shared sales deadline. To show a genuine common promotion deadline instead, set `offerEndAt` to a future ISO datetime with time zone, e.g. `2026-12-01T23:59:00+05:30`. Expiry displays zero without changing the price.

## Images

Add your images directly to the `images/` folder. The exact filenames are described in `images/IMAGE_CHECKLIST.md`. Then rebuild the site to copy them to `dist/images/`. The image holders show labeled placeholders until you add each file.

## Preview on Windows

From the `massage-guide-redesign` folder, either double-click `index.html` or start a static local web server. 

## Build

Requires Node.js 18+:

```bat
npm run build
```

This creates the publishable `dist` folder.

## Create and link a Netlify project with Windows CMD

1. Open CMD inside the project folder using VS Code terminal or `cd /d "C:\path\to\massage-guide-redesign"`.
2. If not installed, install CLI: `npm install -g netlify-cli`.
3. Log in: `netlify login` (browser opens to authorize).
4. Check: `netlify status`.
5. Create a project: `netlify sites:create`. Follow the team/name prompts.
6. If you created the project separately on the Netlify website, run `netlify link` instead; select the correct site or enter its Project ID.
7. Verify: `netlify status`. Netlify may create `.netlify/state.json` with the linked site ID; keep this file locally.
8. Run `npm run build`.
9. Test draft: `netlify deploy --dir=dist --no-build`.
10. After testing, go live: `netlify deploy --prod --dir=dist --no-build`.

For every later edit to text, image files, or `checkout-config.js`, rebuild and redeploy with the final two commands.

## Content and counts

Review text, purchases, income figures, and availability are copied from the supplied content. They are static website content, not connected to a payment platform or independent verification.

## Countdown behavior (V9 fix)

The display starts at **00 hours / 10 minutes / 00 seconds** in a new browser tab, counts down continuously using the wall clock, and stops at **00:00:00**. Reloading the same tab does not reset it. Opening a fresh browser tab starts a new page-view session timer. This is a session timer, not a claim about the actual availability or price of the offer.

To set a genuine shared offer deadline instead, edit `offerEndAt` in `checkout-config.js` to an ISO timestamp, such as `2026-12-15T23:59:00+05:30`. It then counts to that exact time and stops at zero. The price is never changed automatically.

The former V8 timer used `localStorage`, so an expired deadline could make the timer remain at zero even on a subsequent visit. The V9 fix uses `sessionStorage` for the optional visitor countdown and updates using time differences, with visibility and focus refresh handling.

## V10 animation polish

- CTA buttons have subtle hover shine, lift and pressed feedback.
- Content further down the page fades/slides in once as it enters view.
- Motion is disabled for visitors who prefer reduced motion.
- Checkout behavior, pricing, image folders and countdown logic are unchanged.

## V11 mobile CTA shine
On mobile widths (780px and below), all CTA buttons (including the sticky Buy Now button) get a subtle light sweep roughly every seven seconds. This is a CSS-only effect, disabled when the visitor prefers reduced motion. Desktop hover behavior is unchanged.
