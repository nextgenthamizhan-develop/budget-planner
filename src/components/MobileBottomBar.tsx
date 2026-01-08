import type { Theme } from "../utils/theme";
import { ThemeToggle } from "./ThemeToggle";

export function MobileBottomBar({
  theme,
  onToggleTheme,
}: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 sm:hidden">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="
          rounded-3xl border shadow-soft px-3 py-2 flex items-center justify-between gap-2
          bg-white/90 backdrop-blur border-slate-200
          dark:bg-slate-900/90 dark:border-slate-700
        ">
          <div className="text-xs">
            <p className="font-bold text-slate-900 dark:text-slate-100">Budget Planner</p>
            <p className="text-slate-600 dark:text-slate-300">Theme</p>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} compact />
        </div>
      </div>
    </div>
  );
}
