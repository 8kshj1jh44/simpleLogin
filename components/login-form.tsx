"use client";

import { useActionState } from "react";
import { signIn, signInDemo } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export function LoginForm() {
  const [state, signInAction, signingIn] = useActionState(signIn, null);
  const [demoState, demoAction, startingDemo] = useActionState(signInDemo, null);
  const error = state?.error ?? demoState?.error;
  const busy = signingIn || startingDemo;

  return (
    <div className="mt-10">
      <form action={signInAction} className="space-y-4">
        <Field
          label="Email"
          tone="surface"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@example.com"
          defaultValue={state?.email}
          required
        />
        <Field
          label="Password"
          tone="surface"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <p role="alert" className="min-h-6 text-[15px] font-medium text-loss">
          {error}
        </p>
        <Button type="submit" disabled={busy} className="h-16 w-full text-lg">
          {signingIn ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-sm text-faint" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={demoAction}>
        <Button type="submit" variant="secondary" disabled={busy} className="h-16 w-full text-lg">
          {startingDemo ? "Opening demo…" : "Try the demo"}
        </Button>
      </form>
      <p className="mt-3 text-center text-sm text-muted">No sign-up. See a real month in seconds.</p>
    </div>
  );
}
