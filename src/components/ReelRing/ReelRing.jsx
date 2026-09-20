import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import "./ReelRing.css";

import imgAuth from "../../assets/Authentication vs Authorization Essentials.png";
import imgPassword from "../../assets/Password Hashing_ Store Safe, Stay Secure.png";
import imgGit from "../../assets/MERN Series EP 13_ Git & GitHub(1).png";
import imgCDN from "../../assets/CDN Explained_ Global Speed and Reach.png";
import imgCaching from "../../assets/MERN Series_ Caching Explained.png";

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";

const REELS = [
  {
    id: "ep-10",
    ep: "EP 10",
    number: "10",
    tag: "Security & Auth",
    title: "Authentication vs Authorization",
    tamilHook: "Login panrathu onnu... Access kudupathu innonnu...!",
    desc: "Who are you? vs What can you do? Learn how login verification differs from role-based access permissions, explained with everyday analogies.",
    takeaways: [
      "Authentication: Verifies identity (Email & Password, JWT)",
      "Authorization: Checks permissions (Admin vs User settings)",
      "Secure Tokens: Protecting routes in Express.js & Node",
    ],
    img: imgAuth,
    accent: "#D9202A",
    glow: "rgba(217, 32, 42, 0.35)",
  },
  {
    id: "ep-11",
    ep: "EP 11",
    number: "11",
    tag: "Data Protection",
    title: "Password Hashing",
    tamilHook: "Store Safe, Stay Secure! Never Store Plain Text Passwords",
    desc: "Why raw passwords must never touch your database. Discover how cryptographic salts and one-way hashing keep user data safe even if servers get breached.",
    takeaways: [
      "Never store plain text passwords in your database",
      "One-Way Hashing: Irreversible cryptographic transforms",
      "Salting & bcrypt: Preventing rainbow table attacks",
    ],
    img: imgPassword,
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.35)",
  },
  {
    id: "ep-13",
    ep: "EP 13",
    number: "13",
    tag: "Version Control",
    title: "Git & GitHub",
    tamilHook: "Track • Commit • Push • Collaborate — Code Together, Grow Together!",
    desc: "Stop worrying about breaking your codebase. Master the full lifecycle of version control: edit, stage, commit, push, and team collaboration.",
    takeaways: [
      "The 4-step workflow: Edit → Add → Commit → Push",
      "Safe branching & merging without panic",
      "Collaborative coding with remote GitHub repositories",
    ],
    img: imgGit,
    accent: "#FF5722",
    glow: "rgba(255, 87, 34, 0.35)",
  },
  {
    id: "ep-14",
    ep: "EP 14",
    number: "14",
    tag: "System Design",
    title: "CDN Na Enna?! (Content Delivery Network)",
    tamilHook: "Same Content, Faster to Everyone — Global Speed & Reach",
    desc: "Why should a user in Chennai wait for a server in California? See how CDN edge servers distribute assets worldwide for blazing-fast page loads.",
    takeaways: [
      "Origin Server vs Worldwide Edge Servers",
      "Dramatically reduced latency & lower server load",
      "Automatic caching of images, scripts, and video assets",
    ],
    img: imgCDN,
    accent: "#2563EB",
    glow: "rgba(37, 99, 235, 0.35)",
  },
  {
    id: "ep-15",
    ep: "EP 15",
    number: "15",
    tag: "Web Performance",
    title: "What is Caching? Store Now, Load Faster",
    tamilHook: "First Time (Slower) • Next Time (Instant!) — Happier Users",
    desc: "How caching supercharges modern web applications. Instead of running expensive database queries repeatedly, retrieve responses instantly from high-speed memory.",
    takeaways: [
      "First time fetch vs instant cached response",
      "Browser cache, CDN cache, and Redis memory cache",
      "Optimizing response times from 800ms down to 10ms",
    ],
    img: imgCaching,
    accent: "#9333EA",
    glow: "rgba(147, 51, 234, 0.35)",
  },
];

export default function ReelRing() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxImg(null);
    };
    if (lightboxImg) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxImg]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % REELS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + REELS.length) % REELS.length);
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section className="section reels-ring-section" id="reels">
      {/* Ambient glow */}
      <div className="reels-ambient-glow" aria-hidden="true" />

      {/* Section Header */}
      <div className="section-head reveal">
        <div className="reels-pill">
          <span className="dot">✦</span> MERN SERIES — FRESH FROM THE FEED
        </div>
        <h2>Real Lessons from Our Instagram</h2>
        <p>
          Visual, story-driven MERN Series episodes explained simply in Tamil &amp; Tanglish.
          Swipe or hover to pause &mdash; click any card to watch the full episode on Instagram.
        </p>
      </div>

      {/* 3D Rotating Ring Stage with Mobile Touch Swipe */}
      <div
        className="ring-stage reveal"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Navigation Arrows */}
        <button
          type="button"
          className="ring-nav-btn ring-nav-prev"
          onClick={handlePrev}
          aria-label="Previous Reel"
        >
          <Icon name="chevron-left" size={20} />
        </button>

        <button
          type="button"
          className="ring-nav-btn ring-nav-next"
          onClick={handleNext}
          aria-label="Next Reel"
        >
          <Icon name="chevron-right" size={20} />
        </button>

        {/* The 3D Ring Cylinder */}
        <div
          className={`ring ${isPaused ? "ring-paused" : ""}`}
          style={{
            "--rotation-offset": `${-activeIdx * 72}deg`,
          }}
        >
          {REELS.map((r, i) => {
            const isCurrent = i === activeIdx;
            return (
              <div
                key={r.id}
                className={`panel panel-img ${isCurrent ? "panel-active" : ""}`}
                style={{
                  "--i": i,
                  "--c1": r.accent,
                }}
                onClick={() => setActiveIdx(i)}
              >
                {/* Real High-Resolution Reel Cover Image */}
                <img
                  src={r.img}
                  alt={`${r.ep} - ${r.title}`}
                  className="panel-reel-img"
                  loading="lazy"
                />

                {/* Top Subtle Tag Pill */}
                <div className="panel-top-pill">
                  <span className="panel-ep-badge">{r.ep}</span>
                  <span className="panel-tag-mini">{r.tag}</span>
                </div>

                {/* Minimal Bottom Gradient Bar with Actions */}
                <div className="panel-img-overlay">
                  <div className="panel-overlay-caption">
                    <span className="panel-title-mini">{r.title}</span>
                    <span className="panel-hook-mini">{r.tamilHook}</span>
                  </div>

                  <div className="panel-actions">
                    <button
                      type="button"
                      className="panel-action-btn panel-action-zoom"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImg(r);
                      }}
                      title="View Full High-Resolution Infographic"
                    >
                      <Icon name="maximize" size={14} /> Zoom
                    </button>
                    <a
                      href={IG_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="panel-action-btn panel-action-ig"
                      onClick={(e) => e.stopPropagation()}
                      title="Watch Reel on Instagram"
                    >
                      <Icon name="insta" size={14} /> Watch Reel
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ring-floor" aria-hidden="true" />
      </div>

      {/* Full-Screen High-Resolution Infographic Lightbox Modal */}
      {lightboxImg && (
        <div
          className="reel-lightbox-backdrop"
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="reel-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="reel-lightbox-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Close Preview"
            >
              <Icon name="close" size={20} />
            </button>

            <div className="reel-lightbox-body">
              <div className="reel-lightbox-image-wrap">
                <img
                  src={lightboxImg.img}
                  alt={lightboxImg.title}
                  className="reel-lightbox-img"
                />
              </div>

              <div className="reel-lightbox-info">
                <div className="lightbox-tag-row">
                  <span className="panel-ep-badge" style={{ background: lightboxImg.accent }}>
                    {lightboxImg.ep}
                  </span>
                  <span className="panel-tag-mini">{lightboxImg.tag}</span>
                </div>

                <h3 className="lightbox-title">{lightboxImg.title}</h3>
                <p className="lightbox-hook">{lightboxImg.tamilHook}</p>
                <p className="lightbox-desc">{lightboxImg.desc}</p>

                <div className="lightbox-takeaways">
                  <h4>What you'll master:</h4>
                  <ul>
                    {lightboxImg.takeaways.map((item, idx) => (
                      <li key={idx}>
                        <span style={{ color: lightboxImg.accent }}>✦</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lightbox-footer-cta">
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-crimson w-full"
                  >
                    <Icon name="insta" size={18} /> Watch this Reel on Instagram
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost w-full"
                    onClick={() => setLightboxImg(null)}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
