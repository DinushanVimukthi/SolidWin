import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ProjectsFilterGrid } from "@/features/projects/ProjectsFilterGrid";
import { quoteHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects & Portfolio",
  description:
    "Explore completed residential, commercial, industrial and infrastructure projects by Solidwin.",
};

export default function ProjectsPage() {
  return (
    <>
      <Hero
        eyebrow="Portfolio & Completed Builds"
        title="See the vision take shape."
        description="A showcase of structural excellence across commercial developments, bespoke residential homes, industrial facilities and civil infrastructure."
        image={{
          src: "/images/hero-construction.jpg",
          alt: "Completed architectural build",
        }}
        actions={
          <>
            <Button href={quoteHref} withArrow>
              Request a Project Quote
            </Button>
            <Button href="/contact" variant="outline" withArrow>
              Book a Consultation
            </Button>
          </>
        }
      />

      <Section
        id="portfolio-grid"
        eyebrow="Featured Builds"
        title="Our track record across sectors"
        description="Filter by sector to see how our integrated divisions deliver quality on site."
      >
        <ProjectsFilterGrid />
      </Section>

      <CtaBand />
    </>
  );
}
