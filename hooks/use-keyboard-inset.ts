"use client";

import { useEffect, useState } from "react";

/**
 * How far the on-screen keyboard overlaps the bottom of the layout viewport.
 * iOS Safari overlays the keyboard instead of resizing, which would hide a bottom sheet's button.
 */
export function useKeyboardInset(active: boolean) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) return;

    const update = () =>
      setInset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop));

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      setInset(0);
    };
  }, [active]);

  return inset;
}
