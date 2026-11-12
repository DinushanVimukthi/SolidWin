import clsx from "clsx";
import styles from "./StatusBadge.module.css";
import type { InquiryStatus } from "@/lib/dal/types";

export type ExtendedStatus = InquiryStatus | "in_progress";

interface StatusBadgeProps {
  status: ExtendedStatus;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const normalized = status === "in_progress" ? "in_review" : status;

  const labels: Record<string, string> = {
    new: "New",
    in_review: "In Review",
    in_progress: "In Review",
    quoted: "Quoted",
    won: "Won",
    closed: "Closed",
  };

  return (
    <span
      className={clsx(
        styles.badge,
        styles[normalized] || styles.closed,
        size === "sm" && styles.badgeSm,
        className
      )}
    >
      <span className={styles.dot} aria-hidden="true" />
      {labels[status] || status}
    </span>
  );
}
