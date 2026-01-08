import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Shell } from "../components/Shell";
import { MonthPicker } from "../components/MonthPicker";
import { SummaryCards } from "../components/SummaryCards";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionTable } from "../components/TransactionTable";
import { Charts } from "../components/Charts";
import { ReportPreview } from "../components/ReportPreview";
import { ThemeToggle } from "../components/ThemeToggle";
import { MobileBottomBar } from "../components/MobileBottomBar";
import { BudgetsPanel } from "../components/BudgetsPanel";
import { RecurringPanel } from "../components/RecurringPanel";

import type { BudgetState, MonthKey, Transaction, Category, RecurringRule } from "../types";
import {
  getMonthTx,
  loadState,
  saveState,
  setMonthTx,
  getMonthBudgets,
  setMonthBudgets,
} from "../utils/storage";
import { type Theme, applyTheme, getInitialTheme, animateThemeSwap } from "../utils/theme";
import { exportElementToPDF } from "../utils/pdf";
import { ensureRecurringForMonth } from "../utils/recurring";
import { downloadTextFile, exportAllCsv, exportMonthCsv, importCsvToState } from "../utils/csv";

import { supabase } from "../supabaseClient";

export default function BudgetPlannerPage() {
  const nav = useNavigate();

  // Theme
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  useEffect(() => applyTheme(theme), [theme]);

  const toggleTheme = () => {
    animateThemeSwap();
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  // Local state
  const [state, setState] = useState<BudgetState>(() => loadState());
  useEffect(() => saveState(state), [state]);

  const month = state.month;

  const tx = useMemo(() => getMonthTx(state, month), [state, month]);
  const budgets = useMemo(() => getMonthBudgets(state, month), [state, month]);

  const setMonth = (m: MonthKey) => setState((s) => ({ ...s, month: m }));

  const addTx = (t: Transaction) => {
    setState((s) => {
      const current = getMonthTx(s, s.month);
      return setMonthTx(s, s.month, [t, ...current]);
    });
  };

  const deleteTx = (id: string) => {
    setState((s) => {
      const current = getMonthTx(s, s.month);
      return setMonthTx(s, s.month, current.filter((x) => x.id !== id));
    });
  };

  // Budgets
  const onSetBudget = (cat: Category, amount: number) => {
    setState((s) => {
      const cur = getMonthBudgets(s, s.month);
      return setMonthBudgets(s, s.month, { ...cur, [cat]: Number(amount) || 0 });
    });
  };

  // Recurring
  const onChangeRule = (r: RecurringRule) => {
    setState((s) => ({
      ...s,
      recurring: s.recurring.map((x) => (x.id === r.id ? r : x)),
    }));
  };

  const onAddRule = () => {
    setState((s) => ({
      ...s,
      recurring: [
        {
          id: crypto.randomUUID(),
          enabled: true,
          type: "expense",
          dayOfMonth: 1,
          category: "Other",
          amount: 0,
          note: "Recurring item",
        },
        ...s.recurring,
      ],
    }));
  };

  const onDeleteRule = (id: string) => {
    setState((s) => ({ ...s, recurring: s.recurring.filter((x) => x.id !== id) }));
  };

  // Apply recurring on month change
  useEffect(() => {
    setState((s) => {
      const existing = getMonthTx(s, s.month);
      const { tx: merged, added } = ensureRecurringForMonth(s.month, s.recurring, existing);
      if (!added) return s;
      return setMonthTx(s, s.month, merged);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  // PDF
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const downloadPDF = async () => {
    if (!pdfRef.current) return;
    await exportElementToPDF(pdfRef.current, `Budget_Report_${month}_${theme}.pdf`);
  };

  // CSV
  const exportMonth = () => {
    downloadTextFile(exportMonthCsv(month, tx), `budget_${month}.csv`);
  };

  const exportAll = () => {
    downloadTextFile(exportAllCsv(state), `budget_all.csv`);
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    setState((s) => importCsvToState(text, s));
  };

  // Logout (NO inline await in if)
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    nav("/login", { replace: true });
  };

  return (
    <>
      <Shell
        rightSlot={
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              onClick={logout}
              type="button"
              className="rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm
                border-slate-200 bg-white text-slate-800 hover:bg-slate-50
                dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl border shadow-soft p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
            bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800"
          >
            <MonthPicker month={month} onChange={setMonth} />

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                onClick={downloadPDF}
                type="button"
                className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-semibold shadow-sm
                bg-slate-900 text-white hover:opacity-95 dark:bg-slate-100 dark:text-slate-900"
              >
                Download PDF
              </button>

              <button
                onClick={exportMonth}
                type="button"
                className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-semibold border
                border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Export Month CSV
              </button>

              <button
                onClick={exportAll}
                type="button"
                className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-semibold border
                border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Export All CSV
              </button>

              <label
                className="w-full sm:w-auto rounded-xl px-4 py-2 text-sm font-semibold border cursor-pointer text-center
                border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                Import CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      importCsv(f);
                    }
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          <SummaryCards tx={tx} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TransactionForm onAdd={addTx} />
            <Charts tx={tx} theme={theme} />
          </div>

          <BudgetsPanel month={month} tx={tx} budgets={budgets} onSetBudget={onSetBudget} />

          <RecurringPanel
            rules={state.recurring}
            onChange={onChangeRule}
            onAddRule={onAddRule}
            onDeleteRule={onDeleteRule}
          />

          <TransactionTable tx={tx} onDelete={deleteTx} />

          {/* Hidden PDF render */}
          <div style={{ position: "fixed", left: "-10000px", top: 0, width: "794px" }}>
            <div ref={pdfRef}>
              <ReportPreview month={month} tx={tx} mode={theme} />
            </div>
          </div>
        </div>
      </Shell>

      <MobileBottomBar theme={theme} onToggleTheme={toggleTheme} />
    </>
  );
}
