<div align="center">

# Kabilan GR — Developer Portfolio

**Lead Full-Stack Developer · Software Architect · AI Agent Orchestrator**

A warm, animated, fully responsive single-page portfolio, built with React.

[**🌐 Live site: www.kabilan.me**](https://www.kabilan.me)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-222?logo=github&logoColor=white)

</div>

---

## ✨ Highlights

- **Golden Hour Café theme**: cream light mode by default, plus a "Brick dusk" dark mode. The choice is saved and applied before first paint, so there is no flash.
- **Reveal-card hero**: a Pixar-style cartoon that reveals a robot twin on pointer move or touch, with a typewriter role rotator.
- **Responsive from 320px up**: phones, tablets and desktop, in portrait and landscape, with touch and mouse input. Below 1024px a full-screen, focus-trapped mobile menu replaces the nav links.
- **Motion with care**: scroll reveals, count-up stats, tilt cards and a scroll-drawn timeline, all of which respect `prefers-reduced-motion`.
- **Accessible**: scripted colour-contrast checks, a single `<h1>`, keyboard and focus management, and `aria-hidden` on decorative elements.
- **Performance-minded**: responsive WebP hero images with `srcset`, a single matching preload, and lazy loading of the robot image (skipped when Save-Data is on).
- **Privacy-friendly**: no analytics, no contact form, and no email or phone number published.

## 📄 Sections

| Section | What's in it |
|---|---|
| **Hero** | Name, typewriter roles, the current role, CTAs and the reveal card |
| **About** | Summary, count-up stats, education, and an interactive English / Tamil languages card |
| **Skills** | Eight filterable skill categories and proficiency rings for the core stack |
| **Experience** | Vertical timeline of five roles, newest first |
| **Projects** | Featured **Valam** (a Flutter finance app with the *Mathi* AI coach), plus six more projects with category filters |
| **Contact** | LinkedIn, GitHub and location |

## 🛠 Tech stack

- **React 18** (Create React App / `react-scripts` 5) and **React Router 6**
- **Framer Motion** for animation, and **typewriter-effect** for the hero roles
- Plain CSS with design tokens as custom properties (`src/index.css`)
- **gh-pages** for deployment, with a `404.html` copy for SPA routing

## 🚀 Getting started

```bash
git clone https://github.com/kabilangr/resume-app.git
cd resume-app
npm install
npm start          # dev server at http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm start` | Run the dev server |
| `npm run build` | Production build (also writes `build/404.html`) |
| `npm test` | Run the test suite |
| `npm run test:responsive` | Check the layout at the supported viewport sizes |
| `npm run deploy` | Build and publish `build/` to GitHub Pages |

## 🗂 Project structure

```
src/
├── home/         Hero and reveal-portrait card
├── About/        About section and languages card
├── projects/     Featured project and project grid
├── workExperience/  Experience timeline
├── Contact/      Contact section
├── navigation/   Nav bar, mobile menu, theme toggle, logo
├── components/   Shared UI, icons, illustrations, motion helpers
├── hooks/        useTheme, useCanHover, usePrefersReducedMotion, ...
└── data/portfolio.js   All site content in one place
```

Content (roles, experience, skills, projects) lives in [`src/data/portfolio.js`](src/data/portfolio.js), so most edits don't touch components.

## 📚 More documentation

- [Full developer guide](docs/DEVELOPMENT.md): theme, responsive layout, SEO, deployment, custom domain and content editing
- [Changelog](CHANGELOG.md)

## 📬 Connect

- 🌐 [www.kabilan.me](https://www.kabilan.me)
- 💼 [LinkedIn](https://www.linkedin.com/in/kabilan-gr-9749631b5/)
- 🐙 [GitHub @kabilangr](https://github.com/kabilangr)

---

<div align="center">
<sub>Designed and built by Kabilan GR · Chennai, India</sub>
</div>
