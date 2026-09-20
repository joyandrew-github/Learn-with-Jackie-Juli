import Icon from "../common/Icon";
import "./HowItWorks.css";

const STEPS = [
  {
    step: "01",
    label: "STEP 01",
    duration: "60 Seconds",
    icon: "play",
    accent: "crimson",
    title: "Watch the Idea",
    tagline: "A short reel that shows the idea in action",
    description:
      "Start with a quick 60-second video on Instagram. See how the concept works in real life with pure visuals and zero boring slides.",
    perk: "Fast 60-second visual breakdown",
  },
  {
    step: "02",
    label: "STEP 02",
    duration: "5 Minutes",
    icon: "spark",
    accent: "crimson",
    title: "Understand the Logic",
    tagline: "We break it down until it clicks naturally",
    description:
      "We unpack the internals step-by-step in simple Tamil & Tanglish. Visual mental models with zero confusing jargon left over.",
    perk: "Zero jargon • Crystal clear mental models",
  },
  {
    step: "03",
    label: "STEP 03",
    duration: "30 Minutes",
    icon: "code",
    accent: "crimson",
    title: "Build It Yourself",
    tagline: "Try it with a project you can finish today",
    description:
      "Turn what you watched into muscle memory. Use our starter templates to build and finish a real project you can be proud of today.",
    perk: "Starter code templates you can finish fast",
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-section" id="how">
      <div className="how-ambient-glow" aria-hidden="true" />

      {/* Header */}
      <div className="section-head reveal">
        <div className="how-pill">
          <span className="how-pill-dot" />
          <span>SIMPLE 3-STEP LEARNING</span>
        </div>
        <h2>Understand it, then build it</h2>
        <p>
          Every lesson follows the exact same three friendly moves, so you always know where you
          are and never feel overwhelmed.
        </p>
      </div>

      {/* Spacious, Uncongested 3-Step Cards */}
      <div className="how-spacious-grid reveal">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className={`how-step-card glass how-step-${s.accent}`}
          >
            {/* Step Top Bar */}
            <div className="how-card-header-bar">
              <span className={`how-step-badge badge-${s.accent}`}>{s.label}</span>
              <span className="how-time-chip">
                <Icon name="clock" size={13} />
                <span>{s.duration}</span>
              </span>
            </div>

            {/* Visual Glowing Icon */}
            <div className={`how-icon-circle circle-${s.accent}`}>
              <Icon name={s.icon} size={24} />
            </div>

            {/* Title & Tagline */}
            <h3 className="how-step-title">{s.title}</h3>
            <div className="how-step-tagline">{s.tagline}</div>

            {/* Simple, Easy-to-Understand Description */}
            <p className="how-step-description">{s.description}</p>

            {/* Clean Feature Chip */}
            <div className="how-step-footer">
              <span className="how-feature-chip">
                <Icon name="check" size={13} />
                <span>{s.perk}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
