import type { ReactNode } from "react";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  icon: ReactNode;
}

export function MetricCard({ title, value, description, trend, icon }: MetricCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.value}>{value}</div>
        {(trend || description) && (
          <div className={styles.footer}>
            {trend && (
              <span
                className={
                  trend.neutral
                    ? styles.trendNeutral
                    : trend.positive
                    ? styles.trendPositive
                    : styles.trendNegative
                }
              >
                {trend.value}
              </span>
            )}
            {description && <span className={styles.description}>{description}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
