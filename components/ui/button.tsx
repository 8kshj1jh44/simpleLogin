"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const variants = {
  primary: "border border-accent-edge bg-accent text-on-accent hover:brightness-105 disabled:opacity-60",
  secondary: "border border-line bg-surface text-ink hover:bg-raised disabled:opacity-60",
  ghost: "text-muted hover:bg-raised hover:text-ink",
};

type ButtonProps = HTMLMotionProps<"button"> & { variant?: keyof typeof variants };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={`inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-box font-semibold transition-[background-color,filter] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
