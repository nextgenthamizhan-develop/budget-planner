import type { Category, RecurringRule } from "../types";

const categories: Category[] = [
  "Salary","Business","Freelance","Gift",
  "Food","Transport","Rent","Utilities","Health","Education",
  "Shopping","Entertainment","Savings","Other",
];

export function RecurringPanel({
  rules,
  onChange,
  onAddRule,
  onDeleteRule,
}: {
  rules: RecurringRule[];
  onChange: (r: RecurringRule) => void;
  onAddRule: () => void;
  onDeleteRule: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Recurring transactions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Auto-adds monthly items (salary, rent, etc.)
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRule}
          className="rounded-xl px-3 py-2 text-sm font-semibold
            bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
        >
          + Add rule
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {rules.map((r) => (
          <div key={r.id} className="rounded-2xl border p-3 border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={r.enabled}
                  onChange={(e) => onChange({ ...r, enabled: e.target.checked })}
                />
                Enabled
              </label>

              <select
                value={r.type}
                onChange={(e) => onChange({ ...r, type: e.target.value as any })}
                className="rounded-xl border px-3 py-2 text-sm bg-white
                  border-slate-200 text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                <option value="income">income</option>
                <option value="expense">expense</option>
              </select>

              <input
                type="number"
                min={1}
                max={28}
                value={r.dayOfMonth}
                onChange={(e) => onChange({ ...r, dayOfMonth: Number(e.target.value) })}
                className="w-24 rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Day"
                title="Day of month (1-28)"
              />

              <select
                value={r.category}
                onChange={(e) => onChange({ ...r, category: e.target.value as any })}
                className="rounded-xl border px-3 py-2 text-sm bg-white
                  border-slate-200 text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <input
                type="number"
                value={r.amount || ""}
                onChange={(e) => onChange({ ...r, amount: Number(e.target.value) })}
                className="w-32 rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Amount"
              />

              <input
                value={r.note ?? ""}
                onChange={(e) => onChange({ ...r, note: e.target.value })}
                className="flex-1 rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Note"
              />

              <button
                type="button"
                onClick={() => onDeleteRule(r.id)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900
                  dark:text-slate-300 dark:hover:text-white"
              >
                Delete
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              This rule will auto-add on day <b>{r.dayOfMonth}</b> each month (safe range 1–28).
            </p>
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            No recurring rules yet.
          </div>
        )}
      </div>
    </div>
  );
}
