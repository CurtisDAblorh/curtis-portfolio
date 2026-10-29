import { useRef, useState, type KeyboardEvent } from "react";
import { experiences, type Role } from "../data/experience";

// arrow keys move between tabs in a tab list; returns the new index, or null for other keys
function arrowStep(ev: KeyboardEvent, i: number, count: number, keys: string[]) {
  if (!keys.includes(ev.key)) return null;
  ev.preventDefault();
  const forward = ev.key === "ArrowDown" || ev.key === "ArrowRight";
  return (i + (forward ? 1 : -1) + count) % count;
}

function Highlights({ role }: { role: Role }) {
  if (!role.highlights) return null;
  return (
    <div className="exp-highlights">
      {role.highlights.map(h => <div className="exp-highlight" key={h.num}><span className="num" dangerouslySetInnerHTML={{ __html: h.num }} /><p>{h.text}</p></div>)}
    </div>
  );
}

const List = ({ points }: { points: string[] }) => <ul>{points.map(p => <li key={p}>{p}</li>)}</ul>;

/** A long role split into tabs: "Highlights" first, then one tab per section. */
function RoleTabs({ role }: { role: Role }) {
  const [tab, setTab] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = [{ label: "Highlights", points: role.points }, ...role.sections!];
  const onKey = (ev: KeyboardEvent, i: number) => {
    const n = arrowStep(ev, i, tabs.length, ["ArrowLeft", "ArrowRight"]);
    if (n !== null) { setTab(n); btns.current[n]?.focus(); }
  };
  return (
    <>
      <div className="exp-tabs" role="tablist" aria-label={`${role.co} work by area`}>
        {tabs.map((t, i) => (
          <button key={t.label} ref={el => { btns.current[i] = el; }} id={`exp-tab-${i}`} className="exp-tab" role="tab"
            aria-selected={i === tab} aria-controls="exp-tabpanel" tabIndex={i === tab ? 0 : -1}
            onClick={() => setTab(i)} onKeyDown={ev => onKey(ev, i)}>
            {t.label}<span className="n">{t.points.length}</span>
          </button>
        ))}
      </div>
      <div className="exp-tabpanel" id="exp-tabpanel" role="tabpanel" aria-labelledby={`exp-tab-${tab}`} key={tab}>
        {tab === 0 && <Highlights role={role} />}
        <List points={tabs[tab].points} />
      </div>
    </>
  );
}

export function Experience() {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const e = experiences[sel];
  const onKey = (ev: KeyboardEvent, i: number) => {
    const n = arrowStep(ev, i, experiences.length, ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"]);
    if (n !== null) { setSel(n); tabs.current[n]?.focus(); }
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
            {/* keyed by role, so switching role starts again on its first tab */}
            <div className="exp-body" key={sel}>
              <header><h3>{e.title}</h3><span className="when">{e.date}</span></header>
              <div className="co">{e.co}</div>
              {e.sections ? <RoleTabs role={e} /> : <><Highlights role={e} /><List points={e.points} /></>}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
