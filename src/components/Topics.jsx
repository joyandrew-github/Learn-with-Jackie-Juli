import { useState } from "react";
import Icon from "./Icon";

const CATEGORIES = [
  { id: "all", label: "All Tracks" },
  { id: "frontend", label: "Frontend & Web" },
  { id: "backend", label: "Backend & Data" },
  { id: "ai-tools", label: "AI & Modern Tools" },
];

const TRACKS = [
  {
    id: "web-core",
    category: "frontend",
    badge: "FOUNDATIONAL",
    count: "18+ Reels",
    title: "Web Core from Zero",
    blurb: "HTML5, modern CSS layouts, and JavaScript fundamentals taught with real-world analogies.",
    outcomes: [
      "Semantic HTML & responsive flex/grid layouts",
      "Modern ES6+ syntax, arrays, events & async",
      "Hands-on interactive browser projects",
    ],
    tags: ["HTML5", "CSS3", "JavaScript"],
    accent: "#EF3038",
    icon: "code",
  },
  {
    id: "react-ui",
    category: "frontend",
    badge: "MOST POPULAR",
    count: "24+ Reels",
    title: "React & Component Architecture",
    blurb: "Component-driven design, state management, and modern web patterns built step by step.",
    outcomes: [
      "Hooks, state management & component lifecycle",
      "Reusable component design & custom hooks",
      "Fast SPA development with modern build tools",
    ],
    tags: ["React 19", "Hooks", "Vite"],
    accent: "#2547C8",
    icon: "layers",
  },
  {
    id: "backend-apis",
    category: "backend",
    badge: "CORE SYSTEMS",
    count: "16+ Reels",
    title: "Backend & Scalable APIs",
    blurb: "Understand how servers process requests, authenticate users, and communicate with clients.",
    outcomes: [
      "RESTful API design, HTTP methods & middleware",
      "User authentication, tokens & security basics",
      "Error handling & asynchronous request pipelines",
    ],
    tags: ["Node.js", "Express", "REST APIs"],
    accent: "#FF6B35",
    icon: "db",
  },
  {
    id: "databases",
    category: "backend",
    badge: "PRACTICAL DATA",
    count: "14+ Reels",
    title: "Databases That Make Sense",
    blurb: "Relational tables vs document stores, writing efficient queries, and data persistence.",
    outcomes: [
      "Schema modeling & table relationships",
      "Writing clean queries & filtering data",
      "Connecting databases to real application backends",
    ],
    tags: ["PostgreSQL", "SQL", "MongoDB"],
    accent: "#FFC21A",
    icon: "db",
  },
  {
    id: "ai-apis",
    category: "ai-tools",
    badge: "EMERGING TECH",
    count: "12+ Reels",
    title: "AI Tools & Applied APIs",
    blurb: "Demystifying modern AI, structured prompting, and building smart software with APIs.",
    outcomes: [
      "Calling LLM APIs with structured inputs/outputs",
      "Practical prompt engineering for developers",
      "Integrating AI assistance into real web apps",
    ],
    tags: ["LLM APIs", "Prompting", "AI Tools"],
    accent: "#EF3038",
    icon: "spark",
  },
  {
    id: "dev-tools",
    category: "ai-tools",
    badge: "ESSENTIAL WORKFLOW",
    count: "15+ Reels",
    title: "Developer Tools & Git",
    blurb: "Version control without fear, terminal confidence, and deploying your projects online.",
    outcomes: [
      "Git branching, commits, merges & pull requests",
      "Command line fundamentals & package managers",
      "Zero-config cloud deployments with Vercel/GitHub",
    ],
    tags: ["Git", "GitHub", "Terminal"],
    accent: "#2547C8",
    icon: "code",
  },
];

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";

export default function Topics() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTracks =
    activeCategory === "all"
      ? TRACKS
      : TRACKS.filter((t) => t.category === activeCategory);

  return (
    <section className="section topics-section" id="teach">
      <div className="section-head reveal">
        <div className="topics-pill">
          <span className="dot">✦</span> CURATED LEARNING TRACKS
        </div>
        <h2>Master Modern Tech, Step by Step.</h2>
        <p className="topics-subtitle">
          Structured learning roadmaps built for real-world engineering. From foundational syntax
          to production software architecture — explained simply in Tamil &amp; Tanglish.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="topics-filters reveal">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`topics-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.id)}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      <div className="topics-grid">
        {filteredTracks.map((track, i) => (
          <div
            key={track.id}
            className="topic-card glass"
            style={{ "--accent": track.accent, "--d": `${i * 0.08}s` }}
          >
            <div className="topic-card-header">
              <span className="topic-badge">{track.badge}</span>
              <span className="topic-count">{track.count}</span>
            </div>

            <div className="topic-icon-wrap" style={{ borderColor: track.accent }}>
              <Icon name={track.icon} size={22} />
            </div>

            <h3 className="topic-title">{track.title}</h3>
            <p className="topic-blurb">{track.blurb}</p>

            <ul className="topic-outcomes">
              {track.outcomes.map((item) => (
                <li key={item}>
                  <span className="outcome-check">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <ul className="tags">
              {track.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className="topic-footer">
              <a
                className="topic-action-link"
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
              >
                <span>Watch Lessons</span>
                <Icon name="arrow-right" size={15} />
              </a>
              <span className="topic-lang-badge">Tamil &amp; Tanglish</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Track Banner */}
      <div className="topics-bottom-banner glass reveal">
        <div className="topics-banner-text">
          <h4>Looking for a topic not listed here?</h4>
          <p>We drop fresh concept reels every week based on community requests and emerging tech.</p>
        </div>
        <a className="btn btn-sm" href={IG_URL} target="_blank" rel="noreferrer">
          <Icon name="insta" size={16} /> Request a Topic on Instagram
        </a>
      </div>
    </section>
  );
}
