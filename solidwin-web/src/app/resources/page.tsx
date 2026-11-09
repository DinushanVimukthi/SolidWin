import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Accordion } from "@/components/ui/Accordion";
import { ResourcesDocumentsGrid } from "@/features/resources/ResourcesDocumentsGrid";
import { generalFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Resources and HSEQ",
  description: "Company profile, HSEQ documents, certificates and frequently asked questions.",
};

export default function ResourcesPage() {
  return (
    <>
      <Hero
        eyebrow="Resources and HSEQ"
        title="Clear guidance. Confident decisions."
        description="Documents and answers to help you plan your project."
        image={{ src: "/images/service-turnkey.jpg", alt: "Team reviewing blueprints on site" }}
      />

      <Section id="docs-title" eyebrow="Documents" title="Health, Safety, Environment & Quality">
        <ResourcesDocumentsGrid />
      </Section>

      <Section id="faq-title" eyebrow="FAQ" title="Frequently asked questions">
        <Accordion items={generalFaqs} />
      </Section>

      <CtaBand />
    </>
  );
}
