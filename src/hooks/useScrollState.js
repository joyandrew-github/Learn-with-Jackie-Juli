import { useState, useEffect } from "react";

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Writes scroll position to --sy and scroll progress (0..1) to --p,
 * and reports whether the page has scrolled past the top.
 */
export default function useScrollState() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const animate = !reduceMotion();
    let raf = 0;

    const write = () => {
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      if (animate) root.style.setProperty("--sy", String(Math.min(y, 1200)));
      root.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
      setScrolled(y > 35);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return scrolled;
}
