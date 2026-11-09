import type { Metadata } from "next";
import { PROJECTS } from "@/data/projects";
import { ProjectDetailView } from "@/features/projects/ProjectDetailView";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return {
      title: "Project Portfolio | Solidwin",
      description: "Explore completed builds and engineering projects by Solidwin.",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const initialProject = PROJECTS.find((p) => p.slug === slug);

  return <ProjectDetailView initialProject={initialProject} slug={slug} />;
}
