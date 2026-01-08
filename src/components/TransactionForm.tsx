import { useMemo, useState } from "react";
import type { Category, Transaction, TxType } from "../types";
import { clampMoney } from "../utils/money";

const categories: Category[] = [
  "Salary","Business","Freelance","Gift",
  "Food","Transport","Rent","Utilities","Health","Education",
  "Shopping","Entertainment","Savings","Other",
];

const today = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function TransactionForm({ onAdd }: { onAdd: (t: Transaction) => void }) {
  const [type, setType] = useState<TxType>("expense");
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<Category>("Food");
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState("");

  const catOptions = useMemo(() => {
    if (type === "income") return ["Salary", "Business", "Freelance", "Gift", "Other"] as Category[];
    return categories.filter((c) => !["Salary","Business","Freelance","Gift"].includes(c)) as Category[];
  }, [type]);

  const submit = () => {
    const cleanAmount = clampMoney(amount);
    if (!cleanAmount) return;

    onAdd({
      id: crypto.randomUUID(),
      type,
      date,
      category,
      note: note.trim() || undefined,
      amount: cleanAmount,
    });

    setAmount(0);
    setNote("");
  };

  return (
    <div className="rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          Add transaction
        </h2>

        <div className="flex rounded-xl border overflow-hidden border-slate-200 dark:border-slate-700">
          <button
            className={`px-3 py-2 text-sm font-semibold ${
              type === "expense"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
            onClick={() => {
              setType("expense");
              setCategory("Food");
            }}
            type="button"
          >
            Expense
          </button>
          <button
            className={`px-3 py-2 text-sm font-semibold ${
              type === "income"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
            onClick={() => {
              setType("income");
              setCategory("Salary");
            }}
            type="button"
          >
            Income
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
              border-slate-200 bg-white text-slate-900
              dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white
              border-slate-200 text-slate-900
              dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {catOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Amount
          </label>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="e.g. 5000"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
              border-slate-200 bg-white text-slate-900
              dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Note (optional)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. groceries, bus fare"
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
              border-slate-200 bg-white text-slate-900
              dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={submit}
          className="rounded-xl px-4 py-2 text-sm font-semibold shadow-sm
            bg-slate-900 text-white hover:opacity-95
            dark:bg-slate-100 dark:text-slate-900"
        >
          Add
        </button>
      </div>
    </div>
  );
}
