import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cssVar, useTheme } from "../hooks/theme";
import { dragOrbit, LIGHT, protoColor, reducedMotion, triangleCount, type Orbit } from "./shared";

export type CityMode = "height" | "clay" | "wire";

/** Downtown San Francisco on a round plate, buildings coloured by height. */
export function CityScene({ url, mode, onProgress, onReady, onError }: {
  url: string; mode: CityMode;
  onProgress: (p: number) => void; onReady: (tris: number) => void; onError: () => void;
}) {
  const { gl, camera } = useThree();
  const { theme } = useTheme();
  const cb = useRef({ onProgress, onReady, onError }); cb.current = { onProgress, onReady, onError };

  const s = useMemo(() => {
    const root = new THREE.Group();
    root.add(new THREE.HemisphereLight(0xffffff, 0xcfc8e8, 0.9 * LIGHT));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2 * LIGHT); sun.position.set(2, 3, 1.5); root.add(sun);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.12, 0.05, 72), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9 }));
    plate.position.y = -0.027; root.add(plate);
    return {
      root, plate, buildings: [] as THREE.Mesh[], minY: 0, maxY: 1,
      matH: new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .75 }),
      matC: new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: .85 }),
      matW: new THREE.MeshBasicMaterial({ color: 0x7B5CFF, wireframe: true, transparent: true, opacity: .45 }),
      orbit: { yaw: 0.6, pitch: 0.35, idle: 0, minP: 0.1, maxP: 1.1, cYaw: null, cPitch: null } as Orbit,
      isDragging: (): boolean => false,
    };
  }, []);

  function recolor() {
    const c1 = protoColor(cssVar("a3")), c2 = protoColor(cssVar("a1")), c3 = protoColor(cssVar("a2")), base = protoColor(cssVar("surface2")), tmp = new THREE.Color();
    protoColor(cssVar("surface"), (s.plate.material as THREE.MeshStandardMaterial).color); protoColor(cssVar("surface"), s.matC.color); protoColor(cssVar("a1"), s.matW.color);
    s.buildings.forEach(b => {
      const pos = b.geometry.attributes.position, col = b.geometry.attributes.color;
      for (let i = 0; i < pos.count; i++) {
        const h = Math.pow(THREE.MathUtils.clamp((pos.getY(i) - s.minY - 2) / (s.maxY - s.minY - 2), 0, 1), 0.55);
        if (h < 0.08) tmp.copy(base); else if (h < 0.5) tmp.copy(c1).lerp(c2, (h - 0.08) / 0.42); else tmp.copy(c2).lerp(c3, (h - 0.5) / 0.5);
        col.setXYZ(i, tmp.r, tmp.g, tmp.b);
      }
      col.needsUpdate = true;
    });
  }
  useEffect(recolor, [theme, s]);
  const modeRef = useRef(mode); modeRef.current = mode;
  const matFor = (m: CityMode) => m === "height" ? s.matH : m === "clay" ? s.matC : s.matW;
  useEffect(() => { s.buildings.forEach(b => { b.material = matFor(mode); }); }, [mode, s]);

  useEffect(() => {
    const d = dragOrbit(gl.domElement, s.orbit); s.isDragging = d.isDragging;
    return d.dispose;
  }, [gl, s]);

  useEffect(() => {
    let cancelled = false, loaded = false;
    new GLTFLoader().load(url, gltf => {
      if (cancelled) return;
      loaded = true;
      const holder = gltf.scene; let tris = 0;
      const box = new THREE.Box3().setFromObject(holder);
      s.minY = box.min.y; s.maxY = box.max.y;
      holder.traverse(o => {
        const m = o as THREE.Mesh; if (!m.isMesh) return;
        tris += triangleCount(m.geometry);
        m.geometry.computeVertexNormals();
        if (/buildings/.test(m.name)) { m.geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(m.geometry.attributes.position.count * 3), 3)); s.buildings.push(m); }
        else m.material = new THREE.MeshBasicMaterial({ color: 0x99aadd, transparent: true, opacity: .7 });
      });
      holder.position.y = -s.minY;
      // the OSM export is in metres; 1/665 fits the 1.3 km block onto the plate
      const wrap = new THREE.Group(); wrap.scale.setScalar(1 / 665); wrap.add(holder); s.root.add(wrap);
      s.buildings.forEach(b => { b.material = matFor(modeRef.current); });
      recolor();
      cb.current.onReady(Math.round(tris));
    }, x => { if (x.total && !loaded && !cancelled) cb.current.onProgress(x.loaded / x.total); }, err => { if (!cancelled) { console.error(err); cb.current.onError(); } });
    return () => { cancelled = true; };
  }, [url, s]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05), o = s.orbit;
    o.idle += dt;
    if (!reducedMotion() && !s.isDragging() && o.idle > 2) o.yaw += dt * 0.12;
    const r = 3.1, el = 0.35 + o.pitch * 0.6;
    camera.position.set(Math.sin(o.yaw) * Math.cos(el) * r, Math.sin(el) * r, Math.cos(o.yaw) * Math.cos(el) * r);
    camera.lookAt(0, 0.12, 0);
  });

  return <primitive object={s.root} />;
}
