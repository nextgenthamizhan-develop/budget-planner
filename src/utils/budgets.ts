import type { Category, Transaction } from "../types";

export const expenseCategories: Category[] = [
  "Food","Transport","Rent","Utilities","Health","Education","Shopping","Entertainment","Savings","Other",
];

export const spentByCategory = (tx: Transaction[]) => {
  const m: Partial<Record<Category, number>> = {};
  for (const t of tx) {
    if (t.type !== "expense") continue;
    m[t.category] = (m[t.category] || 0) + t.amount;
  }
  return m;
};
