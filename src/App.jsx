import "./App.css";
import PageLoader from "./components/PageLoader/PageLoader";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Topics from "./components/Topics/Topics";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import ReelRing from "./components/ReelRing/ReelRing";
import Community from "./components/Community/Community";
import Footer from "./components/Footer/Footer";
import useScrollState from "./hooks/useScrollState";
import useScrollSpy from "./hooks/useScrollSpy";
import useReveal from "./hooks/useReveal";

const SECTION_IDS = ["top", "about", "teach", "how", "reels", "community"];

export default function App() {
  const scrolled = useScrollState();
  const active = useScrollSpy(SECTION_IDS);
  useReveal();

  return (
    <>
      {/* ---------------- Cyber Tech Initial Page Loader ---------------- */}
      <PageLoader />

      <div className="progress" aria-hidden="true" />

      {/* ---------------- Nav ---------------- */}
      <Navbar scrolled={scrolled} active={active} />

      <main>
        {/* ---------------- Hero ---------------- */}
        <Hero />

        {/* ---------------- About ---------------- */}
        <About />

        {/* ---------------- What we teach ---------------- */}
        <Topics />

        {/* ---------------- How it works ---------------- */}
        <HowItWorks />

        {/* ---------------- 3D Reel Ring ---------------- */}
        <ReelRing />

        {/* ---------------- Community Guild ---------------- */}
        <Community />
      </main>

      <Footer />
    </>
  );
}

export { Navbar, Hero, About, Topics, HowItWorks, ReelRing, Community, Footer };