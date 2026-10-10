# Portfolio Dev — Modern Developer Portfolio

Vite + React 18 + Tailwind CSS 3 + Framer Motion + PWA. Dark-mode first, glassmorphism, accent themes, settings drawer, installable.

## Folder structure

```
portfolio-dev/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── manifest.webmanifest
│   ├── icon.svg
│   └── sw.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/projects.js      ← edit your projects here
│   ├── hooks/useSettings.jsx
│   ├── hooks/usePwaInstall.js
│   └── components/
│       ├── Navbar.jsx  Hero.jsx  About.jsx
│       ├── Projects.jsx  ProjectModal.jsx
│       ├── Skills.jsx  Contact.jsx  Footer.jsx
│       └── SettingsDrawer.jsx
├── scripts/
│   ├── install-linux.sh
│   ├── install-windows.ps1
│   └── generate-icons.py
└── README.md
```

## 1. Run locally

Requirements: Node.js 18+.

```bash
cd portfolio-dev
npm install
npm run dev
# → http://localhost:5173
```

Build + preview (PWA / service worker only runs in production build):

```bash
npm run build
npm run preview
# → http://localhost:4173
```

## 2. Customize

- **Projects:** edit `src/data/projects.js` (`profile`, `skills`, `projects` arrays). Spanish variants (`role_es`, `summary_es`, `description_es`, `features_es`) show when ES is active; they fall back to English if empty.
- **Presentation (no code):** click **Edit** in the About section to change your name, role, tagline, location, links, cards — and your **profile photo** (any JPG/PNG, auto-compressed to ~512px so it stays tiny). Saved per-browser in localStorage (`portfolio-content-v1`); **Restore defaults** reverts to the data files.
- **My certificates (no code):** new **Certificates** menu section. Click **Add certificate** to register courses you completed (title, issuer, issue date day/month/year, credential URL + ID, skills). Yours appear first with a badge, support edit/delete, and persist per-browser (`portfolio-mycerts-v1`). Examples live in `src/data/certificates.js`.
- **My projects (no code):** click **Add project** in the Projects section to create your own entries (title, **full date: day / month / year**, language/tech tags incl. custom ones, summary, description, features, GitHub/demo links + optional document attachment up to **50 MB**, stored in the browser's IndexedDB so heavy docs don't clog localStorage). Yours appear first with a badge, can be edited/deleted from their cards (deleting also removes the stored file), and persist per-browser (`portfolio-myprojects-v1` + `portfolio-db`). Every card — including the built-in examples — has a 🗑️ trash icon (two clicks to confirm); hiding examples can be undone with the restore button.
- **Snippets:** copy-paste blocks live in `src/data/snippets.js` (`{ id, lang, title, title_es, desc, desc_es, code }`). The section shows a language picker first (no clutter); picking one reveals its snippets with search + copy buttons (clipboard API with manual-select fallback).
- **Language:** UI strings live in `src/i18n/translations.js` (`en` + `es`). Toggle EN/ES from the navbar or Settings → Language. Persisted in settings; `<html lang>` updates automatically.
- **Contact:** set `email`, `github`, `linkedin` in the same file.
- **Title/colors:** `index.html` title + `tailwind.config.js` + `src/index.css` (`[data-accent=...]`).

Settings (theme dark/light/system, accent emerald/cyan/purple/amber/rose/blue, animations, compact grid) persist in `localStorage` key `portfolio-settings-v1`. The navbar uses simple text links (full menu on desktop, hamburger dropdown on smaller screens).

## 3. PWA — Install to Desktop

The app ships with `public/manifest.webmanifest` + `public/sw.js` (offline cache, registered in `src/main.jsx` in production).

1. `npm run build && npm run preview` (or deploy to HTTPS — required for install prompt except on localhost).
2. Open in Chrome/Edge → look for the install icon in the address bar, or click the **Install / Install App** button in the navbar, hero, or contact section (fires `beforeinstallprompt`).
3. The installed app runs standalone with its own window + icon.

Generate PNG icons (Chrome prefers 192/512 PNG):

```bash
pip install pillow
python scripts/generate-icons.py
# writes public/icon-192.png and public/icon-512.png from icon.svg colors
```

## 4. Desktop shortcut without store (alternative)

### Linux — `.desktop` launcher
```bash
# after deploying, e.g. https://you.github.io/portfolio/
APP_URL="https://you.github.io/portfolio/" bash scripts/install-linux.sh
# creates ~/.local/share/applications/portfolio-dev.desktop
```

Or in Chrome: ⋮ → Save and share → **Install page as app**, or Create shortcut → tick *Open as window*.

### Windows
- **Easiest:** Chrome/Edge → ⋮ → Save and share → **Install page as app** (creates Start Menu + Desktop entry, auto-updates).
- **Manual:** run PowerShell script (creates a desktop `.lnk` opening the URL in a standalone window):
```powershell
powershell -ExecutionPolicy Bypass -File scripts\install-windows.ps1 -Url "https://you.github.io/portfolio/"
```
- Or right-click Desktop → New → Shortcut → location: `"C:\Program Files\Google\Chrome\Application\chrome.exe" --app=https://you.github.io/portfolio/`.

### Build a real executable wrapper (optional)
```bash
# via Nativefier (Electron wrapper)
npm i -g nativefier
nativefier --name "AlexDev Portfolio" "https://you.github.io/portfolio/" --platform linux --arch x64
nativefier --name "AlexDev Portfolio" "https://you.github.io/portfolio/" --platform windows --arch x64
```

## 5. Deploy

Any static host: Vercel, Netlify, GitHub Pages, Cloudflare Pages. Build output is `dist/`. Make sure `manifest.webmanifest`, `sw.js`, icons are served from root and the site is HTTPS.

## Notes

- Service worker caches `/`, `/index.html`, manifest + icon; stale-while-revalidate for same-origin GETs.
- Contact form is a front-end demo — connect Formspree/Resend/your API for real delivery.
