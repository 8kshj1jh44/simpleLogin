"use server";

import { redirect } from "next/navigation";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { credentialsSchema } from "@/lib/validation";

export type LoginState = { error: string; email?: string } | null;

export async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const parsed = credentialsSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "That email and password don't match.", email };

  redirect("/");
}

export async function signInDemo(): Promise<LoginState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (error) return { error: "The demo isn't set up yet. Run npm run seed:demo." };

  redirect("/");
}
