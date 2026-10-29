import { useEffect, useState } from "react";
import { useTheme } from "../hooks/theme";

const links = [["about", "About"], ["experience", "Experience"], ["projects", "Projects"], ["lab", "3D Lab"], ["tech", "Tech"]];

export function Nav() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const [active, setActive] = useState("");
  // highlight the link for whichever section crosses the middle of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section.block").forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="nav" aria-label="Main">
      <div className="wrap"><div className="nav-inner">
        <a className="logo" href="#top"><span className="logo-mark" />Curtis</a>
        <ul className="nav-links">
          {links.map(([id, text]) => <li key={id}><a href={"#" + id} className={active === id ? "active" : undefined}>{text}</a></li>)}
        </ul>
        <div className="nav-end">
          {/* shows the mode you'd switch to: a moon in light mode, a sun in dark mode */}
          <button className="theme-btn" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}>
            {dark
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
          </button>
          <a className="btn btn-primary" href="#contact">Let's talk</a>
        </div>
      </div></div>
    </nav>
  );
}
