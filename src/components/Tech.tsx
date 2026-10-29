import { useState } from "react";
import { groups, tech } from "../data/tech";
import { Filters } from "./Filters";

// brand colours too close to black would vanish in dark mode, so those use the ink token instead
const luminance = (hex: string) => {
  const n = parseInt(hex, 16);
  const c = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
};

export function Tech() {
  const [g, setG] = useState("all");
  return (
    <section className="block tint" id="tech">
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">Tech stack</span><h2>Tools I reach for</h2></div><p>The icon grid from before, now grouped so you can filter by what each tool is for.</p></div>
        <Filters id="techFilters" className="filters tech-filters" label="Filter tech" value={g} onChange={setG}
          options={groups.map(x => ({ id: x.id, label: x.label, count: x.id === "all" ? tech.length : tech.filter(t => t.g === x.id).length }))} />
        <div className="tech" id="techGrid">
          {tech.map((t, i) => (
            <div className="t" key={t.name} hidden={!(g === "all" || t.g === g)}>
              <div className="t-ic" style={{ animationDelay: `${(i % 7) * .35}s`, ...(t.hex ? { "--b": "#" + t.hex } as React.CSSProperties : {}) }}>
                {t.path
                  ? <svg viewBox="0 0 24 24" aria-hidden="true"><path fill={t.hex && luminance(t.hex) >= .03 ? "#" + t.hex : "var(--ink)"} d={t.path} /></svg>
                  : <span className="txt">{t.txt}</span>}
              </div>
              <span>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
