import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void };
const ThemeContext = createContext<Ctx>({ theme: "light", toggle: () => {} });

/** Reads a design token (CSS custom property) from :root, e.g. cssVar("a1"). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue("--" + name).trim();

// Always opens light. The attribute is set before the state update so that anything reacting to `theme`
// (the 3D scenes recolouring from CSS tokens) already reads the new values.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    document.documentElement.dataset.theme = "light";
    return "light";
  });
  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
