import { ProjectDetailView } from "@/app/components/homepage/projects/project-detail-view";
import { projectsData } from "@/utils/data/projects-data";
import { notFound } from "next/navigation";

const CATEGORY_ORDER = ["cad", "simulation", "results", "video", "code"];

export async function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) return {};

  return {
    title: `${project.nameFull} - Portfolio of Sujith`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: (project.assets ?? []).filter((asset) => asset.category === category),
  })).filter((group) => group.items.length > 0);

  return <ProjectDetailView project={project} grouped={grouped} />;
}
