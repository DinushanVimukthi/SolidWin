"use client";

import { useEffect, useState } from "react";

/** Reads the date after mount because `new Date()` is unstable during prerendering. */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred read is intentional
    setYear(new Date().getFullYear());
  }, []);

  return <span>{year ?? ""}</span>;
}
