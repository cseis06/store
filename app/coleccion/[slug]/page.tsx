import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollectionBySlug, getAllCollectionSlugs } from "@/lib/collections";
import CollectionContent from "@/components/collection/CollectionContent";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generar rutas estaticas
export async function generateStaticParams() {
  const slugs = await getAllCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generar metadata dinamica
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getCollectionBySlug(slug);

  if (!response.success || !response.data) {
    return {
      title: "Coleccion no encontrada | KIREN",
    };
  }

  const collection = response.data;

  return {
    title: `${collection.name} | KIREN`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | KIREN`,
      description: collection.description,
      images: collection.image ? [collection.image] : [],
      type: "website",
    },
  };
}

// Componente de la pagina
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const response = await getCollectionBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return <CollectionContent collection={response.data} />;
}