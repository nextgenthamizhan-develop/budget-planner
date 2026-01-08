import type { BudgetState, MonthKey, Transaction } from "../types";

const esc = (s: string) => `"${String(s).replaceAll('"', '""')}"`;

export const exportMonthCsv = (month: MonthKey, tx: Transaction[]) => {
  const header = ["month","id","type","date","category","amount","note"].join(",");
  const rows = tx.map((t) =>
    [esc(month), esc(t.id), esc(t.type), esc(t.date), esc(t.category), String(t.amount), esc(t.note ?? "")]
      .join(",")
  );
  return [header, ...rows].join("\n");
};

export const exportAllCsv = (state: BudgetState) => {
  const header = ["month","id","type","date","category","amount","note"].join(",");
  const rows: string[] = [];
  for (const [month, tx] of Object.entries(state.transactions)) {
    for (const t of tx) {
      rows.push([esc(month), esc(t.id), esc(t.type), esc(t.date), esc(t.category), String(t.amount), esc(t.note ?? "")]
        .join(","));
    }
  }
  return [header, ...rows].join("\n");
};

const parseCsvLine = (line: string) => {
  const out: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQ = false;
      else cur += ch;
    } else {
      if (ch === ",") { out.push(cur); cur = ""; }
      else if (ch === '"') inQ = true;
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
};

export const importCsvToState = (csvText: string, state: BudgetState): BudgetState => {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return state;

  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);

  const mIdx = idx("month");
  const idIdx = idx("id");
  const typeIdx = idx("type");
  const dateIdx = idx("date");
  const catIdx = idx("category");
  const amtIdx = idx("amount");
  const noteIdx = idx("note");

  if ([mIdx, idIdx, typeIdx, dateIdx, catIdx, amtIdx].some((x) => x < 0)) return state;

  const next = { ...state, transactions: { ...state.transactions } };

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const month = cols[mIdx];
    const t: Transaction = {
      id: cols[idIdx] || crypto.randomUUID(),
      type: cols[typeIdx] as any,
      date: cols[dateIdx],
      category: cols[catIdx] as any,
      amount: Number(cols[amtIdx] || 0),
      note: noteIdx >= 0 ? cols[noteIdx] || undefined : undefined,
    };
    if (!month || !t.date || !t.category || !t.type || !Number.isFinite(t.amount) || t.amount <= 0) continue;

    const cur = next.transactions[month] ?? [];
    if (cur.some((x) => x.id === t.id)) continue;
    next.transactions[month] = [t, ...cur];
  }

  return next;
};

export const downloadTextFile = (content: string, fileName: string, mime = "text/csv") => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
