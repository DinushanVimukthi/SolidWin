import clsx from "clsx";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "./Container";
import styles from "./Section.module.css";

interface SectionProps {
  /** Heading id; also used for `aria-labelledby`. */
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, eyebrow, description, children, className }: SectionProps) {
  return (
    <section aria-labelledby={id} className={clsx(styles.section, className)}>
      <Container>
        <header className={styles.header}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 id={id} className={styles.title}>
            {title}
          </h2>
          {description && <p className={styles.description}>{description}</p>}
        </header>
        {children}
      </Container>
    </section>
  );
}
