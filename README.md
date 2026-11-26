# AARK Innovations &mdash; Enterprise Systems, Modern Cloud & Applied AI

High-performance corporate web platform for **AARK Innovations**, built with modern vanilla frontend architecture, responsive micro-animations, and verified enterprise copy.

---

## ⚡ Architecture & Sections

- **Two-Step Notch Navigation & Hero Proof Grid:** Responsive status bar with working session booking CTA, animated SVG backdrop, and four-column executive metrics bar.
- **Section 04 &mdash; Consulting Practices:** Interactive 6-card grid with line-drawing SVG path reveals, custom technical icons, and high-contrast hover feedback.
- **Section 05 &mdash; Ecosystem Platforms:** Interactive service rows for Oracle ERP Cloud, Snowflake, Databricks, Microsoft Azure, and AWS with cursor-tracking arrows and micro-animations.
- **Section 06 &mdash; The Bottleneck & Data Trust Gap:** 3-card flip reveal zoom grid (*The Integration Chasm*, *The AI Foundation Trap*, *Cognitive Busywork*) paired with the 67% executive data trust stat banner.
- **Enterprise Content Suite:** Complete copy documentation covering service practices, enterprise case studies, delivery manifesto, and legal policies.

---

## 🚀 Deployment (Vercel)

This project is structured as a zero-dependency static web application, perfectly optimized for instantaneous deployment on [Vercel](https://vercel.com).

1. Import this repository into Vercel.
2. Framework Preset: **Other** (Static HTML).
3. Root Directory: `./` (leave default).
4. Click **Deploy**.

---

## 🛠 Local Development

No build steps, package managers, or compilers required. Simply open `index.html` in any modern browser or run a local web server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .
```

## November 26, 2026 — optimization update

- All 93 standalone image assets are WebP and strictly below 100,000 bytes (largest 97,538 bytes). Inline SVG animations remain inline to preserve their interactivity. Existing video is unchanged.
- Image assets went from 17,824,138 bytes (including original alternate formats) to 4,188,892 bytes. Old duplicate image formats were removed.
- Responsive layout fixes for hero, service rows, cards, footer, contact form, and delivery journey. The animated desktop journey switches to the stacked progress layout below 1360px.
- Real internal destinations for practice, platform, blueprint, migration and legal links, generated from the supplied content documents. Generic social-network homepages were removed pending verified company profile URLs.
- The contact form validates required fields and email format. With no endpoint configured it creates a prefilled email addressed to hello@aarkinn.com. The visitor must send it from their email application. No false delivery confirmation is shown.
- To enable direct submission, configure a real HTTPS POST endpoint in `data-endpoint` on `#project-contact-form` in `index.html`. The endpoint must accept JSON (`name`, `email`, `company`, `message`) and implement server-side validation, spam protection, and delivery/storage; return a 2xx status only after accepting the enquiry. Do not put secret credentials in client code. The contact form reports failures without clearing entries.
- Tests: JavaScript syntax validation, internal link/asset reference audit, image decoding and size validation, and Chromium in-memory browser fixture at 320, 375, 768, 1024, 1280, and 1440px. No horizontal overflow or page errors observed in those fixtures; theme, mobile navigation, FAQ, and expandable card controls exercised. Live hosting and actual email delivery were not tested.

## Practice card update

- The six practice cards are static informational cards with no links or action arrows; their layout and hover effects are retained.
- Removed the five linked practice detail pages (oracle, data, ai, integration, architecture) and the Enterprise Architecture Blueprint link, which shared the architecture page. Other links to removed practice pages now point to the corresponding homepage cards. Privacy and terms pages remain available; migration playbook and obsolete practice links were removed.

## AWS and Azure update

- Removed both standalone platform pages and converted all four links to static informational content. Removed navigation arrows from the two platform rows; existing hover animations and layout remain.
