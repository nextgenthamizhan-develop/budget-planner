import type { MonthKey, RecurringRule, Transaction } from "../types";

const pad2 = (n: number) => String(n).padStart(2, "0");

export const ensureRecurringForMonth = (
  month: MonthKey,
  rules: RecurringRule[],
  existing: Transaction[]
): { tx: Transaction[]; added: number } => {
  const [yStr, mStr] = month.split("-");
  const y = Number(yStr);
  const mo = Number(mStr);

  const existingKeys = new Set(
    existing.map((t) => `${t.date}|${t.type}|${t.category}|${t.amount}|${t.note ?? ""}`)
  );

  let added = 0;
  const newOnes: Transaction[] = [];

  for (const r of rules) {
    if (!r.enabled) continue;
    if (r.amount <= 0) continue;

    const day = Math.min(Math.max(1, r.dayOfMonth), 28);
    const date = `${y}-${pad2(mo)}-${pad2(day)}`;
    const key = `${date}|${r.type}|${r.category}|${r.amount}|${r.note ?? ""}`;
    if (existingKeys.has(key)) continue;

    newOnes.push({
      id: crypto.randomUUID(),
      type: r.type,
      date,
      category: r.category,
      amount: r.amount,
      note: r.note,
    });
    added++;
  }

  return { tx: [...newOnes, ...existing], added };
};
