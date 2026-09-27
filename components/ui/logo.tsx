/** The brand mark: a tick on a hi-vis tile. A single geometric mark, not an icon. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#FACC15" />
      <path
        d="M9.5 16.5l4.5 4.5 8.5-9.5"
        fill="none"
        stroke="#0B0D10"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[16px] font-semibold tracking-tight text-ink">One Login</span>
    </span>
  );
}
