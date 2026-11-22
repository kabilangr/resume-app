import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { ImageUtil } from '../utils/ImageUtil';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import './RevealPortrait.css';

// Scene sizes in SVG user units. With real images the stage is the full 16:9 scene,
// shown cover-cropped (focal point set in CSS) inside the frame; the base image and the
// SVG layer share the stage box, so they stay aligned. All pointer maths is converted
// from CSS px into these units.
const SCENE = { w: 1672, h: 941 };
const PHOTO = { w: 756, h: 800 }; // fallback portrait canvas
const N = 7; // circles in the trail
const FOLLOW = [0.35, 0.3, 0.25, 0.22, 0.2, 0.18]; // lerp factor of circle i+1 toward circle i
const R_HEAD = 90; // px
const R_TAIL = 40; // px
const OPEN_MS = 160;
const CLOSE_MS = 400;
const TAP_SLOP = 10; // px a tap may move before it counts as a drag
const PEEK_MS = 1600; // how long a tap keeps the reveal open
const TOUCH_QUERY = '(hover: none)';

const matches = (q) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? !!window.matchMedia(q).matches : false;
const saveData = () => typeof navigator !== 'undefined' && !!(navigator.connection && navigator.connection.saveData);

// Smallest robot file that covers the scene box at the device pixel ratio, otherwise the largest.
const pickRobot = (set, sceneWidth) => {
  const need = sceneWidth * (window.devicePixelRatio || 1);
  const hit = set.find((f) => f.w >= need);
  return (hit || set[set.length - 1]).url;
};

function useTouchCopy() {
  const [touch, setTouch] = useState(() => matches(TOUCH_QUERY));
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(TOUCH_QUERY);
    const on = () => setTouch(!!mql.matches);
    on();
    if (mql.addEventListener) {
      mql.addEventListener('change', on);
      return () => mql.removeEventListener('change', on);
    }
    return undefined;
  }, []);
  return touch;
}

// Gooey trail reveal. Circles live in an SVG <mask> that runs through a goo filter
// (blur + alpha threshold), so they merge into one liquid blob. Everything is
// driven from requestAnimationFrame and written to the circles through refs, never
// through React state.
export function RevealPortrait({ portrait = profile.portrait }) {
  const { cartoon, robot, cartoonSrcSet, robotSet, sizes } = portrait || {};
  const scene = !!cartoon;
  const { w: W, h: H } = scene ? SCENE : PHOTO;
  const uid = useId().replace(/:/g, '');
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const dotRefs = useRef([]);
  const ringRef = useRef(null);
  const touchCopy = useTouchCopy();
  const [robotHref, setRobotHref] = useState(null); // the robot layer loads lazily (see loadRobot)
  const [robotReady, setRobotReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden'
  );
  const [interacted, setInteracted] = useState(false);
  const [peek, setPeek] = useState(false);
  const peekTimer = useRef(0);
  const downAt = useRef(null);
  const sim = useRef({
    pts: Array.from({ length: N }, () => ({ x: W / 2, y: H / 2 })),
    tx: W / 2,
    ty: H / 2,
    open: 0,
    want: 0,
    active: false,
    init: false,
    raf: 0,
    last: 0,
  });

  const render = useCallback(() => {
    const st = sim.current;
    const px = stageRef.current && stageRef.current.clientWidth ? W / stageRef.current.clientWidth : 1;
    const scale = Math.max(0.55, Math.min(1, (frameRef.current ? frameRef.current.clientWidth : 400) / 420)); // smaller radii on small screens
    let rHead = 0;
    st.pts.forEach((p, i) => {
      const t = i / (N - 1);
      const r = (R_HEAD + (R_TAIL - R_HEAD) * t) * scale * px * st.open;
      if (i === 0) rHead = r;
      const el = dotRefs.current[i];
      if (el) {
        el.setAttribute('cx', p.x.toFixed(1));
        el.setAttribute('cy', p.y.toFixed(1));
        el.setAttribute('r', Math.max(0, r).toFixed(1));
      }
    });
    const ring = ringRef.current;
    if (ring) {
      ring.setAttribute('cx', st.pts[0].x.toFixed(1));
      ring.setAttribute('cy', st.pts[0].y.toFixed(1));
      ring.setAttribute('r', Math.max(0, rHead).toFixed(1));
      ring.style.opacity = String(Math.min(1, st.open));
    }
  }, [W]);

  const tick = useCallback(
    (now) => {
      const st = sim.current;
      st.raf = 0;
      const dt = st.last ? Math.min(64, now - st.last) : 16;
      st.last = now;

      // open / close tween, linear in time
      const openMs = reduced ? 1 : OPEN_MS; // reduced motion: open and close at once
      const closeMs = reduced ? 1 : CLOSE_MS;
      if (st.open < st.want) st.open = Math.min(st.want, st.open + dt / openMs);
      else if (st.open > st.want) st.open = Math.max(st.want, st.open - dt / closeMs);

      let moving = st.open !== st.want;
      const lead = st.pts[0];
      const k0 = st.active ? 0.6 : 0.2;
      lead.x += (st.tx - lead.x) * k0;
      lead.y += (st.ty - lead.y) * k0;
      if (Math.abs(st.tx - lead.x) < 0.2 && Math.abs(st.ty - lead.y) < 0.2) {
        lead.x = st.tx;
        lead.y = st.ty;
      } else moving = true;
      for (let i = 1; i < N; i += 1) {
        const a = st.pts[i - 1];
        const b = st.pts[i];
        const f = FOLLOW[i - 1];
        b.x += (a.x - b.x) * f;
        b.y += (a.y - b.y) * f;
        if (Math.abs(a.x - b.x) < 0.2 && Math.abs(a.y - b.y) < 0.2) {
          b.x = a.x;
          b.y = a.y;
        } else moving = true;
      }
      render();
      if (moving) st.raf = window.requestAnimationFrame(tick);
      else st.last = 0;
    },
    [render, reduced]
  );

  const kick = useCallback(() => {
    if (!sim.current.raf) sim.current.raf = window.requestAnimationFrame(tick);
  }, [tick]);

  const toUnits = (clientX, clientY) => {
    const rect = stageRef.current.getBoundingClientRect();
    const kx = rect.width ? W / rect.width : 1;
    const ky = rect.height ? H / rect.height : 1;
    return [(clientX - rect.left) * kx, (clientY - rect.top) * ky];
  };

  const aim = (clientX, clientY) => {
    const st = sim.current;
    const [x, y] = toUnits(clientX, clientY);
    st.tx = x;
    st.ty = y;
    if (!st.init) {
      st.pts.forEach((p) => {
        p.x = x;
        p.y = y;
      });
      st.init = true;
    }
    kick();
  };

  // The robot image has no href until it is needed: the first pointer contact, or an idle moment
  // after load (never with Save-Data).
  const loadRobot = useCallback(() => {
    if (!robot) return;
    setRobotHref((cur) => {
      if (cur) return cur;
      if (!robotSet || !robotSet.length) return robot;
      const w = stageRef.current ? stageRef.current.clientWidth : 0;
      return pickRobot(robotSet, w);
    });
  }, [robot, robotSet]);

  const clearPeek = () => {
    window.clearTimeout(peekTimer.current);
    peekTimer.current = 0;
    setPeek(false);
  };

  const openAt = (clientX, clientY) => {
    const st = sim.current;
    st.active = true;
    st.want = 1;
    const [x, y] = toUnits(clientX, clientY);
    st.pts.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    st.init = true;
    aim(clientX, clientY);
  };

  const onEnter = (e) => {
    loadRobot();
    if (e.pointerType === 'touch') return;
    setInteracted(true);
    openAt(e.clientX, e.clientY);
  };
  const onMove = (e) => {
    const st = sim.current;
    if (e.pointerType === 'touch' && !st.active) return;
    if (!st.active) {
      st.active = true;
      st.want = 1;
    }
    aim(e.clientX, e.clientY);
  };
  const close = () => {
    const st = sim.current;
    st.active = false;
    st.want = 0;
    kick();
  };
  // Touch and pen: press opens the reveal under the finger, a drag moves it, release closes it.
  // A tap (moved less than TAP_SLOP) keeps it open for PEEK_MS so it can be seen.
  const onDown = (e) => {
    loadRobot();
    if (e.pointerType === 'mouse') return;
    setInteracted(true);
    downAt.current = { x: e.clientX, y: e.clientY };
    clearPeek();
    openAt(e.clientX, e.clientY);
  };
  const onUp = (e) => {
    if (e.pointerType === 'mouse') return;
    const d = downAt.current;
    downAt.current = null;
    const tap = d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < TAP_SLOP;
    if (!tap) {
      close();
      return;
    }
    aim(d.x, d.y);
    setPeek(true);
    window.clearTimeout(peekTimer.current);
    peekTimer.current = window.setTimeout(() => {
      peekTimer.current = 0;
      setPeek(false);
      close();
    }, PEEK_MS);
  };
  const onCancel = (e) => {
    if (e.pointerType === 'mouse') return;
    downAt.current = null;
    clearPeek();
    close();
  };

  // Idle preload of the robot layer, unless the user asked to save data.
  useEffect(() => {
    if (!robot || saveData()) return undefined;
    let cancelled = false;
    let handle = 0;
    let usedIdle = false;
    const run = () => {
      if (!cancelled) loadRobot();
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        usedIdle = true;
        handle = window.requestIdleCallback(run, { timeout: 5000 });
      } else {
        handle = window.setTimeout(run, 3000);
      }
    };
    const onLoad = () => schedule();
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', onLoad);
      if (usedIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [robot, loadRobot]);

  // Visibility inputs for the auto-wander.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof window.IntersectionObserver !== 'function') return undefined;
    const io = new window.IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (last) setInView(!!last.isIntersecting && last.intersectionRatio >= 0.1);
      },
      { threshold: [0, 0.1, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const on = () => setPageVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  // Gentle auto-wander on touch devices. It runs only while the hero is at least 10% visible, the tab
  // is visible, nobody has touched the card yet, Save-Data is off, and the robot layer has loaded.
  const robotNeedsLoad = !!robot;
  const wanderOn =
    touchCopy && !reduced && inView && pageVisible && !interacted && !saveData() && (!robotNeedsLoad || robotReady);
  useEffect(() => {
    if (!wanderOn) return undefined;
    const st = sim.current;
    const step = () => {
      if (st.active) return;
      st.want = 1;
      // wander inside the visible crop (scene: roughly the middle 45% of the width)
      st.tx = scene ? W * (0.35 + Math.random() * 0.25) : W * (0.25 + Math.random() * 0.5);
      st.ty = H * (0.2 + Math.random() * 0.55);
      if (!st.init) {
        st.pts.forEach((p) => {
          p.x = st.tx;
          p.y = st.ty;
        });
        st.init = true;
      }
      kick();
    };
    const first = window.setTimeout(step, 1200);
    const id = window.setInterval(step, 2600);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
      if (!st.active) {
        st.want = 0;
        kick();
      }
    };
  }, [wanderOn, kick, scene, W, H]);

  useEffect(() => {
    const st = sim.current;
    return () => {
      if (st.raf) window.cancelAnimationFrame(st.raf);
      window.clearTimeout(peekTimer.current);
    };
  }, []);

  const baseSrc = cartoon || ImageUtil.kabilanImage;
  const gooId = `${uid}-goo`;
  const maskId = `${uid}-mask`;
  const duoId = `${uid}-duo`;
  const gridId = `${uid}-grid`;

  return (
    <>
      <div
        ref={frameRef}
        className={`reveal${scene ? ' reveal--scene' : ' reveal--photo'}${reduced ? ' reveal--still' : ''}`}
        data-testid="reveal-frame"
        data-peek={peek ? 'true' : undefined}
        data-wander={wanderOn ? 'on' : 'off'}
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={close}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
      >
        {/* Base image: real <img> so the alt text is in the accessibility tree. */}
        <div ref={stageRef} className="reveal__stage">
        <img
            className="reveal__base"
            src={baseSrc}
            {...(scene && cartoonSrcSet ? { srcSet: cartoonSrcSet, sizes } : {})}
            alt={profile.portraitAlt}
            width={W}
            height={H}
            {...(scene ? { fetchpriority: 'high' } : {})}
          />
        <svg
          className="reveal__svg"
          viewBox={`0 0 ${W} ${H}`}
          aria-hidden="true"
          focusable="false"
          data-testid="reveal-layer"
          preserveAspectRatio={scene ? 'xMidYMid slice' : 'none'}
        >
          <defs>
            <filter id={gooId} filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <g filter={`url(#${gooId})`}>
                {Array.from({ length: N }, (_, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    data-testid={`reveal-dot-${i}`}
                    cx={W / 2}
                    cy={H / 2}
                    r="0"
                    fill="#fff"
                  />
                ))}
              </g>
            </mask>
            {/* duotone: walnut -> cyan -> cream, after a grayscale + contrast boost */}
            <filter id={duoId} colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.5" intercept="-0.2" />
                <feFuncG type="linear" slope="1.5" intercept="-0.2" />
                <feFuncB type="linear" slope="1.5" intercept="-0.2" />
              </feComponentTransfer>
              <feComponentTransfer>
                <feFuncR type="table" tableValues="0.17 0.35 0.96" />
                <feFuncG type="table" tableValues="0.10 0.78 0.93" />
                <feFuncB type="table" tableValues="0.07 1 0.87" />
              </feComponentTransfer>
            </filter>
            <pattern id={gridId} width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M42 0H0V42" fill="none" stroke="#59c8ff" strokeWidth="1" opacity="0.4" />
            </pattern>
          </defs>

          <g mask={`url(#${maskId})`}>
            {robot ? (
              <image
                {...(robotHref ? { href: robotHref } : {})}
                x="0"
                y="0"
                width={W}
                height={H}
                preserveAspectRatio="xMidYMid slice"
                onLoad={() => setRobotReady(true)}
              />
            ) : (
              <g className="reveal__bot">
                <image
                  href={baseSrc}
                  x="0"
                  y="0"
                  width={W}
                  height={H}
                  preserveAspectRatio="xMidYMid slice"
                  filter={`url(#${duoId})`}
                />
                <rect width={W} height={H} fill={`url(#${gridId})`} style={{ mixBlendMode: 'screen' }} />
                <g fill="none" stroke="#59c8ff" strokeWidth="2" opacity="0.85">
                  <path d="M0 150H190L240 200H430" />
                  <path d="M756 560H560L510 510H340V420" />
                  <path d="M150 800V640L210 580" />
                  <path d="M610 0V110L550 170" />
                </g>
                <g fill="#59c8ff">
                  <circle cx="430" cy="200" r="8" />
                  <circle cx="340" cy="420" r="8" />
                  <circle cx="210" cy="580" r="8" />
                  <circle cx="550" cy="170" r="8" />
                </g>
                <g fill="none" stroke="#f6ecdd" strokeWidth="4">
                  <path d="M120 150V110H160" />
                  <path d="M636 150V110H596" />
                  <path d="M120 650V690H160" />
                  <path d="M636 650V690H596" />
                </g>
                <text x={W / 2} y="700" textAnchor="middle" fill="#f6ecdd" fontFamily="Nunito, sans-serif" fontWeight="700" fontSize="24" letterSpacing="2">
                  SYS://KABILAN.AI
                </text>
              </g>
            )}
          </g>
          <circle ref={ringRef} className="reveal__ring" cx={W / 2} cy={H / 2} r="0" fill="none" />
        </svg>
        </div>
      </div>
      <span className="reveal__hint" aria-hidden="true">
        {touchCopy ? 'Tap or drag to meet my robot twin' : 'Hover to meet my robot twin'}
      </span>
    </>
  );
}

export default RevealPortrait;
