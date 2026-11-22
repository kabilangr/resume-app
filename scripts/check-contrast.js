// WCAG contrast check for the Golden Hour Cafe palette. Run: node scripts/check-contrast.js
// Colours are read from src/index.css (the `:root, [data-theme="light"]` block and the
// `[data-theme="dark"]` block), so this script never keeps its own palette table.
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.css'), 'utf8');

const blockAfter = (selectorRe) => {
  const m = selectorRe.exec(css);
  if (!m) throw new Error(`index.css: block not found for ${selectorRe}`);
  const open = css.indexOf('{', m.index);
  const close = css.indexOf('\n}', open);
  return css.slice(open + 1, close);
};

const tokens = (block) => {
  const out = {};
  block.split('\n').forEach((line) => {
    const m = /^\s*(--[\w-]+):\s*(.+?);\s*(?:\/\*.*)?$/.exec(line);
    if (m) out[m[1]] = m[2];
  });
  return out;
};

const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const themes = {
  light: tokens(blockAfter(/:root,\s*\n\[data-theme="light"\]\s*\{/)),
  dark: tokens(blockAfter(/^\[data-theme="dark"\]\s*\{/m)),
};

const hex = (theme, name) => {
  const v = themes[theme][name];
  if (!v || !/^#[0-9a-fA-F]{6}$/.test(v)) throw new Error(`${theme}: ${name} is not a #rrggbb value (${v})`);
  return v;
};
const gradientEnds = (theme) => {
  const v = themes[theme]['--gradient-brand'] || '';
  const found = v.match(/#[0-9a-fA-F]{6}/g) || [];
  if (found.length < 2) throw new Error(`${theme}: --gradient-brand has no hex stops`);
  return [found[0], found[found.length - 1]];
};

const CATS = ['frontend', 'mobile', 'backend', 'cloud', 'vibe', 'agents', 'iot', 'process'];
const TEXT = ['--color-text', '--color-text-muted', '--color-accent', '--color-accent-strong', '--color-accent-2', '--color-success', '--color-warning', '--color-danger'];
const SURFACES = ['--color-bg', '--color-surface', '--color-surface-2'];

let fail = 0;
let count = 0;
const chk = (theme, name, fg, bg, min) => {
  const r = ratio(fg, bg); const ok = r >= min; count += 1; if (!ok) fail += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${theme.padEnd(5)} ${name.padEnd(40)} ${r.toFixed(2)} (>= ${min})`);
};

for (const theme of Object.keys(themes)) {
  for (const s of SURFACES) {
    const bg = hex(theme, s);
    const sn = s.replace('--color-', '');
    TEXT.forEach((t) => chk(theme, `${t.replace('--color-', '')} on ${sn}`, hex(theme, t), bg, 4.5));
    CATS.forEach((c) => chk(theme, `cat-${c} on ${sn}`, hex(theme, `--cat-${c}`), bg, 4.5));
    chk(theme, `border-strong on ${sn}`, hex(theme, '--color-border-strong'), bg, 3);
    chk(theme, `focus ring on ${sn}`, hex(theme, '--focus-ring'), bg, 3);
  }
  const onA = hex(theme, '--color-text-on-accent');
  chk(theme, 'on-accent on accent', onA, hex(theme, '--color-accent'), 4.5);
  const [g0, g1] = gradientEnds(theme);
  chk(theme, 'on-accent on gradient start', onA, g0, 4.5);
  chk(theme, 'on-accent on gradient end', onA, g1, 4.5);
}
console.log(`\n${count} checks, ${fail} failures`);
console.log(fail ? `${fail} FAILED` : 'all passed');
process.exit(fail ? 1 : 0);
