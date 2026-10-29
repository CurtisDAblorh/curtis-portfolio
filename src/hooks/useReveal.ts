import { useEffect } from "react";

type Dir = "down" | "left" | "right" | "up" | "fade";

// Slide-ins modelled on the original site's framer-motion variants: headings drop from above, cards slide in
// from the side or rise from below, once each, with a spring overshoot. Cards entering together are staggered.
// Uses the Web Animations API on translate/opacity so it doesn't override the cards' hover transitions or CSS animations.
const from: Record<Dir, string> = { down: "0 -50px", left: "-100px 0", right: "100px 0", up: "0 80px", fade: "0 0" };
const groups: [selector: string, dir: Dir, stagger: number][] = [
  [".sec-head", "down", .12],
  ["#about .about-text", "fade", 0], ["#about .role", "left", .15],
  ["#expList .exp-item", "left", .08], ["#expPanel", "right", 0],
  ["#projectGrid .proj", "up", .15],
  ["#cityStage", "left", 0], [".lab-side > *", "right", .12], [".showcase .shot", "up", .2],
  ["#techFilters", "fade", 0], ["#techGrid .t", "up", .03],
  [".contact-copy", "left", 0], ["#contactForm", "right", 0],
];

export function useReveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("animate" in Element.prototype)) return;
    const meta = new Map<Element, { g: number; dir: Dir; step: number }>();
    groups.forEach(([sel, dir, step], g) => document.querySelectorAll(sel).forEach(el => { meta.set(el, { g, dir, step }); el.classList.add("rv"); }));
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).map(e => e.target)
        .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      const seen = new Map<number, number>();
      hit.forEach(el => {
        const { g, dir, step } = meta.get(el)!, k = seen.get(g) || 0; seen.set(g, k + 1);
        io.unobserve(el); el.classList.remove("rv");
        el.animate([{ translate: from[dir], opacity: 0 }, { translate: "0 0", opacity: 1 }],
          { duration: dir === "fade" ? 700 : 900, delay: k * step * 1000, easing: dir === "fade" ? "ease-out" : "cubic-bezier(.22,1.3,.36,1)", fill: "backwards" });
      });
    }, { threshold: .2, rootMargin: "0px 0px -8% 0px" });
    meta.forEach((_, el) => io.observe(el));
    return () => { io.disconnect(); meta.forEach((_, el) => el.classList.remove("rv")); };
  }, []);
}
