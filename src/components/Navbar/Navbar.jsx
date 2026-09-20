import { useState, useEffect } from "react";
import Icon from "../common/Icon";
import brandLogo from "../../assets/image.png";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Topics", href: "#teach" },
  { label: "How It Works", href: "#how" },
  { label: "Reels", href: "#reels" },
  { label: "Community", href: "#community" },
];

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";

export default function Navbar({ scrolled = false, active = "top" }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -90;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""} ${mobileOpen ? "nav-drawer-open" : ""}`}>
        <a
          className="brand"
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          aria-label="Learn with Jackie and Juli, home"
        >
          <div className="brand-logo-frame">
            <img src={brandLogo} alt="Learn with Jackie and Juli logo" className="brand-logo" />
          </div>
          <div className="brand-text">
            <span className="brand-pre">LEARN WITH</span>
            <span className="brand-name">
              Jackie <span className="brand-amp">&amp;</span> Juli
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="nav-links" aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className={active === l.href.slice(1) ? "nav-active" : ""}
              aria-current={active === l.href.slice(1) ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions & Mobile Menu Toggle */}
        <div className="nav-actions">
          <a className="btn btn-sm btn-nav" href={IG_URL} target="_blank" rel="noreferrer">
            <span>Join Our Journey</span>
            <Icon name="arrow-right" size={15} />
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {mobileOpen && (
        <div
          className="nav-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`nav-mobile-drawer ${mobileOpen ? "open" : ""}`} aria-label="Mobile Navigation">
        <div className="nav-mobile-drawer-header">
          <div className="brand-text">
            <span className="brand-pre">NAVIGATION</span>
            <span className="brand-name">Explore Platform</span>
          </div>
          <button
            type="button"
            className="nav-mobile-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="nav-mobile-links">
          {NAV_LINKS.map((l) => {
            const isCurrent = active === l.href.slice(1);
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`nav-mobile-link ${isCurrent ? "nav-mobile-active" : ""}`}
              >
                <span>{l.label}</span>
                {isCurrent && <span className="nav-mobile-indicator">●</span>}
              </a>
            );
          })}
        </nav>

        <div className="nav-mobile-footer">
          <a
            className="btn btn-primary nav-mobile-cta"
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="insta" size={16} /> Follow on Instagram
          </a>
        </div>
      </div>
    </>
  );
}
