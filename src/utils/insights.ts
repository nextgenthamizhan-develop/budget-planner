import type { Transaction } from "../types";
import { sumBy } from "./money";

type Insight = { title: string; body: string };
const pct = (a: number, b: number) => (b <= 0 ? 0 : (a / b) * 100);

export const buildExpertInsights = (tx: Transaction[]): Insight[] => {
  const income = tx.filter((t) => t.type === "income");
  const expense = tx.filter((t) => t.type === "expense");
  const totalIncome = sumBy(income);
  const totalExpense = sumBy(expense);
  const net = totalIncome - totalExpense;

  const byCategory = expense.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
  const savingsRate = totalIncome > 0 ? (net / totalIncome) * 100 : 0;

  const insights: Insight[] = [];
  if (totalIncome <= 0) {
    insights.push({ title: "No income recorded", body: "Add income first to calculate saving rate and affordability." });
    return insights;
  }

  insights.push(
    net >= 0
      ? { title: "Cashflow positive", body: "Expenses are within income. Consider automating savings/investments." }
      : { title: "Cashflow negative", body: "You spent more than you earned. Reduce non-essential categories or increase income." }
  );

  if (savingsRate >= 20) insights.push({ title: "Strong savings rate", body: "20%+ surplus. Split between emergency fund and investing." });
  else if (savingsRate >= 10) insights.push({ title: "Moderate savings rate", body: "Aim for 20% by trimming top categories or raising income." });
  else insights.push({ title: "Low savings rate", body: "Try saving 10% immediately after payday and cap discretionary spending." });

  if (top) {
    const [cat, amount] = top;
    const share = pct(amount, totalExpense);
    insights.push({
      title: "Top spending category",
      body: `${cat} is highest (${share.toFixed(1)}% of expenses). Set a cap and track weekly.`,
    });
  }

  const expenseRatio = pct(totalExpense, totalIncome);
  if (expenseRatio > 90) insights.push({ title: "High spending pressure", body: "Expenses > 90% of income. Tighten discretionary limits." });
  else if (expenseRatio > 70) insights.push({ title: "Manageable spending", body: "Expenses 70–90%. Optimize big categories and build emergency fund." });
  else insights.push({ title: "Good flexibility", body: "Expenses < 70%. Consider goal-based investing." });

  return insights;
};
