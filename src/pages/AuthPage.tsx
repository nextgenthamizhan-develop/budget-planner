import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../supabaseClient";

export default function AuthPage() {
  const nav = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already logged in, go to /app
  useEffect(() => {
    if (!supabase) return;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        nav("/app", { replace: true });
      }
    })();
  }, [nav]);

  const submit = async () => {
    setMsg(null);

    if (!isSupabaseConfigured || !supabase) {
      setMsg("Supabase is not configured. Add .env variables and restart.");
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

      nav("/app", { replace: true });
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-3xl border shadow-soft p-6 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
            Budget Planner
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Login or create an account to sync your data across devices.
          </p>

          {/* Supabase config warning */}
          {!isSupabaseConfigured && (
            <div className="mt-4 rounded-2xl border p-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold">Supabase not configured</p>
              <p className="mt-2 text-sm">
                Create <b>.env</b> in your project root (same folder as <b>package.json</b>):
              </p>
              <pre className="mt-2 text-xs overflow-auto rounded-xl p-3 bg-white/70 dark:bg-black/30 border border-amber-200 dark:border-amber-900/50">
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
              </pre>
              <p className="mt-2 text-xs">
                Restart the dev server: <b>Ctrl+C</b> then <b>npm run dev</b>
              </p>
            </div>
          )}

          {/* Mode tabs */}
          <div className="mt-5 flex gap-2">
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

          {/* Inputs */}
          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Password
              </label>
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm
                  border-slate-200 bg-white text-slate-900
                  dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                type="password"
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={busy || !isSupabaseConfigured}
            onClick={submit}
            className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold shadow-sm
              bg-slate-900 text-white hover:opacity-95
              dark:bg-slate-100 dark:text-slate-900
              ${(busy || !isSupabaseConfigured) ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>

          {/* Message */}
          {msg && (
            <div className="mt-4 rounded-xl border p-3 text-sm border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              {msg}
            </div>
          )}

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Tip: If signup needs email verification, disable “Confirm email” in Supabase Auth settings while testing.
          </p>
        </div>
      </div>
    </div>
  );
}
