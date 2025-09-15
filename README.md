# Qissa'25 — NUML (Static Site)

Modern, responsive static website for Qissa'25 with homepage, embedded rulebook, countdown, and Netlify-ready contact form.

## Local preview

1. Open the `NUMLQisaWebsite` folder.
2. Serve the folder with any static server:
   - VS Code Live Server
   - Node: `npx serve .`
   - Python: `python -m http.server 8080`
3. Open the printed URL (or `http://localhost:8080`).

## File structure

- `index.html` — homepage
- `rules.html` — embedded rulebook PDF and download
- `assets/css/styles.css` — theme styles
- `assets/js/main.js` — interactivity (nav, smooth scroll, countdown)
- `assets/docs/` — PDFs (logos and rulebook)
 - `assets/img/` — icons and logos (replace placeholders with your assets)

## Netlify deploy

1. Push this folder to a Git repo (root can be the project root or this subfolder).
2. On Netlify, New site from Git → pick the repo.
3. Build settings:
   - Build command: none
   - Publish directory: `NUMLQisaWebsite`
4. Deploy. Forms work automatically via Netlify Forms.

## Add your PDFs

These files are already placed under `assets/docs/`:

- `Qissa'25 Rulebook.pdf`
- `Qissa 2.0 logo (Q2).pdf`
- `Qissa 2.0 (Full logo idea 5).pdf`
- `Qissa Logo New.1.pdf`

If you rename them, update links in `index.html` and `rules.html` accordingly.

## Countdown

Edit the `data-deadline` on the countdown div in `index.html` to your actual date/time.

## Icons / Logos

- Replace `assets/img/qissa-logo.svg` with your Qissa logo (SVG/PNG). Also used as favicon and manifest icon.
- Replace `assets/img/numl-logo.svg` with the NUML crest (SVG/PNG) for the header badge.
