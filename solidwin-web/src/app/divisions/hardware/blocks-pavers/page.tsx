import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { BlocksPaversCatalogue } from "@/features/catalogue/QuoteBasket";
import { quoteHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blocks & Pavers Catalogue",
  description:
    "Factory-cured concrete hollow blocks, solid partitions and heavy-duty traffic interlocking pavers with certified compressive strength.",
};

export default function BlocksPaversPage() {
  return (
    <>
      <Hero
        eyebrow="Blocks & Pavers Catalogue"
        title="Built on the right materials."
        description="Explore blocks and paving options for your project. Add products directly to your quote basket for fast contractor pricing."
        image={{
          src: "/images/service-residential.jpg",
          alt: "Cured interlocking pavers and building blocks",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Request a Custom Quote
            </Button>
            <Button href="/divisions/hardware/equipment" variant="outline" withArrow>
              View Rental Equipment
            </Button>
          </>
        }
      />

      <Section
        id="catalogue-section"
        eyebrow="Factory Direct"
        title="Building blocks & paving units"
        description="All masonry products steam-cured and batch-tested for high dimensional accuracy and load-bearing performance."
      >
        <BlocksPaversCatalogue />
      </Section>

      <CtaBand />
    </>
  );
}
