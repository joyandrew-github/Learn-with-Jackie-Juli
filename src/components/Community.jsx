import Icon from "./Icon";
import brandLogo from "../assets/image.png";

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";
const IG_HANDLE = "@learn_with_jackie_juli";

export default function Community() {
  return (
    <section className="section community-section" id="community">
      <div className="community-ambient-glow" aria-hidden="true" />

      {/* Header */}
      <div className="section-head reveal">
        <div className="community-pill">
          <span className="community-pill-dot" />
          <span>GLOBAL DEVELOPER GUILD</span>
        </div>
        <h2>Join 50,000+ Developers Building the Future</h2>
        <p>
          Coding is 10x faster when you learn together. Get unblocked, showcase your weekend
          builds, and master modern tech alongside builders worldwide.
        </p>
      </div>

      {/* Grand Brand Showcase Banner with User Logo */}
      <div className="community-hero-banner glass reveal">
        <div className="community-hero-emblem-wrap">
          <div className="community-emblem-halo" aria-hidden="true" />
          <div className="community-emblem-border">
            <img
              src={brandLogo}
              alt="Learn with Jackie & Juli Official Emblem"
              className="community-emblem-img"
            />
          </div>
          <div className="community-emblem-badge">
            <span className="badge-pulse" />
            <span>OFFICIAL GUILD</span>
          </div>
        </div>

        <div className="community-hero-content">
          <div className="community-hero-tag">UNDERSTAND IT • BUILD THE FUTURE</div>
          <h3 className="community-hero-title">
            The Martial Arts of Clean Code &amp; Modern Architecture
          </h3>
          <p className="community-hero-desc">
            Created by Jackie &amp; Juli to cut through the noise of bloated tutorials.
            Whether you are on Instagram, Discord, or GitHub, you will find a welcoming space to
            sharpen your craft every single day.
          </p>

          <div className="community-hero-stats">
            <div className="community-stat-block">
              <span className="community-stat-num">50K+</span>
              <span className="community-stat-lbl">Active Learners</span>
            </div>
            <div className="community-stat-block">
              <span className="community-stat-num">120+</span>
              <span className="community-stat-lbl">Micro Lessons</span>
            </div>
            <div className="community-stat-block">
              <span className="community-stat-num">98%</span>
              <span className="community-stat-lbl">Positive Feedback</span>
            </div>
            <div className="community-stat-block">
              <span className="community-stat-num">Free</span>
              <span className="community-stat-lbl">Always Open</span>
            </div>
          </div>

          <div className="community-hero-actions">
            <a
              className="btn btn-primary"
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="insta" size={18} /> Join on Instagram {IG_HANDLE}
            </a>
            <a
              className="btn btn-ghost"
              href="https://discord.gg"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="discord" size={18} /> Join Discord Code Lounge
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
