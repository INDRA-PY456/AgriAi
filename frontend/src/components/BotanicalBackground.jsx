/**
 * Decorative, non-interactive background layer: a dense grid of faint botanical
 * line icons (leaves, sprouts, blooms, wheat, tendrils) covering the whole
 * viewport. Normally barely visible; when the cursor moves near a symbol it
 * smoothly brightens and gains a soft glow. Proximity is detected at the
 * window level, so every symbol responds even when it sits behind a card or
 * button. Pure presentation — no app logic, safe to remove.
 */

import { useEffect, useRef, useState } from "react";

const ICONS = {
  leaf: (
    <>
      <path d="M4.5 19.5C4.5 11 11 4.5 19.5 4.5c0 8.5-6.5 15-15 15Z" />
      <path d="M4.5 19.5C8.5 14.5 12.5 10.5 18 6.5" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 22v-9" />
      <path d="M12 13c0-5.5-4-8.5-9-8.5 0 5.5 4 8.5 9 8.5Z" />
      <path d="M12 10.5c0-4.5 3-7 7.5-7 0 4.5-3 7-7.5 7Z" />
    </>
  ),
  bloom: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.6 5.6l3.2 3.2M15.2 15.2l3.2 3.2M18.4 5.6l-3.2 3.2M8.8 15.2l-3.2 3.2" />
    </>
  ),
  wheat: (
    <>
      <path d="M12 22V5" />
      <path d="M12 6c-2.5 0-4 1.6-4 4.2 2.5 0 4-1.6 4-4.2Z" />
      <path d="M12 10.4c-2.5 0-4 1.6-4 4.2 2.5 0 4-1.6 4-4.2Z" />
      <path d="M12 14.8c2.5 0 4 1.6 4 4.2-2.5 0-4-1.6-4-4.2Z" />
      <path d="M12 19.2c2.5 0 4 1.6 4 4.2-2.5 0-4-1.6-4-4.2Z" />
    </>
  ),
  vine: (
    <>
      <path d="M3.5 20.5C3.5 12 9.5 6 17.5 3.5c-1.5 6.5-5 10.5-11 12.5" />
      <circle cx="17.5" cy="3.5" r="1.3" />
    </>
  ),
  seed: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
};

const TYPES = Object.keys(ICONS);
const GLOWS = ["glow-emerald", "glow-amber", "glow-sky", "glow-teal"];
const SPACING = 150; // px between grid points
const HOVER_RADIUS = 120; // px around a symbol center that triggers the glow

/* Deterministic pseudo-random number in [0, 1) from a seed */
const rand = (seed) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/* Build a grid of symbols that covers the entire viewport, with organic jitter */
function generateLayout() {
  const { innerWidth: width, innerHeight: height } = window;
  const cols = Math.ceil(width / SPACING);
  const rows = Math.ceil(height / SPACING);
  const symbols = [];
  let i = 0;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = c * SPACING + (r % 2 ? SPACING / 2 : 0) + (rand(i * 2) - 0.5) * 44;
      const y = r * SPACING + (rand(i * 2 + 1) - 0.5) * 44;
      symbols.push({
        id: i,
        type: TYPES[Math.floor(rand(i * 2 + 2) * TYPES.length)],
        glow: GLOWS[Math.floor(rand(i * 2 + 5) * GLOWS.length)],
        x,
        y,
        size: 30 + rand(i * 2 + 3) * 36,
        rotate: (rand(i * 2 + 4) - 0.5) * 70,
      });
      i += 1;
    }
  }
  return symbols;
}

export default function BotanicalBackground() {
  const layerRef = useRef(null);
  const [symbols, setSymbols] = useState([]);

  // Lay out the grid for the current viewport; re-lay out (debounced) on resize.
  useEffect(() => {
    const compute = () => setSymbols(generateLayout());
    compute();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(compute, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Cursor proximity: brighten any symbol within HOVER_RADIUS of the pointer.
  useEffect(() => {
    if (symbols.length === 0) return undefined;

    const els = layerRef.current.querySelectorAll("[data-symbol]");
    let rafId = 0;

    const clearAll = () => {
      for (const el of els) el.classList.remove("is-active");
    };

    const handleMove = (e) => {
      if (rafId) return; // rAF-throttled: at most one pass per frame
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const { clientX: mx, clientY: my } = e;

        if (mx < 0 || my < 0 || mx > window.innerWidth || my > window.innerHeight) {
          clearAll();
          return;
        }

        const r2 = HOVER_RADIUS * HOVER_RADIUS;
        for (const el of els) {
          const dx = Number(el.dataset.x) - mx;
          const dy = Number(el.dataset.y) - my;
          el.classList.toggle("is-active", dx * dx + dy * dy <= r2);
        }
      });
    };

    const handleBlur = () => clearAll();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("blur", handleBlur);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [symbols]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {symbols.map((s) => {
        const Icon = ICONS[s.type];
        return (
          <span
            key={s.id}
            data-symbol
            data-x={Math.round(s.x)}
            data-y={Math.round(s.y)}
            className={`absolute flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center ${s.glow}`}
            style={{ left: s.x, top: s.y }}
          >
            <span
              className="relative flex items-center justify-center"
              style={{ transform: `rotate(${s.rotate}deg)` }}
            >
              <span className="botanical-glow absolute inset-0 rounded-full" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="botanical-symbol relative"
                style={{ width: s.size, height: s.size }}
              >
                {Icon}
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}
