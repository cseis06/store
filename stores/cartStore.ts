'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getSupabaseClient } from '@/lib/supabase/client'

// ============================================
// TIPOS
// ============================================

export interface CartItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  product: {
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    image: string | null
  }
  variant: {
    id: string
    name: string
    size: string | null
    color: string | null
    priceAdjustment: number
    stockQuantity: number
  } | null
}

interface CartStore {
  // Estado
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  isInitialized: boolean
  
  // Acciones UI
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Acciones del carrito
  addItem: (item: Omit<CartItem, 'id'>) => Promise<{ success: boolean; error?: string }>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  
  // Sincronización con Supabase
  syncWithServer: () => Promise<void>
  
  // Computed (getters)
  getSubtotal: () => number
  getItemCount: () => number
  getItemPrice: (item: CartItem) => number
}

// ============================================
// STORE
// ============================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      isOpen: false,
      isLoading: false,
      isInitialized: false,

      // ============================================
      // ACCIONES UI
      // ============================================
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ============================================
      // ACCIONES DEL CARRITO
      // ============================================

      addItem: async (newItem) => {
        const { items } = get()
        const supabase = getSupabaseClient()
        
        // Verificar si el usuario está autenticado
        const { data: { user } } = await supabase.auth.getUser()

        // Buscar si ya existe el item
        const existingIndex = items.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            item.variantId === newItem.variantId
        )

        if (existingIndex > -1) {
          // Actualizar cantidad del existente
          const updatedItems = [...items]
          const newQuantity = updatedItems[existingIndex].quantity + newItem.quantity
          
          // Verificar stock
          const maxStock = updatedItems[existingIndex].variant?.stockQuantity || 99
          if (newQuantity > maxStock) {
            return { success: false, error: `Solo hay ${maxStock} unidades disponibles` }
          }
          
          updatedItems[existingIndex].quantity = newQuantity
          set({ items: updatedItems })

          // Si está autenticado, sincronizar con servidor
          if (user) {
            await supabase
              .from('cart_items')
              .upsert({
                user_id: user.id,
                product_id: newItem.productId,
                variant_id: newItem.variantId,
                quantity: newQuantity,
              }, {
                onConflict: 'user_id,product_id,variant_id'
              })
          }
        } else {
          // Agregar nuevo item
          const itemWithId: CartItem = {
            ...newItem,
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          }
          
          set({ items: [...items, itemWithId] })

          // Si está autenticado, sincronizar con servidor
          if (user) {
            const { data } = await supabase
              .from('cart_items')
              .upsert({
                user_id: user.id,
                product_id: newItem.productId,
                variant_id: newItem.variantId,
                quantity: newItem.quantity,
              }, {
                onConflict: 'user_id,product_id,variant_id'
              })
              .select('id')
              .single()

            // Actualizar con el ID real del servidor
            if (data) {
              set((state) => ({
                items: state.items.map((item) =>
                  item.id === itemWithId.id ? { ...item, id: data.id } : item
                ),
              }))
            }
          }
        }

        return { success: true }
      },

      updateQuantity: async (itemId, quantity) => {
        const { items } = get()
        const supabase = getSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (quantity <= 0) {
          await get().removeItem(itemId)
          return
        }

        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
        set({ items: updatedItems })

        // Sincronizar con servidor si está autenticado
        if (user && !itemId.startsWith('local_')) {
          await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId)
        }
      },

      removeItem: async (itemId) => {
        const { items } = get()
        const supabase = getSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        set({ items: items.filter((item) => item.id !== itemId) })

        // Sincronizar con servidor si está autenticado
        if (user && !itemId.startsWith('local_')) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId)
        }
      },

      clearCart: async () => {
        const supabase = getSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        set({ items: [] })

        // Sincronizar con servidor si está autenticado
        if (user) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id)
        }
      },

      // ============================================
      // SINCRONIZACIÓN CON SERVIDOR
      // ============================================

      syncWithServer: async () => {
        const supabase = getSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          set({ isInitialized: true })
          return
        }

        set({ isLoading: true })

        try {
          // Obtener carrito del servidor
          const { data: serverItems } = await supabase
            .from('cart_items')
            .select(`
              id,
              product_id,
              variant_id,
              quantity,
              products (
                name,
                slug,
                price,
                compare_at_price,
                product_images!inner (url)
              ),
              product_variants (
                id,
                name,
                size,
                color,
                price_adjustment,
                stock_quantity
              )
            `)
            .eq('user_id', user.id)
            .eq('products.is_active', true)
            .eq('products.product_images.is_primary', true)

          if (serverItems && serverItems.length > 0) {
            // Transformar datos del servidor
            const cartItems: CartItem[] = serverItems.map((item: any) => ({
              id: item.id,
              productId: item.product_id,
              variantId: item.variant_id,
              quantity: item.quantity,
              product: {
                name: item.products?.name || '',
                slug: item.products?.slug || '',
                price: item.products?.price || 0,
                compareAtPrice: item.products?.compare_at_price,
                image: item.products?.product_images?.[0]?.url || null,
              },
              variant: item.product_variants ? {
                id: item.product_variants.id,
                name: item.product_variants.name,
                size: item.product_variants.size,
                color: item.product_variants.color,
                priceAdjustment: item.product_variants.price_adjustment || 0,
                stockQuantity: item.product_variants.stock_quantity || 0,
              } : null,
            }))

            // Merge: items locales + items del servidor
            const { items: localItems } = get()
            const localOnlyItems = localItems.filter(
              (local) => local.id.startsWith('local_')
            )

            // Subir items locales al servidor
            for (const localItem of localOnlyItems) {
              await supabase
                .from('cart_items')
                .upsert({
                  user_id: user.id,
                  product_id: localItem.productId,
                  variant_id: localItem.variantId,
                  quantity: localItem.quantity,
                }, {
                  onConflict: 'user_id,product_id,variant_id'
                })
            }

            // Re-fetch para obtener IDs reales
            if (localOnlyItems.length > 0) {
              const { data: finalItems } = await supabase
                .from('cart_items')
                .select(`
                  id,
                  product_id,
                  variant_id,
                  quantity,
                  products (
                    name,
                    slug,
                    price,
                    compare_at_price,
                    product_images!inner (url)
                  ),
                  product_variants (
                    id,
                    name,
                    size,
                    color,
                    price_adjustment,
                    stock_quantity
                  )
                `)
                .eq('user_id', user.id)
                .eq('products.is_active', true)
                .eq('products.product_images.is_primary', true)

              if (finalItems) {
                const finalCartItems: CartItem[] = finalItems.map((item: any) => ({
                  id: item.id,
                  productId: item.product_id,
                  variantId: item.variant_id,
                  quantity: item.quantity,
                  product: {
                    name: item.products?.name || '',
                    slug: item.products?.slug || '',
                    price: item.products?.price || 0,
                    compareAtPrice: item.products?.compare_at_price,
                    image: item.products?.product_images?.[0]?.url || null,
                  },
                  variant: item.product_variants ? {
                    id: item.product_variants.id,
                    name: item.product_variants.name,
                    size: item.product_variants.size,
                    color: item.product_variants.color,
                    priceAdjustment: item.product_variants.price_adjustment || 0,
                    stockQuantity: item.product_variants.stock_quantity || 0,
                  } : null,
                }))
                set({ items: finalCartItems })
              }
            } else {
              set({ items: cartItems })
            }
          }
        } catch (error) {
          console.error('Error syncing cart:', error)
        } finally {
          set({ isLoading: false, isInitialized: true })
        }
      },

      // ============================================
      // COMPUTED VALUES
      // ============================================

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.product.price + (item.variant?.priceAdjustment || 0)
          return total + price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      getItemPrice: (item: CartItem) => {
        return item.product.price + (item.variant?.priceAdjustment || 0)
      },
    }),
    {
      name: 'kiren-cart', // Nombre para localStorage
      partialize: (state) => ({ items: state.items }), // Solo persistir items
    }
  )
)
