import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { LogoMark } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Sign in · One Login" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-5 pt-[max(40px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <LogoMark size={48} />
      <h1 className="mt-8 text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink">
        Log a job in 30 seconds.
      </h1>
      <p className="mt-2 text-lg text-muted">Out-simple them.</p>
      <LoginForm />
    </main>
  );
}
