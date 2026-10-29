import * as THREE from "three";

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Frame-rate independent exponential ease from a toward b. */
export const ease = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));

/** three r155+ uses physically based light units; multiplying by PI keeps the prototype's (r147, legacy units) look. */
export const LIGHT = Math.PI;

export type Shade = "solid" | "wire" | "normal";

export type Orbit = {
  yaw: number; pitch: number; idle: number;
  /** camera orbit (middle-mouse drag); null when the stage doesn't allow it */
  cYaw: number | null; cPitch: number | null;
  minP?: number; maxP?: number;
};

/**
 * Left drag turns the model; middle drag (wheel button) orbits the camera when the stage allows it (o.cYaw set).
 * Returns a cleanup function and an isDragging reader.
 */
export function dragOrbit(canvas: HTMLCanvasElement, o: Orbit) {
  let dragging = false, btn = 0, lastX = 0, lastY = 0;
  const free = () => o.cYaw != null;
  const noScroll = (e: MouseEvent) => { if (e.button === 1 && free()) e.preventDefault(); }; // no autoscroll
  const down = (e: PointerEvent) => {
    if (e.button === 1 && !free()) return;
    if (e.button === 1) e.preventDefault();
    dragging = true; btn = e.button; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); canvas.classList.add("dragging"); o.idle = 0;
  };
  const up = () => { dragging = false; canvas.classList.remove("dragging"); o.idle = 0; };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; o.idle = 0;
    if (btn === 1 && o.cYaw != null && o.cPitch != null) { o.cYaw -= dx * 0.008; o.cPitch = THREE.MathUtils.clamp(o.cPitch + dy * 0.006, -0.12, 1.3); return; }
    o.yaw += dx * 0.01; o.pitch = THREE.MathUtils.clamp(o.pitch + dy * 0.005, o.minP ?? -0.2, o.maxP ?? 0.6);
  };
  canvas.addEventListener("mousedown", noScroll); canvas.addEventListener("auxclick", noScroll);
  canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointermove", move);
  return {
    isDragging: () => dragging,
    dispose: () => {
      canvas.removeEventListener("mousedown", noScroll); canvas.removeEventListener("auxclick", noScroll);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointermove", move);
    },
  };
}

export const triangleCount = (g: THREE.BufferGeometry) => (g.index ? g.index.count : g.attributes.position.count) / 3;

/**
 * The prototype ran on three r147 without colour management, so CSS colours went into materials unconverted.
 * Reading them as linear values keeps that softer look (e.g. the charcoal cloud, the city's height colours).
 */
export const protoColor = (css: string, target = new THREE.Color()) => target.setStyle(css, THREE.LinearSRGBColorSpace);
