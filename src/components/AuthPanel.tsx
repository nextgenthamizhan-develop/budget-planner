import { useState } from "react";
import { supabase } from "../supabaseClient";

type Props = {
  userEmail: string | null;
  onLogout: () => Promise<void>;
  onLoginChanged: () => Promise<void>;
};

export function AuthPanel({ userEmail, onLogout, onLoginChanged }: Props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg(null);

    if (!supabase) {
      setMsg("Supabase is not configured. Add env variables and restart the app.");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !pass) {
      setMsg("Enter email and password.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: pass,
        });

        if (error) {
          setMsg(error.message);
          return;
        }

        setMsg("Signup successful. Now login.");
        setMode("login");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      setMsg("Logged in!");
      await onLoginChanged();
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border shadow-soft p-4 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Cloud Sync (Supabase)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Login to sync your budget data across mobile and computer.
          </p>
        </div>

        {userEmail && (
          <button
            onClick={onLogout}
            type="button"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Logout
          </button>
        )}
      </div>

      {/* Supabase missing */}
      {!supabase && (
        <div className="mt-3 rounded-xl border p-3 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-semibold">Supabase is not configured</p>
          <p className="mt-1 text-sm">
            Create <b>.env</b> in project root and add:
          </p>
          <pre className="mt-2 text-xs overflow-auto rounded-xl p-3 bg-white/70 dark:bg-black/30 border border-amber-200 dark:border-amber-900/50">
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
          </pre>
          <p className="mt-2 text-xs">
            Then restart: <b>npm run dev</b>
          </p>
        </div>
      )}

      {/* Logged in */}
      {supabase && userEmail && (
        <div className="mt-3 rounded-xl border p-3 border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-900 dark:text-slate-100">
            Logged in as <b>{userEmail}</b>
          </p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Your changes will sync automatically (if cloud sync is enabled in App).
          </p>
        </div>
      )}

      {/* Not logged in */}
      {supabase && !userEmail && (
        <>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMsg(null);
              }}
              className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                mode === "login"
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                  : "bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMsg(null);
              }}
              className={`rounded-xl px-3 py-2 text-sm font-semibold border ${
                mode === "signup"
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                  : "bg-white text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Password
              </label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                type="password"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm
                bg-slate-900 text-white hover:opacity-95
                dark:bg-slate-100 dark:text-slate-900
                ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tip: For testing, you can disable “Confirm email” in Supabase Auth settings.
            </p>
          </div>
        </>
      )}

      {/* Message */}
      {msg && (
        <div className="mt-3 rounded-xl border p-3 text-sm border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
          {msg}
        </div>
      )}
    </div>
  );
}
