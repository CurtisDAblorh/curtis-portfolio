import { useMemo, useRef, useState } from "react";
import { CharacterScene, type CharacterApi, type CharacterConfig } from "../three/CharacterScene";
import { ShadeToggle, Stage3D } from "../three/Stage3D";
import type { Shade } from "../three/shared";

const base = import.meta.env.BASE_URL;
const shades: [Shade, string][] = [["solid", "Solid"], ["wire", "Wire"], ["normal", "Normals"]];

function useLoading(what: string) {
  const [text, setText] = useState<string | null>(`Loading ${what}…`);
  return {
    text,
    events: {
      // after the download, textures still decode before the model appears
      onProgress: (p: number) => setText(p >= 1 ? "Preparing…" : `Loading… ${Math.round(p * 100)}%`),
      onError: () => setText("Couldn't load the model. Reload the page to try again."),
      done: () => setText(null),
    },
  };
}

function DeskStage() {
  const cfg = useMemo<CharacterConfig>(() => ({
    url: base + "models/desk.glb", height: 2.6, width: 4.6, yaw: -2.33,
    turntable: true, spin: 0.12, elev: 0.87, zoom: 0.82, lookAt: 0.42, shadow: 2.6, lighting: "desk", keepMaterials: true,
    loops: new Set(), speeds: {}, labels: {},
  }), []);
  const api = useRef<CharacterApi>(null);
  const [spinning, setSpinning] = useState(true);
  const [shade, setShade] = useState<Shade>("solid");
  const [tris, setTris] = useState(0);
  const load = useLoading("desk");
  const label = "Curtis's 3D desk scene, turning on a turntable";

  return (
    <Stage3D id="deskStage" label={tris ? `${label}, ${tris.toLocaleString()} triangles` : label} shadows overlay={<>
      {load.text && <div className="loading">{load.text}</div>}
      <div className="hud hud-top">
        <div className="actions">
          <button className="act" aria-pressed={!spinning} onClick={() => { api.current?.setSpinning(!spinning); setSpinning(!spinning); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M9 5v14M15 5v14" /></svg>
            <span>{spinning ? "Pause spin" : "Resume spin"}</span>
          </button>
        </div>
        <span className="chipx">{spinning ? <><i />Spinning</> : "Paused · drag to rotate"}</span>
      </div>
      <div className="hud hud-bottom">
        <span className="chipx">Drag to rotate</span>
        <ShadeToggle label="Viewport shading" options={shades} value={shade} onChange={v => { api.current?.setShade(v); setShade(v); }} />
      </div>
    </>}>
      <CharacterScene cfg={cfg} api={api} events={{ ...load.events, onReady: i => { setTris(i.tris); load.events.done(); }, onClip: () => {} }} />
    </Stage3D>
  );
}

function FunkoStage() {
  const cfg = useMemo<CharacterConfig>(() => ({
    url: base + "models/funko.glb", freeCam: true, backdrop: 9.6, height: 4.4, width: 4.6, yaw: -0.35, follow: "spine006",
    clips: { idle: "metarigAction", walk: "walk", run: "walk FASTERFIN", jump: "metarigAction.001", fly: "metarigAction.FLIGHT" }, idle: "idle",
    labels: { idle: "Idle", walk: "Walk", run: "Run", jump: "Jump", fly: "Take off" },
    loops: new Set(["walk", "run"]), speeds: { walk: 2.2, run: 3.8 },
    slow: { clip: "fly", from: 2.27, to: 2.95, scale: 0.28 },
  }), []);
  const api = useRef<CharacterApi>(null);
  const [clip, setClip] = useState("idle");
  const [ready, setReady] = useState<string[]>([]);
  const [shade, setShade] = useState<Shade>("solid");
  const [tris, setTris] = useState(0);
  const load = useLoading("character");
  const label = "Curtis's animated Funko-style character";
  const btn = (k: string, toggle: boolean, children: React.ReactNode, cls = "act") => (
    <button className={cls} disabled={!ready.includes(k)} aria-pressed={toggle ? clip === k : undefined} onClick={() => api.current?.play(k)}>{children}</button>
  );

  return (
    <Stage3D id="funkoStage" label={tris ? `${label}, ${tris.toLocaleString()} triangles` : label} flat
      canvasTitle="Drag to turn him. Hold the mouse wheel and drag to orbit the camera." overlay={<>
        <span className="mini-hint">Wheel-click + drag to orbit</span>
        {load.text && <div className="loading">{load.text}</div>}
        <div className="hud hud-top">
          <div className="actions">{btn("walk", true, "Walk")}{btn("run", true, "Run")}{btn("jump", false, "Jump")}</div>
          <span className="chipx"><i />{cfg.labels[clip]}</span>
        </div>
        <div className="hud hud-bottom">
          {btn("fly", false, <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            <span>Take off</span></>, "act primary")}
          <ShadeToggle label="Viewport shading" options={shades} value={shade} onChange={v => { api.current?.setShade(v); setShade(v); }} />
        </div>
      </>}>
      <CharacterScene cfg={cfg} api={api} events={{ ...load.events, onReady: i => { setReady(i.clips); setTris(i.tris); load.events.done(); }, onClip: setClip }} />
    </Stage3D>
  );
}

export function Hero() {
  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <DeskStage />
        <div className="hero-copy">
          <span className="status"><i />Frontend Developer · London · Open to roles</span>
          <h1>Hi,<br />I'm <span className="grad">Curtis</span></h1>
          <p className="sub">I am a Frontend Developer, who loves to make <em>3D Models</em></p>
          <p className="lede">I turn scientific workflows into fast, tested React and TypeScript products. Both scenes are mine, made in Blender: spin my desk setup on the left, and press a button to make my Funko-style self move on the right.</p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#projects">See my work
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
            <a className="btn btn-ghost" href="#lab">Explore my 3D work</a>
          </div>
          <div className="proof">
            <div><b>2022</b><span>shipping React in production</span></div>
            <div><b>−35%</b><span>E2E pipeline time</span></div>
            <div><b>4</b><span>animations to play with</span></div>
          </div>
        </div>
        <FunkoStage />
      </div>
    </header>
  );
}
