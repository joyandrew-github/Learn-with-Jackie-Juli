import { useState } from "react";
import Icon from "./Icon";
import brandLogo from "../assets/image.png";

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";
const IG_HANDLE = "@learn_with_jackie_juli";

// const HUBS = [
//   {
//     id: "instagram",
//     icon: "insta",
//     badge: "FLAGSHIP • DAILY REELS",
//     title: IG_HANDLE,
//     metric: "50,000+ Developers",
//     desc: "Daily 60-second concept reels, bite-sized carousels, and interactive Q&As on stories every week.",
//     btnText: "Follow on Instagram",
//     btnUrl: IG_URL,
//     accent: "crimson",
//     isPrimary: true,
//   },
//   {
//     id: "discord",
//     icon: "discord",
//     badge: "LIVE CHAT • 24/7",
//     title: "Jackie & Juli Discord",
//     metric: "12,400+ Members • 850 Online",
//     desc: "Get unblocked fast. Dedicated channels for React, Node, AI dev, resume feedback, and weekly voice hangouts.",
//     btnText: "Join Discord Guild",
//     btnUrl: "https://discord.gg",
//     accent: "cobalt",
//     isPrimary: false,
//   },
//   {
//     id: "github",
//     icon: "github",
//     badge: "OPEN SOURCE",
//     title: "Jackie-Juli-Labs",
//     metric: "35+ Repos • 4.8k Stars",
//     desc: "Cloneable production boilerplates, lab starter kits, and interactive markdown cheatsheet guides.",
//     btnText: "Explore Repos",
//     btnUrl: "https://github.com",
//     accent: "gold",
//     isPrimary: false,
//   },
//   {
//     id: "codex",
//     icon: "send",
//     badge: "WEEKLY DIGEST",
//     title: "The Weekly Codex",
//     metric: "18,500+ Readers",
//     desc: "Every Sunday: curated modern web architecture, AI tool breakdowns, and exclusive cheat sheets.",
//     btnText: "Subscribe Free",
//     btnUrl: "#community",
//     accent: "ember",
//     isPrimary: false,
//     isNewsletter: true,
//   },
// ];

// const PERKS = [
//   {
//     icon: "zap",
//     title: "Daily Micro-Challenges",
//     desc: "Quick 10-minute code puzzles designed to build muscle memory without exhausting your schedule.",
//   },
//   {
//     icon: "community",
//     title: "Direct Mentor Access",
//     desc: "Ask questions and get practical answers from Jackie, Juli, and experienced senior engineers.",
//   },
//   {
//     icon: "code",
//     title: "Peer Code Reviews",
//     desc: "Post your repositories and PRs in the guild to get actionable feedback before shipping to production.",
//   },
//   {
//     icon: "star",
//     title: "Story Feature Spotlight",
//     desc: "Ship a cool lab project and get featured on the official Instagram stories to 50,000+ developers.",
//   },
// ];

// const VOICES = [
//   {
//     name: "Alex Chen",
//     role: "Frontend Engineer",
//     avatar: "AC",
//     quote:
//       "Jackie & Juli's 60s breakdowns explained React Actions and Server Components better than a 5-hour video course. Shipped my portfolio app in one weekend!",
//     handle: "@alexchen_dev",
//   },
//   {
//     name: "Priya Sharma",
//     role: "Full-Stack Builder",
//     avatar: "PS",
//     quote:
//       "The Discord community helped me debug an async race condition in 10 minutes. The mindset shift from 'watching' to 'building' got me my first junior developer offer.",
//     handle: "@priyacodes",
//   },
//   {
//     name: "Marcus Vance",
//     role: "Self-Taught Developer",
//     avatar: "MV",
//     quote:
//       "No gatekeeping, no 40-hour lectures, no jargon. Just clean mental models and real code that actually works in production. Best dev account on the internet.",
//     handle: "@vance_builds",
//   },
// ];

export default function Community() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 3000);
    }
  };

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

      {/* Multi-Channel Hub Cards */}
      <div className="community-hubs-grid">
        {HUBS.map((hub) => (
          <div
            key={hub.id}
            className={`community-hub-card glass reveal ${hub.isPrimary ? "hub-card-primary" : ""
              }`}
          >
            <div className="hub-card-header">
              <div className={`hub-icon-wrap hub-icon-${hub.accent}`}>
                <Icon name={hub.icon} size={22} />
              </div>
              <span className={`hub-badge hub-badge-${hub.accent}`}>{hub.badge}</span>
            </div>

            <h3 className="hub-title">{hub.title}</h3>
            <div className="hub-metric">{hub.metric}</div>
            <p className="hub-desc">{hub.desc}</p>

            {hub.isNewsletter ? (
              <form onSubmit={handleSubscribe} className="hub-newsletter-form">
                {subscribed ? (
                  <div className="hub-subscribed-msg">
                    <Icon name="check" size={16} /> Subscribed! Welcome to the Codex.
                  </div>
                ) : (
                  <>
                    <input
                      type="email"
                      placeholder="your.email@dev.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="hub-input"
                    />
                    <button type="submit" className="btn btn-sm hub-btn">
                      <Icon name="send" size={14} /> Subscribe
                    </button>
                  </>
                )}
              </form>
            ) : (
              <a
                href={hub.btnUrl}
                target="_blank"
                rel="noreferrer"
                className={`btn btn-sm ${hub.isPrimary ? "btn-primary" : "btn-ghost"} hub-btn`}
              >
                <span>{hub.btnText}</span>
                <Icon name="arrow-right" size={14} />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Community Perks Grid */}
      <div className="community-perks-section reveal">
        <div className="community-perks-header">
          <span className="perks-badge">MEMBERSHIP PRIVILEGES</span>
          <h3 className="perks-title">Everything You Gain in the Guild</h3>
          <p className="perks-desc">
            No subscription fees. Joining our platforms gives you immediate access to our
            arsenal of developer resources.
          </p>
        </div>

        <div className="community-perks-grid">
          {PERKS.map((perk) => (
            <div key={perk.title} className="community-perk-card glass">
              <div className="perk-icon-wrap">
                <Icon name={perk.icon} size={20} />
              </div>
              <h4 className="perk-card-title">{perk.title}</h4>
              <p className="perk-card-desc">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Member Voices / Testimonials */}
      <div className="community-voices-section reveal">
        <div className="voices-header">
          <span className="voices-badge">COMMUNITY VOICES</span>
          <h3 className="voices-title">Loved by Builders Across the Globe</h3>
        </div>

        <div className="community-voices-grid">
          {VOICES.map((v) => (
            <div key={v.name} className="community-voice-card glass">
              <div className="voice-stars">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="star" size={14} />
                ))}
              </div>
              <p className="voice-quote">“{v.quote}”</p>
              <div className="voice-author">
                <div className="voice-avatar">{v.avatar}</div>
                <div>
                  <div className="voice-name">{v.name}</div>
                  <div className="voice-meta">
                    {v.role} • <span className="voice-handle">{v.handle}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
