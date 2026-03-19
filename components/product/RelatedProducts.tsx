"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/common/ProductCard";
import { ProductListItem } from "@/types/product";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RelatedProductsProps {
  products: ProductListItem[];
  title?: string;
}

export default function RelatedProducts({
  products,
  title = "También te puede gustar",
}: RelatedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length === 0) return;

    const ctx = gsap.context(() => {
      // Animación del título
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animación de los productos
      const items = gridRef.current?.querySelectorAll(".related-product");
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 border-t border-black/10">
      <div className="container-kiren">
        <h2
          ref={titleRef}
          className="font-oswald text-2xl lg:text-3xl font-semibold tracking-wide text-center mb-12"
        >
          {title}
        </h2>

        <div
          ref={gridRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.map((product) => (
            <div key={product.id} className="related-product">
              <ProductCard
                product={{
                  id: parseInt(product.id.replace(/\D/g, "")) || 0,
                  name: product.name,
                  price: product.price,
                  slug: product.slug,
                  image: product.image,
                  category: product.category,
                  isNew: product.isNew,
                  isSale: product.isSale,
                  salePrice: product.salePrice,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}