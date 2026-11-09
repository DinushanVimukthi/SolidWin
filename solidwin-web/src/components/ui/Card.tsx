import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  children?: ReactNode;
  image?: { src: string; alt: string };
  /** Makes the whole card a link, with the title as the accessible name. */
  href?: string;
  linkLabel?: string;
  /** Optional leading icon or element shown instead of an image. */
  icon?: ReactNode;
  className?: string;
}

export function Card({ title, children, image, href, linkLabel, icon, className }: CardProps) {
  return (
    <article className={clsx(styles.card, href && styles.interactive, className)}>
      {image && (
        <div className={styles.media}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.body}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        {children && <div className={styles.text}>{children}</div>}
        {href && (
          <Link href={href} className={styles.link}>
            {linkLabel ?? "Learn more"}
            <span className="visually-hidden">: {title}</span>
            <span aria-hidden="true"> →</span>
          </Link>
        )}
      </div>
    </article>
  );
}
