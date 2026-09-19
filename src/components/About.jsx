import Icon from "./Icon";
import brandLogo from "../assets/image.png";
import jackieJuliImg from "../assets/Jackie-Juli.png";

const PILLARS = [
  {
    icon: "spark",
    accent: "var(--crimson)",
    title: "Tamil & Tanglish First",
    desc: "No gatekeeping or unnecessary jargon. We explain complex technical concepts in friendly Tamil and Tanglish, making tech truly accessible to everyone.",
  },
  {
    icon: "play",
    accent: "var(--gold)",
    title: "Bite-Sized to Deep-Dive",
    desc: "From 60-second Instagram reels that spark curiosity to guided step-by-step topics, learn at your own pace one solid idea at a time.",
  },
  {
    icon: "code",
    accent: "var(--cobalt)",
    title: "Real-World Engineering",
    desc: "We focus on what actually matters in modern tech: clean code, scalable databases, APIs, full-stack workflows, and emerging AI tools.",
  },
  {
    icon: "community",
    accent: "var(--ember)",
    title: "Community & Mentorship",
    desc: "You're never learning alone. Join thousands of enthusiastic learners and mentors sharing questions, insights, and career growth.",
  },
];

export default function About() {
  return (
    <section className="section about-section" id="about">
      {/* 2-Column Hero Story: Mission Copy + Character Illustration */}
      <div className="about-hero-grid">
        <div className="about-hero-text reveal">
          <div className="about-pill">
            <span className="dot">✦</span> WHO WE ARE &amp; OUR MISSION
          </div>
          <h2>Demystifying Tech. Empowering Learners.</h2>
          <p className="about-lede">
            Technology shouldn't feel intimidating. We started <strong>Jackie &amp; Juli</strong> to
            replace complex technical jargon with crystal-clear, relatable explanations in Tamil &amp;
            Tanglish — helping you understand modern IT and confidently build the future.
          </p>

          <div className="about-highlights">
            <div className="about-highlight-item glass">
              <span className="highlight-num">100+</span>
              <span className="highlight-label">Concept Reels</span>
            </div>
            <div className="about-highlight-item glass">
              <span className="highlight-num">1.6K+</span>
              <span className="highlight-label">Community</span>
            </div>
            <div className="about-highlight-item glass">
              <span className="highlight-num">100%</span>
              <span className="highlight-label">Tamil &amp; Tanglish</span>
            </div>
          </div>
        </div>

        <div className="about-image-card glass reveal" style={{ "--d": "0.15s" }}>
          <div className="about-image-wrapper">
            <img
              src={jackieJuliImg}
              alt="Jackie and Juli teaching tech concepts"
              className="about-image"
              loading="lazy"
            />
            <div className="about-image-gradient" />
            <div className="about-image-badge">
              <span className="badge-tag">CREATORS &amp; MENTORS</span>
              <span className="badge-name">Jackie &amp; Juli</span>
              <span className="badge-desc">Demystifying Tech in Tamil &amp; Tanglish</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Bento */}
      <div className="about-bento">
        {PILLARS.map((pillar, idx) => (
          <div
            className="about-card glass reveal"
            key={pillar.title}
            style={{ "--accent": pillar.accent, "--d": `${idx * 0.1}s` }}
          >
            <div className="about-card-icon" style={{ borderColor: pillar.accent }}>
              <Icon name={pillar.icon} size={22} />
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Philosophy Quote Card */}
      <div className="about-quote-card glass reveal" style={{ "--d": "0.4s" }}>
        <div className="about-quote-mark">
          <div className="about-quote-logo-frame">
            <img
              src={brandLogo}
              alt="Learn with Jackie & Juli Official Logo"
              className="about-quote-logo"
            />
          </div>
        </div>
        <div className="about-quote-content">
          <p className="about-quote-tag">THE PHILOSOPHY</p>
          <blockquote className="about-quote-text">
            “Tech Today, A Better Tomorrow. Every expert was once a beginner who didn't give up.
            Let's understand it together, build real things, and grow together.”
          </blockquote>
          <div className="about-quote-author">
            — <strong>Jackie &amp; Juli</strong> Mentorship Collective
          </div>
        </div>
        <div className="about-quote-actions">
          <a className="btn btn-sm" href="#teach">
            Explore Topics <Icon name="arrow-right" size={14} />
          </a>
          <a className="btn btn-sm btn-ghost" href="#community">
            Join Community
          </a>
        </div>
      </div>
    </section>
  );
}
