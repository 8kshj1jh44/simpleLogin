import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in · One Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pt-[max(88px,calc(env(safe-area-inset-top)+48px))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">One Login</p>
      <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink">
        Always in the black.
      </h1>
      <p className="mt-2 text-lg text-muted">One login. One screen. Every job counted.</p>
      <LoginForm />
      <p className="mt-auto pt-10 text-center text-sm text-faint">Out-simple them.</p>
    </main>
  );
}
