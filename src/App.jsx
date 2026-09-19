import { useEffect, useRef, useState } from "react";
import "./App.css";
import PageLoader from "./components/PageLoader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Topics from "./components/Topics";
import HowItWorks from "./components/HowItWorks";
import ReelRing from "./components/ReelRing";
import Community from "./components/Community";
import brandLogo from "./assets/image.png";

/* ------------------------------------------------------------------ */
/*  Copy & Constants                                                  */
/* ------------------------------------------------------------------ */
const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";
const IG_HANDLE = "@learn_with_jackie_juli";



/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Writes scroll position to --sy and scroll progress (0..1) to --p,
 * and reports whether the page has scrolled past the top.
 */
function useScrollState() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const animate = !reduceMotion();
    let raf = 0;
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;

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

/** Adds `.in` to every `.reveal` element once it enters the viewport. */
function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll(".reveal"));

    if (reduceMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    root.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));

    const mo = new MutationObserver(() => {
      const newEls = document.querySelectorAll(".reveal:not(.in)");
      newEls.forEach((el) => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("js");
    };
  }, []);
}

/** Returns the id of the section currently in view (for the nav highlight). */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return active;
}



/* ------------------------------------------------------------------ */
/*  Glossy 3D tilt card                                                */
/* ------------------------------------------------------------------ */
function Tilt({ className = "", style, children }) {
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



/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
const SECTION_IDS = ["top", "about", "teach", "how", "reels", "community"];

export default function App() {
  const scrolled = useScrollState();
  const active = useScrollSpy(SECTION_IDS);
  useReveal();

  return (
    <>
      {/* ---------------- 3D Tower Page Loader ---------------- */}
      <PageLoader />

      <div className="progress" aria-hidden="true" />

      {/* ---------------- Nav ---------------- */}
      <Navbar scrolled={scrolled} active={active} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <Hero />

        {/* ---------------- About ---------------- */}
        <About />

        {/* ---------------- What we teach ---------------- */}
        <Topics />

        {/* ---------------- How it works ---------------- */}
        <HowItWorks />

        {/* ---------------- 3D Reel Ring ---------------- */}
        <ReelRing />

        {/* ---------------- Community Guild ---------------- */}
        <Community />
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-frame">
              <img src={brandLogo} alt="Learn with Jackie and Juli" className="footer-logo" />
            </div>
            <div>
              <div className="footer-brand-title">LEARN WITH JACKIE &amp; JULI</div>
              <div className="footer-brand-sub">Understand it. Build the future.</div>
            </div>
          </div>
          <div className="footer-nav">
            <a href="#about">About</a>
            <a href="#teach">Topics</a>
            <a href="#how">How It Works</a>
            <a href="#reels">Reels</a>
            <a href="#community">Community</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Learn with Jackie &amp; Juli. All rights reserved.</span>
          <a href={IG_URL} target="_blank" rel="noreferrer" className="footer-ig-link">
            Instagram: {IG_HANDLE}
          </a>
        </div>
      </footer>
    </>
  );
}

export { Navbar, Hero, About, Topics, HowItWorks, Community };