import Icon from "../common/Icon";
import "./Hero.css";

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";

const FLOATING_CARDS = [
  { icon: "code", label: "Code", x: "40%", y: "30%", delay: 0 },
  { icon: "spark", label: "Learn", x: "60%", y: "10%", delay: 0.15 },
  { icon: "layers", label: "Build", x: "90%", y: "22%", delay: 0.3 },
  { icon: "db", label: "Grow", x: "90%", y: "52%", delay: 0.45 },
  { icon: "community", label: "Community", x: "70%", y: "80%", delay: 0.6 },
];

const STATS = [
  { value: "6.0K+", label: "FOLLOWERS" },
  { value: "15+", label: "REELS" },
  { value: "10+", label: "TOPICS" },
  { value: "BIG", label: "COMMUNITY" },
];

function FloatingCard({ icon, label, style, delay = 0 }) {
  return (
    <div
      className="hero-float-card"
      style={{ ...style, animationDelay: `${0.9 + delay}s, ${delay}s` }}
    >
      <span className="hero-float-card-icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="hero-float-card-label">{label}</span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-artwork-frame">
          <video
            className="hero-bg-video hero-video-desktop"
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-bg.jpg"
          >
            <source src="/hero-bg.webm" type="video/webm" />
            <source src="/hero-bg.mp4" type="video/mp4" />
            <img src="/hero-bg.jpg" alt="" />
          </video>

          <video
            className="hero-bg-video hero-video-mobile"
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-bg-mobile.jpg"
          >
            <source src="/hero-bg-mobile.webm" type="video/webm" />
            <source src="/hero-bg-mobile.mp4" type="video/mp4" />
            <img src="/hero-bg-mobile.jpg" alt="" />
          </video>
          <div className="hero-bg-overlay" />

          <div className="hero-float-cards">
            {FLOATING_CARDS.map((c) => (
              <FloatingCard
                key={c.label}
                icon={c.icon}
                label={c.label}
                delay={c.delay}
                style={{ left: c.x, top: c.y }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-breadcrumb">
            CODE <span className="dot">✦</span> LEARN <span className="dot">✦</span> GROW{" "}
            <span className="dot">✦</span> TOGETHER
          </p>
          <h1>
            <span className="title-small">LEARN WITH</span>
            <span className="title-big">
              <span className="jackie">Jackie </span>
              <span className="amp">&amp;</span>
              <span className="juli"> Juli</span>
            </span>
          </h1>
          <p className="tagline">Understand IT. Build the Future.</p>
          <p className="lede">
            Simple explanations. Real-world tech. In Tamil &amp; Tanglish.
            <br />
            Learn practical concepts, tools and skills — one reel at a time.
          </p>
          <div className="cta-row">
            <a className="btn btn-hero" href={IG_URL} target="_blank" rel="noreferrer">
              Start Learning <Icon name="arrow-right" size={18} />
            </a>
            <a className="btn btn-ghost btn-hero-ghost" href="#reels">
              <Icon name="play" size={16} /> Watch Our Reels
            </a>
          </div>
        </div>
      </div>

      <div className="hero-stats-wrap">
        <div className="hero-stats">
          {STATS.map((s) => (
            <div className="hero-stat" key={s.label}>
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-bottom">
        <p className="hero-motto">
          Tech Today
          <br />
          <em>A Better Tomorrow</em>
        </p>
        <div className="hero-scroll">
          <span className="hero-scroll-line" />
          <span className="hero-scroll-text">SCROLL TO EXPLORE</span>
        </div>
        <div className="hero-socials">
          <a href={IG_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Icon name="insta" size={18} />
          </a>
          <a href="#" aria-label="YouTube">
            <Icon name="youtube" size={18} />
          </a>
          <a href="#" aria-label="Discord">
            <Icon name="discord" size={18} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Icon name="linkedin" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
