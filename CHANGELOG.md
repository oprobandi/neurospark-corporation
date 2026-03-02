# Neurospark Corporation — Changelog

---

## v2.2.0 (current)

### Critical Bug Fixes

**Typography — Fraunces replaced with Playfair Display (site-wide)**
- `index.html`: Google Fonts URL now loads `Playfair Display` (ital,wght: 0,400; 0,700; 0,900; 1,400; 1,700) instead of the unloaded Fraunces
- `Hero.jsx`: h1 headline font corrected
- `StatsStrip.jsx`: stat numbers font corrected
- `Wordmark.jsx`: brand wordmark in navbar and footer corrected
- `Chapter.jsx`: service section headlines corrected
- `BrandMoment.jsx`: brand quote corrected
- `FinalCTA.jsx`: CTA heading corrected
- `Testimonials.jsx`: quote mark and quote body corrected
- Previous state rendered fallback serif (Times New Roman) for every headline, the wordmark, and all stat numbers

**Typography — Space Grotesk now loads correctly**
- `index.html`: Space Grotesk (wght: 400; 500; 600; 700) added to Google Fonts URL
- All pages: `'Space Grotesk', monospace` fallback corrected to `'Space Grotesk', sans-serif`
- Previous state rendered Courier New for every agent code badge, category pill, and tag chip

**Typography — Playfair Display weight 900 + italic 700 now available**
- Added `wght@0,900` and `ital,wght@1,700` to font loading
- Eliminates browser font synthesis for bold and italic headlines

**Invalid HTML — nested `<a>` tags eliminated**
- `Buttons.jsx`: new `BtnGoldLink` component added — renders as react-router `<Link to>` natively
- `App.jsx` Navbar: desktop and mobile "Let's Talk" CTAs converted from `<Link><BtnGold>` to `<BtnGoldLink>`
- `App.jsx` MeetAgents: "Browse All 12 Agents" CTA converted from `<Link><BtnGold>` to `<BtnGoldLink>`
- Previous state produced nested `<a><a>` — invalid HTML with unpredictable cross-browser link behaviour

**Dead anchors — `#contact` replaced with `/contact` route**
- `Hero.jsx`: main hero CTA corrected to `/contact`
- `AgentsPage.jsx`: hero "Talk to Sales" button corrected to `/contact`
- `AgentDetailPage.jsx`: "Book a Demo" and "Deploy" CTAs in DeploymentCTA section corrected to `/contact`
- Previous state: clicking these buttons only appended `#contact` to the URL with no scroll or navigation

### Visual Fixes

**AgentCountStrip — navy band removed**
- `AgentsPage.jsx`: count strip changed from full-width navy background to a subtle cream-background strip with a single border line
- Eliminates the jarring navy sandwich between cream hero filter bar and cream agent grid

### Architecture

**Design tokens consolidated into single source of truth**
- `constants.js`: extended with `navyMid`, `navyDeep`, `goldDim`, `green` and new `FONTS` export (`display`, `body`, `mono`)
- `tailwind.config.js`: font family config updated — `fraunces` removed, `display` (Playfair Display), `grotesk` (Space Grotesk) added
- All 6 page files: local `const C = { ... }` declarations removed; now import `{ C, FONTS }` from `constants.js`
- Font alias constants in each page now derived from `FONTS` (e.g. `const FD = FONTS.display`)

---

## v2.1.0

- Navbar: Services/About/Contact → real route Links
- Navbar: "Results" uses `?scroll=results` pattern for cross-page anchor nav
- Navbar: "Let's Talk" CTA → `/contact`
- HomePage: reads `?scroll=` query param on mount, smooth-scrolls to section
- Footer: react-router Links throughout
- Added routes: `/agents`, `/agents/:slug`, `/services`, `/about`, `/blog`, `/blog/:slug`, `/projects`, `/contact`

## v2.0.0

- Multi-page React app (react-router-dom)
- Component extraction: Hero, StatsStrip, Chapter × 3, BrandMoment, Testimonials, FinalCTA, Footer, WhatsAppWidget
- MeetAgents section with 6 agent preview cards
- Tailwind CSS integration
- Custom `useInView` hook for scroll-triggered animations
- `constants.js` design tokens and image URLs
