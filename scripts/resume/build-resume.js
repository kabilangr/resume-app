#!/usr/bin/env node
/* Regenerates scripts/resume/out/Kabilan_GR_Resume.pdf (kept out of public/ so it is never deployed) with headless Chrome.
   Usage: node scripts/resume/build-resume.js [outfile]
   Content comes from src/data/portfolio.js (evaluated under plain node, see load()) and resume-data.json. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..', '..');
const out = path.resolve(process.argv[2] || path.join(__dirname, 'out', 'Kabilan_GR_Resume.pdf'));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function load() {
  // portfolio.js is ESM inside a CommonJS package: strip `export` and evaluate it.
  const src = fs.readFileSync(path.join(root, 'src/data/portfolio.js'), 'utf8').replace(/^export /gm, '');
  const names = [...src.matchAll(/^const (\w+) =/gm)].map((m) => m[1]);
  return vm.runInNewContext(`${src}\n({${names.join(',')}})`, { process: { env: {} } });
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const P = load();
const D = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume-data.json'), 'utf8'));

const git = P.socials.find((s) => s.id === 'github').href;
const lin = P.socials.find((s) => s.id === 'linkedin').href;
const short = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const xp = P.experience.find((e) => e.id === 'xpulsar');
const job = (j) => `
<section class="job">
  <div class="row"><span class="co">${esc(j.company)}</span><span class="loc">${esc(j.location)}</span></div>
  <div class="row"><span class="role">${esc(j.role)}</span><span class="dates">${esc(j.dates)}</span></div>
  <p class="desc">${esc(j.description)}</p>
  ${j.bullets && j.bullets.length ? `<ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
</section>`;
const jobs = [
  { company: xp.company, location: '', role: xp.role, dates: `${xp.start} – Present`, description: xp.description, bullets: [] },
  ...D.olderJobs,
].map(job).join('');

const others = P.projects.map((p) => `<li><b>${esc(p.title)}.</b> ${esc(p.description)}</li>`).join('');

const skills = P.skillCategories
  .map((c) => `<b>${esc(c.title)}:</b> ${esc([...c.items.flatMap((i) => [...((D.skillsBefore || {})[i] || []), i]), ...((D.skillsExtra || {})[c.id] || [])].join(', '))}`)
  .join('. ') + '.';

const dots = (n) => '<i></i>'.repeat(n);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kabilan GR - Resume</title>
<style>
@page { size: A4; margin: 30pt 0 24pt 0 }
* { box-sizing: border-box; margin: 0; padding: 0 }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact }
body { width: 595pt; padding: 0 39pt 0 40pt; font-family: 'PT Sans', sans-serif; font-size: 7.92pt; line-height: 1.28; color: #384347 }
a { color: inherit; text-decoration: none }
h1 { font-size: 13.9pt; font-weight: 700; color: #000; text-align: center; letter-spacing: .2pt }
.title { font-size: 11.5pt; color: #6f7878; text-align: center; margin-top: 3pt }
.contact { text-align: center; margin-top: 6pt; word-spacing: 1pt }
.contact span + span::before { content: '\\2022'; font-size: 6pt; margin: 0 7pt; vertical-align: 1pt }
h2 { break-after: avoid; font-size: 11.5pt; font-weight: 400; color: #000; text-align: center; margin: 15pt 0 5pt; padding-bottom: 5pt; border-bottom: .7pt solid #000 }
.in { padding-left: 3pt }
.row { display: flex; justify-content: space-between; align-items: baseline }
.co { font-size: 11.5pt; color: #6f7878 }
.loc { font-size: 9.6pt; padding-right: 8pt }
.role { font-size: 9.6pt; color: #000 }
.dates { font-size: 9.6pt; padding-right: 8pt }
.job, li, .edu, .langs, .skills { break-inside: avoid }
.job { margin-bottom: 4.5pt }
.job .co { line-height: 1.2 }
.desc { margin-top: 2pt; padding-left: 3pt }
ul { list-style: none; margin-top: 1.5pt }
li { position: relative; padding-left: 13pt; line-height: 1.4 }
li::before { content: ''; position: absolute; left: 5pt; top: 4.2pt; width: 2.2pt; height: 2.2pt; border-radius: 50%; background: #384347 }
.edu .row + .row { margin-top: 2pt }
.edu .loc, .edu .dates { padding-right: 0 }
.langs { display: flex; gap: 0; padding-top: 4pt }
.langs div { width: 50%; display: flex; align-items: center; gap: 6pt }
.langs b { font-weight: 400; font-size: 9.6pt; color: #000 }
.langs span { font-size: 7pt }
.langs i { display: inline-block; width: 6pt; height: 6pt; border-radius: 50%; background: #000; margin-right: 1.6pt }
.langs .d { display: flex }
.proj-others li b { font-weight: 700; color: #384347 }
.skills { padding-left: 3pt }
.skills b { font-weight: 700 }
</style></head><body>
<h1>KABILAN GR</h1>
<div class="title">${esc(D.title)}</div>
<div class="contact"><span><a href="${lin}">${short(lin)}</a></span><span><a href="${git}">${short(git)}</a></span><span>${esc(P.profile.location)}</span></div>

<h2>Summary</h2>
<p class="in">${esc(P.profile.summary)} ${esc(P.profile.summaryMore)}</p>

<h2>Experience</h2>
${jobs}

<h2>Projects</h2>
<ul class="proj-others">${others}</ul>

<h2>Education</h2>
<div class="edu"><div class="row"><span class="co">${esc(D.education.institution)}</span><span class="loc">${esc(D.education.location)}</span></div>
<div class="row"><span class="role">${esc(D.education.degree)}</span><span class="dates">${esc(D.education.dates)}</span></div></div>

<h2>Languages</h2>
<div class="langs">${D.languages.map((l) => `<div><b>${l.name}</b><span>${l.level}</span><span class="d">${dots(l.dots)}</span></div>`).join('')}</div>

<h2>Skills</h2>
<p class="skills">${skills}</p>
</body></html>`;

fs.mkdirSync(path.dirname(out), { recursive: true });
const htmlPath = path.join(__dirname, '.resume.generated.html');
fs.writeFileSync(htmlPath, html);
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, 'file://' + htmlPath], { stdio: 'ignore' });
fs.unlinkSync(htmlPath);
const pages = (fs.readFileSync(out, 'latin1').match(/\/Type\s*\/Page\b/g) || []).length;
console.log(`wrote ${out} (${pages} page(s))`);
