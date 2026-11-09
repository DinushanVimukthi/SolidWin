import type { Metadata } from "next";
import { CardGrid } from "@/components/layout/CardGrid";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuickLinksBand } from "@/components/home/QuickLinksBand";
import { constructionServices } from "@/data/divisions";
import { quoteHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { absolute: "Solidwin | Construction, Ready-Mix & Hardware" },
  description:
    "Solidwin delivers construction services, ready-mix concrete, and hardware supply with blocks, pavers and equipment rental.",
};

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Construction Services • From concept to completion"
        title="Built around your vision."
        description="Quality construction for homes, businesses and industries—built safely, delivered on time."
        image={{
          src: "/images/hero-construction.jpg",
          alt: "Site team reviewing plans on a high-rise construction site",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Discuss Your Project
            </Button>
            <Button href="/projects" variant="outline" withArrow>
              View Projects
            </Button>
          </>
        }
      />

      <Section id="services-title" eyebrow="What we build" title="Construction for every sector">
        <CardGrid>
          {constructionServices.map((s) => (
            <Card key={s.id} title={s.title} image={s.image} href={s.href} linkLabel="Learn More">
              {s.description}
            </Card>
          ))}
        </CardGrid>
      </Section>

      {/* Quick Project Tools Band (Explore Projects, Block Calculator, Request a Quote) */}
      <QuickLinksBand />

      <CtaBand />
    </>
  );
}
