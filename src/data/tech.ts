import icons from "./icons.json";

// icons.json holds brand paths and colours extracted from the simple-icons package
export type Tech = { name: string; g: string; hex?: string; path?: string; txt?: string };

export const groups = [
  { id: "all", label: "All" },
  { id: "build", label: "Languages & frameworks" },
  { id: "ui", label: "UI & visuals" },
  { id: "api", label: "APIs & real-time" },
  { id: "test", label: "Testing" },
  { id: "ship", label: "Tooling & delivery" },
];

export const tech: Tech[] = [
  ...(icons as Tech[]),
  { name: "REST API", g: "api", txt: "API" },
  { name: "Kubb", g: "api", txt: "K" },
  { name: "WebSockets", g: "api", txt: "WS" },
  { name: "Playwright", g: "test", txt: "PW" },
].sort((a, b) => groups.findIndex(g => g.id === a.g) - groups.findIndex(g => g.id === b.g));
