import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import Categories from "@/components/home/Categories";
import PromoBanner from "@/components/home/PromoBanner";

export default function Home() {
  return (
    <>
      {/* Hero Carrusel */}
      <Hero />

      {/* Productos destacados */}
      <FeaturedProducts />

      {/* Colección destacada */}
      <FeaturedCollection />

      {/* Categorías */}
      <Categories />

      {/* Promo */}
      <PromoBanner />
    </>
  );
}