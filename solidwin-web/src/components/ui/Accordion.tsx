import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionItem[];
}

/**
 * FAQ accordion built on native `<details>`: keyboard accessible, works without JS,
 * and stays a Server Component.
 */
export function Accordion({ items }: AccordionProps) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.id} className={styles.item}>
          <summary className={styles.summary}>{item.question}</summary>
          <div className={styles.answer}>{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
