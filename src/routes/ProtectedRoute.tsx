import { useEffect, useState, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [allowed, setAllowed] = useState<"loading" | "yes" | "no">("loading");

  useEffect(() => {
    if (!supabase) {
      setAllowed("no");
      return;
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      setAllowed(data.session ? "yes" : "no");
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAllowed(session ? "yes" : "no");
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (allowed === "loading") {
    return (
      <div className="min-h-screen grid place-items-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        Loading...
      </div>
    );
  }

  if (allowed === "no") return <Navigate to="/login" replace />;

  return children;
}
