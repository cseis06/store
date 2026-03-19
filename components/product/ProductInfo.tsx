"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, ProductVariant } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

// Formatear precio en pesos argentinos
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("detalles");

  // Verificar si hay stock disponible
  const hasStock = product.variants.some((v) => v.stock > 0);
  const selectedHasStock = selectedVariant ? selectedVariant.stock > 0 : false;

  // Manejar agregar al carrito
  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Por favor seleccioná una talla");
      return;
    }

    // Aquí iría la lógica de agregar al carrito
    console.log("Agregar al carrito:", {
      product: product.id,
      variant: selectedVariant.id,
      quantity,
    });
  };

  return (
    <div className="lg:sticky lg:top-32">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-black/50">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              Inicio
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/catalogo" className="hover:text-black transition-colors">
              Catálogo
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="hover:text-black transition-colors"
            >
              {product.category.name}
            </Link>
          </li>
        </ol>
      </nav>

      {/* Badges */}
      <div className="flex gap-2 mb-4">
        {product.isNew && (
          <span className="inline-block px-2 py-1 bg-black text-white font-inter text-[10px] tracking-wider uppercase">
            Nuevo
          </span>
        )}
        {product.isSale && (
          <span className="inline-block px-2 py-1 bg-white text-black font-inter text-[10px] tracking-wider uppercase border border-black">
            Oferta
          </span>
        )}
      </div>

      {/* Nombre */}
      <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide mb-4">
        {product.name}
      </h1>

      {/* Precio */}
      <div className="flex items-center gap-3 mb-6">
        {product.salePrice ? (
          <>
            <span className="font-inter text-2xl">
              {formatPrice(product.salePrice)}
            </span>
            <span className="font-inter text-lg text-black/40 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="font-inter text-sm text-black bg-black/5 px-2 py-1">
              -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </span>
          </>
        ) : (
          <span className="font-inter text-2xl">{formatPrice(product.price)}</span>
        )}
      </div>

      {/* Descripción */}
      <p className="font-inter text-black/70 leading-relaxed mb-8">
        {product.description}
      </p>

      {/* Selector de tallas */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-inter text-sm font-medium">Talla</span>
          <button className="font-inter text-xs text-black/50 hover:text-black transition-colors underline underline-offset-2">
            Guía de tallas
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              disabled={variant.stock === 0}
              className={`min-w-[48px] h-12 px-4 font-inter text-sm border transition-all duration-200 cursor-pointer ${
                selectedVariant?.id === variant.id
                  ? "border-black bg-black text-white"
                  : variant.stock === 0
                  ? "border-black/10 text-black/30 cursor-not-allowed line-through"
                  : "border-black/20 text-black hover:border-black"
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>
        {selectedVariant && selectedVariant.stock <= 3 && selectedVariant.stock > 0 && (
          <p className="font-inter text-xs text-black/50 mt-2">
            ¡Solo quedan {selectedVariant.stock} unidades!
          </p>
        )}
      </div>

      {/* Selector de cantidad */}
      <div className="mb-8">
        <span className="font-inter text-sm font-medium block mb-3">Cantidad</span>
        <div className="flex items-center border border-black/20 w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-black/60 hover:text-black transition-colors cursor-pointer"
            aria-label="Reducir cantidad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="w-12 h-12 flex items-center justify-center font-inter text-sm border-x border-black/20">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))
            }
            className="w-12 h-12 flex items-center justify-center text-black/60 hover:text-black transition-colors cursor-pointer"
            aria-label="Aumentar cantidad"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Botón agregar al carrito */}
      <button
        onClick={handleAddToCart}
        disabled={!hasStock}
        className={`w-full py-4 font-inter text-sm tracking-wide transition-all duration-300 mb-4 ${
          hasStock
            ? "bg-black text-white hover:bg-black/90 cursor-pointer"
            : "bg-black/20 text-black/50 cursor-not-allowed"
        }`}
      >
        {hasStock ? "Agregar al carrito" : "Agotado"}
      </button>

      {/* Botón comprar ahora */}
      {hasStock && (
        <button className="w-full py-4 font-inter text-sm tracking-wide border border-black text-black hover:bg-black hover:text-white transition-all duration-300 mb-8 cursor-pointer">
          Comprar ahora
        </button>
      )}

      {/* Acordeones */}
      <div className="border-t border-black/10">
        {/* Detalles */}
        <Accordion
          title="Detalles del producto"
          isOpen={openAccordion === "detalles"}
          onToggle={() =>
            setOpenAccordion(openAccordion === "detalles" ? null : "detalles")
          }
        >
          <ul className="space-y-2">
            {product.details.map((detail, index) => (
              <li
                key={index}
                className="font-inter text-sm text-black/70 flex items-start gap-2"
              >
                <span className="w-1 h-1 bg-black/40 rounded-full mt-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Cuidado */}
        <Accordion
          title="Cuidado"
          isOpen={openAccordion === "cuidado"}
          onToggle={() =>
            setOpenAccordion(openAccordion === "cuidado" ? null : "cuidado")
          }
        >
          <ul className="space-y-2">
            {product.care.map((item, index) => (
              <li
                key={index}
                className="font-inter text-sm text-black/70 flex items-start gap-2"
              >
                <span className="w-1 h-1 bg-black/40 rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Accordion>

        {/* Envíos */}
        <Accordion
          title="Envíos y devoluciones"
          isOpen={openAccordion === "envios"}
          onToggle={() =>
            setOpenAccordion(openAccordion === "envios" ? null : "envios")
          }
        >
          <div className="font-inter text-sm text-black/70 space-y-3">
            <p>
              <strong className="text-black">Envío gratis</strong> en compras mayores a
              $50.000.
            </p>
            <p>Envíos a todo el país en 3-5 días hábiles.</p>
            <p>
              Devoluciones gratuitas dentro de los primeros 30 días.{" "}
              <Link href="/devoluciones" className="underline hover:text-black">
                Ver política completa
              </Link>
            </p>
          </div>
        </Accordion>
      </div>
    </div>
  );
}

// Componente Accordion
function Accordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-black/10">
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-inter text-sm font-medium">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}