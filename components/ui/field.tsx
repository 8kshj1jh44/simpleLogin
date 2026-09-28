import { useId, type ComponentProps } from "react";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  prefix?: string;
  /** Pick the tone that contrasts with what the field sits on: white on the grey page, grey on a white sheet. */
  tone?: "surface" | "sunken";
};

// --field-bg also feeds the autofill override in globals.css.
const TONES = {
  surface: "bg-surface [--field-bg:var(--surface)] shadow-[0_1px_2px_rgb(11_13_16/0.05)]",
  sunken: "bg-canvas [--field-bg:var(--canvas)]",
};

export function Field({ label, prefix, tone = "surface", className = "", ...props }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-medium text-muted">
        {label}
      </label>
      <div className={`flex h-16 items-center rounded-box border border-line px-4 ${TONES[tone]} transition-shadow focus-within:border-ink focus-within:shadow-[0_0_0_1px_var(--ink)]`}>
        {prefix && (
          <span aria-hidden className="mr-1 text-xl font-semibold text-faint">
            {prefix}
          </span>
        )}
        <input
          id={id}
          className="h-full w-full min-w-0 bg-transparent text-xl text-ink placeholder:text-faint focus:outline-none"
          {...props}
        />
      </div>
    </div>
  );
}
