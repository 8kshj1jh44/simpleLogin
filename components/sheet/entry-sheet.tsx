"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { EntryType } from "@/lib/entries";
import { formatAmount, parseCents, sanitizePrice } from "@/lib/money";
import { uuid } from "@/lib/uuid";
import { entryFormSchemas, entryInputSchema, type EntryFormValues, type EntryInput } from "@/lib/validation";
import { BottomSheet } from "./bottom-sheet";

type FieldName = keyof EntryFormValues;

type FieldConfig = { name: FieldName; label: string; placeholder: string };

const SHEETS: Record<EntryType, { title: string; fields: FieldConfig[] }> = {
  income: {
    title: "Job done",
    fields: [
      { name: "customer", label: "Customer", placeholder: "e.g. Smith" },
      { name: "description", label: "Job", placeholder: "e.g. Hot water system" },
      { name: "amount", label: "Price", placeholder: "0" },
    ],
  },
  expense: {
    title: "Expense",
    fields: [
      { name: "description", label: "What", placeholder: "e.g. Bunnings materials" },
      { name: "amount", label: "Amount", placeholder: "0" },
    ],
  },
};

type EntrySheetProps = {
  type: EntryType | null;
  /** Recent customer names offered as one-tap chips on the Job done sheet. */
  customers: string[];
  onClose: () => void;
  onSubmit: (input: EntryInput) => void;
};

export function EntrySheet({ type, customers, onClose, onSubmit }: EntrySheetProps) {
  // Keep the last sheet's content on screen while it slides away.
  const [lastType, setLastType] = useState<EntryType>("income");
  if (type !== null && type !== lastType) setLastType(type);
  const shown = type ?? lastType;

  return (
    <BottomSheet open={type !== null} title={SHEETS[shown].title} onClose={onClose}>
      <EntryForm type={shown} customers={shown === "income" ? customers : []} onSubmit={onSubmit} />
    </BottomSheet>
  );
}

type EntryFormProps = { type: EntryType; customers: string[]; onSubmit: (input: EntryInput) => void };

function EntryForm({ type, customers, onSubmit }: EntryFormProps) {
  const { fields } = SHEETS[type];
  const [values, setValues] = useState<EntryFormValues>({ customer: "", description: "", amount: "" });
  const inputs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  const parsed = entryFormSchemas[type].safeParse(values);
  const cents = parseCents(values.amount) ?? 0;

  function update(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: name === "amount" ? sanitizePrice(value) : value }));
  }

  function pickCustomer(name: string) {
    update("customer", name);
    inputs.current.description?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    const next = fields[index + 1];
    if (event.key !== "Enter" || !next) return;
    event.preventDefault();
    inputs.current[next.name]?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!parsed.success) {
      const invalid = fields.find(({ name }) => parsed.error.issues.some((issue) => issue.path[0] === name));
      if (invalid) inputs.current[invalid.name]?.focus();
      return;
    }
    const input = entryInputSchema.safeParse({
      id: uuid(),
      type,
      customer: "customer" in parsed.data ? parsed.data.customer : null,
      description: parsed.data.description,
      amount_cents: parsed.data.amount,
    });
    if (input.success) onSubmit(input.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {customers.length > 0 && (
        <div role="group" aria-label="Recent customers" className="flex flex-wrap gap-2">
          {customers.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => pickCustomer(name)}
              aria-pressed={values.customer === name}
              className="min-h-11 max-w-full overflow-hidden rounded-box border border-line bg-canvas px-4 text-[15px] font-medium text-ellipsis whitespace-nowrap text-ink transition-colors hover:bg-raised aria-pressed:border-ink"
            >
              {name}
            </button>
          ))}
        </div>
      )}
      {fields.map((field, index) => {
        const isAmount = field.name === "amount";
        const isLast = index === fields.length - 1;
        return (
          <Field
            key={field.name}
            ref={(node) => {
              inputs.current[field.name] = node;
            }}
            label={field.label}
            placeholder={field.placeholder}
            value={values[field.name]}
            onChange={(event) => update(field.name, event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            autoFocus={index === 0}
            prefix={isAmount ? "$" : undefined}
            inputMode={isAmount ? "decimal" : "text"}
            enterKeyHint={isLast ? "done" : "next"}
            autoComplete="off"
            autoCapitalize={isAmount ? "off" : "sentences"}
            maxLength={isAmount ? 11 : field.name === "customer" ? 80 : 120}
          />
        );
      })}
      <Button
        type="submit"
        aria-disabled={!parsed.success}
        className={`mt-2 h-16 w-full text-xl ${parsed.success ? "" : "opacity-50"}`}
      >
        Add <span className="tabular-nums">{formatAmount(cents)}</span>
      </Button>
    </form>
  );
}
