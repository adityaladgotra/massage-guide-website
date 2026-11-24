# Massage Guide — /live Analytics (No Database)

## What is included
- Original v11 static Netlify website source and build (from the available v11 archive).
- `/live` private dashboard, responsive for mobile/desktop.
- `live-tracker.js` that instruments page loads, scroll depth, *each* `[data-checkout]` button separately (BUY-01 through BUY-07 in this archive), FAQ clicks, outbound links, visibility changes, heartbeat/active time, and estimated exit.
- `live-server/server.js`: a Node.js 20+ always-on HTTP receiver. All activity is held ONLY in server RAM and expires after 12 hours. Nothing is stored in a database or on disk.
- Sessions from the last hour with an individual event timeline; summary view can toggle last hour/12 hours.

## IMPORTANT: Do not overwrite your current website blindly
This package was built from the most recent COMPLETE local ZIP available here (`massage-guide-redesign-v11-mobile-shine.zip`). It is NOT verified to match the currently deployed website, especially changes made afterward.
**In this source ZIP `checkout-config.js` has `checkoutUrl: ''`**. You MUST enter your actual working SuperProfile purchase URL there before deployment, or copy your CURRENT live `checkout-config.js` into this folder. Otherwise checkout buttons may stop working. Keep any newer page changes/images from your current production build.
The existing screenshot/ZIP source may have placeholder images. Preserve your current real images.

## Step 1 — Deploy ALWAYS-ON analytics receiver (required)
You cannot get reliable, shared, twelve-hour RAM data with Netlify static hosting or stateless Netlify Functions alone. Use an always-running Node.js host (paid, always-on Render web service, a small VPS, etc). **Free hosts that sleep will lose all history when they suspend.**

Deploy the `live-server` folder as a Node.js 20+ service. No npm install dependencies are required.
Start command: `npm start` (or `node server.js`). The hosting provider should expose its PORT automatically.
Set environment variables **ON THE SERVER**, not in public JS:
- `LIVE_PASSWORD` = password you chose in this chat (do not paste into frontend code).
- `LIVE_SECRET` = independently generated random string of at least 24 characters, preferably 64+ random hex characters (e.g. `openssl rand -hex 32`).
- `WEBSITE_ORIGIN` = `https://get-massage-books.netlify.app` (exactly, no trailing slash).
- `PORT` = optional; the host normally provides this.

The service must be reachable over HTTPS, e.g. `https://your-service.example.com`. Visit `https://your-service.example.com/health` to confirm `{ "ok": true, "retentionHours": 12 }`.

Important security: the password was shared within chat. Consider changing it to a fresh, unique password before publishing, and set that on the server. The server verifies it; it is not embedded in the downloadable files. Never place `LIVE_PASSWORD` or `LIVE_SECRET` in Netlify frontend files.

## Step 2 — Configure Netlify website
1. In `live-config.js`, enter your analytics server HTTPS address, e.g. `window.LIVE_ANALYTICS_URL = "https://your-service.example.com";` (no trailing slash).
2. Make sure `checkout-config.js` contains your CURRENT **working** SuperProfile checkout URL, not an empty value.
3. Keep the source's images / page assets (preserve any newer live site changes).
4. Build with Node.js 20+: `npm run build` (doesn't require installing dependencies).
5. Deploy the **contents of `dist/`** to your existing Netlify site. If the site is linked to a Git repo, commit the source changes and allow Netlify to build instead.
6. Visit `https://get-massage-books.netlify.app/live` and sign in with the `LIVE_PASSWORD` from your receiver's environment settings.

Never upload `live-server` as a static folder accessible on Netlify. In the included build script, the server is excluded from `dist/`.

## Step 3 — Test end to end
1. Open the landing page in an ordinary incognito browser and wait a few seconds.
2. Visit `/live` in another browser and sign in. One new session and page view should appear within five seconds.
3. Scroll to 25%, 50% and 75% of the page: inspect scroll reach and session timeline.
4. Click a BUY button; verify the specific BUY-01/BUY-02 etc appears in the events and the correct SuperProfile checkout opens **in the same tab as before**. Do not perform a real transaction merely for testing.
5. Close the visitor page; it should become inactive approximately 45 seconds after its last request (sometimes sooner on pagehide, though status waits for inactivity).
6. Test on mobile. Data is shared across browsers because the server, not the browser, holds it.

## Privacy and accuracy
- No form inputs, names, passwords, phone numbers, emails, payment content, raw user-agent strings, or full landing URL queries are collected.
- No replay/video captures, IP location or precise geographic tracking. Clicked FAQ and outbound element labels are truncated; avoid using personal data in button labels.
- Browser requests can be blocked or lost. Duration is observed/estimated, not a guaranteed exact exit time. Unique sessions are anonymous **per tab/session**; they are not guaranteed unique people.
- Real-time = dashboard polls the server every 5 seconds. Active = last recorded request within 45 seconds.
- Checkout intent = click on a `[data-checkout]` link. **Not** purchase or checkout initiation inside SuperProfile.
- No traffic events from before deployment are recoverable. All data is lost when the receiver restarts/redeploys/sleeps, and events older than 12 hours are deleted.
- The receiver restricts browser CORS origins and limits event submissions/login attempts, but public analytics endpoints cannot absolutely prevent spoofing or server-to-server requests. Treat numbers as indicative, not audited billing data.
- Have a clear analytics disclosure and observe consent requirements applicable to your visitors before enabling behavioral tracking.

## Recommended analytics URL
`https://get-massage-books.netlify.app/live`

## Rolling data
The dashboard shows events from the last 1 or 12 hours and ALWAYS has an individual-session list covering the latest 1 hour. The receiver stores up to 250,000 events max to protect memory. During extreme volume, early events can be evicted before 12 hours.
