# Kabilan GR - Developer Portfolio

Single-page developer portfolio for **Kabilan GR**, Lead Full-Stack Developer at Xpulsar (Chennai, India).
It is served at **https://www.kabilan.me** from GitHub Pages.

The site is built for recruiters, hiring managers and potential clients. It presents his career, skills and a
featured personal project (Valam). It uses a warm **Golden Hour Café** theme, light by default with a
"Brick dusk" dark mode, scroll and hover animations, and support for reduced motion. It is laid out for phones
from 320px, tablets and desktop, in portrait and landscape, with touch and mouse input.

## What the site contains

One scrolling page at `/` with six anchored sections, shown in this order:

| Section | Anchor | What it shows |
|---|---|---|
| Hero | `#hero` | The name (the page's only `<h1>`), a typewriter rotator with eight roles (see "Roles and summary"), the current role at Xpulsar, a "6+ years" stat, CTAs (View Projects, Contact Me, Download résumé), and the reveal card: the Pixar-style cartoon, with the robot revealed by the pointer or by touch. A marquee ("build · ship · architect · orchestrate") and bokeh dots sit behind it. Text and card sit side by side from 768px and stack below it |
| About | `#about` | Summary, location, count-up stat cards (6+ years, 5 companies, platforms), education, and an interactive Languages card (English / Tamil toggles with a greeting and a native-speaker meter) |
| Skills | `#skills` | Eight skill categories with filter chips and tilt cards. Six core-stack proficiency rings, each with an icon (React, Node.js, TypeScript, Flutter, AI agents, chip). Levels are self-assessed |
| Experience | `#experience` | Vertical timeline of five roles, newest first, with a scroll-drawn line. Only the Xpulsar role is marked "Present" |
| Projects | `#projects` | Featured Valam card (Flutter finance app with the Mathi AI coach), then six projects with category filters. On phones the Valam screenshots scroll sideways, with dots that show the position |
| Contact | `#contact` | A "Message me on LinkedIn" button, location, résumé download, GitHub and LinkedIn. The site publishes no email address and no phone number |

A sticky navigation bar links to the six sections with a scroll-spy highlight, and has a theme toggle. Below 1024px
the links are replaced by a full-screen menu (see "Mobile menu"). A footer with the logo and a back-to-top button ends
the page. A scroll cue at the bottom of the hero points to About. It is shown from 768px up, and hidden on landscape
phones.

The site has no contact form, no email link and no analytics.

## Roles and summary

- **Typewriter roles.** `profile.roles` in `src/data/portfolio.js` holds the eight roles the hero types, in this order:
  Lead Full-Stack Developer, Software Architect, Flutter Developer, React & React Native Engineer, AI Agent
  Orchestrator, IoT & Embedded Systems Engineer, Product Owner, Product Developer.
- **Summary.** `profile.summary` says the work includes "own architecture and product decisions as a software
  architect and product owner". `profile.summaryMore` says IoT and embedded systems are designed on ESP32, Arduino and
  Raspberry Pi. The "6+ years" figure is unchanged.
- **Banner.** The hero marquee reads "build · ship · architect · orchestrate ·". It is decorative and `aria-hidden`.
- **Layout.** The role line has a reserved height, so the typewriter does not move the page as it types. On phones a
  hidden copy of the longest role sets the width, so the longest role fits on one line at 320px. See "Responsive
  layout".

## Theme: Golden Hour Café

- **Light (default).** The palette comes from the two hero images. The page is cream `#fbf3e7`, the colour of the
  cartoon's shirt and the robot's shell. The accent is brick `#9a3a22`, with honey wood `#7a4f00` as the secondary colour.
- **Brick dusk (dark).** A brick-brown page `#2b1912` with a fairy-light gold accent `#ffcf7a`.
- **Robot cyan** (`#59c8ff` in light, `#6fdcff` in dark) is used only for the reveal ring around the hero card.
  Gold and cyan are never used as text on the light page.
- **Fonts.** Fraunces (SOFT 100) for headings and the wordmark, Nunito for body text, labels and tags, and
  Baloo Thambi 2 for the Tamil greeting. They load from Google Fonts in `public/index.html` with `display=swap`.
  The fallbacks are Georgia and the system UI fonts.
- **Theme switching.** Light is the default for every visitor, whatever the OS setting is. The toggle in the
  navigation saves the choice in `localStorage` under the key `theme`. A stored `light` or `dark` always wins on later
  visits. The site does not read `prefers-color-scheme`. A small script in `public/index.html` applies the stored
  theme before the first paint, and `src/hooks/useTheme.js` keeps it in sync and updates the `theme-color` meta tag.
- **Tokens.** Colours, fonts, radii, shadows and motion values are CSS custom properties in `src/index.css`. The
  colours are in two blocks, `:root, [data-theme="light"]` and `[data-theme="dark"]`. Keep one `--name: value;`
  declaration per line in those blocks, because the contrast script parses them line by line.
- **Contrast check.** Run `node scripts/check-contrast.js` after any colour change. It reads the two blocks from
  `src/index.css` and checks WCAG AA contrast in both themes: text needs 4.5:1, and UI and focus need 3:1. It covers
  the eight category colours as well. It prints one line per check and exits with 1 if any check fails. The last
  recorded run was 114 checks with 0 failures.
  - This is not an npm script. See "Commands that are not npm scripts" below.

## Logo and icons

- **Logo: "Bot visor K".** A cream robot head with ear pods, and a cyan K glowing in a dark visor. The master file is
  `public/logo.svg` (viewBox `0 0 64 64`, paths only, no text). `src/navigation/Logo.js` is an inline copy of the
  same mark, with the "kabilan" wordmark in Fraunces and ".me" in the muted colour. The shell and ear colours follow
  the `--logo-*` tokens, so the mark stays legible in both themes. The logo appears in the navigation and the footer.
  The wordmark hides below 480px. The logo is a 44×44 tap target in the navigation.
- **Favicon set.** All of these are in `public/` and linked from `public/index.html`:
  - `favicon.ico` (16, 32 and 48 px in one file), for browsers that ignore SVG favicons, such as Safari;
  - `favicon.svg`, a simplified, bolder version of the logo for small sizes. It is not a byte copy of `logo.svg`;
  - `favicon-16.png` and `favicon-32.png`;
  - `apple-touch-icon.png` (180×180, opaque and full-bleed), for iOS home screens.
- **Cache-busting.** Every icon link carries a `?v=N` query (currently `?v=3`). Bump N in all the icon links in
  `public/index.html` whenever any icon file changes. Otherwise browsers keep showing the old icon.

## Hero

- **Reveal card.** The master images are two JPGs (1600×900) in `src/assets/portrait/`: `portrait-cartoon.jpg`, the
  Pixar-style cartoon of Kabilan, and `portrait-robot.jpg`, the same scene with the robot. The site serves WebP copies
  of them (see "Responsive hero images"). The cartoon is the base image, and the robot is revealed through a gooey
  trail. The hint chip reads "Hover to meet my robot twin" with a mouse, and "Tap or drag to meet my robot twin" on
  touch devices. See "Touch and hover".
- **Loading.** The cartoon `<img>` has `fetchpriority="high"`, a `srcset` and `sizes`, and no lazy loading, because it
  is the likely largest element on first paint. `public/index.html` has one matching preload. The robot image is never
  high priority, and it is loaded lazily (see "Touch and hover").
- **Fallbacks.** If the images are missing, the card uses the photo `src/assets/kabilan-portrait.jpg` as its base,
  with an SVG robot drawn over it (cream and cyan, with the label `SYS://KABILAN.AI`).
- **Ambience.** A golden-hour glow sits behind the card. Six decorative bokeh dots (`aria-hidden`, no pointer events)
  surround it, and two of them overlap the card edge. The light card has a cream matte and a warm shadow. In Brick
  dusk the card has no matte, and its edge fades into the page through a mask. A grain texture sits behind the page
  and never over text.
- **Marquee.** One lowercase row behind the portrait reads "build · ship · architect · orchestrate ·". It is set in
  Fraunces italic at low opacity and is `aria-hidden`. It loops slowly, and it stops under reduced motion.

### Responsive hero images

- **Files.** `public/img/hero/` holds eight WebP files:
  `portrait-cartoon-640.webp`, `-960`, `-1280` and `-1600`, and the same four widths for `portrait-robot-*.webp`.
  The 1280 cartoon is about 78 KB (the limit is 200 KB).
- **Data.** `src/data/portfolio.js` builds `profile.portrait` from a `HERO_WIDTHS` list: `cartoon` and `robot` (the
  1280 URLs), `cartoonSrcSet`, `robotSet` (an array of `{ w, url }`) and `sizes`.
- **Markup.** The cartoon `<img>` lists the four widths in `srcset` and uses
  `sizes="(min-width: 1024px) 1350px, (min-width: 768px) 1000px, 112vw"`. The preload in `public/index.html` carries
  the same `imagesrcset` and `imagesizes`. They must stay identical, or the browser downloads the image twice.
- **Regenerating the images.** There is no script for this in the repo, so it is a manual step. The WebP files were made
  from the two JPG masters with Pillow (Python), not with `sips`. To regenerate them:
  1. Check that Pillow can write WebP (`PIL.features.check('webp')` returns True).
  2. Write each width (640, 960, 1280 and 1600) for the cartoon and the robot, from the 1600×900 masters, as WebP with
     quality 80, method 6, and no crop. Keep the file names above.
  3. Keep the cartoon and the robot framed the same way, with the same 16:9 aspect, so the reveal lines up.
  4. If the widths, the file names or the `sizes` value change, update `HERO_WIDTHS` and `sizes` in
     `src/data/portfolio.js`, and the preload in `public/index.html`, so they match.
  5. Run the tests and `npm run test:responsive` (see "Testing").
  The Jest suite checks that the preload matches the data, so a mismatch fails the tests.

## Responsive layout

The layout was checked from 320px to 1280px in portrait, and at 844×390 and 667×375 in landscape, in both themes.

- **Breakpoints.** The values below are written out as literals in each `@media` rule. CSS custom media is not used.
  - `max-width: 480px`: phones. Buttons go full width and wrap, the chip rows scroll, the typewriter gets its reserved
    height, and cards are one column.
  - `min-width: 568px`: used only inside the landscape two-column query.
  - `min-width: 768px`: tablets. The hero has two columns, and the grids have two columns.
  - `min-width: 1024px`: laptops. The desktop nav appears, the grids have three columns, and the gallery fan is shown.
  - `min-width: 1280px`: caps for the container and display type.
  - Landscape phones: `(orientation: landscape) and (max-height: 500px)`.
- **Fluid type and spacing.** The headings, the menu links, the card padding and the section padding use `clamp()`
  with a `rem + vw` middle term. Body text stays at 1rem, so it never gets smaller than 16px.
- **Buttons.** `.btn` has a minimum height of 52px and no fixed height. Below 480px the text wraps, so "Message me on
  LinkedIn" is never clipped.
- **Tap targets.** Every control in the checked list is at least 44×44px. This covers the logo, the chips (44px, with
  8px gaps, in a row that scrolls sideways on phones), the social links, the scroll cue, the nav links and the
  gallery controls. Inline text links inside a paragraph are exempt, as WCAG 2.5.8 allows.
- **Typewriter.** Below 480px the role line has a reserved height of 3em and a fixed single line. A hidden copy of the
  longest role sets the width, so the page does not shift as the roles change.
- **Landscape phones.** The hero uses a shorter stage and no minimum height, the scroll cue is hidden, and the menu
  links are 48px.
- **Overflow.** `overflow-x: clip` is set on `html` and `body`. There is no `overflow-x: hidden`.
- **Safe areas.** The viewport meta has `viewport-fit=auto`, and it never disables zoom (no `maximum-scale` or
  `user-scalable`). The menu and the footer add `env(safe-area-inset-bottom, 0px)` to their bottom padding.
- **Solid nav on touch.** On touch devices the scrolled nav uses a solid background, with no `backdrop-filter`.

## Mobile menu

- **Where it shows.** Below 1024px the burger button replaces the nav links. Above 1024px the links show and the
  burger is hidden. If the window is resized to 1024px or wider while the menu is open, the menu closes.
- **What it is.** A full-screen dialog ("Site menu"). Its top row, 64px high, holds the decorative logo, the theme
  toggle, and a visible **Close** button with an ✕ icon. Below the row are the six section links and the GitHub and
  LinkedIn links.
- **Open and close.** The burger keeps `aria-expanded` and `aria-controls`, and its label changes between "Open menu" and
  "Close menu". Close, Esc and the burger all close the menu. On close, focus returns to the burger.
- **Focus.** Focus moves to the Close button when the menu opens. Tab and Shift+Tab wrap inside the dialog. When the menu
  is open, the page behind it is `inert`: `#main`, the footer, the skip link and the nav bar. This is set by hand,
  because React 18 does not support the `inert` prop, and it is removed before focus moves.
- **Links.** Choosing a link closes the menu and moves focus to that section.
- **Scroll lock.** While the menu is open, `html` and `body` have `overflow: hidden`, and the menu has
  `overscroll-behavior: contain`. Both are restored on close. A real iOS device was not available for a final check
  of this (see "Before you deploy").

## Touch and hover

- **Hover effects only on hover devices.** Every `:hover` rule in `src/**/*.css` sits inside
  `@media (hover: hover) and (pointer: fine)`. The `:focus-visible` and `:focus-within` styles are outside that query,
  so keyboard users see them on every device. In JavaScript, `src/hooks/useCanHover.js` returns whether the device
  can hover. Every framer-motion `whileHover` prop is gated by it, and so are the mouse handlers of the phone gallery.
- **Reveal card on touch.** `touch-action: pan-y` keeps vertical scrolling working over the card.
  - **Tap to peek.** A tap (a pointer down and up less than 10px apart) opens the reveal at that point for 1.6 seconds,
    then closes it. While it is open, the frame has `data-peek="true"`.
  - **Drag.** Press and drag to reveal the robot. Lifting the finger releases it.
  - **Robot loads lazily.** The robot image is not requested on render. It loads on the first `pointerenter` or
    `pointerdown` on the card, or when the browser is idle after load (3 seconds as the fallback). With Save-Data on,
    the idle load is skipped. The robot file is the smallest width at least as wide as the card in device pixels.
  - **Auto-wander.** The reveal can drift by itself, only while the hero is at least 10% on screen, the
    tab is visible, the visitor has not interacted yet, and Save-Data is off. The frame shows `data-wander="on"` or
    `"off"`.
- **Animation budget on phones.** Below 768px, or on touch devices, the blurred blobs and the projects wash have no
  filter and no animation, the skill-card glow is a static gradient, and the marquee keeps running.
- **Off-screen pause.** `src/hooks/useInViewPause.js` sets `data-paused` on `#hero`, `#skills` and `#projects` while
  they are off screen. `src/index.css` then pauses their animations (`[data-paused] * { animation-play-state: paused; }`).
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the typewriter, tilt, reveal, marquee, bokeh twinkle, phone
  gallery and timeline animations stop, and the content stays visible.
- **Pause-animations toggle (out of scope).** A control to pause all animations (WCAG 2.2.2, REC17) is deliberately
  out of scope for now. There is no toggle, no `data-motion` attribute and no motion key in `localStorage`. The
  mitigation is that every loop stops under `prefers-reduced-motion`, and off-screen sections pause. This is an accepted
  gap, to revisit if the owner decides it is needed.

### Phone gallery

Below 1024px the Valam screenshots scroll sideways in a row. Three dots below the row show the position. They are
`aria-hidden`, and a visually hidden live region reads "Screenshot n of 3" as the row moves. From 1024px up the dots
are hidden and the screenshots sit in the fan.

## SEO and sharing

`public/index.html` sets:

- the title "Kabilan GR — Lead Full-Stack Developer", a meta description, and
  `<link rel="canonical" href="https://www.kabilan.me/">`;
- Open Graph tags: `og:url`, `og:title`, `og:description`, and `og:image` =
  `https://www.kabilan.me/og-kabilan-gr-cafe.jpg`, with `og:image:width` 1200, `og:image:height` 630 and `og:image:alt`;
- `twitter:card` = `summary_large_image`;
- one JSON-LD `ProfilePage` block whose `mainEntity` is a `Person`. It has the name, job title, description, image
  and `sameAs` (the GitHub and LinkedIn URLs only). It has no email, telephone or address keys. The test suite parses
  the block and checks it;
- one `theme-color` meta tag, `#fbf3e7`. The pre-paint script and `useTheme` change it to `#2b1912` in Brick dusk.

The share image is `public/og-kabilan-gr-cafe.jpg` (1200×630, about 109 KB). It is cropped from the cartoon with the
box (left, top, right, bottom) = (0, 30, 1490, 812). That box keeps the face in the frame and the watermark in the
bottom-right corner out of it. Use the same box if you make a new crop from a different source.

`public/sitemap.xml` lists the single URL `https://www.kabilan.me/` with a `lastmod` date.
`public/robots.txt` allows all crawlers and points to the sitemap.

## Routes

| Route | Behaviour |
|---|---|
| `/` | The full portfolio page |
| `/home`, `/languages`, `/workExperience`, `/projects`, `/about`, `/contact` | Legacy URLs. Each redirects to `/` and scrolls to the matching section (`#hero`, `#skills`, `#experience`, `#projects`, `#about`, `#contact`) |
| any other path | Redirects to `/` |
| `/Kabilan_GR_Resume.pdf` | Static résumé file in `public/` (you supply it, see "Before you deploy") |

**Deep links.** The `postbuild` script copies `build/index.html` to `build/404.html` after every build. GitHub Pages
serves `404.html` for paths it does not have, so a direct load of `/home` or `/about` loads the app, and the router
then redirects to `/` and scrolls to the section. GitHub sends a 404 status code with these responses, even though the
page renders. After a build, `cmp build/index.html build/404.html` shows the two files are identical.

## Tech stack

- **Create React App** (`react-scripts` 5.0.1) with React 18.2
- **react-router-dom** 6 (`BrowserRouter`, with `basename={process.env.PUBLIC_URL}`)
- **framer-motion** 11 for scroll reveals, the timeline, tilt cards, the reveal portrait, the mobile menu and the
  phone gallery
- **typewriter-effect** for the hero role rotator
- Plain CSS files next to each component, plus global CSS custom properties in `src/index.css` for the theme
- Inline SVG icons (no icon font). The `font-awesome` package is still listed in `package.json` but is not imported
- Fonts: Fraunces, Nunito and Baloo Thambi 2, loaded from Google Fonts (see "Theme: Golden Hour Café")
- Tests: Jest and React Testing Library (via react-scripts), plus a zero-dependency headless Chrome check for the
  responsive layout (`npm run test:responsive`)
- Deployment: `gh-pages`

## Running locally, building, testing and deploying

Requires Node.js and npm.

### npm scripts (all from `package.json`)

| Command | What it does |
|---|---|
| `npm install` | Installs dependencies |
| `npm start` | Starts the dev server at http://localhost:3000 |
| `npm run build` | Production build into `build/`, then runs `postbuild` (creates `build/404.html`) |
| `CI=true npm run build` | The same build with `CI=true`, so any ESLint warning fails it. Run this before deploying |
| `CI=true npm test -- --watchAll=false` | Runs the Jest suite once and exits. The last recorded run was 60 tests in 2 suites, all passing, in 3 of 3 runs |
| `npm run test:responsive` | Runs the responsive check against `build/` (see "Testing the responsive layout"). Run `CI=true npm run build` first. Exits 1 on any failure |
| `npm run deploy` | Runs `predeploy` (`npm run build`), then publishes `build/` to the `gh-pages` branch with `gh-pages -d build` |
| `npm run clear` | Deletes `build/` |

`npm run deploy` runs the build without `CI=true`, so warnings do not stop the deploy. Run
`CI=true npm run build` first to confirm the build is clean.

Deployment is a manual step: run `npm run deploy` from your machine. GitHub Pages then serves the `gh-pages`
branch at the custom domain. `public/CNAME` (containing `www.kabilan.me`) is copied into `build/` on each build,
so the custom domain is kept.

### Testing the responsive layout

`npm run test:responsive` (after `CI=true npm run build`) runs `scripts/check-responsive.js`. It needs no npm packages.

- It starts the installed Google Chrome in headless mode, and serves `build/` on a free local port.
- It runs the checks at 320, 360, 375, 390, 414, 640, 768, 900, 1023, 1024 and 1280px wide (portrait, 800px high), and
  at 844×390 and 667×375 (landscape), in both the light and the dark theme. Reduced motion, the 320px text-spacing
  check and the hero layout-shift run are included.
- It checks, among other things: no horizontal overflow; every control at least 44×44 (with the menu closed, and open
  below 1024); the nav switch at 1024; the modal menu and its focus handling; hover effects only behind the hover query;
  the gallery; the hero's layout shift during the role cycle; the hero image loading once; and the landscape layout.
- It saves a screenshot of each viewport and theme to a folder outside the repo. The folder is the system temp folder,
  `responsive`, unless `RESPONSIVE_OUT` is set.
- It prints one `PASS` or `FAIL` line per check, then a summary, and exits with 1 if any check fails.

Options and environment variables:

- `CHROME_PATH` sets the Chrome binary. The default is `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
  so set it on other systems.
- `RESPONSIVE_BUILD` sets the folder to serve (default `build/`).
- `RESPONSIVE_OUT` sets the screenshot folder.
- `--vp=360,844x390` runs only the listed viewports.
- `--skip-cls` skips the 20-second layout-shift run.
- `--no-shots` skips the screenshots.

Example: `npm run test:responsive -- --vp=360,844x390 --skip-cls`.

### Commands that are not npm scripts

These are run directly from the repository root:

- `node scripts/check-contrast.js`: checks the theme contrast. Exit code 0 means every check passed.
- The ExFAT cleanup (macOS shell command). See the ExFAT note below.

### ExFAT note (macOS, external drives)

On an ExFAT volume, macOS writes AppleDouble metadata files named `._*` next to every file it saves. ESLint
(through `eslint-plugin-jest`) and Jest pick these up and fail, even though the code is fine. The `._*` pattern is
already in `.gitignore`, but it does not stop the tools from reading them.

**Delete the `._*` files before every build, test or deploy:**

```bash
find . -name '._*' -not -path './node_modules/*' -delete; find node_modules -name '._*' -delete
```

Then run the build or test command. `npm run deploy` runs the build internally, so run the `find` command before
it too.

If you move the project to APFS, this step is not needed.

## Custom domain setup (www.kabilan.me)

The site is published to **www.kabilan.me**. The repository already has the pieces it needs:

- `package.json` sets `"homepage": "https://www.kabilan.me"`.
- `public/CNAME` contains `www.kabilan.me`.

Three steps must be done outside the repository:

1. **DNS.** Create a `CNAME` record for `www` that points to `kabilangr.github.io`.
2. **GitHub Pages settings.** In the repository's Settings, open Pages. Set the custom domain to `www.kabilan.me`.
   Make sure Pages is serving from the `gh-pages` branch (the branch `npm run deploy` publishes to).
3. **Enforce HTTPS.** On the same Pages settings page, tick **Enforce HTTPS**. GitHub only offers this after the
   DNS record resolves and the certificate is issued, which can take some time.

The site uses the domain root, so `PUBLIC_URL` is empty and the router and asset paths work without a sub-path.

## Before you deploy

- [ ] **Add the résumé PDF.** Place the résumé at `public/Kabilan_GR_Resume.pdf`. It is linked from the Hero and
      Contact sections (`profile.resumePath`). The project does not generate or commit the file. The PDF must have
      **no phone number and no email address**, because the site shows neither and the résumé should match.
- [ ] **Run a manual browser check.** Automated tests do not cover everything. Check these in a browser:
  - **Dark mode:** switch to Brick dusk. The hero card fades into the page with no hard edge, and the text stays
    readable. Reload the page to confirm that the choice persists.
  - **Widths:** 360px, 768px and 1024px, in portrait, with no horizontal scroll. Below 1024px the menu is the
    full-screen dialog, and from 1024px the desktop links show. The hero stacks below 768px, and the featured Valam
    card stacks on mobile.
  - **Landscape:** 844×390 or 667×375. The hero fits, and the menu links are readable.
  - **Menu:** open and close it with the burger, Close and Esc. Focus returns to the burger. A menu link scrolls to its
    section.
  - **Reveal alignment:** with a mouse, the trail and the ring follow the pointer and the robot sits exactly over the
    cartoon. On touch, tap the card to peek at the robot, and press and drag to reveal it. Lifting the finger releases it.
  - **Tamil font:** the Languages card shows the Tamil greeting `வணக்கம்` in Baloo Thambi 2, with no missing glyphs.
- [ ] **Review the responsive screenshots and check a real iOS device.** `npm run test:responsive` saves screenshots at
      each width and theme. Look through them for layout problems. The last run covered the checks, but the screenshots
      were not all reviewed by a person. On a real iPhone, check that the page behind the open menu does not scroll. No
      iOS device was available for the last check, so this is still open.
- [ ] **Run the contrast script:** `node scripts/check-contrast.js`. It must exit 0 and print no `FAIL` lines.
- [ ] **Review the descriptions.** Some project and role descriptions were drafted from the résumé in short, factual
      sentences. Check them in `src/data/portfolio.js` before publishing. These are `projects[].description`,
      `experience[].description` and `profile.summary` / `profile.summaryMore`. Edit anything that is not accurate.
- [ ] **Run the build, the responsive check and deploy:** run the ExFAT `find` step, then `CI=true npm run build`, then
      `npm run test:responsive`, then `npm run deploy`.

## Project structure

Entries marked (new) or (changed) were added or edited in the recent work. "v3" marks the mobile responsive work.

```
resume-app/
├── public/                              # Served as-is
│   ├── CNAME                            # www.kabilan.me (custom domain for GitHub Pages)
│   ├── index.html                       # (changed) Title, meta, Open Graph, twitter card, canonical, JSON-LD,
│   │                                    #   icon links (?v=3), fonts, pre-paint theme script, hero image preload (v3)
│   ├── img/hero/                        # (new, v3) Responsive hero WebP files: portrait-cartoon-{640,960,1280,1600}.webp
│   │                                    #   and portrait-robot-{640,960,1280,1600}.webp
│   ├── logo.svg                         # (new) "Bot visor K" logo master, viewBox 0 0 64 64
│   ├── favicon.svg                      # (changed) Simplified bold favicon, not a copy of logo.svg
│   ├── favicon.ico                      # (new) 16, 32 and 48 px favicon for browsers that ignore SVG
│   ├── favicon-16.png, favicon-32.png   # (new) PNG favicons
│   ├── apple-touch-icon.png             # (changed) 180×180 opaque icon for iOS
│   ├── og-kabilan-gr-cafe.jpg           # (new) 1200×630 share image, cropped from the cartoon
│   ├── sitemap.xml                      # (new) One URL with lastmod
│   ├── robots.txt                       # (changed) Allow all, plus the Sitemap line
│   └── Kabilan_GR_Resume.pdf            # You add this file (not in the repo)
├── scripts/
│   ├── check-contrast.js                # WCAG contrast check; reads the tokens in src/index.css
│   └── check-responsive.js              # (new, v3) Headless Chrome responsive check (npm run test:responsive)
├── src/
│   ├── index.js / App.js                # Entry point; App.js holds the router and the single-page layout
│   ├── App.css / index.css              # (changed) Global styles; index.css holds the Golden Hour Café tokens,
│   │                                    #   the responsive tokens (v3), the overflow guard and the paused-animation rule
│   ├── App.test.js                      # Page tests (44)
│   ├── setupTests.js                    # Test mocks (IntersectionObserver, matchMedia with (hover: hover) by default,
│   │                                    #   clipboard, scroll)
│   ├── data/portfolio.js                # All site content, including the roles (v3), profile.portrait and the hero srcset
│   ├── utils/
│   │   ├── Constants.js                 # NAV_ITEMS, SECTION_IDS, LEGACY_ROUTES
│   │   ├── ImageUtil.js                 # Image imports: the photo fallback and the Valam assets
│   │   └── style.js                     # Compatibility map of colour names to CSS variables
│   ├── hooks/
│   │   ├── useTheme.js                  # (changed) Theme context: stored choice, otherwise light
│   │   ├── usePrefersReducedMotion.js
│   │   ├── useCanHover.js               # (new, v3) True on hover devices; gates framer whileHover props
│   │   └── useInViewPause.js            # (new, v3) Sets data-paused on off-screen #hero, #skills and #projects
│   ├── components/                      # Shared pieces used by several sections
│   │   ├── icons/                       # Inline SVG icons: createIcon.js, index.js, ringIcons.js (skill ring icons)
│   │   ├── illustrations/               # SVG project covers (ProjectCovers.js)
│   │   ├── motion/                      # Reveal (scroll reveal) and TiltCard (hover tilt, gated in v3)
│   │   ├── Footer.js / .css             # (changed) Footer with logo, back-to-top and safe-area padding
│   │   ├── FilterChips.js               # Chip filter used by Skills and Projects (44px chips in v3)
│   │   ├── ResumeButton.js              # Download résumé link (uses profile.resumePath)
│   │   ├── SectionHeading.js / .css     # Eyebrow, h2 and lead for each section
│   │   └── SocialLinks.js / .css        # GitHub and LinkedIn icon links
│   ├── navigation/                      # Sticky nav, scroll spy, theme toggle, mobile menu
│   │   ├── Navigation.js / .css         # (changed, v3) Burger below 1024px, desktop links from 1024px
│   │   ├── Logo.js                      # Inline "Bot visor K" logo with the kabilan.me wordmark
│   │   ├── ThemeToggle.js
│   │   └── MobileMenu.js                # (changed, v3) Full-screen dialog with a Close button, inert page, focus trap
│   ├── home/                            # Hero section
│   │   ├── Home.js / Home.css           # (changed) Hero copy, marquee, bokeh, glow, scroll cue, role line, landscape layout
│   │   ├── RevealPortrait.js / .css     # (changed, v3) Reveal card: responsive WebP, lazy robot, tap to peek, auto-wander
│   │   └── RevealPortrait.test.js       # Reveal portrait tests (16)
│   ├── About/                           # About section (About.js / .css)
│   │   ├── LanguagesCard.js / .css      # Interactive English / Tamil card
│   ├── languages/                       # Skills section (exports Skills from Languages.js); hover gated (v3)
│   ├── workExperience/                  # Experience timeline
│   ├── projects/                        # Projects section, FeaturedProject (Valam, with the phone gallery dots), Projects.css
│   ├── Contact/                         # Contact section
│   └── assets/
│       ├── kabilan-portrait.jpg         # Photo used as the fallback base of the reveal card (756 × 800)
│       ├── portrait/                    # portrait-cartoon.jpg, portrait-robot.jpg (1600 × 900 masters)
│       └── projects/valam/              # Valam screenshots (home, coach, wealth) and icon
├── docs/site-build/                     # Build pipeline notes (plan, design, build log, test report, docs summary); git-ignored
├── CHANGELOG.md                         # Release notes, newest first
├── package.json
└── README.md
```

## Editing content

Almost all text, links and data live in **`src/data/portfolio.js`**. Components render from these exports:

| Export | Used for |
|---|---|
| `profile` | Name, role, company, location, résumé path (`resumePath`), typewriter `roles` (eight roles), `summary` and `summaryMore`, `portraitAlt` (alt text of the hero card), `portrait` (`{ cartoon, robot, cartoonSrcSet, robotSet, sizes }`, the hero image URLs and srcset), `contactLead` (the Contact intro) and `heroStat` (the text beside "6+") |
| `stats` | Stat cards and the hero stat (`years: '6+'`, companies, platforms) |
| `socials` | GitHub and LinkedIn links (the only socials on the site) |
| `coreStack` | Six proficiency rings in Skills, each with an `icon` key (`react`, `node`, `ts`, `flutter`, `agents`, `chip`). The levels are **self-assessed** working proficiency, not a measured metric |
| `skillCategories` | The eight skill categories and their items |
| `experience` | The five timeline entries, newest first |
| `featuredProject` | Valam: tagline, features, privacy pills, the Mathi panel, tags, screenshots |
| `projectFilters` | Filter tabs for Projects |
| `projects` | The six resume project cards |
| `education` | Education card |
| `languages` | The Languages card in About: name, code, greeting, romanised greeting, level and note for each language |
| `spokenLanguages` | Derived from `languages` (the list of names) |

Other places to know about:

- `src/utils/Constants.js` defines `NAV_ITEMS` (nav labels and section ids) and `LEGACY_ROUTES` (the redirect map).
  Change the section list here and in `src/App.js` together.
- Valam screenshots and icon live in `src/assets/projects/valam/`. Keep each screenshot at 900px wide or less and
  200 KB or less, and the icon at 256px or less.
- The hero master images are `src/assets/portrait/portrait-cartoon.jpg` and `portrait-robot.jpg`. The site serves the
  WebP files in `public/img/hero/`. To swap the images, follow "Regenerating the images" in the Hero section.
- `src/utils/ImageUtil.js` holds the image imports for the photo fallback and the Valam assets.

## Adding to the site

- **New section:** create `src/<section>/<Section>.js` (and a `.css` file) with `<section id="...">`. Add it to
  `NAV_ITEMS` in `src/utils/Constants.js`, then render it inside `<main>` in `src/App.js`, in the order you want it to
  appear. For a legacy-style redirect, add an entry to `LEGACY_ROUTES`. If the section has looping animations, call
  `useInViewPause` for it (see the hook in `src/hooks/useInViewPause.js`).
- **New shared component:** add it under `src/components/`, with a short header comment that gives its purpose and props.
- **New hover effect:** put every `:hover` rule inside `@media (hover: hover) and (pointer: fine)`. Gate any framer
  `whileHover` with `useCanHover` (see `src/hooks/useCanHover.js`).
- **New tap target:** make it at least 44×44px.
- **New icon:** add an SVG component to `src/components/icons/index.js`. Skill ring icons are mapped from the
  `coreStack` icon keys in `src/components/icons/ringIcons.js`. A key with no matching icon falls back to initials.
- **New content:** add it to the matching export in `src/data/portfolio.js`. Components read from there.
- **Icon change:** replace the file, then bump the `?v=N` query on every icon link in `public/index.html`.
- **Colour change:** edit the tokens in `src/index.css` and run `node scripts/check-contrast.js`.
- **Layout change:** run `CI=true npm run build` and then `npm run test:responsive`. It checks the widths, the tap
  targets and the overflow.

## Notes

- Contact is through LinkedIn: the "Message me on LinkedIn" button in Contact, and "Contact Me" in the hero.
  GitHub and LinkedIn are the only social links.
- The site has no phone number and no email address anywhere, and no `mailto:` or `tel:` links. Keep it that way
  when you add content.
- Skill rings show self-assessed proficiency (values in `coreStack` in `src/data/portfolio.js`).
- The pause-animations toggle (WCAG 2.2.2) is out of scope for now. See "Touch and hover".
- Tests: 60 tests in two suites. `src/App.test.js` (44 tests) covers the sections and their order, navigation and the
  mobile menu, the theme default and toggle, the logo and favicon links, skills, experience, projects and filters, the
  LinkedIn contact link, the absence of email and phone, the résumé links, the JSON-LD block, the sitemap and robots
  files, the Languages card, the hero bokeh layer, the roles and marquee copy, reduced motion and the hover gating.
  `src/home/RevealPortrait.test.js` (16 tests) covers the reveal card: the lazy robot, the touch hint and tap to peek,
  the hero image srcset and preload, and Save-Data.
