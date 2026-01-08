export const formatLKR = (value: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

export const clampMoney = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export const sumBy = (items: { amount: number }[]) =>
  items.reduce((acc, x) => acc + (x.amount || 0), 0);
