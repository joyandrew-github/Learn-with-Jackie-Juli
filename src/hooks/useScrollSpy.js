import { useState, useEffect } from "react";

/** Returns the id of the section currently in view (for the nav highlight). */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
