import Image from "next/image";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "./Container";
import styles from "./Hero.module.css";

interface HeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Call-to-action buttons. */
  actions?: ReactNode;
  image: { src: string; alt: string };
}

/** Purple hero panel with the curved cut-out edge and photo, as in the Figma frames. */
export function Hero({ eyebrow, title, description, actions, image }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Container className={styles.container}>
        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={styles.image}
          />
        </div>
        <div className={styles.panel}>
          <div className={styles.content}>
            {eyebrow && <Eyebrow inverse>{eyebrow}</Eyebrow>}
            <h1 id="hero-title" className={styles.title}>
              {title}
            </h1>
            {description && <p className={styles.description}>{description}</p>}
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
