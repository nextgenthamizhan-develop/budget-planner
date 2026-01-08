import type { Theme } from "../utils/theme";

export function ThemeToggle({
  theme,
  onToggle,
  compact,
}: {
  theme: Theme;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="
        inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm
        border-slate-200 bg-white text-slate-800 hover:bg-slate-50
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800
      "
    >
      <span className="text-base">{theme === "dark" ? "🌙" : "☀️"}</span>
      {compact ? (
        <span className="opacity-80">{theme === "dark" ? "Dark" : "Light"}</span>
      ) : (
        <>
          <span>{theme === "dark" ? "Dark" : "Light"}</span>
          <span className="opacity-60">Mode</span>
        </>
      )}
    </button>
  );
}
