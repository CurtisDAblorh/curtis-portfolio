import * as THREE from "three";
import { cssVar } from "../hooks/theme";
import { LIGHT } from "./shared";

export type WorldOptions = { lighting?: "desk"; height: number; backdrop?: number };

/**
 * Lights plus the round grid floor under each hero model, and optionally a grid wall behind it.
 * The card's own gradient shows through the transparent canvas.
 */
export function makeWorld(scene: THREE.Object3D, o: WorldOptions) {
  let rim: THREE.DirectionalLight;
  if (o.lighting === "desk") {
    // like the original site: soft hemisphere fill plus a light from high above, here as an overhead spot over the desk
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 0.55 * LIGHT));
    const over = new THREE.SpotLight(0xfff4e0, 2.4 * LIGHT, 0, 0.62, 0.75, 0); over.position.set(0.3, o.height * 3.2, 0.4);
    over.target.position.set(0, o.height * 0.35, 0); scene.add(over, over.target);
    over.castShadow = true; over.shadow.mapSize.set(1024, 1024); over.shadow.bias = -0.0004; over.shadow.radius = 4;
    const fillPt = new THREE.PointLight(0xffffff, 0.6 * LIGHT, 0, 0); fillPt.position.set(0, o.height * 0.9, 1.4); scene.add(fillPt);
    rim = new THREE.DirectionalLight(0x7c5cf6, 0.45 * LIGHT); rim.position.set(-6, 4, -5); scene.add(rim);
    const catcher = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.ShadowMaterial({ opacity: 0.28 }));
    catcher.rotation.x = -Math.PI / 2; catcher.position.y = 0.004; catcher.receiveShadow = true; scene.add(catcher);
  } else {
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcfdcff, 0.95 * LIGHT));
    const key = new THREE.DirectionalLight(0xffffff, 1.45 * LIGHT); key.position.set(4, 8, 7); scene.add(key);
    rim = new THREE.DirectionalLight(0x7c5cf6, 0.9 * LIGHT); rim.position.set(-6, 5, -5); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 0.35 * LIGHT); fill.position.set(-4, 2, 6); scene.add(fill);
  }

  // one canvas texture (a single grid square) drives both floor and wall
  const fc = document.createElement("canvas"); fc.width = fc.height = 256; const fx = fc.getContext("2d")!;
  // floor radius: reaches the back wall when there is one; squares stay the same size whatever the radius
  const R = o.backdrop ? o.backdrop + 1.5 : 6, sq = 12 / 22;
  const floorTex = new THREE.CanvasTexture(fc); floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2 * R / sq, 2 * R / sq); floorTex.colorSpace = THREE.SRGBColorSpace;
  // unlit, so the scene lights can't wash the grid out to white in light mode
  const floorMat = new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, depthWrite: false });
  // with a back wall, the floor is cut off where it would show through behind the wall
  const wallU = { uDir: { value: new THREE.Vector2(0, 1) }, uWall: { value: o.backdrop || 99 } };
  floorMat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, wallU);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vR;").replace("#include <uv_vertex>", "#include <uv_vertex>\nvR = position.xy;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vR;\nuniform vec2 uDir;\nuniform float uWall;").replace("#include <dithering_fragment>", `#include <dithering_fragment>\ngl_FragColor.a *= 1.0 - smoothstep(${(R * 0.7).toFixed(2)}, ${R.toFixed(2)}, length(vR));\nif (dot(vec2(vR.x, -vR.y), uDir) < -uWall) discard;`);
  };
  const floor = new THREE.Mesh(new THREE.CircleGeometry(R, 64), floorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; scene.add(floor);

  // optional back wall: the same grid standing up behind the model, fading out at the top and sides
  let wall: THREE.Group | null = null, wallTex: THREE.CanvasTexture | null = null;
  if (o.backdrop) {
    // sized to cover the camera's view at the wall's distance
    const W = 16, H = 13;
    wallTex = new THREE.CanvasTexture(fc); wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping; wallTex.repeat.set(W / sq, H / sq); wallTex.colorSpace = THREE.SRGBColorSpace;
    const wallMat = new THREE.MeshBasicMaterial({ map: wallTex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    wallMat.onBeforeCompile = sh => {
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vW;").replace("#include <uv_vertex>", "#include <uv_vertex>\nvW = position.xy;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vW;").replace("#include <dithering_fragment>", `#include <dithering_fragment>\ngl_FragColor.a *= (1.0 - smoothstep(${(W * 0.32).toFixed(2)}, ${(W / 2).toFixed(2)}, abs(vW.x))) * (1.0 - smoothstep(${(H * 0.6).toFixed(2)}, ${H.toFixed(2)}, vW.y));`);
    };
    const g = new THREE.PlaneGeometry(W, H); g.translate(0, H / 2, 0);
    wall = new THREE.Group(); const m = new THREE.Mesh(g, wallMat); m.position.set(0, -0.01, -o.backdrop); wall.add(m); scene.add(wall);
  }

  return {
    /** keep the wall behind the model when the camera orbits */
    faceCamera(yaw: number) { if (!wall) return; wall.rotation.y = yaw; wallU.uDir.value.set(Math.sin(yaw), Math.cos(yaw)); },
    /** redraw the grid square from the current theme tokens */
    apply(dark: boolean) {
      // light mode needs a stronger line than the --line token or the grid vanishes on white
      fx.fillStyle = cssVar(dark ? "surface" : "surface2"); fx.fillRect(0, 0, 256, 256);
      fx.strokeStyle = dark ? cssVar("line") : cssVar("a1"); fx.globalAlpha = dark ? 1 : .85; fx.lineWidth = dark ? 6 : 8; fx.strokeRect(0, 0, 256, 256); fx.globalAlpha = 1;
      fx.fillStyle = cssVar(dark ? "a1" : "a2"); fx.globalAlpha = dark ? .35 : .9; fx.beginPath(); fx.arc(0, 0, 12, 0, 7); fx.fill(); fx.globalAlpha = 1;
      floorTex.needsUpdate = true; if (wallTex) wallTex.needsUpdate = true; rim.color.set(cssVar("a2"));
    },
    /** the floor texture scrolls under the character while he walks */
    floorTex,
  };
}
