import { useEffect, useState, useRef } from "react";
import brandLogo from "../assets/image.png";
import "./PageLoader.css";

const STATUS_MESSAGES = [
  "INITIALIZING CODE RUNTIME...",
  "COMPILING MERN ARCHITECTURE...",
  "SYNCING CONCEPT EPISODES...",
  "READY TO BUILD THE FUTURE.",
];

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);
  const [visible, setVisible] = useState(true);
  const [rendered, setRendered] = useState(true);
  const cycleIdRef = useRef(0);

  // Smooth realistic progress counter & status progression
  useEffect(() => {
    const currentCycle = ++cycleIdRef.current;
    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds loading sequence

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 35) {
        setStatusText(STATUS_MESSAGES[0]);
      } else if (pct < 70) {
        setStatusText(STATUS_MESSAGES[1]);
      } else if (pct < 95) {
        setStatusText(STATUS_MESSAGES[2]);
      } else {
        setStatusText(STATUS_MESSAGES[3]);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          if (cycleIdRef.current === currentCycle) {
            setVisible(false);
            setTimeout(() => {
              if (cycleIdRef.current === currentCycle) {
                setRendered(false);
              }
            }, 550);
          }
        }, 300);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  // Strict viewport freeze: lock body scroll while loader is visible
  useEffect(() => {
    if (visible) {
      document.documentElement.classList.add("page-loading");
      document.body.classList.add("page-loading");
      window.scrollTo(0, 0);

      const preventDefault = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const preventKeys = (e) => {
        if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      window.addEventListener("wheel", preventDefault, { passive: false, capture: true });
      window.addEventListener("touchmove", preventDefault, { passive: false, capture: true });
      window.addEventListener("scroll", preventDefault, { passive: false, capture: true });
      window.addEventListener("keydown", preventKeys, { passive: false, capture: true });

      return () => {
        document.documentElement.classList.remove("page-loading");
        document.body.classList.remove("page-loading");
        window.removeEventListener("wheel", preventDefault, { capture: true });
        window.removeEventListener("touchmove", preventDefault, { capture: true });
        window.removeEventListener("scroll", preventDefault, { capture: true });
        window.removeEventListener("keydown", preventKeys, { capture: true });
      };
    } else {
      document.documentElement.classList.remove("page-loading");
      document.body.classList.remove("page-loading");
    }
  }, [visible]);

  if (!rendered) return null;

  return (
    <div
      className={`page-loader-overlay${!visible ? " fade-out" : ""}`}
      aria-hidden={!visible}
      aria-label="Loading Learn with Jackie & Juli"
    >
      <div className="page-loader-bg-grid" aria-hidden="true" />

      <div className="page-loader-stage">
        {/* Holographic Orbital Reactor Core */}
        <div className="orbital-core">
          <div className="orbital-ring-outer" />
          <div className="orbital-ring-mid" />
          <div className="orbital-ring-inner">
            <span className="orbital-node" />
          </div>

          <div className="orbital-center">
            <img
              src={brandLogo}
              alt="Learn with Jackie & Juli Emblem"
              className="orbital-logo"
            />
          </div>

          <div className="orbital-code-tag">&lt;/&gt;</div>
        </div>

        {/* Brand Information */}
        <div className="page-loader-brand">
          <div className="page-loader-title">
            <span className="title-eyebrow">LEARN WITH</span>
            <span className="title-name">
              <span className="name-white">Jackie</span> <span className="amp">&amp;</span>{" "}
              <span className="name-crimson">Juli</span>
            </span>
          </div>
          <span className="page-loader-subtitle">UNDERSTAND IT · BUILD THE FUTURE</span>

          {/* High-Tech Metrics & Progress */}
          <div className="page-loader-metrics">
            <div className="page-loader-counter">{progress}%</div>
            <div className="page-loader-status">
              <span className="dot">✦</span> {statusText}
            </div>

            <div className="page-loader-progress-track">
              <div
                className="page-loader-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
