import Link from "next/link";
import { Container } from "@/components/layout/Container";
import styles from "./QuickLinksBand.module.css";

const QUICK_ACTIONS = [
  {
    id: "explore-projects",
    href: "/projects",
    title: "Explore Projects",
    description: "Browse our latest construction projects.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: "block-calculator",
    href: "/divisions/construction#calculators-section",
    title: "Block Calculator",
    description: "Estimate your material requirements.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10.01" />
        <line x1="12" y1="10" x2="12" y2="10.01" />
        <line x1="16" y1="10" x2="16" y2="10.01" />
        <line x1="8" y1="14" x2="8" y2="14.01" />
        <line x1="12" y1="14" x2="12" y2="14.01" />
        <line x1="16" y1="14" x2="16" y2="14.01" />
        <line x1="8" y1="18" x2="8" y2="18.01" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
        <line x1="16" y1="18" x2="16" y2="18.01" />
      </svg>
    ),
  },
  {
    id: "request-quote",
    href: "/request-quote",
    title: "Request a Quote",
    description: "Let's discuss your project needs.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export function QuickLinksBand() {
  return (
    <Container className={styles.container}>
      <div className={styles.bar} role="region" aria-label="Quick project tools">
        {QUICK_ACTIONS.map((action, idx) => (
          <Link key={action.id} href={action.href} className={styles.actionItem}>
            <div className={styles.iconWrapper}>{action.icon}</div>
            <div className={styles.content}>
              <h3 className={styles.title}>{action.title}</h3>
              <p className={styles.desc}>{action.description}</p>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
            {idx < QUICK_ACTIONS.length - 1 && <span className={styles.divider} aria-hidden="true" />}
          </Link>
        ))}
      </div>
    </Container>
  );
}
