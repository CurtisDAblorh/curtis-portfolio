import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cssVar, useTheme } from "../hooks/theme";
import { makeWorld } from "./gridWorld";
import { dragOrbit, ease, protoColor, reducedMotion, triangleCount, type Orbit, type Shade } from "./shared";

export type CharacterConfig = {
  url: string;
  height: number; width: number; yaw: number;
  /** clip key → animation name in the glTF; `idle` names the resting clip */
  clips?: Record<string, string>; idle?: string;
  labels: Record<string, string>;
  loops: Set<string>; speeds: Record<string, number>;
  /** slow-motion window (e.g. the airborne part of the take-off) */
  slow?: { clip: string; from: number; to: number; scale: number };
  /** bone the camera follows upward when the character leaves the ground */
  follow?: string;
  /** middle-mouse camera orbit */
  freeCam?: boolean;
  /** distance of the grid wall behind the model */
  backdrop?: number;
  turntable?: boolean; spin?: number;
  elev?: number; zoom?: number; lookAt?: number; shadow?: number;
  lighting?: "desk";
  /** keep the glTF's own materials instead of the clay-ish clones */
  keepMaterials?: boolean;
};

export type CharacterApi = { play: (k: string) => void; setShade: (s: Shade) => void; setSpinning: (on: boolean) => void };
export type CharacterEvents = {
  onProgress: (p: number) => void;
  onReady: (info: { clips: string[]; tris: number }) => void;
  onError: () => void;
  onClip: (k: string) => void;
};

type MatSet = { solid: THREE.Material | THREE.Material[]; wire: THREE.Material | THREE.Material[]; normal: THREE.Material | THREE.Material[] };

export function CharacterScene({ cfg, api, events }: { cfg: CharacterConfig; api: RefObject<CharacterApi | null>; events: CharacterEvents }) {
  const { gl, camera } = useThree();
  const { theme } = useTheme();
  const ev = useRef(events); ev.current = events;

  // everything the frame loop needs, created once per stage
  const s = useMemo(() => {
    const root = new THREE.Group();
    const world = makeWorld(root, { lighting: cfg.lighting, height: cfg.height, backdrop: cfg.backdrop });
    const pivot = new THREE.Group(); root.add(pivot);
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), new THREE.MeshBasicMaterial({ color: 0x162B4D, transparent: true, opacity: 0.14, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; pivot.add(shadow);
    const orbit: Orbit = { yaw: cfg.yaw, pitch: 0, idle: 0, cYaw: cfg.freeCam ? 0 : null, cPitch: cfg.freeCam ? 0.07 : null };
    return {
      root, world, pivot, shadow, orbit,
      shadeables: [] as THREE.Mesh[], model: null as THREE.Object3D | null, mixer: null as THREE.AnimationMixer | null,
      cloud: null as THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial> | null, cloudBase: new THREE.Vector3(),
      actions: {} as Record<string, THREE.AnimationAction>, current: null as string | null,
      followBone: null as THREE.Bone | null, followRest: 0,
      spinning: !!cfg.turntable, yawCur: cfg.yaw, cloudS: 1, speed: 0, lift: 0,
      isDragging: (): boolean => false, tmp: new THREE.Vector3(), lookAt: new THREE.Vector3(),
    };
  }, [cfg]);

  function recolor() {
    const dark = document.documentElement.dataset.theme === "dark";
    s.world.apply(dark);
    s.shadeables.forEach(m => { const w = (m.userData.mats as MatSet).wire; protoColor(cssVar("a1"), ((Array.isArray(w) ? w[0] : w) as THREE.MeshBasicMaterial).color); });
    if (s.cloud) protoColor(dark ? "#5B6478" : "#14171F", s.cloud.material.color);
    protoColor(cssVar("ink"), (s.shadow.material as THREE.MeshBasicMaterial).color);
  }
  useEffect(recolor, [theme, s]);

  function play(k: string, fade = 0.35) {
    const next = s.actions[k]; if (!next || s.current === k && cfg.loops.has(k)) return;
    const prev = s.current ? s.actions[s.current] : null;
    next.reset(); next.enabled = true; next.setEffectiveTimeScale(1); next.setEffectiveWeight(1); next.play();
    if (prev && prev !== next) prev.crossFadeTo(next, fade, false);
    s.current = k; ev.current.onClip(k);
  }

  useEffect(() => {
    api.current = {
      play: k => play(cfg.loops.has(k) && s.current === k ? cfg.idle! : k),
      setShade: shade => s.shadeables.forEach(m => { m.material = (m.userData.mats as MatSet)[shade]; }),
      setSpinning: on => { s.spinning = on; },
    };
    const d = dragOrbit(gl.domElement, s.orbit); s.isDragging = d.isDragging;
    return () => { api.current = null; d.dispose(); };
  }, [gl, s]);

  useEffect(() => {
    let cancelled = false, loaded = false;
    if (cfg.lighting === "desk") { gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; }
    new GLTFLoader().load(cfg.url, gltf => {
      if (cancelled) return;
      loaded = true;
      const model = gltf.scene; s.model = model;
      const holder = new THREE.Group(); holder.add(model); s.pivot.add(holder);
      let tris = 0;
      model.traverse(o => {
        const m = o as THREE.Mesh; if (!m.isMesh) return; m.frustumCulled = false;
        if (m.name === "Cloud") { s.cloud = m as typeof s.cloud; return; }
        tris += triangleCount(m.geometry); dress(m);
        if (cfg.lighting === "desk") { m.castShadow = true; m.receiveShadow = true; }
      });
      // normalise height so both characters stand the same size on the ground
      const box = new THREE.Box3(); model.updateMatrixWorld(true);
      s.shadeables.forEach(m => { m.geometry.computeBoundingBox(); box.union(m.geometry.boundingBox!.clone().applyMatrix4(m.matrixWorld)); });
      const k = cfg.height / (box.max.y - box.min.y); holder.scale.setScalar(k);
      holder.position.set(-(box.min.x + box.max.x) / 2 * k, -box.min.y * k, -(box.min.z + box.max.z) / 2 * k);
      if (cfg.shadow) s.shadow.scale.setScalar(cfg.shadow);
      if (s.cloud) { s.cloud.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true }); s.cloud.geometry.computeVertexNormals(); s.cloudBase.copy(s.cloud.scale); }
      if (cfg.follow) model.traverse(b => { if ((b as THREE.Bone).isBone && b.name === cfg.follow) s.followBone = b as THREE.Bone; });
      if (s.followBone) { model.updateMatrixWorld(true); s.followRest = s.followBone.getWorldPosition(new THREE.Vector3()).y; }
      if (cfg.clips) {
        const mixer = new THREE.AnimationMixer(model); s.mixer = mixer;
        for (const key in cfg.clips) {
          const clip = gltf.animations.find(c => c.name === cfg.clips![key]); if (!clip) continue;
          const a = mixer.clipAction(clip);
          if (key !== cfg.idle && !cfg.loops.has(key)) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
          s.actions[key] = a;
        }
        mixer.addEventListener("finished", () => play(cfg.idle!)); play(cfg.idle!, 0);
      }
      recolor();
      ev.current.onReady({ clips: Object.keys(s.actions), tris: Math.round(tris) });
    }, x => { if (x.total && !loaded && !cancelled) ev.current.onProgress(x.loaded / x.total); }, err => { if (!cancelled) { console.error(err); ev.current.onError(); } });
    return () => { cancelled = true; };
  }, [cfg, gl, s]);

  function dress(m: THREE.Mesh) {
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const solid = cfg.keepMaterials ? mats : mats.map(src => {
      const c = src.clone() as THREE.MeshStandardMaterial; c.roughness = Math.max(c.roughness ?? .6, .45); c.metalness = 0; return c;
    });
    const wire = new THREE.MeshBasicMaterial({ color: 0x3B7CF0, wireframe: true, transparent: true, opacity: .5 }), normal = new THREE.MeshNormalMaterial();
    const one = !Array.isArray(m.material);
    const set: MatSet = { solid: one ? solid[0] : solid, wire: one ? wire : solid.map(() => wire), normal: one ? normal : solid.map(() => normal) };
    m.userData.mats = set; m.material = set.solid; s.shadeables.push(m);
  }

  function fitDistance() {
    const cam = camera as THREE.PerspectiveCamera;
    const vf = THREE.MathUtils.degToRad(cam.fov / 2), halfH = cfg.height * 0.5 + 1.1, halfW = cfg.width * 0.5 + 0.4;
    return Math.max(halfH / Math.tan(vf), halfW / (Math.tan(vf) * cam.aspect));
  }

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05), o = s.orbit;
    if (s.mixer) {
      const a = s.current ? s.actions[s.current] : null;
      if (a && cfg.slow && s.current === cfg.slow.clip) a.setEffectiveTimeScale(a.time > cfg.slow.from && a.time < cfg.slow.to ? cfg.slow.scale : 1);
      s.mixer.update(reducedMotion() && s.current !== cfg.idle ? dt * 0.6 : dt);
    }
    const walking = !!s.current && cfg.loops.has(s.current);
    s.speed = ease(s.speed, walking ? (cfg.speeds[s.current!] || 0) : 0, 4, dt);
    s.world.floorTex.offset.y -= s.speed * dt / 2.4;
    if (s.cloud) {
      s.cloudS = ease(s.cloudS, walking ? 0 : 1, 6, dt); s.cloud.visible = s.cloudS > 0.02;
      s.cloud.scale.copy(s.cloudBase).multiplyScalar(Math.max(s.cloudS, 1e-3)); s.cloud.material.opacity = s.cloudS;
    }
    // camera follows the character upward when he leaves the ground
    let want = 0;
    if (s.followBone && s.model?.parent) {
      s.followBone.getWorldPosition(s.tmp);
      want = Math.max(0, s.tmp.y - (s.followRest * (s.model.parent.scale.y || 1) + s.model.parent.position.y) - 0.3);
    }
    s.lift = ease(s.lift, want, want > s.lift ? 7 : 3, dt);
    s.shadow.scale.setScalar((cfg.shadow || 1) / (1 + s.lift * 0.25)); (s.shadow.material as THREE.MeshBasicMaterial).opacity = 0.14 / (1 + s.lift * 0.4);
    o.idle += dt;
    if (cfg.turntable) { if (s.spinning && !s.isDragging() && o.idle > 1.5 && !reducedMotion()) o.yaw += dt * (cfg.spin || 0.35); }
    else {
      const restYaw = walking ? -Math.PI / 2 + cfg.yaw : cfg.yaw;
      if (!s.isDragging() && o.idle > 2.5) o.yaw = ease(o.yaw, restYaw, 2.5, dt);
    }
    s.yawCur = ease(s.yawCur, o.yaw, 10, dt); s.pivot.rotation.y = s.yawCur;
    const dist = fitDistance() * (cfg.zoom || 1), cy = cfg.height * (cfg.lookAt ?? 0.5) + s.lift;
    // middle-mouse orbit: the camera circles the character, always aimed at him
    if (o.cYaw != null && o.cPitch != null) {
      camera.position.set(Math.sin(o.cYaw) * Math.cos(o.cPitch) * dist, cy + Math.sin(o.cPitch) * dist, Math.cos(o.cYaw) * Math.cos(o.cPitch) * dist);
      s.world.faceCamera(o.cYaw);
    } else if (cfg.elev != null) camera.position.set(0, cy + dist * Math.sin(cfg.elev), dist * Math.cos(cfg.elev));
    else camera.position.set(0, cy + 0.9, dist);
    s.lookAt.set(0, cy, 0); camera.lookAt(s.lookAt);
  });

  return <primitive object={s.root} />;
}
