const icon = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const roles = [
  { title: "Frontend", text: "React, Next.js, TypeScript", svg: <svg {...icon}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 21h8" /></svg> },
  { title: "Data viz", text: "Custom D3 timelines and charts", svg: <svg {...icon}><path d="M3 20V10M9 20V4M15 20v-7M21 20V8" /></svg> },
  { title: "Quality", text: "Jest, Playwright, Chromatic", svg: <svg {...icon}><path d="M4 7h16M4 12h10M4 17h6" /><path d="m16 15 2 2 4-4" /></svg> },
  { title: "3D", text: "Blender characters, rigs and scenes", svg: <svg {...icon}><path d="M12 2 3 7v10l9 5 9-5V7z" /><path d="M3 7l9 5 9-5M12 12v10" /></svg> },
];

export function About() {
  return (
    <section className="block tint" id="about">
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">About</span><h2>Engineer by trade,<br />character artist by habit.</h2></div></div>
        <div className="about-grid">
          <div className="about-text">
            <p>I'm Curtis, a frontend developer in London. I build data-rich, real-time interfaces with React, Next.js and TypeScript, and I care about the parts users never see: type-safe APIs, test coverage, and CI that doesn't make you wait.</p>
            <p>Before frontend I spent a few years in IT support and consultancy, which is where I learned to explain technical things clearly and stay calm when something breaks.</p>
            <p>In my spare time I create and animate 3D characters and scenes in Blender. You've already met my Funko-style self at the top of the page. There's more in the 3D Lab below.</p>
          </div>
          <div className="roles">
            {roles.map(r => <div className="role" key={r.title}><div className="ic">{r.svg}</div><div><h3>{r.title}</h3><p>{r.text}</p></div></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
