import brandLogo from "../../assets/image.png";
import "./Footer.css";

const IG_URL = "https://www.instagram.com/learn_with_jackie_juli/";
const IG_HANDLE = "@learn_with_jackie_juli";

export default function Footer() {
  return (
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
  );
}
