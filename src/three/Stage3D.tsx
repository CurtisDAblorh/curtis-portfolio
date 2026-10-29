import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

type Props = {
  id: string; label: string;
  /** NoToneMapping (the character and city scenes); the desk keeps ACES like the original site */
  flat?: boolean; shadows?: boolean;
  canvasTitle?: string;
  /** the 3D scene, rendered inside the canvas */
  children: ReactNode;
  /** HUD and loading text, layered over the canvas */
  overlay?: ReactNode;
};

/** A 3D card with the rotating gradient outline. Rendering pauses while it is off screen. */
export function Stage3D({ id, label, flat, shadows, canvasTitle, children, overlay }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div className="stage" id={id} aria-label={label} ref={ref}>
      <Canvas className="r3f" frameloop={visible ? "always" : "never"} flat={flat} shadows={shadows} dpr={[1, 2]}
        camera={{ fov: 32, near: 0.05, far: 50 }} gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => { if (canvasTitle) gl.domElement.title = canvasTitle; }}>
        {children}
      </Canvas>
      {overlay}
    </div>
  );
}

/** "Solid / Wire / Normals" toggle shared by the stages. */
export function ShadeToggle<T extends string>({ options, value, onChange, label }: { options: [T, string][]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([v, text]) => <button key={v} aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>)}
    </div>
  );
}
