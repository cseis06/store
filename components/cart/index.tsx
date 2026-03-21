"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import CartDrawer from "./CartDrawer";

// ============================================
// CART PROVIDER
// ============================================

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const syncWithServer = useCartStore((state) => state.syncWithServer);
  const isInitialized = useCartStore((state) => state.isInitialized);

  // Sincronizar carrito cuando se monta la app
  useEffect(() => {
    if (!isInitialized) {
      syncWithServer();
    }
  }, [isInitialized, syncWithServer]);

  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}

// ============================================
// CART BUTTON (para el header)
// ============================================

export function CartButton() {
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-black/5 transition-colors"
      aria-label={`Carrito (${itemCount} productos)`}
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
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>

      {/* Badge con contador */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-inter font-medium rounded-full flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}

// ============================================
// CART ICON LINK (alternativa como link)
// ============================================

export function CartIconLink() {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <Link
      href="/carrito"
      className="relative p-2 hover:bg-black/5 transition-colors"
      aria-label={`Ver carrito (${itemCount} productos)`}
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
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-inter font-medium rounded-full flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
