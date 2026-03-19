import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";

// Tipos para los parámetros de la página
interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generar rutas estáticas (para SSG)
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generar metadata dinámica
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await getProductBySlug(slug);

  if (!response.success || !response.data) {
    return {
      title: "Producto no encontrado | KIREN",
    };
  }

  const product = response.data;
  const price = product.salePrice || product.price;
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);

  return {
    title: `${product.name} | KIREN`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.src ? [product.images[0].src] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: `${product.description} - ${formattedPrice}`,
    },
  };
}

// Componente de la página
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Obtener datos del producto
  const response = await getProductBySlug(slug);

  // Si no existe, mostrar 404
  if (!response.success || !response.data) {
    notFound();
  }

  const product = response.data;

  // Obtener productos relacionados
  const relatedProducts = await getRelatedProducts(
    product.category.slug,
    product.id,
    4
  );

  return (
    <div className="min-h-screen">
      {/* Contenido principal del producto */}
      <div className="container-kiren py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Galería de imágenes */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Información del producto */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Productos relacionados */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}