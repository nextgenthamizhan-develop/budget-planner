import type { Transaction } from "../types";
import { formatLKR } from "../utils/money";

export function TransactionTable({
  tx,
  onDelete,
}: {
  tx: Transaction[];
  onDelete: (id: string) => void;
}) {
  const sorted = [...tx].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          Transactions
        </h2>
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {sorted.length} items
        </span>
      </div>

      <div className="mt-3 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600 dark:text-slate-300">
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Type</th>
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Note</th>
              <th className="py-2 pr-3 text-right">Amount</th>
              <th className="py-2 pr-3"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                <td className="py-2 pr-3 whitespace-nowrap text-slate-900 dark:text-slate-100">{t.date}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      t.type === "income"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td className="py-2 pr-3 text-slate-900 dark:text-slate-100">{t.category}</td>
                <td className="py-2 pr-3 text-slate-600 dark:text-slate-300">{t.note ?? "—"}</td>
                <td className="py-2 pr-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {formatLKR(t.amount)}
                </td>
                <td className="py-2 pr-1 text-right">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    type="button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td className="py-6 text-center text-slate-600 dark:text-slate-300" colSpan={6}>
                  No transactions for this month yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
