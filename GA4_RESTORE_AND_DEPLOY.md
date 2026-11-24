# GA4 restoration — minimal-change release

## Modified files
- `index.html`: reinstated standard Google Analytics gtag.js snippet for **G-Q0EBEGZWWL** inside `<head>`.
- `live-config.js`: preconfigured existing Railway live server at `https://massage-live-analytics-production.up.railway.app` so `/live` is not disconnected.

No edits were made to page styles, content, `script.js`, `live-tracker.js`, `/live` dashboard, or server code.

## Before deploying
1. In `checkout-config.js`, set `checkoutUrl` to the **existing verified SuperProfile or other payment checkout URL**. It is blank in the available project source and checkout links may not function until set.
2. **Copy all images and other assets from your currently working production project into `images/`.** The source ZIP did not contain actual image files (only `IMAGE_CHECKLIST.md`). If you upload the included `dist` folder without those assets, image links may break. You can instead merge the code changes into your latest production folder (preferred).
3. Back up your currently published Netlify build before replacing it. Check that there are no newer page/design features missing from the source used for this package.
4. From the project root, run `npm run build`, which copies the source and images to `dist/`, then deploy **dist/** to Netlify. The supplied `netlify-dist` ZIP is a build reference; you should regenerate it after copying images and filling the checkout URL.
5. Open `https://get-massage-books.netlify.app`, view source and search `G-Q0EBEGZWWL`, then open Chrome DevTools > Network and verify requests to `gtag/js?id=G-Q0EBEGZWWL` and `google-analytics.com/g/collect` where permitted. Confirm GA4 Realtime; ad blockers/consent settings may prevent recording.
6. Verify every Buy Now button opens the correct external checkout. Open `/live` and check its connection.

## Known limitations
This restores basic GA4 page tracking only; it does not add automatically verified SuperProfile purchases or checkout events. The dashboard's activity metrics and GA4 sessions are defined differently and may not match exactly.
