import React, { useCallback, useEffect, useId, useRef } from 'react';
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

const hasHover = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(hover: hover)').matches
    : true;

// Gooey trail reveal. Circles live in an SVG <mask> that runs through a goo filter
// (blur + alpha threshold), so they merge into one liquid blob. Everything is
// driven from requestAnimationFrame and written to the circles through refs, never
// through React state.
export function RevealPortrait({ portrait = profile.portrait }) {
  const { cartoon, robot } = portrait || {};
  const scene = !!cartoon;
  const { w: W, h: H } = scene ? SCENE : PHOTO;
  const uid = useId().replace(/:/g, '');
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef(null);
  const stageRef = useRef(null);
  const dotRefs = useRef([]);
  const ringRef = useRef(null);
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
      if (st.open < st.want) st.open = Math.min(st.want, st.open + dt / OPEN_MS);
      else if (st.open > st.want) st.open = Math.max(st.want, st.open - dt / CLOSE_MS);

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
    [render]
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

  const onEnter = (e) => {
    if (e.pointerType === 'touch') return;
    const st = sim.current;
    st.active = true;
    st.want = 1;
    // start the trail at the entry point so it does not streak in from the centre
    const [x, y] = toUnits(e.clientX, e.clientY);
    st.pts.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    st.init = true;
    aim(e.clientX, e.clientY);
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
  const onDown = (e) => {
    if (e.pointerType !== 'touch') return;
    const st = sim.current;
    st.active = true;
    st.want = 1;
    const [x, y] = toUnits(e.clientX, e.clientY);
    st.pts.forEach((p) => {
      p.x = x;
      p.y = y;
    });
    st.init = true;
    aim(e.clientX, e.clientY);
  };
  const close = () => {
    const st = sim.current;
    st.active = false;
    st.want = 0;
    kick();
  };

  // Gentle auto-wander when there is no hover (touch), unless motion is reduced.
  useEffect(() => {
    if (reduced || hasHover()) return undefined;
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
    };
  }, [reduced, kick, scene, W, H]);

  useEffect(() => {
    const st = sim.current;
    return () => {
      if (st.raf) window.cancelAnimationFrame(st.raf);
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
        onPointerEnter={onEnter}
        onPointerMove={onMove}
        onPointerLeave={close}
        onPointerDown={onDown}
        onPointerUp={(e) => e.pointerType === 'touch' && close()}
        onPointerCancel={(e) => e.pointerType === 'touch' && close()}
      >
        {/* Base image: real <img> so the alt text is in the accessibility tree. */}
        <div ref={stageRef} className="reveal__stage">
        <img
            className="reveal__base"
            src={baseSrc}
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
              <image href={robot} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
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
      {!reduced && (
        <span className="reveal__hint" aria-hidden="true">
          Hover to meet my robot twin
        </span>
      )}
    </>
  );
}

export default RevealPortrait;
