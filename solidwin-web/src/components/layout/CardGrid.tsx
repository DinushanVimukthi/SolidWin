import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./CardGrid.module.css";

interface CardGridProps {
  children: ReactNode;
  /** Columns at desktop width. Collapses to 2 then 1 on smaller screens. */
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 4, className }: CardGridProps) {
  return <div className={clsx(styles.grid, styles[`cols${columns}`], className)}>{children}</div>;
}
