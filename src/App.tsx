import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { Lab } from "./components/Lab";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { Tech } from "./components/Tech";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Lab />
        <Tech />
        <Contact />
      </main>
      <footer><div className="wrap"><span>© 2026 Curtis · Built with React, Three.js and Blender</span><span>Map data © OpenStreetMap contributors</span></div></footer>
    </>
  );
}
