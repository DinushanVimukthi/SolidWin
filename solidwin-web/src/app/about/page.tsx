import type { Metadata } from "next";
import { CardGrid } from "@/components/layout/CardGrid";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { companyValues } from "@/data/company";
import { divisions } from "@/data/divisions";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Solidwin, our values and our three integrated divisions.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About Solidwin"
        title="Building structures. Building trust."
        description="Integrated construction, concrete and hardware solutions under one brand."
        image={{ src: "/images/hero-construction.jpg", alt: "Site team on a construction project" }}
      />

      <Section id="values-title" eyebrow="What we stand for" title="Built on clear values">
        <CardGrid columns={3}>
          {companyValues.map((v) => (
            <Card key={v.id} title={v.title}>
              {v.description}
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section
        id="integrated-title"
        eyebrow="Capabilities"
        title="Integrated solutions, one team"
        description="Each division works with the others, from materials to completed structures."
      >
        <CardGrid columns={3}>
          {divisions.map((d) => (
            <Card key={d.id} title={d.title} href={d.href} linkLabel="Explore">
              {d.description}
            </Card>
          ))}
        </CardGrid>
      </Section>

      <CtaBand />
    </>
  );
}
