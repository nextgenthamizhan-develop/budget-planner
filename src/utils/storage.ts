import type { BudgetState, MonthKey, Transaction } from "../types";

const KEY = "budget_planner_v3";

const nowMonthKey = (): MonthKey => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export const defaultState = (): BudgetState => ({
  month: nowMonthKey(),
  transactions: {},
  budgets: {},
  recurring: [
    { id: crypto.randomUUID(), enabled: true, type: "income", dayOfMonth: 1, category: "Salary", amount: 0, note: "Monthly salary" },
    { id: crypto.randomUUID(), enabled: true, type: "expense", dayOfMonth: 5, category: "Rent", amount: 0, note: "Monthly rent" },
  ],
  cloud: {},
});

export const loadState = (): BudgetState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as BudgetState;
    if (!parsed?.month || !parsed?.transactions) return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      budgets: parsed.budgets ?? {},
      recurring: parsed.recurring ?? defaultState().recurring,
      cloud: parsed.cloud ?? {},
    };
  } catch {
    return defaultState();
  }
};

export const saveState = (state: BudgetState) => localStorage.setItem(KEY, JSON.stringify(state));

export const getMonthTx = (state: BudgetState, month: MonthKey): Transaction[] =>
  state.transactions[month] ?? [];

export const setMonthTx = (state: BudgetState, month: MonthKey, tx: Transaction[]): BudgetState => ({
  ...state,
  transactions: { ...state.transactions, [month]: tx },
});

export const getMonthBudgets = (state: BudgetState, month: MonthKey) =>
  state.budgets[month] ?? {};

export const setMonthBudgets = (state: BudgetState, month: MonthKey, budgets: any): BudgetState => ({
  ...state,
  budgets: { ...state.budgets, [month]: budgets },
});
