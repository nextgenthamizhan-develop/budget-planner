import type { Category, MonthKey, Transaction } from "../types";
import { expenseCategories, spentByCategory } from "../utils/budgets";
import { formatLKR } from "../utils/money";

export function BudgetsPanel({
  month,
  tx,
  budgets,
  onSetBudget,
}: {
  month: MonthKey;
  tx: Transaction[];
  budgets: Partial<Record<Category, number>>;
  onSetBudget: (cat: Category, amount: number) => void;
}) {
  const spent = spentByCategory(tx);

  return (
    <div className="rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Category budgets</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Month: {month}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {expenseCategories.map((cat) => {
          const limit = budgets[cat] || 0;
          const used = spent[cat] || 0;
          const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
          const over = limit > 0 && used > limit;

          return (
            <div key={cat} className="rounded-2xl border p-3 border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{cat}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Spent: {formatLKR(used)} {limit > 0 ? ` / Budget: ${formatLKR(limit)}` : "(No budget set)"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={limit || ""}
                    placeholder="Set budget"
                    onChange={(e) => onSetBudget(cat, Number(e.target.value))}
                    className="w-28 rounded-xl border px-3 py-2 text-sm
                      border-slate-200 bg-white text-slate-900
                      dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mt-3 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${over ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                {limit > 0 ? `${pct.toFixed(0)}% used` : "Set a budget to track progress."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
