import type { MonthKey } from "../types";

export function MonthPicker({ month, onChange }: { month: MonthKey; onChange: (m: MonthKey) => void }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Month</label>
      <input
        type="month"
        value={month}
        onChange={(e) => onChange(e.target.value)}
        className="
          rounded-xl border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2
          border-slate-200 bg-white text-slate-900 focus:ring-slate-300
          dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-600
        "
      />
    </div>
  );
}
