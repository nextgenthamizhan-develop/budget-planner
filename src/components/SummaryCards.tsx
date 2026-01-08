import type { Transaction } from "../types";
import { formatLKR, sumBy } from "../utils/money";

export function SummaryCards({ tx }: { tx: Transaction[] }) {
  const income = tx.filter((t) => t.type === "income");
  const expense = tx.filter((t) => t.type === "expense");
  const totalIncome = sumBy(income);
  const totalExpense = sumBy(expense);
  const net = totalIncome - totalExpense;

  const card = "rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className={card}>
        <p className="text-sm text-slate-600 dark:text-slate-300">Total Income</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{formatLKR(totalIncome)}</p>
      </div>
      <div className={card}>
        <p className="text-sm text-slate-600 dark:text-slate-300">Total Expenses</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">{formatLKR(totalExpense)}</p>
      </div>
      <div className={card}>
        <p className="text-sm text-slate-600 dark:text-slate-300">Net</p>
        <p className={`mt-1 text-2xl font-bold ${net >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{formatLKR(net)}</p>
      </div>
    </div>
  );
}
