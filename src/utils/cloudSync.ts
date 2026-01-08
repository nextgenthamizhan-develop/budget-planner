import type { BudgetState } from "../types";
import { supabase } from "../supabaseClient";

export const getUserEmail = async (): Promise<string | null> => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
};

export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const pullState = async (): Promise<BudgetState | null> => {
  if (!supabase) return null;

  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("budget_states")
    .select("data")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;
  return (data?.data as BudgetState) ?? null;
};

export const pushState = async (state: BudgetState): Promise<boolean> => {
  if (!supabase) return false;

  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return false;

  const { error } = await supabase
    .from("budget_states")
    .upsert({
      user_id: user.id,
      data: state,
      updated_at: new Date().toISOString(),
    });

  return !error;
};
