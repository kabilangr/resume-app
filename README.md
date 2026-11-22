# Kabilan GR - Developer Portfolio

Single-page developer portfolio for **Kabilan GR**, Lead Full-Stack Developer at Xpulsar (Chennai, India).
It is served at **https://www.kabilan.me** from GitHub Pages.

The site is built for recruiters, hiring managers and potential clients. It presents his career, skills and
featured personal project. It uses a **Golden Hour Café** theme with light (default) and "Brick dusk" dark modes,
scroll and hover animations, and support for reduced motion.

## What the site contains

One scrolling page at `/` with six anchored sections, shown in this order:

| Section | Anchor | What it shows |
|---|---|---|
| Hero | `#hero` | Name (the page's only `<h1>`), typewriter roles, the current role at Xpulsar, a "6+ years" stat, CTAs (View Projects, Contact Me, Download résumé), and a reveal portrait with a looping text marquee behind it. Text and portrait sit side by side from 768px and stack on mobile |
| About | `#about` | Summary, location, count-up stat cards (6+ years, 5 companies, platforms), education, and an interactive Languages card (English / Tamil toggles with a greeting and a native-speaker meter) |
| Skills | `#skills` | Eight skill categories with filter chips and tilt cards. Each category has a proficiency ring with an icon (React, Node.js, TypeScript, Flutter, agents, chip). Levels are self-assessed |
| Experience | `#experience` | Vertical timeline of five roles, newest first, with a scroll-drawn line. Only the Xpulsar role is marked "Present" |
| Projects | `#projects` | Featured Valam card (Flutter finance app with the Mathi AI coach), then six projects with category filters |
| Contact | `#contact` | A "Message me on LinkedIn" button, location, résumé download, GitHub and LinkedIn. The site publishes no email address and no phone number |

A sticky navigation bar links to the six sections with a scroll-spy highlight. Below 768px it becomes a
full-screen menu. A footer with the logo and a back-to-top button ends the page. A scroll cue at the bottom of
the hero points to About (shown from 768px up).

The site has no contact form, no email link and no analytics.

### Theme, logo and favicon

- **Theme: Golden Hour Café.** Light is the default for everyone: cream background `#fbf3e7` with a brick accent
  `#9a3a22`. The optional dark mode, "Brick dusk", uses `#2b1912` with a fairy-gold accent `#ffcf7a`. Robot cyan is
  used only for the hero reveal ring. The tokens are in `src/index.css`, and `node scripts/check-contrast.js` reads
  them to check WCAG AA contrast. The choice is saved in `localStorage` under `theme`; if nothing is saved the site
  is light and does not read `prefers-color-scheme`.
- **Logo:** an inline "Bot visor K" robot-head mark with a "kabilan.me" wordmark (`src/navigation/Logo.js`). It is used in the
  navigation and the footer, and the wordmark hides below 480px. Its shell and ear colours follow the `--logo-*`
  tokens in `src/index.css`.
- **Favicon:** `public/favicon.svg` (linked from `public/index.html`) and `public/apple-touch-icon.png`
  (180px, for iOS home screens).

### Routes

| Route | Behaviour |
|---|---|
| `/` | The full portfolio page |
| `/home`, `/languages`, `/workExperience`, `/projects`, `/about`, `/contact` | Legacy URLs. Each redirects to `/` and scrolls to the matching section (`#hero`, `#skills`, `#experience`, `#projects`, `#about`, `#contact`) |
| any other path | Redirects to `/` |
| `/Kabilan_GR_Resume.pdf` | Static résumé file in `public/` (you supply it, see "Before you deploy") |

The legacy and redirect routes work when the app navigates to them. GitHub Pages has no server-side rewrites, and
the project has no `404.html` fallback, so opening a deep link such as `/home` directly returns GitHub's 404 page.
Only `/` and the static files in `public/` load directly.

## Tech stack

- **Create React App** (`react-scripts` 5.0.1) with React 18.2
- **react-router-dom** 6 (`BrowserRouter`, with `basename={process.env.PUBLIC_URL}`)
- **framer-motion** 11 for scroll reveals, the timeline, tilt cards, the reveal portrait's animations and the mobile menu
- **typewriter-effect** for the hero role rotator
- Plain CSS files next to each component, plus global CSS custom properties in `src/index.css` for theming
- Inline SVG icons (no icon font). The `font-awesome` package is still listed in `package.json` but is not imported.
- Fonts: Fraunces (SOFT 100) for display, Nunito for body text and Baloo Thambi 2 for the Tamil greeting. They
  load from Google Fonts in `public/index.html`
- Tests: Jest and React Testing Library (via react-scripts)
- Deployment: `gh-pages`

## Running locally

Requires Node.js and npm.

```bash
npm install
npm start
```

`npm start` runs the dev server at http://localhost:3000.

**Before the first build or test on an ExFAT drive, read the ExFAT note below.**

## Editing content

Almost all text, links and data live in **`src/data/portfolio.js`**. Components render from these exports:

| Export | Used for |
|---|---|
| `profile` | Name, role, company, location, résumé path (`resumePath`), typewriter `roles`, summary and summaryMore, `portraitAlt` (alt text of the hero portrait), `portrait` (the reveal portrait images, see below), `contactLead` (the Contact intro), `heroStat` (the text beside "6+") |
| `stats` | Stat cards and the hero stat (`years: '6+'`, companies, platforms) |
| `socials` | GitHub and LinkedIn links (the only socials on the site) |
| `coreStack` | Proficiency rings in Skills, with an icon key per ring. The levels are **self-assessed** working proficiency, not a measured metric |
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
- The hero photo is `src/assets/kabilan-portrait.jpg` (a resized copy, 756 x 800). It is the fallback image of the
  reveal portrait.
- `src/utils/ImageUtil.js` holds the image imports (the hero photo and the Valam assets).

## Hero portrait images (Pixar-style cutouts)

The hero shows a reveal portrait. Moving the pointer over it (or pressing and dragging on touch) reveals a second
figure through a gooey, liquid-looking trail. Two optional PNG cutouts drive it:

- `src/assets/portrait/portrait-cartoon.png`: the Pixar-style 3D cartoon of Kabilan. This is the base image.
- `src/assets/portrait/portrait-robot.png`: the same character as a robot. This is the image revealed by the pointer.

### Requirements for both PNGs

- **Transparent background.** Both are cutouts of the head and shoulders.
- **Same canvas size, with a 756 : 800 aspect ratio** (the frame and its SVG canvas are 756 x 800 units). Any size
  works if the ratio matches, for example 756 x 800 px or 1512 x 1600 px. The images are drawn with
  `xMidYMid slice`, so a different ratio gets cropped and the two images stop lining up. Crop both with the same box.
- **Same head position in both files.** The robot must sit exactly under the cartoon when it is revealed.
- Keep the files small (a few hundred KB each at most). They load on the home page.

### Steps

1. Copy the two PNGs into `src/assets/portrait/`. Create the folder if it is missing (it is empty in the repo).
2. In `src/data/portfolio.js`, add the imports at the top of the file:

   ```js
   import cartoon from '../assets/portrait/portrait-cartoon.png';
   import robot from '../assets/portrait/portrait-robot.png';
   ```

3. Replace `portrait: { cartoon: null, robot: null }` in the `profile` export with:

   ```js
   portrait: { cartoon, robot },
   ```

4. Update the test in `src/home/RevealPortrait.test.js` that asserts `profile.portrait` equals
   `{ cartoon: null, robot: null }` (around line 13). It fails once the images are set. Change it to match the new
   values (for example, assert that both fields are set), and check the other tests in that file too.
5. Run the test and build commands below.

### What the fallbacks show until then

While a field is `null`, the portrait still works:

- **Cartoon not set:** the base image is the hero photo (`src/assets/kabilan-portrait.jpg`), with a radial fade at
  the bottom and sides so it reads as a cutout.
- **Robot not set:** the revealed layer is an SVG "robot" built from the base image. It uses a grey-to-duotone
  filter (walnut, cyan and cream), a cyan grid, circuit traces with nodes, cream HUD corner brackets and the label `SYS://KABILAN.AI`. It uses the cartoon as its base if the cartoon is set,
  and the photo otherwise.
- **Robot set:** the robot PNG is revealed as it is, without the duotone or the overlay.

Under reduced motion the auto-wander and the hint chip ("hover to reveal the bot") are turned off.

### Example image-generator prompts

Generate the cartoon first, then use the same pose and framing for the robot. Remove the background if the
generator does not output transparency, and crop both images to the 756 : 800 ratio. The prompts ask for "square"
output, so crop to 756 : 800 afterwards.

- "Pixar-style 3D cartoon of this person, same pose and framing, transparent background, square"
- "the same Pixar character as a humanoid robot, identical pose and framing, transparent background"

## Build, test and deploy

| Command | What it does |
|---|---|
| `npm install` | Installs dependencies |
| `npm start` | Starts the dev server |
| `CI=true npm run build` | Production build into `build/`. With `CI=true`, any ESLint warning fails the build. Run this before deploying. |
| `CI=true npm test -- --watchAll=false` | Runs the test suite once and exits |
| `npm run deploy` | Runs `predeploy` (`npm run build`), then publishes `build/` to the `gh-pages` branch with `gh-pages -d build` |
| `npm run clear` | Deletes `build/` |

`npm run deploy` runs `npm run build` without `CI=true`, so warnings do not fail the deploy. Run
`CI=true npm run build` first to confirm the build is clean.

Deployment is a manual step: run `npm run deploy` from your machine. GitHub Pages then serves the `gh-pages`
branch at the custom domain. `public/CNAME` (containing `www.kabilan.me`) is copied into `build/` on each build,
so the custom domain is kept.

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

- [ ] **Add the résumé PDF.** Place a résumé at `public/Kabilan_GR_Resume.pdf`. It is linked from the Hero and
      Contact sections (`profile.resumePath`). The file is not generated or committed by the project. The PDF must
      have the **phone number and the email address removed**, because the site shows neither and the résumé should
      match.
- [ ] **Optional: add the portrait PNGs.** Add `portrait-cartoon.png` and `portrait-robot.png` to
      `src/assets/portrait/` and wire them up as described in "Hero portrait images". Update the test noted there.
      The site works without them, using the fallbacks.
- [ ] **Optional: delete the unused original photo.** `src/assets/kabilan-image.JPG` (about 1.6 MB) is not imported.
      The site uses the resized `src/assets/kabilan-portrait.jpg`. Delete the original only after checking that
      nothing else refers to it.
- [ ] **Review the descriptions.** Some project and role descriptions were drafted from the résumé in short, factual
      sentences. Check them in `src/data/portfolio.js` before publishing. These are `projects[].description`,
      `experience[].description` and `profile.summary` / `profile.summaryMore`. Edit anything that is not accurate.
- [ ] **Run the manual browser check.** Automated tests do not cover layout or motion, so check these in a browser:
  - **AC21 layout:** no horizontal scroll at 360px, 768px and 1280px widths. The hamburger menu appears below
    768px, and the desktop links appear at 768px and above. The featured Valam card stacks on mobile.
  - **Reduced motion:** in the browser DevTools, set "prefers-reduced-motion: reduce". The typewriter, tilt, reveal,
    marquee and timeline animations stop, and all content stays visible.
  - **Hero reveal:** the gooey trail looks right with the pointer, and touch press-and-drag reveals the robot and
    releases back to the cartoon on lift.
  - **Tamil rendering:** the Languages card shows the Tamil greeting (`வணக்கம்`) in Noto Sans Tamil, with no
    missing glyphs.
  - **Ring icons and scroll cue:** the skill rings show their icons in both themes. The scroll cue is hidden below
    768px and is centred at 768px and above.
- [ ] **Run the build:** `CI=true npm run build` (after the ExFAT `find` step), then `npm run deploy`.

## Project structure

```
resume-app/
├── public/
│   ├── CNAME                      # www.kabilan.me (custom domain for GitHub Pages)
│   ├── index.html                 # Title, meta and Open Graph tags, fonts, favicon links, pre-paint theme script
│   ├── favicon.svg                # Site favicon
│   ├── apple-touch-icon.png       # 180px icon for iOS home screens
│   ├── robots.txt
│   └── Kabilan_GR_Resume.pdf      # You add this file (not in the repo)
├── src/
│   ├── index.js / App.js          # Entry point; App.js holds the router and the single-page layout
│   ├── App.css / index.css        # Global styles; index.css holds the Golden Hour Café tokens (light and dark)
│   ├── App.test.js                # Page tests (27)
│   ├── setupTests.js              # Test mocks (IntersectionObserver, matchMedia, clipboard, scroll)
│   ├── data/portfolio.js          # All site content (see "Editing content")
│   ├── utils/
│   │   ├── Constants.js           # NAV_ITEMS, SECTION_IDS, LEGACY_ROUTES
│   │   ├── ImageUtil.js           # Image imports (hero photo and Valam assets)
│   │   └── style.js               # Compatibility map of colour names to CSS variables
│   ├── hooks/
│   │   ├── useTheme.js            # Theme context: localStorage, otherwise light
│   │   └── usePrefersReducedMotion.js
│   ├── components/                # Shared pieces used by several sections
│   │   ├── icons/                 # Inline SVG icons: createIcon.js, index.js, ringIcons.js (skill ring icons)
│   │   ├── illustrations/         # SVG project covers (ProjectCovers.js)
│   │   ├── motion/                # Reveal (scroll reveal) and TiltCard (hover tilt)
│   │   ├── Footer.js / .css       # Footer with logo and back-to-top
│   │   ├── FilterChips.js         # Chip filter used by Skills and Projects
│   │   ├── ResumeButton.js        # Download résumé link (uses profile.resumePath)
│   │   ├── SectionHeading.js/.css # Eyebrow, h2 and lead for each section
│   │   └── SocialLinks.js/.css    # GitHub and LinkedIn icon links
│   ├── navigation/                # Sticky nav, scroll spy, theme toggle, mobile menu
│   │   ├── Navigation.js / .css
│   │   ├── Logo.js                # Inline SVG {K} mark with the kabilan.me wordmark
│   │   ├── ThemeToggle.js
│   │   └── MobileMenu.js
│   ├── home/                      # Hero section
│   │   ├── Home.js / Home.css     # Hero copy, marquee, side-by-side layout, scroll cue
│   │   ├── RevealPortrait.js / .css   # Gooey reveal portrait (cartoon base, robot reveal, fallbacks)
│   │   └── RevealPortrait.test.js     # Reveal portrait tests (5)
│   ├── About/                     # About section (About.js / .css)
│   │   ├── LanguagesCard.js / .css    # Interactive English / Tamil card
│   ├── languages/                 # Skills section (exports Skills from Languages.js)
│   ├── workExperience/            # Experience timeline
│   ├── projects/                  # Projects section, FeaturedProject (Valam), Projects.css
│   ├── Contact/                   # Contact section
│   └── assets/
│       ├── kabilan-portrait.jpg   # Resized hero photo (756 x 800), the reveal portrait's fallback base
│       ├── portrait/              # Pixar cartoon and robot PNGs (optional, see "Hero portrait images")
│       └── projects/valam/        # Valam screenshots (home, coach, wealth) and icon
├── docs/site-build/               # Build pipeline notes (plan, design, build log, test report, docs summary)
├── CHANGELOG.md
├── package.json
└── README.md
```

## Adding to the site

- **New section:** create `src/<section>/<Section>.js` (and a `.css` file) with `<section id="...">`. Add it to
  `NAV_ITEMS` in `src/utils/Constants.js`, then render it inside `<main>` in `src/App.js`, in the order you want it to
  appear. For a legacy-style redirect, add an entry to `LEGACY_ROUTES`.
- **New shared component:** add it under `src/components/`.
- **New icon:** add an SVG component to `src/components/icons/index.js`. Skill ring icons are mapped from the
  `coreStack` icon keys in `src/components/icons/ringIcons.js`. A key with no matching icon falls back to initials.
- **New content:** add it to the matching export in `src/data/portfolio.js`. Components read from there.

## Notes

- Contact is through LinkedIn: the "Message me on LinkedIn" button in Contact, and "Contact Me" in the hero.
  GitHub and LinkedIn are the only social links.
- The site has no phone number and no email address anywhere, and no `mailto:` or `tel:` links. Keep it that way
  when you add content.
- Skill rings show self-assessed proficiency (values in `coreStack` in `src/data/portfolio.js`).
- Tests: `src/App.test.js` (27 tests) covers the sections and their order, navigation, the theme toggle, the logo
  and favicon, skills, experience, projects and filters, the LinkedIn contact link, the absence of email and phone,
  the résumé links, the Languages card, and reduced motion. `src/home/RevealPortrait.test.js` (5 tests) covers the
  reveal portrait. There are 32 tests in two suites.
