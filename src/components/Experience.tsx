import { useRef, useState, type KeyboardEvent } from "react";
import { experiences } from "../data/experience";

export function Experience() {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const e = experiences[sel];
  // arrow keys move between roles, like a tab list
  const onKey = (ev: KeyboardEvent, i: number) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(ev.key)) return;
    ev.preventDefault();
    const n = (i + (ev.key === "ArrowDown" || ev.key === "ArrowRight" ? 1 : -1) + experiences.length) % experiences.length;
    setSel(n); tabs.current[n]?.focus();
  };
  return (
    <section className="block" id="experience">
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">Experience</span><h2>Where I've worked</h2></div><p>From on-site support to leading product pages end to end. Pick a role to see what I did there.</p></div>
        <div className="exp">
          <div className="exp-list" role="tablist" aria-label="Roles" id="expList">
            {experiences.map((x, i) => (
              <button key={x.co} ref={el => { tabs.current[i] = el; }} className="exp-item" role="tab" aria-selected={i === sel} tabIndex={i === sel ? 0 : -1}
                onClick={() => setSel(i)} onKeyDown={ev => onKey(ev, i)}>
                <span className="exp-badge">{x.badge}</span><span><strong>{x.co}</strong><span>{x.date}</span></span>
              </button>
            ))}
          </div>
          <article className="exp-panel" id="expPanel" role="tabpanel" aria-live="polite">
            <div className="exp-body" key={sel}>
              <header><h3>{e.title}</h3><span className="when">{e.date}</span></header>
              <div className="co">{e.co}</div>
              {e.highlights && <div className="exp-highlights">
                {e.highlights.map(h => <div className="exp-highlight" key={h.num}><span className="num" dangerouslySetInnerHTML={{ __html: h.num }} /><p>{h.text}</p></div>)}
              </div>}
              <ul>{e.points.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
