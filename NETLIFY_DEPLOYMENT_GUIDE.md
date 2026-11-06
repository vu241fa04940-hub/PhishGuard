# Netlify Deployment Guide for PhishGuard

## Why the "Page Not Found" (404) Error Occurred
In a React Single Page Application (SPA), routing is handled client-side by React Router (e.g. `/scanner`, `/about`, `/dashboard`, `/login`). 

When you refresh or visit a direct link on Netlify, Netlify's web server looks for an actual file named `/scanner/index.html` on the server disk. When it cannot find it, Netlify throws a **404 Page Not Found** error.

---

## How It Has Been Fixed
1. **Added `_redirects` file** in `client/public/_redirects`:
   ```text
   /*    /index.html   200
   ```
   This rule instructs Netlify to route all incoming page requests back to `/index.html` with an HTTP 200 status, allowing React Router to handle the page smoothly.

2. **Added `netlify.toml` configurations** at both the root and `client/` directories to automatically register the SPA redirect rules and publish directory.

3. **Added Resilient Heuristic Engine (`client/src/utils/urlAnalyzer.js`)**:
   When deployed on Netlify as a static frontend without a connected cloud server, the URL Scanner, Dashboard, and History will run seamlessly in the browser using the same 24-feature heuristics.

---

## How to Deploy on Netlify

### Option 1: Git Repository Deployment (Recommended)
In your Netlify Dashboard (**Site configuration > Build & deploy**):
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `build` (or `client/build` if base directory is blank)

Click **Save & Deploy Site**.

---

### Option 2: Drag and Drop Deployment
If you are deploying manually via the Netlify drag-and-drop web console:
1. Open terminal in the `client` folder:
   ```bash
   cd client
   npm run build
   ```
2. A `build` folder will be generated inside `client/`.
3. Drag and drop the **`client/build`** folder directly into the Netlify "Deploy" box.

