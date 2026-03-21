"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import gsap from "gsap";

// Formatear precio en guaraníes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
    getItemPrice,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animación de apertura/cierre
  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body
      document.body.style.overflow = "hidden";

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });

      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, closeCart]);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/50 z-50 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ opacity: 0 }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="font-oswald text-xl font-semibold tracking-wide">
            Carrito ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-black/30"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-16 h-16 text-black/20 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="font-inter text-black/60 mb-4">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="font-inter text-sm underline underline-offset-4 hover:text-black/70 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {items.map((item) => (
                <li key={item.id} className="p-6">
                  <div className="flex gap-4">
                    {/* Imagen */}
                    <Link
                      href={`/producto/${item.product.slug}`}
                      onClick={closeCart}
                      className="flex-shrink-0 w-20 h-24 bg-black/5 overflow-hidden"
                    >
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={80}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/20">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={0.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                            />
                          </svg>
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${item.product.slug}`}
                        onClick={closeCart}
                        className="font-inter text-sm font-medium hover:underline block truncate"
                      >
                        {item.product.name}
                      </Link>

                      {item.variant && (
                        <p className="font-inter text-xs text-black/50 mt-1">
                          Talla: {item.variant.size}
                          {item.variant.color && ` / ${item.variant.color}`}
                        </p>
                      )}

                      <p className="font-inter text-sm mt-2">
                        {formatPrice(getItemPrice(item))}
                      </p>

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-black/20">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black transition-colors cursor-pointer"
                            aria-label="Reducir cantidad"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-3 h-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center font-inter text-xs border-x border-black/20">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.variant?.stockQuantity || 99)}
                            className="w-8 h-8 flex items-center justify-center text-black/60 hover:text-black transition-colors disabled:opacity-30 cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-3 h-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-black/40 hover:text-black transition-colors cursor-pointer"
                          aria-label="Eliminar producto"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-black/10 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm text-black/60">Subtotal</span>
              <span className="font-inter text-lg font-medium">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="font-inter text-xs text-black/50">
              Envío calculado en el checkout
            </p>

            {/* Botones */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full py-4 bg-black text-white text-center font-inter text-sm tracking-wide hover:bg-black/90 transition-colors"
              >
                Finalizar compra
              </Link>

              <Link
                href="/carrito"
                onClick={closeCart}
                className="block w-full py-4 border border-black text-black text-center font-inter text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                Ver carrito
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
