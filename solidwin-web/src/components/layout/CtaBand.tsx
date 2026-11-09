import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { quoteHref } from "@/lib/site-config";
import { Container } from "./Container";
import styles from "./CtaBand.module.css";

interface CtaBandProps {
  title?: string;
  description?: string;
}

/** Shared "Your next project starts here" call-to-action band used above the footer. */
export function CtaBand({
  title = "Your next project starts here.",
  description = "Talk to our team about construction, concrete, materials and equipment.",
}: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className={styles.band}>
      <Container className={styles.inner}>
        <div className={styles.copy}>
          <Eyebrow>Let&apos;s build together</Eyebrow>
          <h2 id="cta-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.actions}>
          <Button href={quoteHref} withArrow>
            Request a Quote
          </Button>
          <Button href="/contact" variant="outline" withArrow>
            Contact Our Team
          </Button>
        </div>
      </Container>
    </section>
  );
}
