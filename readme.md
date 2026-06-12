# Ezhil Savier S — Portfolio 2026

> **"Intelligence with Intent"** — AI & Data Science Engineer Portfolio  
> Built with pure HTML, CSS, and JavaScript. No frameworks. No build step.

---

## 🗂 Project Structure

```
portfolio 2026/
├── index.html        # Main HTML file (single-page portfolio)
├── style.css         # All styles — dark futurism / neural interface theme
├── script.js         # Animations, particles, typewriter, canvas effects
├── profile.png       # Profile photo
└── README.md         # This file
```

---

## 🚀 Running Locally

This is a **static site** — there's no build step, no `npm install`, no dependencies to install.

### Option 1 — Double-click (simplest)

Just open `index.html` directly in your browser:

```
d:\portfolio 2026\index.html
```

> ⚠️ Some browsers may block local CDN resources (particles, GSAP) when opened via `file://`. Use one of the server options below for the full experience.

---

### Option 2 — VS Code Live Server (recommended)

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Opens at: `http://127.0.0.1:5500`

---

### Option 3 — Python (no install required)

**Python 3:**
```bash
python -m http.server 5500
```

**Python 2:**
```bash
python -m SimpleHTTPServer 5500
```

Then open: [http://localhost:5500](http://localhost:5500)

---

### Option 4 — Node.js (`npx serve`)

```bash
npx serve .
```

Then open the URL shown in the terminal (usually `http://localhost:3000`).

---

### Option 5 — Node.js (`npx live-server`)

```bash
npx live-server --port=5500
```

Auto-reloads the browser on file changes — great for development.

---

## 🌐 Deployment

### GitHub Pages

1. Push the project to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder `/`
4. Your portfolio will be live at: `https://<your-username>.github.io/<repo-name>`

### Netlify (drag & drop)

1. Go to [netlify.com](https://netlify.com) and log in
2. Drag the entire `portfolio 2026` folder onto the deploy zone
3. Get an instant live URL

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | Vanilla CSS (custom properties, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Animations | GSAP 3 + ScrollTrigger (CDN) |
| Particles | tsParticles (CDN) |
| Fonts | Google Fonts — Outfit, Inter, DM Mono, Space Mono |

---

## ✏️ Customisation

| What to change | Where |
|----------------|-------|
| Name, bio, links | `index.html` |
| Colors, fonts, spacing | `style.css` → `:root` variables |
| Typewriter phrases | `script.js` → `phrases` array |
| Terminal boot lines | `script.js` → `terminalLines` array |
| Profile photo | Replace `profile.png` (keep the same filename) |

---

## 📄 License

Personal portfolio — all rights reserved © Ezhil Savier S, 2026.
