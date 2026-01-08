import type { Transaction, MonthKey } from "../types";
import { formatLKR, sumBy } from "../utils/money";
import { buildExpertInsights } from "../utils/insights";
import type { Theme } from "../utils/theme";

export function ReportPreview({ month, tx, mode }: { month: MonthKey; tx: Transaction[]; mode: Theme }) {
  const income = tx.filter((t) => t.type === "income");
  const expense = tx.filter((t) => t.type === "expense");
  const totalIncome = sumBy(income);
  const totalExpense = sumBy(expense);
  const net = totalIncome - totalExpense;

  const insights = buildExpertInsights(tx);

  return (
    <div className={`pdf-skin ${mode === "dark" ? "pdf-dark" : "pdf-light"}`}>
      <div className="pdf-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Monthly Expert Report</h2>
            <p className="pdf-muted mt-1">
              Month: <span className="font-semibold">{month}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm pdf-muted">Net</p>
            <p className="text-xl font-extrabold">{formatLKR(net)}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="pdf-card rounded-2xl p-4">
            <p className="text-xs font-semibold pdf-muted">Total Income</p>
            <p className="text-lg font-bold">{formatLKR(totalIncome)}</p>
            <div className="mt-2 inline-flex rounded-full px-2 py-1 text-xs font-bold pdf-badge-income">Income</div>
          </div>

          <div className="pdf-card rounded-2xl p-4">
            <p className="text-xs font-semibold pdf-muted">Total Expenses</p>
            <p className="text-lg font-bold">{formatLKR(totalExpense)}</p>
            <div className="mt-2 inline-flex rounded-full px-2 py-1 text-xs font-bold pdf-badge-expense">Expense</div>
          </div>

          <div className="pdf-card rounded-2xl p-4">
            <p className="text-xs font-semibold pdf-muted">Transactions</p>
            <p className="text-lg font-bold">{tx.length}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold">Expert insights</h3>
          <div className="mt-3 space-y-3">
            {insights.map((i) => (
              <div key={i.title} className="pdf-card rounded-2xl p-4">
                <p className="font-bold">{i.title}</p>
                <p className="mt-1 pdf-muted">{i.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-xs pdf-muted">
          Note: This report uses spending ratio, savings rate, and category concentration guidance.
        </div>
      </div>
    </div>
  );
}
