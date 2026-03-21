// Tipos generados para Supabase
// Nota: Estos tipos se pueden auto-generar con:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          banner_url: string | null
          is_featured: boolean
          is_active: boolean
          display_order: number
          starts_at: string | null
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          banner_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          display_order?: number
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          banner_url?: string | null
          is_featured?: boolean
          is_active?: boolean
          display_order?: number
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          price: number
          compare_at_price: number | null
          cost_price: number | null
          sku: string | null
          barcode: string | null
          track_inventory: boolean
          stock_quantity: number
          low_stock_threshold: number
          category_id: string | null
          is_active: boolean
          is_featured: boolean
          is_new: boolean
          is_on_sale: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          price: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          track_inventory?: boolean
          stock_quantity?: number
          low_stock_threshold?: number
          category_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          price?: number
          compare_at_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          track_inventory?: boolean
          stock_quantity?: number
          low_stock_threshold?: number
          category_id?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_new?: boolean
          is_on_sale?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string | null
          size: string | null
          color: string | null
          color_hex: string | null
          price_adjustment: number
          stock_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku?: string | null
          size?: string | null
          color?: string | null
          color_hex?: string | null
          price_adjustment?: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string | null
          size?: string | null
          color?: string | null
          color_hex?: string | null
          price_adjustment?: number
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_collections: {
        Row: {
          product_id: string
          collection_id: string
          display_order: number
          added_at: string
        }
        Insert: {
          product_id: string
          collection_id: string
          display_order?: number
          added_at?: string
        }
        Update: {
          product_id?: string
          collection_id?: string
          display_order?: number
          added_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          full_name: string
          phone: string | null
          street_address: string
          apartment: string | null
          city: string
          state: string | null
          postal_code: string | null
          country: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          full_name: string
          phone?: string | null
          street_address: string
          apartment?: string | null
          city: string
          state?: string | null
          postal_code?: string | null
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string | null
          full_name?: string
          phone?: string | null
          street_address?: string
          apartment?: string | null
          city?: string
          state?: string | null
          postal_code?: string | null
          country?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost: number
          tax_amount: number
          discount_amount: number
          total: number
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          shipping_address: Json | null
          billing_address: Json | null
          customer_notes: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
          paid_at: string | null
          shipped_at: string | null
          delivered_at: string | null
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost?: number
          tax_amount?: number
          discount_amount?: number
          total: number
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          customer_notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal?: number
          shipping_cost?: number
          tax_amount?: number
          discount_amount?: number
          total?: number
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          customer_notes?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          paid_at?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          product_sku: string | null
          variant_name: string | null
          unit_price: number
          quantity: number
          total_price: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          variant_id?: string | null
          product_name: string
          product_sku?: string | null
          variant_name?: string | null
          unit_price: number
          quantity: number
          total_price: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          variant_id?: string | null
          product_name?: string
          product_sku?: string | null
          variant_name?: string | null
          unit_price?: number
          quantity?: number
          total_price?: number
          image_url?: string | null
          created_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_purchase_amount: number | null
          max_discount_amount: number | null
          usage_limit: number | null
          usage_count: number
          starts_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_purchase_amount?: number | null
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_purchase_amount?: number | null
          max_discount_amount?: number | null
          usage_limit?: number | null
          usage_count?: number
          starts_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          title: string | null
          content: string | null
          is_verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          title?: string | null
          content?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          is_verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      products_with_image: {
        Row: {
          id: string
          name: string
          slug: string
          price: number
          compare_at_price: number | null
          is_featured: boolean
          is_new: boolean
          is_on_sale: boolean
          primary_image_url: string | null
          primary_image_alt: string | null
          category_name: string | null
          category_slug: string | null
        }
      }
      collections_with_count: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_featured: boolean
          product_count: number
        }
      }
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_cart_total: {
        Args: Record<string, never>
        Returns: number
      }
    }
    Enums: {
      user_role: 'customer' | 'admin'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
  }
}

// Tipos de conveniencia
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Aliases comunes
export type Product = Tables<'products'>
export type ProductImage = Tables<'product_images'>
export type ProductVariant = Tables<'product_variants'>
export type Category = Tables<'categories'>
export type Collection = Tables<'collections'>
export type CartItem = Tables<'cart_items'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Profile = Tables<'profiles'>
export type Address = Tables<'addresses'>
export type Coupon = Tables<'coupons'>
export type Review = Tables<'reviews'>

// Tipos extendidos con relaciones
export type ProductWithImages = Product & {
  product_images: ProductImage[]
  product_variants: ProductVariant[]
  categories: Category | null
}

export type ProductListItem = {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  is_featured: boolean
  is_new: boolean
  is_on_sale: boolean
  primary_image_url: string | null
  primary_image_alt: string | null
  category_name: string | null
  category_slug: string | null
}

export type CollectionWithProducts = Collection & {
  products: ProductListItem[]
}

export type CartItemWithProduct = CartItem & {
  products: Product & {
    product_images: ProductImage[]
  }
  product_variants: ProductVariant | null
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}
