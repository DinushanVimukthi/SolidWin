"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/layout/CtaBand";
import { Hero } from "@/components/layout/Hero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BeforeAfterSlider } from "@/features/projects/BeforeAfterSlider";
import { useProjects } from "@/lib/cms/projects-store";
import type { ProjectItem } from "@/data/projects";
import { quoteHref } from "@/lib/site-config";
import styles from "@/app/projects/[slug]/projectDetail.module.css";

interface ProjectDetailViewProps {
  initialProject?: ProjectItem;
  slug: string;
}

export function ProjectDetailView({ initialProject, slug }: ProjectDetailViewProps) {
  const { projects } = useProjects();
  const project = projects.find((p) => p.slug === slug) ?? initialProject;

  if (!project) {
    return (
      <Container>
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <h2>Project Not Found</h2>
          <p style={{ color: "#64748b", margin: "12px 0 24px" }}>
            The requested portfolio build could not be located in our database.
          </p>
          <Button href="/projects" withArrow>
            Browse Portfolio
          </Button>
        </div>
      </Container>
    );
  }

  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <Hero
        eyebrow={`Project Case Study • ${project.sector}`}
        title={project.title}
        description={project.description}
        image={{
          src: project.featuredImage || "/images/hero-construction.jpg",
          alt: project.title,
        }}
        actions={
          <Button href={quoteHref} withArrow>
            Inquire About Similar Project
          </Button>
        }
      />

      {/* Project Overview & Metadata Grid */}
      <Container className={styles.metaContainer}>
        <div className={styles.overviewBox}>
          <div>
            <Eyebrow>Project Overview</Eyebrow>
            <h2 className={styles.overviewTitle}>Engineered for lasting durability</h2>
            <p className={styles.overviewText}>{project.description}</p>
          </div>

          <dl className={styles.specsList}>
            <div>
              <dt>Sector</dt>
              <dd className={styles.capitalize}>{project.sector}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{project.location}</dd>
            </div>
            <div>
              <dt>Completion</dt>
              <dd>{project.completionDate}</dd>
            </div>
            <div>
              <dt>Scope of Work</dt>
              <dd>{project.scope}</dd>
            </div>
          </dl>
        </div>
      </Container>

      {/* Interactive Before & After Slider */}
      {project.hasBeforeAfter && project.beforeImage && project.afterImage && (
        <Section
          id="before-after"
          eyebrow="Transformation"
          title="Before and after delivery"
          description="Slide across to view the transformation from initial site excavation to final handover."
        >
          <div className={styles.sliderWrap}>
            <BeforeAfterSlider
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              beforeAlt={`${project.title} site before construction`}
              afterAlt={`${project.title} completed build`}
            />
          </div>
        </Section>
      )}

      {/* Full Photo Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <Section
          id="project-gallery"
          eyebrow="Visual Record"
          title="Project gallery"
          description="Detailed imagery of structural framework, materials placement, and final architectural details."
        >
          <div className={styles.galleryGrid}>
            {project.gallery.map((imgUrl, idx) => (
              <div key={idx} className={styles.galleryItem}>
                <Image
                  src={imgUrl}
                  alt={`${project.title} gallery photo ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className={styles.galleryImg}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Related Builds */}
      {related.length > 0 && (
        <Section
          id="related-builds"
          eyebrow="More Portfolio"
          title="More inspiring builds"
        >
          <div className={styles.relatedGrid}>
            {related.map((rel) => (
              <article key={rel.slug} className={styles.relatedCard}>
                <div className={styles.relatedMedia}>
                  <Image
                    src={rel.featuredImage || "/images/hero-construction.jpg"}
                    alt={rel.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={styles.galleryImg}
                  />
                </div>
                <div className={styles.relatedBody}>
                  <span className={styles.relatedSector}>{rel.sector}</span>
                  <h3 className={styles.relatedTitle}>{rel.title}</h3>
                  <Link href={`/projects/${rel.slug}`} className={styles.relatedLink}>
                    View Case Study <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
