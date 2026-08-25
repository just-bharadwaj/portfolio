# Bharadwaj Jakkula — Portfolio

A dark, motion-driven personal portfolio for **Bharadwaj Jakkula**, an AI &amp; Machine Learning engineer and M.S. Computer Science student at Texas A&amp;M University–Corpus Christi. Built as a single, self-contained page with no build step.

**Live:** https://just-bharadwaj.github.io/portfolio/ · [Netlify mirror](https://shiny-arithmetic-99c2fe.netlify.app/)

## Highlights

- **Cinematic hero** — character-by-character headline reveal with an animated gradient, drifting ambient glow, grid + film-grain texture, and a scroll parallax fade.
- **Cross-scrolling marquees** — two counter-rotated skill bands that react to scroll velocity.
- **Project timeline** — six projects (PathWise AI, CycleGAN, Image Captioning, Blockchain Encrypted Image Retrieval, SecureCloth, EcoWaste360) on an alternating timeline whose gradient spine draws itself on scroll.
- **Study timeline** — education presented on the same scroll-drawn treatment.
- **Motion throughout** — animated stat counters, word-split section titles, staggered grid reveals, a cursor glow, and a hide-on-scroll glass nav.
- **Accessible** — respects `prefers-reduced-motion`, keyboard focus states, ARIA labels, and degrades gracefully if the GSAP CDN is unavailable.

## Tech

- Vanilla **HTML / CSS / JavaScript** — no framework, no bundler.
- [GSAP](https://gsap.com/) + ScrollTrigger (loaded from CDN) for the scroll and entrance animations.
- Google Fonts: Space Grotesk, DM Sans, JetBrains Mono.

## Run locally

No build step — serve the folder with any static server:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. (Opening `index.html` directly works too, but a server avoids CDN/CORS quirks.)

## Structure

```
portfolio/
├── index.html   # markup + content
├── style.css    # tokens, layout, and all visual styling
└── script.js    # GSAP timelines, ScrollTrigger, marquees, counters
```

## Deploy

Hosted on **GitHub Pages** from the `main` branch (root). Any push to `main` republishes the site.

---

© 2026 Bharadwaj Jakkula.
