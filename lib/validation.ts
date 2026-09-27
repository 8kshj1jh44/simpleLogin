import { z } from "zod";
import { MAX_CENTS, parseCents } from "./money";

// trim() runs before min(1), so whitespace-only input is rejected.
const text = (max: number) => z.string().trim().min(1).max(max);
const customer = text(80);
const description = text(120);
const amountCents = z.int().positive().max(MAX_CENTS);

/** What the server action accepts. Also re-checked on the client before sending. */
export const entryInputSchema = z.discriminatedUnion("type", [
  z.object({ id: z.uuid(), type: z.literal("income"), customer, description, amount_cents: amountCents }),
  z.object({ id: z.uuid(), type: z.literal("expense"), customer: z.null(), description, amount_cents: amountCents }),
]);

export type EntryInput = z.infer<typeof entryInputSchema>;

const amount = z.string().transform((value, ctx) => {
  const cents = parseCents(value);
  if (cents === null || !amountCents.safeParse(cents).success) {
    ctx.addIssue({ code: "custom", message: "Enter an amount" });
    return z.NEVER;
  }
  return cents;
});

/** What each bottom sheet collects, as typed. */
export const entryFormSchemas = {
  income: z.object({ customer, description, amount }),
  expense: z.object({ description, amount }),
};

export type EntryFormValues = { customer: string; description: string; amount: string };

export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
