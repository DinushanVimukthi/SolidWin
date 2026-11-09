import clsx from "clsx";
import styles from "./Eyebrow.module.css";

interface EyebrowProps {
  children: string;
  /** Use on dark (purple) backgrounds. */
  inverse?: boolean;
  className?: string;
}

/** Small uppercase label with the amber dash used above section titles in the design. */
export function Eyebrow({ children, inverse, className }: EyebrowProps) {
  return <p className={clsx(styles.eyebrow, inverse && styles.inverse, className)}>{children}</p>;
}
