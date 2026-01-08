import React from "react";

export function Shell({
  children,
  rightSlot,
}: {
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 pb-28 sm:pb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Personal Budget Planner
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Track income & expenses monthly. Budgets, recurring, CSV, and cloud sync.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {rightSlot}
            <div className="rounded-2xl border shadow-soft px-4 py-3 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300">Works on</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Mobile • Tablet • Desktop
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">{children}</div>

        <footer className="mt-10 text-xs text-slate-500 dark:text-slate-400">
          Local first + optional Supabase cloud sync.
        </footer>
      </div>
    </div>
  );
}
