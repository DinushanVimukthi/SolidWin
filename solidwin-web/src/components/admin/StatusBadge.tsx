import clsx from "clsx";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: "new" | "in_progress" | "quoted" | "closed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const labels: Record<StatusBadgeProps["status"], string> = {
    new: "New",
    in_progress: "In Progress",
    quoted: "Quoted",
    closed: "Closed",
  };

  return (
    <span className={clsx(styles.badge, styles[status], className)}>
      <span className={styles.dot} aria-hidden="true" />
      {labels[status]}
    </span>
  );
}
