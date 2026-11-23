# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Removed
- The "Download résumé" buttons in the Hero and Contact sections, the `ResumeButton` component and `profile.resumePath`.
  The PDF generator now writes to `scripts/resume/out/` (git-ignored) so a deploy can never publish the file.

## [Mobile responsive v3] - 2026-11-22

Release for the next deploy to https://www.kabilan.me. The site now works on phones from 320px, on tablets and on
desktop, in portrait and landscape, with touch and mouse input. The colours, fonts, logo, sections and routes are
unchanged. The hero text now lists eight roles and an architect banner.

### Added

- **Mobile menu below 1024px.** A full-screen dialog ("Site menu") with a top row holding the logo, the theme toggle
  and a visible **Close** button. The page behind it is inert, focus stays inside the menu, Esc or Close returns focus to
  the burger, a menu link moves focus to its section, and the page does not scroll behind the menu.
- **Responsive hero images.** WebP files in `public/img/hero/` at 640, 960, 1280 and 1600 px, for the cartoon and the
  robot. The cartoon uses `srcset` and `sizes`, and the page has one matching preload, so the image downloads once.
- **Touch reveal.** A tap opens the robot for 1.6 seconds (tap to peek). A press and drag reveals it, and the hint reads
  "Tap or drag to meet my robot twin" on touch devices. The robot image loads on first contact or when the browser is
  idle. The idle load is skipped when Save-Data is on.
- **Gallery affordance.** Below 1024px the Valam screenshots show three position dots and a "Screenshot n of 3" live
  text as the row scrolls.
- **Landscape layout.** Landscape phones (844×390, 667×375) get a shorter hero stage, no scroll cue and 48px menu links.
- **Responsive check.** `npm run test:responsive` runs `scripts/check-responsive.js`. It drives the installed Chrome
  headless, with no npm packages added. It checks 320 to 1280px in both themes, plus the two landscape sizes, for
  horizontal overflow, 44px tap targets, the menu, focus, hover gating, the gallery, the hero layout shift and reduced
  motion. `CHROME_PATH` sets the browser, and `RESPONSIVE_OUT` sets the screenshot folder.
- **Off-screen pause.** The hero, Skills and Projects animations pause while those sections are off screen.
- **Tests.** The suite has 60 tests in 2 suites (41 before). New cases cover the roles, the menu, the hero image preload,
  the touch reveal, the hover gating and the reduced-motion copy.

### Changed

- **Navigation breakpoint.** The desktop links now start at 1024px (they started at 768px). The burger shows below 1024px.
- **Roles.** The hero types eight roles, in this order: Lead Full-Stack Developer, Software Architect, Flutter Developer,
  React & React Native Engineer, AI Agent Orchestrator, IoT & Embedded Systems Engineer, Product Owner and Product
  Developer. The IoT role is now "IoT & Embedded Systems Engineer".
- **Summary wording.** The summary now says the work includes own architecture and product decisions as a software
  architect and product owner. The longer summary names the IoT and embedded systems work on ESP32, Arduino and Raspberry
  Pi. The "6+ years" figure is unchanged.
- **Banner.** The hero marquee reads "build · ship · architect · orchestrate ·".
- **Buttons.** Buttons have a 52px minimum height and no fixed height. Below 480px their text wraps, so "Message me on
  LinkedIn" is never clipped.
- **Typewriter.** Below 480px the role line has a reserved height and a single line, so the page does not shift as the
  roles change. The longest role fits at 320px.
- **Typography and spacing.** Headings, the menu links, the card padding and the section padding scale fluidly between
  phone and desktop sizes. Body text stays at 16px.
- **Hover effects.** Hover styles and framer-motion hover animations apply only on devices that can hover with a fine
  pointer. Touch devices do not get hover-only effects.
- **Phone animations.** On phones and touch devices the decorative blurs and the wash animation are switched off, and the
  skill-card glow is static. The marquee keeps running.
- **Safe areas.** The menu and the footer respect the bottom safe-area inset on iPhones. Zoom is never disabled.
- **Nav on touch.** The scrolled nav uses a solid background on touch devices, without a blur.
- **Overflow guard.** `overflow-x: clip` on `html` and `body` replaces `overflow-x: hidden` on `body`.

### Fixed

- **Missing menu on tablets.** Between 768px and 1023px the page showed the desktop links with no menu button.
- **Small tap targets.** The logo, the chips, the social links and the scroll cue were under 44px. Every checked control
  is now at least 44×44px.
- **Clipped buttons.** Button text was cut off at narrow widths.
- **Hero image downloaded twice.** The preload and the image used different files. There is now one matching preload and
  one responsive image.
- **Hero image hidden at start.** The hero stage started at opacity 0. It now starts visible.
- **Typewriter layout shift.** The role line moved the page as each role was typed. It now has a reserved height.
- **Robot image loaded up front.** The robot image is now loaded on first contact or when the browser is idle.
- **Menu scrolled behind.** The page could scroll under the open menu. The scroll is now locked while it is open.
- **Menu focus.** Choosing a menu link now moves focus to its section.

## [Theme refresh v2 (Golden Hour Café)] - 2026-11-22

Re-theme of the single-page portfolio to match the two hero images. Layout, sections and content are unchanged.
The Café ember and Midnight + lime palettes are gone. Light is the default, and "Brick dusk" is the optional dark mode.

### Added

- **Golden Hour Café theme.** Light by default, with a "Brick dusk" dark mode. The palette comes from the hero images:
  cream `#fbf3e7`, brick `#9a3a22` and fairy gold `#ffcf7a`. Robot cyan is used only for the reveal ring. Tokens are in
  `src/index.css`, in two colour blocks that are checked by `scripts/check-contrast.js`.
- **Hero images.** `src/assets/portrait/portrait-cartoon.jpg` and `portrait-robot.jpg` (1600×900) form the reveal card.
  The cartoon is the base, and the robot is revealed by the pointer or by a touch drag. The card has a golden-hour glow,
  six bokeh dots (two overlap the card edge), a grain texture, and a single marquee that reads
  "build · ship · tinker · orchestrate ·".
- **Logo.** The "Bot visor K" mark: `public/logo.svg` (master) and an inline copy in `src/navigation/Logo.js`, with
  the "kabilan.me" wordmark in Fraunces. The logo is used in the navigation and the footer.
- **Favicon fallbacks.** `public/favicon.ico` (16, 32 and 48 px), `public/favicon-16.png`, `public/favicon-32.png`,
  a simplified `public/favicon.svg` and a 180×180 `public/apple-touch-icon.png`. Every icon link carries a `?v=3`
  query, so browsers fetch the new icons.
- **SEO metadata.** The share image `public/og-kabilan-gr-cafe.jpg` (1200×630, cropped from the cartoon), with
  `og:image:width`, `og:image:height` and `og:image:alt`. Also a `twitter:card` of `summary_large_image`, a canonical
  link, a `ProfilePage` JSON-LD block (name, job title, description, image, and the LinkedIn and GitHub links only),
  `public/sitemap.xml`, and a `Sitemap:` line in `public/robots.txt`.
- **Fonts.** Fraunces (SOFT 100) for display, Nunito for body text and labels, and Baloo Thambi 2 for the Tamil greeting.
- **Deep links.** `postbuild` in `package.json` copies `build/index.html` to `build/404.html`.
- **Contrast check.** `scripts/check-contrast.js` reads its colours from `src/index.css` and checks every text and UI
  pair in both themes. The last recorded run had 114 checks and 0 failures.
- **Tests.** The suite has 41 tests in 2 suites. New cases cover the light default, the stored choice, the theme-color
  meta, the bokeh layer, the JSON-LD block, the sitemap and robots files, the favicon links and the hero image priority.

### Changed

- **Default theme.** Light for every visitor, whatever the OS setting. A stored choice in `localStorage` (key `theme`)
  still wins. `prefers-color-scheme` is no longer read.
- **Hero card.** A 28px radius and a cream matte with a warm shadow in light. In dark, the edge is feathered with a
  mask instead. The 1px border and the amber glow are removed.
- **Marquee.** One lowercase row, set in Fraunces italic at low opacity, in place of the two uppercase rows.
- **Hint chip.** Now reads "Hover to meet my robot twin".
- **Cartoon image.** `fetchpriority="high"` and no lazy loading. The robot image is never high priority.
- **Skill category hues.** All eight `--cat-*` tokens are re-based on the Golden Hour Café palette, in both themes.
- **Robot fallback.** The SVG robot is recoloured to cream and cyan. Its scanlines are removed. The `SYS://KABILAN.AI`
  label stays.
- **Logo.** Replaces the `{K}` monogram with the "Bot visor K" mark. The wordmark has no braces.
- **Share image.** `og:image` points to the 1200×630 JPG, not to `favicon.svg`.
- **Tamil greeting.** Set in Baloo Thambi 2 (`--font-tamil`) instead of Noto Sans Tamil.
- **Labels.** Former monospace eyebrows, tags and captions are Nunito 700 in uppercase with 0.08em tracking.
- **Design tokens.** `--color-text-faint` is replaced by `--color-text-muted`. `--font-mono` is replaced by `--font-body`.
  `--color-warning` is new.

### Removed

- **Café ember palette**, with its espresso, amber and terracotta colours. The earlier Midnight + electric lime palette
  is removed as well.
- **Old fonts:** Space Grotesk, Inter, JetBrains Mono and Noto Sans Tamil. The `--font-mono` and `--color-text-faint`
  tokens are removed with them.
- **Terminal-style marquee.** The outlined and solid uppercase rows, the `>` prompt glyph, and the SVG scanlines.
- **Old photo.** `src/assets/kabilan-image.JPG` (about 1.6 MB). The resized `src/assets/kabilan-portrait.jpg` is kept
  as the fallback base of the reveal card.
- **`{K}` logo mark** and the logo gradient tokens (`--logo-from`, `--logo-to`, `--logo-glyph`).

### Fixed

- **Deep links on GitHub Pages.** Direct loads of routes such as `/home` or `/about` return the app instead of GitHub's
  404 page. The router then redirects to the matching section.
- **Stale or missing favicons.** Safari and other browsers that ignore SVG favicons now have `favicon.ico` and PNG
  fallbacks. The `?v=3` query forces a refresh.
- **Share previews.** Link previews show the illustration instead of the favicon.
- **Contrast drift.** The contrast check reads the real tokens, so it cannot fall out of step with the palette.

## [Unreleased] - 2026-11-22

Rebuild of the site as a single-page developer portfolio for Kabilan GR, served at https://www.kabilan.me.

Corrections added with the theme refresh v2 entry above are marked "Superseded" where the original text no longer applies.

### Added

- Single-page portfolio at `/` with six anchored sections, in order: Hero (`#hero`), About (`#about`),
  Skills (`#skills`), Experience (`#experience`), Projects (`#projects`) and Contact (`#contact`).
- Hero with the page's only `<h1>`, typewriter role rotator (static text under reduced motion), the current
  role at Xpulsar, a stat (superseded: now "6+" years), CTAs and a photo ring with orbiting icons (superseded: the photo
  ring and orbit icons were replaced by the reveal card in the theme refresh v2 entry).
- Skills section with eight categories, including AI-Assisted Dev / Vibe Coding, AI Agent Orchestration &
  Multi-Agent, and Hardware & IoT. Filter chips, tilt cards and self-assessed proficiency rings.
- Experience timeline with five roles, newest first. Only the Xpulsar role is marked "Present".
- Projects section with the featured Valam card (on-device finance app with the Mathi AI coach) and six resume
  projects with category filters (All / Web / Mobile / AI / CRM) and SVG covers.
- Contact section with location, the résumé download, and GitHub and LinkedIn links. (Superseded: the original
  `mailto:` button, copy-email button and toast were removed. The site has no email address and no `mailto:` link.)
- Sticky navigation with a scroll-spy highlight, a theme toggle, and a full-screen mobile menu below 768px
  (Esc to close, focus returned to the menu button, `aria-expanded` and `aria-controls`).
- Theme: dark by default, with a light theme, stored in `localStorage` (superseded: the default is now light for
  every visitor, and `prefers-color-scheme` is not read; see the theme refresh v2 entry).
- Reduced-motion support: typewriter, tilt, reveal, count-up and timeline animations are turned off and the
  content renders statically.
- Skip-to-content link, one `<h1>`, landmark elements, and `alt` text on every image.
- Responsive layout designed for 360px, 768px and 1280px. The in-browser overflow and reduced-motion check (AC21)
  is still a manual step listed in the README.
- Download résumé links in the Hero and Contact sections, pointing to `public/Kabilan_GR_Resume.pdf`
  (the file is supplied by the owner and is not generated by the project).
- Open Graph and meta description tags in `public/index.html`, and a `%PUBLIC_URL%` favicon.
- `public/CNAME` with `www.kabilan.me` for the custom domain.
- Content in one file, `src/data/portfolio.js`, with navigation and redirect maps in `src/utils/Constants.js`.
- Inline SVG icon set in `src/components/icons/` and project cover illustrations in
  `src/components/illustrations/`.
- Valam screenshots and icon in `src/assets/projects/valam/` (screenshots at 900px or less, 200 KB or less).
- Shared components: `Reveal`, `TiltCard`, `SectionHeading`, `SocialLinks`, `ResumeButton`, `FilterChips`,
  `Footer`.
- Theme hook `src/hooks/useTheme.js` and reduced-motion hook `src/hooks/usePrefersReducedMotion.js`.
- Test suite `src/App.test.js` (originally 20 tests; superseded: the suite now has 41 tests in two suites, see the
  theme refresh v2 entry) with mocks for `IntersectionObserver`, `matchMedia` and `navigator.clipboard` in
  `src/setupTests.js`.
- Dependency: `framer-motion` ^11.18.2 (the only new runtime dependency).
- Project README with run, build, test, deploy, custom-domain and pre-deploy instructions.
- Reveal portrait and marquee hero (`src/home/RevealPortrait.js`): a gooey, pointer-driven reveal over looping
  text marquees, with the photo or an SVG robot fallback. (Superseded: the Pixar-style images are now the JPGs in
  `src/assets/portrait/`, not transparent PNGs.)
- Interactive Languages card in About (`src/About/LanguagesCard.js`): English and Tamil toggles with a greeting and a
  native-speaker meter.
- Skill ring icons (`src/components/icons/ringIcons.js`) for the six core-stack rings.
- `public/favicon.svg` and `public/apple-touch-icon.png` (180px), linked from `public/index.html`.

### Changed

- `package.json` `homepage` is now `https://www.kabilan.me`. The `predeploy` and `deploy` scripts are unchanged.
- `src/App.js` uses `BrowserRouter` with `basename={process.env.PUBLIC_URL}`, instead of the previous
  `window.location.pathname` value.
- Skills section (`src/languages/Languages.js`) replaces the previous dial stub with the category, chip and
  ring design.
- Experience timeline (`src/workExperience/`) rebuilt as a scroll-drawn, five-item ordered list.
- Projects (`src/projects/`) rebuilt with the featured Valam card and filterable grid.
- Theme design tokens in `src/index.css` replace the previous colour map. `src/utils/style.js` is now a
  compatibility map to CSS custom properties.
- `src/utils/ImageUtil.js` now only holds the photo fallback and the Valam asset imports. (Superseded: its logo lookup,
  `getLogo`, was removed.)
- `public/index.html`: new title, meta and Open Graph tags, and a pre-paint theme script. (Superseded: the font request
  is now Fraunces, Nunito and Baloo Thambi 2, not Space Grotesk, Inter and JetBrains Mono.)
- `README.md` rewritten for the new site.
- Theme changed to Midnight + electric lime: dark default, lime `#c6f432` and cyan `#22d3ee` accents, and a light
  mode with deeper accents. (Superseded: replaced by the Café ember palette, then by Golden Hour Café. See the theme
  refresh v2 entry.)
- Hero uses a side-by-side layout from 768px (text left, portrait right) and stacks on mobile.
- Experience stat is now 6+ years (`stats.years` in `src/data/portfolio.js`).
- Logo is an inline SVG `{K}` mark with a "kabilan.me" wordmark. (Superseded: replaced by the "Bot visor K" logo in
  the theme refresh v2 entry.)
- The Contact call to action now goes to LinkedIn ("Message me on LinkedIn"), opening in a new tab.

### Removed

- Facebook and Instagram links, imports and assets (`src/assets/facebook.svg`, `src/assets/instagram.svg`).
  The only social links are GitHub and LinkedIn.
- Font Awesome CDN `<link>` in `public/index.html`. Icons are now inline SVG.
- Nunito `@import` in `src/index.css`.
- Old per-page routes. They now redirect to `/` and scroll to the matching section:
  - `/home` redirects to `#hero`
  - `/languages` redirects to `#skills`
  - `/workExperience` redirects to `#experience`
  - `/projects` redirects to `#projects`
  - `/about` redirects to `#about`
  - `/contact` redirects to `#contact`
  - Any other path redirects to `/`
- The default Create React App starter test in `src/App.test.js`.
- KR logo assets: `src/assets/KR-black.gif`, `KR-light.gif`, `KR-static-black.png`, `KR-static-light.png` and
  `public/KR-static-black.png`.
- Old tech logo SVGs: `src/assets/react-logo.svg`, `reactjs-logo.svg`, `nodejs-logo.svg`, `mysql-icon.svg` and
  `firebase-icon.svg`.
- Email display, the `mailto:` link and the copy-email button in Contact, along with the email field in the content
  data. The site shows no email address.

### Fixed

- **Router basename.** `BrowserRouter` used `window.location.pathname` as its basename, which broke routing
  for any path other than the root. It now uses `process.env.PUBLIC_URL`, which is empty at the domain root.
- **Failing test.** The starter test searched for the text "learn react", which the new page does not
  contain. It is replaced by the page test suite. `CI=true npm test -- --watchAll=false` passes. (The suite has since
  grown to 41 tests; see the theme refresh v2 entry.)
- **Lint issues.** Removed the ESLint warnings from the previous markup: `class=` attributes (now `className`),
  `for=` attributes (now `htmlFor`), `<image>` elements, `<img>` tags without `alt`, and `<a>` elements without
  `href`. `CI=true npm run build` now compiles with no warnings.
- **Mobile menu collapse.** The scrolled header used `backdrop-filter`, which makes the header the containing
  block for its `position: fixed` children. The mobile menu then shrank to the 64px header height after scrolling.
  The glass effect now sits on `.nav[data-scrolled='true']::before`, so the menu stays full height.
- **Tooling on ExFAT drives.** AppleDouble `._*` files written by macOS broke ESLint and Jest on the external
  drive. They must be deleted before build and test. This is documented in the README. It is an environment
  issue, not a code change.
- **Invisible or missing ring icons.** The selector `.ring__dial svg` also matched the icon SVGs and positioned
  them absolutely. It is now `.ring__dial > svg`.
- **Stat pill alignment.** The hero stat pill uses flex alignment, so the number and label line up without
  margin or `vertical-align` adjustments.
- **Scroll cue centring.** The scroll cue is centred on the hero, and its label is optically centred.
- **Flaky tests.** The three animation-dependent tests run with reduced motion, and the Jest timeout is raised to
  20 seconds. Timeouts on the slow ExFAT volume caused the failures.
