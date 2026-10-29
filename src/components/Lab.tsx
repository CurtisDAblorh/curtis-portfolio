import { useState } from "react";
import { CityScene, type CityMode } from "../three/CityScene";
import { ShadeToggle, Stage3D } from "../three/Stage3D";

const base = import.meta.env.BASE_URL;
const icon = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function CityStage() {
  const [mode, setMode] = useState<CityMode>("height");
  const [loading, setLoading] = useState<string | null>("Loading city…");
  const [tris, setTris] = useState(0);
  return (
    <Stage3D id="cityStage" label="3D model of downtown San Francisco" flat overlay={<>
      {loading && <div className="loading">{loading}</div>}
      <div className="hud hud-top"><span className="chipx">Downtown San Francisco · 37.79° N, 122.40° W</span></div>
      <div className="hud hud-bottom">
        <ShadeToggle label="City colouring" options={[["height", "Height"], ["clay", "Clay"], ["wire", "Wire"]]} value={mode} onChange={setMode} />
        <span className="chipx">{tris ? `${tris.toLocaleString()} triangles · drag to orbit` : "— triangles"}</span>
      </div>
    </>}>
      <CityScene url={base + "models/city.glb"} mode={mode}
        onProgress={p => setLoading(p >= 1 ? "Preparing city…" : `Loading city… ${Math.round(p * 100)}%`)}
        onReady={t => { setTris(t); setLoading(null); }}
        onError={() => setLoading("Couldn't load the city. Reload the page to try again.")} />
    </Stage3D>
  );
}

export function Lab() {
  return (
    <section className="block" id="lab">
      <div className="wrap">
        <div className="sec-head"><div><span className="eyebrow">3D Lab</span><h2>Things I've built in Blender</h2></div><p>My models, cut down to load fast on the web. Drag the city to look around downtown San Francisco.</p></div>
        <div className="lab">
          <CityStage />
          <div className="lab-side">
            <div className="model" aria-pressed="true">
              <div className="ic"><svg {...icon}><path d="M3 21h18M5 21V10l4-3 4 3v11M13 21V6l3-3 3 3v15" /></svg></div>
              <div><h3>Downtown SF</h3><p>Built from OpenStreetMap data, then trimmed to a 1.3 km block of the Financial District.</p>
                <div className="stats"><span>330k → 35k tris</span><span>33 MB → 1 MB</span></div></div>
            </div>
            <a className="model" href="#top" style={{ textDecoration: "none" }}>
              <div className="ic"><svg {...icon}><circle cx="12" cy="6" r="3" /><path d="M12 9v7M8 12h8M9 22l3-6 3 6" /></svg></div>
              <div><h3>Funko me</h3><p>Sculpted, rigged with Rigify and animated by hand: walk cycles, a jump and a take-off. He's on the right at the top.</p>
                <div className="stats"><span>518k → 31k tris</span><span>98 MB → 2.6 MB</span></div></div>
            </a>
            <div className="model">
              <div className="ic"><svg {...icon}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M2 20h20" /></svg></div>
              <div><h3>WeDevMe desk</h3><p>Me at my gaming setup, from the first version of this site. It's spinning on the left at the top.</p>
                <div className="stats"><span>162k → 77k tris</span><span>full-res textures</span></div></div>
            </div>
            <div className="shrink">
              <div><b>148 MB</b><span>of source files</span></div>
              <span className="arrow"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
              <div><b>19 MB</b><span>loaded on this page</span></div>
            </div>
          </div>
        </div>

        <div className="showcase">
          <article className="shot">
            <div className="shot-img"><img src={base + "renders/muscle-toon.webp"} alt="Anatomy study figure in an A-pose with a black cap, mask, tank top and shorts, rendered with a toon shader and black ink outlines" loading="lazy" /></div>
            <div className="shot-body">
              <span className="eyebrow">Anatomy and toon shading</span>
              <h3>Anatomy study, inked</h3>
              <p>A figure sculpted to study muscle structure and surface anatomy, then rigged with BlenRig. A toon shader and inverted-hull outlines turn the forms into clean comic-style shapes.</p>
              <div className="stats"><span>Toon shader</span><span>Ink outlines</span><span>EEVEE render</span></div>
            </div>
          </article>
          <article className="shot">
            <div className="shot-img"><img src={base + "renders/digime-pose.webp"} alt="Character caught mid-animation in a dynamic pose, with glowing magenta rings and motion lines, on a purple floor" loading="lazy" /></div>
            <div className="shot-body">
              <span className="eyebrow">Animation and effects</span>
              <h3>Character, mid-animation</h3>
              <p>A single frame from a character animation, with emissive effects and motion lines to carry the movement. Built with MB-Lab, with a full body and face rig.</p>
              <div className="stats"><span>MB-Lab</span><span>266 bones</span><span>Emission FX</span></div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
