import { useId, type ComponentProps } from "react";

type FieldProps = ComponentProps<"input"> & { label: string; prefix?: string };

export function Field({ label, prefix, className = "", ...props }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[15px] font-medium text-muted">
        {label}
      </label>
      <div className="flex h-16 items-center rounded-box border border-line bg-canvas px-4 transition-shadow focus-within:border-ink focus-within:shadow-[0_0_0_1px_var(--ink)]">
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
