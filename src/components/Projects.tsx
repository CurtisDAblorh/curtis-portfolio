import { useState } from "react";
import { projects } from "../data/projects";
import { Filters } from "./Filters";

const base = import.meta.env.BASE_URL;
const arrow = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 17 17 7M8 7h9v9" /></svg>;
const cats = ["All", ...new Set(projects.flatMap(p => p.cats))];

export function Projects() {
  const [cat, setCat] = useState("All");
  return (
    <section className="block tint" id="projects">
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">Projects</span><h2>Selected work</h2></div>
          <Filters id="filters" label="Filter projects" value={cat} onChange={setCat}
            options={cats.map(c => ({ id: c, label: c, count: c === "All" ? projects.length : projects.filter(p => p.cats.includes(c)).length }))} />
        </div>
        <div className="projects" id="projectGrid">
          {/* cards stay mounted and are hidden by the filter, so their scroll reveal isn't replayed */}
          {projects.map(p => {
            const show = cat === "All" || p.cats.includes(cat);
            return (
              <article key={p.name} className={"proj" + (show && cat === "All" && p.wide ? " featured" : "")} hidden={!show}>
                <div className={"cover" + (p.cover.contain ? " contain" : "")}><img src={base + p.cover.image} alt={p.cover.alt} loading="lazy" /></div>
                <div className="proj-body">
                  {p.featured && <span className="eyebrow">Featured</span>}
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div>
                  <div className="links">
                    {p.live && <a href={p.live} target="_blank" rel="noopener">Live site {arrow}</a>}
                    {p.code && <a href={p.code} target="_blank" rel="noopener">Source {arrow}</a>}
                    {!p.live && !p.code && <span className="soon">Repo coming soon</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
