export type Theme = "light" | "dark";
const KEY = "budget_theme_v2";

export const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
  localStorage.setItem(KEY, theme);
};

export const animateThemeSwap = () => {
  const root = document.documentElement;
  root.classList.add("theme-animate");
  window.setTimeout(() => root.classList.remove("theme-animate"), 280);
};
