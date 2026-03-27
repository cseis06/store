import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import Categories from "@/components/home/Categories";
import PromoBanner from "@/components/home/PromoBanner";

import { getHeroSlides, getPromoBanner } from "@/lib/banners";
import { getFeaturedProducts } from "@/lib/products";
import { getFeaturedCollectionWithProducts } from "@/lib/collections";
import { getAllCategories } from "@/lib/categories";

export default async function Home() {
  // Obtener todos los datos en paralelo
  const [heroSlides, featuredProducts, featuredCollection, categories, promoBanner] = 
    await Promise.all([
      getHeroSlides(),
      getFeaturedProducts(4),
      getFeaturedCollectionWithProducts(4),
      getAllCategories(),
      getPromoBanner(),
    ]);

  return (
    <>
      {/* Hero Carrusel */}
      <Hero slides={heroSlides} />

      {/* Productos destacados */}
      <FeaturedProducts products={featuredProducts} />

      {/* Colección destacada */}
      {featuredCollection && (
        <FeaturedCollection collection={featuredCollection} />
      )}

      {/* Categorías */}
      <Categories categories={categories} />

      {/* Promo */}
      {promoBanner && <PromoBanner banner={promoBanner} />}
    </>
  );
}
