"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";

type AnimatedNumberProps = { value: number; format: (value: number) => string };

/** Counts from the previous value to the new one (~600ms). Server-renders the final value. */
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const current = useMotionValue(value);
  const text = useTransform(current, (latest) => format(Math.round(latest)));

  useEffect(() => {
    if (reduceMotion) {
      current.set(value);
      return;
    }
    const controls = animate(current, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [current, value, reduceMotion]);

  return <motion.span className="tabular-nums">{text}</motion.span>;
}
