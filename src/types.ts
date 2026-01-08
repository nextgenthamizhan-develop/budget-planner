export type TxType = "income" | "expense";

export type Category =
  | "Salary" | "Business" | "Freelance" | "Gift"
  | "Food" | "Transport" | "Rent" | "Utilities" | "Health" | "Education"
  | "Shopping" | "Entertainment" | "Savings" | "Other";

export type Transaction = {
  id: string;
  type: TxType;
  date: string; // YYYY-MM-DD
  category: Category;
  note?: string;
  amount: number;
};

export type MonthKey = string; // YYYY-MM

export type BudgetsByMonth = Record<MonthKey, Partial<Record<Category, number>>>;

export type RecurringRule = {
  id: string;
  enabled: boolean;
  type: TxType;
  dayOfMonth: number; // 1..28
  category: Category;
  amount: number;
  note?: string;
};

export type BudgetState = {
  month: MonthKey;
  transactions: Record<MonthKey, Transaction[]>;
  budgets: BudgetsByMonth;
  recurring: RecurringRule[];
  cloud?: {
    lastPulledAt?: number;
    lastPushedAt?: number;
  };
};
