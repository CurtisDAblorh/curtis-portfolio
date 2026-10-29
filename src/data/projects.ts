export type Project = {
  name: string;
  /** a screenshot or render under public/; `contain` shows it whole on white instead of cropping to fill */
  cover: { image: string; alt: string; contain?: boolean };
  wide?: boolean;
  featured?: boolean;
  cats: string[];
  desc: string;
  tags: string[];
  live: string | null;
  /** null until the project has its own public repo */
  code: string | null;
};

export const projects: Project[] = [
  {
    name: "Ebuyer Storefront", cover: { image: "projects/ebuyer.jpg", alt: "Ebuyer storefront homepage: \"Everything you want, beautifully delivered\" beside floating product cards for a laptop, phone, perfume and watch" }, wide: true, featured: true, cats: ["Next.js", "D3"],
    desc: "Ecommerce storefront with 150+ products, a D3 price-range brush, price-history and spending charts, a validated multi-step checkout with live card preview, wishlist and persistent bag. MUI component library in Storybook, tested with Jest and Playwright.",
    tags: ["nextjs", "mui", "redux", "d3"],
    live: "https://curtisdablorh.github.io/Ebuyer-Ecommerce-Site/", code: "https://github.com/CurtisDAblorh/Ebuyer-Ecommerce-Site",
  },
  {
    name: "Reverb", cover: { image: "projects/reverb.jpg", alt: "Reverb music player: a dark interface with a glowing radial visualiser, mood cards and a playback bar" }, cats: ["Next.js", "D3"],
    desc: "Genre-reactive Spotify player: the UI, live D3 visualiser and backdrop change with every track. Command palette, shortcuts and a listening-stats dashboard.",
    tags: ["typescript", "nextjs", "shadcn", "d3"],
    live: "https://curtisdablorh.github.io/reverb/", code: "https://github.com/CurtisDAblorh/reverb",
  },
  {
    name: "3D Portfolio (v1)", cover: { image: "projects/portfolio-v1.png", alt: "The first version of the portfolio: a dark starfield hero reading \"Hi, I'm Curtis\" beside a 3D model of Curtis at his gaming desk" },
    cats: ["React", "3D"],
    desc: "The first version of this site: my 3D desk scene on a starfield, character models, work history and projects, with transitions and looping SVG, PNG and Lottie animations.",
    tags: ["react", "typescript", "threejs", "tailwind"],
    live: "https://curtisdablorh.github.io/Curtis_3D_Port_folio/", code: "https://github.com/CurtisDAblorh/Curtis_3D_Port_folio",
  },
  {
    name: "Blood Work Audit", cover: { image: "projects/blood-work-audit.png", alt: "Blood Work Audit: a finding for SITE-001 with its evidence citations, and the cited panel record open in the sidebar showing its integrity score, details and measurements" },
    wide: true, cats: ["React", "Data viz"],
    desc: "Which clinical-trial sites redraw the most blood, and why? Ranks sites by repeat-draw rate, then gives each site findings that cite the exact records behind every claim. Click a citation and that collection note or processing event opens beside it. A filterable, paginated explorer covers all 10,000 specimen panels.",
    tags: ["react", "typescript", "tanstack", "shadcn", "threejs"],
    live: "https://curtisdablorh.github.io/blood-work-audit/", code: "https://github.com/CurtisDAblorh/blood-work-audit",
  },
  {
    name: "C++ Orthotic Exoskeleton", cover: { image: "projects/exoskeleton.png", alt: "Fusion 360 model of the hand exoskeleton: a forearm brace with linear actuators driving jointed finger linkages", contain: true }, wide: true, cats: ["Hardware"],
    desc: "A rehabilitation exoskeleton for muscular dystrophy patients, calibrated by the patient through touch pins that read EMG signal strength from the forearm.",
    tags: ["c++", "fusion 360", "arduino"],
    live: null, code: "https://github.com/CurtisDAblorh/Orthotic_Exoskeleton",
  },
];
