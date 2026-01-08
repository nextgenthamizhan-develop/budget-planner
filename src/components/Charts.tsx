import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type { Transaction } from "../types";
import { sumBy } from "../utils/money";
import type { Theme } from "../utils/theme";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function palette(theme: Theme) {
  if (theme === "dark") {
    return {
      text: "#e5e7eb",
      grid: "rgba(148,163,184,0.22)",
      income: "#22c55e",
      expense: "#fb7185",
      donut: ["#60a5fa", "#a78bfa", "#34d399", "#fb7185", "#fbbf24", "#2dd4bf", "#f472b6", "#cbd5e1"],
    };
  }
  return {
    text: "#0f172a",
    grid: "rgba(15,23,42,0.10)",
    income: "#16a34a",
    expense: "#e11d48",
    donut: ["#2563eb", "#7c3aed", "#059669", "#e11d48", "#d97706", "#0d9488", "#db2777", "#475569"],
  };
}

export function Charts({ tx, theme }: { tx: Transaction[]; theme: Theme }) {
  const income = tx.filter((t) => t.type === "income");
  const expense = tx.filter((t) => t.type === "expense");
  const byExpenseCategory = expense.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const labels = Object.keys(byExpenseCategory);
  const values = Object.values(byExpenseCategory);

  const totalIncome = sumBy(income);
  const totalExpense = sumBy(expense);

  const p = palette(theme);

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: p.text } },
      tooltip: { enabled: true },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: { ticks: { color: p.text }, grid: { color: p.grid } },
      y: { ticks: { color: p.text }, grid: { color: p.grid } },
    },
  };

  const doughnut = {
    labels: labels.length ? labels : ["No expenses yet"],
    datasets: [
      {
        label: "Expenses",
        data: labels.length ? values : [1],
        backgroundColor: labels.length ? labels.map((_, i) => p.donut[i % p.donut.length]) : [p.grid],
        borderWidth: 0,
      },
    ],
  };

  const bar = {
    labels: ["Income", "Expenses"],
    datasets: [
      { label: "Monthly totals", data: [totalIncome, totalExpense], backgroundColor: [p.income, p.expense], borderRadius: 10 },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-4 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Income vs Expenses</h2>
        <div className="mt-3"><Bar data={bar} options={barOptions} /></div>
      </div>
      <div className="rounded-2xl bg-white border border-slate-100 shadow-soft p-4 dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Expense breakdown</h2>
        <div className="mt-3"><Doughnut data={doughnut} options={commonOptions} /></div>
      </div>
    </div>
  );
}
