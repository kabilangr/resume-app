// Responsive browser check. Run after `CI=true npm run build`:  node scripts/check-responsive.js
// (or `npm run test:responsive`).
//
// Zero dependencies. It starts the installed Chrome headless over the DevTools pipe (fds 3 and 4,
// NUL-delimited JSON, Node built-ins only), serves build/ itself, and for every viewport in both
// themes asserts: no horizontal overflow (overflow guard switched off), every control at least
// 44x44 (WCAG inline-text exception), the nav switch at 1024, the modal menu, focus handling,
// the gallery, hover gating, the animation budget and more (see docs/site-build, plan MAC3 to MAC20).
//
// Options:  --vp=320,375,844x390   only these viewports     --skip-cls   skip the 20 s layout-shift run
//           --no-shots             skip screenshots          CHROME_PATH  override the Chrome binary
//           RESPONSIVE_OUT         screenshot folder (default: <tmpdir>/responsive)
//           RESPONSIVE_BUILD       folder to serve (default: build/)
// Exit code 1 when any check fails.
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUILD = process.env.RESPONSIVE_BUILD || path.join(ROOT, 'build');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.env.RESPONSIVE_OUT || path.join(os.tmpdir(), 'responsive');
const args = process.argv.slice(2);
const argVal = (name) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : null;
};
const SHOTS = !args.includes('--no-shots');
const SKIP_CLS = args.includes('--skip-cls');

// ---------------------------------------------------------------- matrix
const PORTRAIT = [320, 360, 375, 390, 414, 640, 768, 900, 1023, 1024, 1280].map((w) => ({ name: String(w), w, h: 800 }));
const LANDSCAPE = [
  { name: '844x390', w: 844, h: 390, land: true },
  { name: '667x375', w: 667, h: 375, land: true },
];
let MATRIX = [...PORTRAIT, ...LANDSCAPE];
const only = argVal('vp');
if (only) MATRIX = MATRIX.filter((v) => only.split(',').includes(v.name));
const THEMES = ['light', 'dark'];

// ---------------------------------------------------------------- results
let total = 0;
let failures = 0;
const perVp = {};
const check = (vp, theme, name, ok, detail) => {
  total += 1;
  if (!ok) failures += 1;
  const key = vp;
  perVp[key] = perVp[key] || { checks: 0, failures: 0 };
  perVp[key].checks += 1;
  if (!ok) perVp[key].failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${String(vp).padEnd(8)} ${String(theme).padEnd(5)} ${name}${detail ? `  ${detail}` : ''}`);
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- static server
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.xml': 'application/xml', '.map': 'application/json', '.woff2': 'font/woff2',
};
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.normalize(path.join(BUILD, urlPath));
    if (!file.startsWith(BUILD)) file = path.join(BUILD, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(BUILD, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ---------------------------------------------------------------- CDP over the pipe
class Cdp {
  constructor(child) {
    this.out = child.stdio[3];
    this.inp = child.stdio[4];
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    this.buf = '';
    this.inp.setEncoding('utf8');
    this.inp.on('data', (chunk) => {
      this.buf += chunk;
      let i = this.buf.indexOf('\0');
      while (i >= 0) {
        const raw = this.buf.slice(0, i);
        this.buf = this.buf.slice(i + 1);
        if (raw) this.handle(JSON.parse(raw));
        i = this.buf.indexOf('\0');
      }
    });
  }
  handle(msg) {
    if (msg.id && this.pending.has(msg.id)) {
      const { resolve, reject, timer } = this.pending.get(msg.id);
      clearTimeout(timer);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.error.message} ${msg.error.data || ''}`));
      else resolve(msg.result || {});
    } else if (msg.method) {
      this.listeners.slice().forEach((l) => l(msg));
    }
  }
  send(method, params = {}, sessionId) {
    this.id += 1;
    const id = this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 60000);
      this.pending.set(id, { resolve, reject, timer });
      this.out.write(`${JSON.stringify(payload)}\0`);
    });
  }
  waitEvent(method, sessionId, ms = 30000) {
    return new Promise((resolve) => {
      const l = (msg) => {
        if (msg.method === method && msg.sessionId === sessionId) {
          this.listeners = this.listeners.filter((x) => x !== l);
          clearTimeout(timer);
          resolve(true);
        }
      };
      const timer = setTimeout(() => {
        this.listeners = this.listeners.filter((x) => x !== l);
        resolve(false);
      }, ms);
      this.listeners.push(l);
    });
  }
}

// ---------------------------------------------------------------- in-page helpers
const HELPERS = `
window.__t = (function () {
  const SEL = 'a[href], button, [role="button"], input, select, summary, [tabindex="0"]';
  const describe = (el, r) => {
    const label = (el.getAttribute('aria-label') || el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 28);
    const cls = typeof el.className === 'string' ? el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '';
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + '[' + label + '] ' + Math.round(r.width * 10) / 10 + 'x' + Math.round(r.height * 10) / 10;
  };
  const targets = (min) => {
    const bad = [];
    let count = 0;
    document.querySelectorAll(SEL).forEach((el) => {
      if (el.classList.contains('skip-link')) return;
      if (el.closest('[aria-hidden="true"], [inert]')) return;
      if (!el.getClientRects().length) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return;
      if (cs.display === 'inline') {
        let block = el.parentElement;
        while (block && getComputedStyle(block).display === 'inline') block = block.parentElement;
        const own = (el.textContent || '').trim();
        const rest = ((block && block.textContent) || '').replace(own, '').trim();
        if (rest.length > 0) return;
      }
      count += 1;
      const r = el.getBoundingClientRect();
      if (r.width < min - 0.5 || r.height < min - 0.5) bad.push(describe(el, r));
    });
    return { count, bad };
  };
  const overflow = (expected) => {
    const w = expected || window.innerWidth;
    const sw = document.documentElement.scrollWidth;
    const offenders = [];
    if (sw > w) {
      document.body.querySelectorAll('*').forEach((el) => {
        if (offenders.length >= 6) return;
        const r = el.getBoundingClientRect();
        if (!(r.right > w + 1 || r.left < -1) || r.width === 0) return;
        let p = el;
        while (p && p !== document.body) {
          const cs = getComputedStyle(p);
          if (cs.position === 'fixed') return;
          if (p !== el && cs.overflowX !== 'visible') return;
          p = p.parentElement;
        }
        offenders.push(describe(el, r) + ' right=' + Math.round(r.right));
      });
    }
    return { sw, w: window.innerWidth, offenders };
  };
  const active = () => {
    const a = document.activeElement;
    if (!a) return 'none';
    const label = (a.getAttribute('aria-label') || a.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 24);
    return a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + '[' + label + ']' + (a.closest('.menu') ? ' in-menu' : '');
  };
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
  };
  const hoverRules = () => {
    const bad = [];
    let total = 0;
    const gated = (rule) => {
      let p = rule.parentRule;
      while (p) {
        if (p.type === CSSRule.MEDIA_RULE && /hover:\\s*hover/.test(p.media.mediaText)) return true;
        p = p.parentRule;
      }
      return false;
    };
    const walk = (rules) => {
      for (const rule of rules) {
        if (rule.type === CSSRule.STYLE_RULE) {
          if (rule.selectorText && rule.selectorText.includes(':hover')) {
            total += 1;
            if (!gated(rule)) bad.push(rule.selectorText.slice(0, 80));
          }
        } else if (rule.cssRules) walk(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch (e) { continue; }
      walk(rules);
    }
    return { total, bad };
  };
  return { targets, overflow, active, rect, hoverRules };
})();
`;

// ---------------------------------------------------------------- page driver
async function openPage(cdp, port, vp, opts = {}) {
  const { theme = 'light', reduced = false } = opts;
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => cdp.send(m, p, sessionId);
  const small = vp.w < 1024;
  const dpr = small ? 3 : 1;
  await s('Page.enable');
  await s('Runtime.enable');
  await s('Emulation.setDeviceMetricsOverride', {
    width: vp.w, height: vp.h, deviceScaleFactor: dpr, mobile: small, screenWidth: vp.w, screenHeight: vp.h,
  });
  await s('Emulation.setTouchEmulationEnabled', { enabled: small, maxTouchPoints: 5 });
  await s('Emulation.setFocusEmulationEnabled', { enabled: true });
  await s('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }],
  });
  await s('Page.addScriptToEvaluateOnNewDocument', {
    source: `try { localStorage.setItem('theme', '${theme}'); } catch (e) {}
      window.__stage = [];
      new MutationObserver(function (m, obs) {
        var el = document.querySelector('.hero__stage');
        var pt = document.querySelector('.hero__portrait');
        if (!el || !pt) return;
        obs.disconnect();
        var read = function () { return [getComputedStyle(el).opacity, getComputedStyle(pt).opacity]; };
        window.__stage.push(read());
        setTimeout(function () { window.__stage.push(read()); }, 50);
      }).observe(document, { childList: true, subtree: true });`,
  });
  const loaded = cdp.waitEvent('Page.loadEventFired', sessionId, 45000);
  await s('Page.navigate', { url: `http://127.0.0.1:${port}/` });
  await loaded;
  const page = {
    s, targetId, dpr,
    async eval(expression) {
      const r = await s('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error(`eval failed: ${(r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text}`);
      return r.result.value;
    },
    async key(key, code, vk, shift) {
      const base = { key, code, windowsVirtualKeyCode: vk, modifiers: shift ? 8 : 0 };
      await s('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
      await s('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
    },
    tab(shift) { return page.key('Tab', 'Tab', 9, shift); },
    esc() { return page.key('Escape', 'Escape', 27, false); },
    async close() {
      try { await cdp.send('Target.closeTarget', { targetId }); } catch (e) { /* ignore */ }
    },
  };
  await page.eval(HELPERS);
  await page.eval('Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 6000))]).then(() => true)');
  await sleep(700);
  return page;
}

const SCROLL_THROUGH = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const h = document.documentElement.scrollHeight;
  const step = Math.max(160, window.innerHeight * 0.4);
  for (let y = 0; y < h; y += step) { window.scrollTo({ top: y, behavior: 'instant' }); await wait(180); }
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  await wait(400);
  // Reveals that still sit at opacity 0 (fast sweep, observers lagging): bring each one into view.
  for (let pass = 0; pass < 2; pass += 1) {
    const hidden = Array.from(document.querySelectorAll('main [style*="opacity: 0;"]')).filter((el) => !el.closest('svg')).slice(0, 40);
    if (!hidden.length) break;
    for (const el of hidden) { el.scrollIntoView({ behavior: 'instant', block: 'center' }); await wait(260); }
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  await wait(1800);
  return true;
})()`;

const GUARD_OFF = `(() => { const s = document.createElement('style'); s.id = '__guard'; s.textContent = 'html,body{overflow-x:visible!important}'; document.head.appendChild(s); return true; })()`;
const GUARD_ON = `(() => { const s = document.getElementById('__guard'); if (s) s.remove(); return true; })()`;
const SPACING_CSS = `(() => { const s = document.createElement('style'); s.id = '__spacing'; s.textContent = '*{line-height:1.5!important;letter-spacing:0.12em!important;word-spacing:0.16em!important} p{margin-bottom:2em!important}'; document.head.appendChild(s); return true; })()`;

async function shot(page, name) {
  if (!SHOTS) return;
  fs.mkdirSync(OUT, { recursive: true });
  const m = await page.s('Page.getLayoutMetrics');
  const cs = m.cssContentSize || m.contentSize;
  const height = Math.min(Math.ceil(cs.height), 14000);
  const { data } = await page.s('Page.captureScreenshot', {
    format: 'jpeg', quality: 55, captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: Math.ceil(cs.width), height, scale: 1 / page.dpr },
  });
  fs.writeFileSync(path.join(OUT, `${name}.jpg`), Buffer.from(data, 'base64'));
}
async function shotView(page, name) {
  if (!SHOTS) return;
  fs.mkdirSync(OUT, { recursive: true });
  const { data } = await page.s('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
  fs.writeFileSync(path.join(OUT, `${name}.jpg`), Buffer.from(data, 'base64'));
}

async function openMenu(page) {
  await page.eval(`document.querySelector('.nav__burger').click(); true`);
  await sleep(1100);
}
async function closeMenuViaButton(page) {
  await page.eval(`(document.querySelector('.menu__close') || {click(){}}).click(); true`);
  await sleep(500);
}

// ---------------------------------------------------------------- per viewport and theme
async function runViewport(cdp, port, vp, theme) {
  const tag = vp.name;
  const small = vp.w < 1024;
  const page = await openPage(cdp, port, vp, { theme });
  try {
    check(tag, theme, 'env', true, `hover:none=${await page.eval("matchMedia('(hover: none)').matches")} dpr=${page.dpr} innerWidth=${await page.eval('innerWidth')}`);
    await page.eval(SCROLL_THROUGH);
    if (argVal('eval')) console.log(`eval ${tag} ${theme}:`, JSON.stringify(await page.eval(argVal('eval'))));

    // MAC12(d): one cartoon file, at most 1280 wide, stage opaque from the first paint
    if (vp.w === 360) {
      const res = await page.eval(`performance.getEntriesByType('resource').map(r => r.name).filter(n => /portrait-cartoon-\\d+\\.webp/.test(n))`);
      const widths = res.map((n) => Number(/cartoon-(\d+)\.webp/.exec(n)[1]));
      check(tag, theme, 'MAC12d one cartoon file at most 1280', res.length === 1 && widths[0] <= 1280, `files=${widths.join(',')}`);
      const stage = await page.eval('window.__stage');
      check(tag, theme, 'MAC12d stage opacity 1 at first paint', stage.length >= 1 && stage.every((p) => p[0] === '1' && p[1] === '1'), JSON.stringify(stage));
    }

    // MAC4: no horizontal overflow with the guard off
    await page.eval(GUARD_OFF);
    const ov = await page.eval('window.__t.overflow(' + vp.w + ')');
    check(tag, theme, 'MAC4 no horizontal overflow', ov.sw <= vp.w && ov.w === vp.w, `scrollWidth=${ov.sw} innerWidth=${ov.w} expected=${vp.w} ${ov.offenders.join(' | ')}`);

    // MAC5: target size, menu closed
    const ts = await page.eval('window.__t.targets(44)');
    check(tag, theme, 'MAC5 targets at least 44x44 (menu closed)', ts.bad.length === 0, `${ts.count} controls ${ts.bad.join(' | ')}`);
    await page.eval(GUARD_ON);

    // MAC6: nav switch
    const nav = await page.eval(`(() => {
      const burger = document.querySelector('.nav__burger');
      const links = document.querySelector('.nav__links');
      const bar = document.querySelector('.nav__bar');
      const lr = links.getBoundingClientRect();
      return { burgerDisplay: getComputedStyle(burger).display, linksDisplay: getComputedStyle(links).display, linksW: lr.width,
               barSW: bar.scrollWidth, barCW: bar.clientWidth };
    })()`);
    if (small) {
      check(tag, theme, 'MAC6 burger shown, links hidden', nav.burgerDisplay !== 'none' && nav.linksDisplay === 'none', `burger=${nav.burgerDisplay} links=${nav.linksDisplay}`);
    } else {
      check(tag, theme, 'MAC6 links shown, burger hidden, bar fits', nav.burgerDisplay === 'none' && nav.linksDisplay !== 'none' && nav.linksW > 0 && nav.barSW <= nav.barCW,
        `burger=${nav.burgerDisplay} links=${nav.linksDisplay} bar=${nav.barSW}/${nav.barCW}`);
    }

    // MAC17 (landscape): hero layout and scroll cue
    if (vp.land) {
      await page.eval('window.scrollTo({ top: 0, behavior: "instant" }); true');
      await sleep(300);
      const L = await page.eval(`(() => ({
        cue: getComputedStyle(document.querySelector('.scroll-cue')).display,
        copy: window.__t.rect('.hero__copy'), stage: window.__t.rect('.hero__portrait'), nav: window.__t.rect('.nav')
      }))()`);
      const inter = !(L.copy.right <= L.stage.left || L.stage.right <= L.copy.left || L.copy.bottom <= L.stage.top || L.stage.bottom <= L.copy.top);
      check(tag, theme, 'MAC17 scroll cue hidden', L.cue === 'none', `display=${L.cue}`);
      check(tag, theme, 'MAC17 copy and stage do not intersect', !inter, `copy=${Math.round(L.copy.left)}-${Math.round(L.copy.right)} stage=${Math.round(L.stage.left)}-${Math.round(L.stage.right)}`);
      check(tag, theme, 'MAC17 tops clear the nav', L.copy.top >= L.nav.bottom - 0.5 && L.stage.top >= L.nav.bottom - 0.5,
        `copy.top=${Math.round(L.copy.top)} stage.top=${Math.round(L.stage.top)} nav.bottom=${Math.round(L.nav.bottom)}`);
    }

    // MAC15: hover gating (one viewport is enough, the CSS is global)
    if (vp.w === 1280) {
      const hv = await page.eval('window.__t.hoverRules()');
      check(tag, theme, 'MAC15 every :hover rule is inside (hover: hover)', hv.total > 0 && hv.bad.length === 0, `${hv.total} hover rules ${hv.bad.slice(0, 6).join(' | ')}`);
    }

    // MAC18: gallery
    if (vp.w === 1024) {
      await page.eval(`document.querySelector('.featured').scrollIntoView({ behavior: 'instant', block: 'center' }); true`);
      await sleep(1500);
      const g = await page.eval(`(() => {
        const card = document.querySelector('.featured__card').getBoundingClientRect();
        return Array.from(document.querySelectorAll('.gallery__phone')).map((p) => {
          const r = p.getBoundingClientRect();
          return { l: r.left - card.left, t: r.top - card.top, r: card.right - r.right, b: card.bottom - r.bottom };
        });
      })()`);
      const inside = g.length === 3 && g.every((p) => p.l >= -1 && p.t >= -1 && p.r >= -1 && p.b >= -1);
      check(tag, theme, 'MAC18 phones inside the featured card', inside, g.map((p) => `${Math.round(p.l)}/${Math.round(p.r)}`).join(' '));
    }
    if (vp.w === 375) {
      const d0 = await page.eval(`(() => { const d = document.querySelector('.gallery__dots'); return d ? { hidden: d.getAttribute('aria-hidden'), n: d.children.length, display: getComputedStyle(d).display } : null; })()`);
      check(tag, theme, 'MAC18 gallery dots present and aria-hidden', !!d0 && d0.hidden === 'true' && d0.n === 3 && d0.display !== 'none', JSON.stringify(d0));
      await page.eval(`(() => { const g = document.querySelector('.gallery'); g.scrollIntoView({ behavior: 'instant', block: 'center' }); g.scrollTo({ left: g.scrollWidth, behavior: 'instant' }); return true; })()`);
      await sleep(700);
      const live = await page.eval(`(() => { const p = document.querySelector('.gallery-wrap [aria-live]'); return p ? p.textContent.trim() : null; })()`);
      check(tag, theme, 'MAC18 live text at the end of the row', live === 'Screenshot 3 of 3', `text=${live}`);
    }
    if (vp.w === 1280) {
      const d1 = await page.eval(`(() => { const d = document.querySelector('.gallery__dots'); return d ? getComputedStyle(d).display : 'missing'; })()`);
      check(tag, theme, 'MAC18 dots not displayed at 1280', d1 === 'none', `display=${d1}`);
    }

    // MAC16: animation budget at 360 with touch
    if (vp.w === 360) {
      const b = await page.eval(`(() => {
        const bad = [];
        document.querySelectorAll('.hero__blob, .projects__wash').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.filter !== 'none' || cs.animationName !== 'none') bad.push(el.className + ' filter=' + cs.filter + ' anim=' + cs.animationName);
        });
        return bad;
      })()`);
      check(tag, theme, 'MAC16 blobs and washes static, no filter', b.length === 0, b.join(' | '));
      await page.eval(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' }); true`);
      await sleep(700);
      const p1 = await page.eval(`document.getElementById('hero').hasAttribute('data-paused')`);
      await page.eval(`window.scrollTo({ top: 0, behavior: 'instant' }); true`);
      await sleep(700);
      const p2 = await page.eval(`document.getElementById('hero').hasAttribute('data-paused')`);
      check(tag, theme, 'MAC16 hero pauses off-screen and resumes', p1 === true && p2 === false, `offscreen=${p1} back=${p2}`);
    }

    // MAC10: LinkedIn button
    if (vp.w === 320 || vp.w === 360) {
      await page.eval(`document.getElementById('contact').scrollIntoView({ behavior: 'instant' }); true`);
      await sleep(900);
      const c = await page.eval(`(() => {
        const a = Array.from(document.querySelectorAll('.contact .btn')).find((x) => /Message me on LinkedIn/.test(x.textContent));
        const panel = document.querySelector('.contact__panel').getBoundingClientRect();
        if (!a) return null;
        const r = a.getBoundingClientRect();
        return { sw: a.scrollWidth, cw: a.clientWidth, sh: a.scrollHeight, ch: a.clientHeight, inside: r.left >= panel.left - 0.5 && r.right <= panel.right + 0.5 };
      })()`);
      check(tag, theme, 'MAC10 LinkedIn button not clipped and inside the panel', !!c && c.sw <= c.cw && c.sh <= c.ch + 1 && c.inside, JSON.stringify(c));
    }

    // MAC5 and MAC17 with the menu open (below 1024), screenshot of the open menu
    if (small) {
      await page.eval('window.scrollTo({ top: 0, behavior: "instant" }); true');
      await sleep(300);
      await openMenu(page);
      const m = await page.eval(`(() => ({
        t: window.__t.targets(44), socials: Array.from(document.querySelectorAll('.menu .socials__link')).map((a) => a.getBoundingClientRect()).map((r) => ({ l: r.left, t: r.top, r: r.right, b: r.bottom })),
        vw: innerWidth, vh: innerHeight, over: document.documentElement.scrollWidth
      }))()`);
      check(tag, theme, 'MAC5 targets at least 44x44 (menu open)', m.t.bad.length === 0 && m.t.count >= 9, `${m.t.count} controls ${m.t.bad.join(' | ')}`);
      if (vp.land) {
        await page.eval(`(() => { const s = document.querySelector('.menu__scroll'); s.scrollTo({ top: s.scrollHeight, behavior: 'instant' }); return true; })()`);
        await sleep(300);
        const soc = await page.eval(`Array.from(document.querySelectorAll('.menu .socials__link')).map((a) => { const r = a.getBoundingClientRect(); return { l: r.left, t: r.top, r: r.right, b: r.bottom }; })`);
        const vis = soc.length > 0 && soc.every((r) => r.l >= 0 && r.t >= 0 && r.r <= vp.w && r.b <= vp.h);
        check(tag, theme, 'MAC17 menu socials inside the viewport at scroll end', vis, JSON.stringify(soc.map((r) => [Math.round(r.t), Math.round(r.b)])));
      }
      await shotView(page, `${tag}-${theme}-menu`);
      await closeMenuViaButton(page);
    }
    await page.eval('window.scrollTo({ top: 0, behavior: "instant" }); true');
    await sleep(400);
    await shot(page, `${tag}-${theme}`);

    // MAC8 in a real browser, at 375
    if (vp.w === 375) await focusChecks(page, tag, theme);
  } finally {
    await page.close();
  }
}

async function focusChecks(page, tag, theme) {
  await page.eval('window.scrollTo({ top: 0, behavior: "instant" }); true');
  await sleep(300);
  await openMenu(page);
  const inertOn = await page.eval(`['.nav__bar', '#main', 'footer', '.skip-link'].map((s) => document.querySelector(s).hasAttribute('inert'))`);
  check(tag, theme, 'MAC7 inert set on bar, main, footer, skip link while open', inertOn.every(Boolean), JSON.stringify(inertOn));
  const first = await page.eval('window.__t.active()');
  check(tag, theme, 'MAC8 focus starts on Close', /Close/.test(first) && /in-menu/.test(first), first);
  let stayed = true;
  let trail = '';
  for (let i = 0; i < 12; i += 1) {
    await page.tab(false);
    await sleep(60);
    const a = await page.eval('window.__t.active()');
    trail = a;
    if (!/in-menu/.test(a)) { stayed = false; break; }
  }
  check(tag, theme, 'MAC8 12 Tab presses stay inside the menu', stayed, `last=${trail}`);
  await page.tab(true);
  await sleep(60);
  await page.esc();
  await sleep(900);
  const afterEsc = await page.eval('window.__t.active()');
  check(tag, theme, 'MAC8 Esc returns focus to the burger', /Open menu/.test(afterEsc), afterEsc);
  const inertOff = await page.eval(`['.nav__bar', '#main', 'footer', '.skip-link'].map((s) => document.querySelector(s).hasAttribute('inert'))`);
  check(tag, theme, 'MAC7 inert removed after close', inertOff.every((v) => v === false), JSON.stringify(inertOff));
  const lock = await page.eval(`[document.documentElement.style.overflow, document.body.style.overflow]`);
  check(tag, theme, 'MAC9 scroll lock restored after close', lock[0] === '' && lock[1] === '', JSON.stringify(lock));
  await openMenu(page);
  await page.eval(`document.querySelector('.menu__link[href="#projects"]').click(); true`);
  await sleep(900);
  const afterLink = await page.eval('window.__t.active()');
  check(tag, theme, 'MAC8 menu link focuses #projects', /#projects/.test(afterLink), afterLink);
  const menuGone = await page.eval(`!document.querySelector('.menu')`);
  check(tag, theme, 'MAC8 menu closed after a link tap', menuGone, `menuGone=${menuGone}`);
  await page.eval('window.scrollTo({ top: 0, behavior: "instant" }); true');
}

// ---------------------------------------------------------------- reduced motion and WCAG spacing runs
async function runReduced(cdp, port, vp, theme) {
  const tag = `${vp.name}-rm`;
  const page = await openPage(cdp, port, vp, { theme, reduced: true });
  try {
    await page.eval(SCROLL_THROUGH);
    await page.eval(GUARD_OFF);
    const ov = await page.eval('window.__t.overflow(' + vp.w + ')');
    check(tag, theme, 'MAC20 no horizontal overflow (reduced motion)', ov.sw <= vp.w && ov.w === vp.w, `scrollWidth=${ov.sw} innerWidth=${ov.w} expected=${vp.w} ${ov.offenders.join(' | ')}`);
    const ts = await page.eval('window.__t.targets(44)');
    check(tag, theme, 'MAC20 targets at least 44x44 (reduced motion)', ts.bad.length === 0, `${ts.count} controls ${ts.bad.join(' | ')}`);
    await page.eval(GUARD_ON);
    const st = await page.eval(`(() => ({
      typewriter: !!document.querySelector('.Typewriter'),
      zero: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'].filter((id) => getComputedStyle(document.getElementById(id)).opacity === '0')
    }))()`);
    check(tag, theme, 'MAC20 no Typewriter, no section at opacity 0', !st.typewriter && st.zero.length === 0, JSON.stringify(st));
    await shot(page, `${tag}-${theme}`);
  } finally {
    await page.close();
  }
}

async function runSpacing(cdp, port, vp, theme) {
  const tag = `${vp.name}-sp`;
  const page = await openPage(cdp, port, vp, { theme });
  try {
    await page.eval(SCROLL_THROUGH);
    await page.eval(SPACING_CSS);
    await page.eval(GUARD_OFF);
    await sleep(400);
    const ov = await page.eval('window.__t.overflow(' + vp.w + ')');
    const btn = await page.eval(`Array.from(document.querySelectorAll('.btn')).filter((b) => b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim().slice(0, 30))`);
    check(tag, theme, 'MAC10 WCAG 1.4.12 spacing: no overflow, no clipped .btn', ov.sw <= vp.w && ov.w === vp.w && btn.length === 0, `scrollWidth=${ov.sw}/${ov.w} clipped=${btn.join(',')} ${ov.offenders.join(' | ')}`);
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------- layout shift in the hero (MAC11)
async function runCls(cdp, port) {
  const vp = { name: '360', w: 360, h: 800 };
  const tag = '360-cls';
  const page = await openPage(cdp, port, vp, { theme: 'light' });
  try {
    // Observer starts after fonts are ready and the entrance has finished, so a font swap does not count.
    await sleep(2200);
    await page.eval(`(() => {
      window.__cls = { sum: 0, n: 0, who: {} };
      const hero = document.getElementById('hero');
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue;
          const inHero = (e.sources || []).some((s) => s.node && hero.contains(s.node));
          if (inHero) {
            window.__cls.sum += e.value; window.__cls.n += 1;
            (e.sources || []).forEach((src) => { const n = src.node; const par = n && n.parentElement; const k = n ? (n.nodeName + ' in ' + (par ? par.className : '?') + ' "' + (n.textContent || '').slice(0, 12) + '" ' + Math.round(src.previousRect.x) + '>' + Math.round(src.currentRect.x) + ',' + Math.round(src.previousRect.y) + '>' + Math.round(src.currentRect.y)) : '?'; window.__cls.who[k] = (window.__cls.who[k] || 0) + 1; });
          }
        }
      }).observe({ type: 'layout-shift', buffered: false });
      return true;
    })()`);
    await sleep(21000);
    const c = await page.eval('window.__cls');
    check(tag, 'light', 'MAC11 hero layout shift stays 0 over a full role cycle', c.sum === 0, `sum=${c.sum} entries=${c.n} ${JSON.stringify(c.who)}`);
  } finally {
    await page.close();
  }
}

// ---------------------------------------------------------------- main
async function main() {
  if (!fs.existsSync(path.join(BUILD, 'index.html'))) {
    console.error('build/index.html is missing. Run: CI=true npm run build');
    process.exit(2);
  }
  if (!fs.existsSync(CHROME)) {
    console.error(`Chrome not found at ${CHROME}. Set CHROME_PATH.`);
    process.exit(2);
  }
  const server = await startServer();
  const port = server.address().port;
  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resp-chrome-'));
  const child = spawn(CHROME, [
    '--headless=new', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    `--user-data-dir=${profileDir}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });
  const cleanup = () => {
    try { child.kill('SIGKILL'); } catch (e) { /* ignore */ }
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  };
  process.on('exit', cleanup);
  process.on('SIGINT', () => process.exit(130));
  process.on('SIGTERM', () => process.exit(143));
  const cdp = new Cdp(child);

  const guarded = async (vp, theme, fn) => {
    try {
      await fn();
    } catch (e) {
      check(vp, theme, 'harness error', false, e.message);
    }
  };

  console.log(`Chrome: ${CHROME}\nServing ${BUILD} on port ${port}\nScreenshots: ${SHOTS ? OUT : 'off'}`);
  for (const vp of MATRIX) {
    for (const theme of THEMES) {
      await guarded(vp.name, theme, () => runViewport(cdp, port, vp, theme));
    }
  }
  for (const vp of MATRIX.filter((v) => v.w === 375 || v.w === 1280)) {
    for (const theme of THEMES) {
      await guarded(`${vp.name}-rm`, theme, () => runReduced(cdp, port, vp, theme));
    }
  }
  for (const vp of MATRIX.filter((v) => v.w === 320)) {
    for (const theme of THEMES) {
      await guarded(`${vp.name}-sp`, theme, () => runSpacing(cdp, port, vp, theme));
    }
  }
  if (!SKIP_CLS && (!only || args.includes('--cls'))) await guarded('360-cls', 'light', () => runCls(cdp, port));

  console.log('\nPer viewport:');
  Object.keys(perVp).forEach((k) => console.log(`  ${k.padEnd(8)} ${String(perVp[k].checks).padStart(3)} checks, ${perVp[k].failures} failures`));
  console.log(`\n${total} checks, ${failures} failures`);
  console.log(failures ? `${failures} FAILED` : '0 failures');
  server.close();
  cleanup();
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
