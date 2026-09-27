"use client";

import { Button } from "@/components/ui/button";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center gap-6 px-5 text-center">
      <p className="text-xl font-semibold text-ink">Something went wrong.</p>
      <p className="text-muted">Check your signal and give it another go.</p>
      <Button onClick={retry} className="h-14 px-8 text-lg">
        Try again
      </Button>
    </main>
  );
}
