import { Collection, CollectionWithProducts, ProductListItem, ApiResponse } from "@/types/product";

// ============================================
// CONFIGURACION DE API
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kiren.com";
const USE_MOCK_DATA = true;

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Obtener una coleccion por su slug
 */
export async function getCollectionBySlug(
  slug: string
): Promise<ApiResponse<CollectionWithProducts | null>> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const collection = mockCollections.find((c) => c.slug === slug);
    
    if (!collection) {
      return {
        data: null,
        success: false,
        error: "Coleccion no encontrada",
      };
    }

    // Obtener productos de esta coleccion
    const products = mockCollectionProducts.filter(
      (p) => p.collectionSlug === slug
    );

    return {
      data: {
        ...collection,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          salePrice: p.salePrice,
          image: p.image,
          category: p.category,
          isNew: p.isNew,
          isSale: p.isSale,
        })),
      },
      success: true,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/collections/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return {
        data: null,
        success: false,
        error: "Error al obtener la coleccion",
      };
    }

    const data = await response.json();
    return {
      data: data,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: "Error de conexion",
    };
  }
}

/**
 * Obtener todas las colecciones
 */
export async function getAllCollections(): Promise<Collection[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockCollections;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/collections`);
    const data = await response.json();
    return data.collections || [];
  } catch (error) {
    return [];
  }
}

/**
 * Obtener todos los slugs de colecciones (para generateStaticParams)
 */
export async function getAllCollectionSlugs(): Promise<string[]> {
  if (USE_MOCK_DATA) {
    return mockCollections
      .filter((c) => c.badge !== "upcoming")
      .map((c) => c.slug);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/collections/slugs`);
    const data = await response.json();
    return data.slugs || [];
  } catch (error) {
    return [];
  }
}

// ============================================
// DATOS MOCK
// ============================================

const mockCollections: Collection[] = [
  {
    id: "col_001",
    name: "Essentials",
    slug: "essentials",
    description: "Piezas atemporales que forman la base de tu guardarropa. Diseños simples, materiales nobles y cortes perfectos que nunca pasan de moda.",
    image: "/images/collections/essentials.jpg",
    banner: "/images/collections/essentials-banner.jpg",
    badge: "permanent",
    productCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "col_002",
    name: "Otono/Invierno 2025",
    slug: "aw-2025",
    description: "Nuestra coleccion de temporada inspirada en la arquitectura brutalista. Siluetas estructuradas, tonos neutros y texturas envolventes.",
    image: "/images/collections/aw-2025.jpg",
    banner: "/images/collections/aw-2025-banner.jpg",
    badge: "current",
    season: "Otono/Invierno",
    year: "2025",
    productCount: 18,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "col_003",
    name: "Minimal Office",
    slug: "minimal-office",
    description: "Elegancia profesional sin esfuerzo. Piezas versatiles que transicionan del trabajo al after office con naturalidad.",
    image: "/images/collections/minimal-office.jpg",
    banner: "/images/collections/minimal-office-banner.jpg",
    badge: "capsule",
    productCount: 8,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "col_004",
    name: "Weekend",
    slug: "weekend",
    description: "Comodidad y estilo para tus dias de descanso. Prendas relajadas en materiales suaves que invitan a disfrutar.",
    image: "/images/collections/weekend.jpg",
    banner: "/images/collections/weekend-banner.jpg",
    badge: "capsule",
    productCount: 10,
    createdAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "col_005",
    name: "Primavera/Verano 2025",
    slug: "ss-2025",
    description: "Proximamente. Una celebracion del sol y la ligereza.",
    image: "/images/collections/ss-2025.jpg",
    badge: "upcoming",
    season: "Primavera/Verano",
    year: "2025",
    productCount: 0,
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "col_006",
    name: "Accesorios",
    slug: "accesorios",
    description: "Los detalles que completan cada look. Bolsos, cinturones y accesorios en materiales nobles.",
    image: "/images/collections/accesorios.jpg",
    banner: "/images/collections/accesorios-banner.jpg",
    badge: "permanent",
    productCount: 6,
    createdAt: "2024-06-01T00:00:00Z",
  },
];

interface MockCollectionProduct extends ProductListItem {
  collectionSlug: string;
}

const mockCollectionProducts: MockCollectionProduct[] = [
  // Essentials
  {
    id: "prod_001",
    name: "Remera Essential Blanca",
    slug: "remera-essential-blanca",
    price: 45000,
    image: "/images/products/remera-essential-blanca-1.jpg",
    category: "remeras",
    isNew: true,
    collectionSlug: "essentials",
  },
  {
    id: "prod_002",
    name: "Remera Essential Negra",
    slug: "remera-essential-negra",
    price: 45000,
    image: "/images/products/remera-essential-negra-1.jpg",
    category: "remeras",
    collectionSlug: "essentials",
  },
  {
    id: "prod_009",
    name: "Camisa Lino Blanca",
    slug: "camisa-lino-blanca",
    price: 62000,
    salePrice: 43400,
    image: "/images/products/camisa-lino-blanca-1.jpg",
    category: "tops",
    isSale: true,
    collectionSlug: "essentials",
  },
  // AW 2025
  {
    id: "prod_003",
    name: "Pantalon Wide Beige",
    slug: "pantalon-wide-beige",
    price: 78000,
    image: "/images/products/pantalon-wide-beige-1.jpg",
    category: "pantalones",
    isNew: true,
    collectionSlug: "aw-2025",
  },
  {
    id: "prod_007",
    name: "Blazer Oversize Negro",
    slug: "blazer-oversize-negro",
    price: 145000,
    salePrice: 101500,
    image: "/images/products/blazer-oversize-negro-1.jpg",
    category: "tops",
    isSale: true,
    collectionSlug: "aw-2025",
  },
  {
    id: "prod_012",
    name: "Cardigan Oversize Beige",
    slug: "cardigan-oversize-beige",
    price: 98000,
    salePrice: 68600,
    image: "/images/products/cardigan-oversize-beige-1.jpg",
    category: "tops",
    isSale: true,
    collectionSlug: "aw-2025",
  },
  // Minimal Office
  {
    id: "prod_005",
    name: "Pollera Midi Plisada",
    slug: "pollera-midi-plisada",
    price: 68000,
    image: "/images/products/pollera-midi-plisada-1.jpg",
    category: "polleras",
    collectionSlug: "minimal-office",
  },
  {
    id: "prod_010",
    name: "Pantalon Pinzas Gris",
    slug: "pantalon-pinzas-gris",
    price: 85000,
    salePrice: 59500,
    image: "/images/products/pantalon-pinzas-gris-1.jpg",
    category: "pantalones",
    isSale: true,
    collectionSlug: "minimal-office",
  },
  // Weekend
  {
    id: "prod_006",
    name: "Short Lino Natural",
    slug: "short-lino-natural",
    price: 52000,
    image: "/images/products/short-lino-natural-1.jpg",
    category: "shorts",
    isNew: true,
    collectionSlug: "weekend",
  },
  {
    id: "prod_004",
    name: "Top Minimal Negro",
    slug: "top-minimal-negro",
    price: 38000,
    salePrice: 30400,
    image: "/images/products/top-minimal-negro-1.jpg",
    category: "tops",
    isSale: true,
    collectionSlug: "weekend",
  },
  // Accesorios
  {
    id: "prod_011",
    name: "Bolso Tote Cuero",
    slug: "bolso-tote-cuero",
    price: 125000,
    salePrice: 87500,
    image: "/images/products/bolso-tote-cuero-1.jpg",
    category: "accesorios",
    isSale: true,
    collectionSlug: "accesorios",
  },
  {
    id: "prod_013",
    name: "Cinturon Cuero Negro",
    slug: "cinturon-cuero-negro",
    price: 35000,
    image: "/images/products/cinturon-cuero-negro-1.jpg",
    category: "accesorios",
    collectionSlug: "accesorios",
  },
  {
    id: "prod_014",
    name: "Panuelo Seda Estampado",
    slug: "panuelo-seda-estampado",
    price: 28000,
    image: "/images/products/panuelo-seda-estampado-1.jpg",
    category: "accesorios",
    isNew: true,
    collectionSlug: "accesorios",
  },
];