import { useRef } from "react";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Glossy 3D tilt card component */
export default function Tilt({ className = "", style, children }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="tilt-inner">{children}</div>
    </div>
  );
}
