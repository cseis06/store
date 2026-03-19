import { Product, ProductListItem, ApiResponse, PaginatedResponse } from "@/types/product";

// ============================================
// CONFIGURACIÓN DE API
// Cambiar estas variables cuando conectes la API real
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.kiren.com";
const USE_MOCK_DATA = true; // Cambiar a false cuando la API esté lista

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Obtener un producto por su slug
 */
export async function getProductBySlug(slug: string): Promise<ApiResponse<Product | null>> {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const product = mockProducts.find((p) => p.slug === slug);
    return {
      data: product || null,
      success: !!product,
      error: product ? undefined : "Producto no encontrado",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
      next: { revalidate: 60 }, // Revalidar cada 60 segundos
    });

    if (!response.ok) {
      return {
        data: null,
        success: false,
        error: "Error al obtener el producto",
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
      error: "Error de conexión",
    };
  }
}

/**
 * Obtener todos los slugs de productos (para generateStaticParams)
 */
export async function getAllProductSlugs(): Promise<string[]> {
  if (USE_MOCK_DATA) {
    return mockProducts.map((p) => p.slug);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/products/slugs`);
    const data = await response.json();
    return data.slugs || [];
  } catch (error) {
    return [];
  }
}

/**
 * Obtener productos relacionados
 */
export async function getRelatedProducts(
  categorySlug: string,
  currentProductId: string,
  limit: number = 4
): Promise<ProductListItem[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    
    return mockProducts
      .filter((p) => p.category.slug === categorySlug && p.id !== currentProductId)
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        image: p.images[0]?.src || "",
        category: p.category.slug,
        isNew: p.isNew,
        isSale: p.isSale,
      }));
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/products?category=${categorySlug}&exclude=${currentProductId}&limit=${limit}`
    );
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    return [];
  }
}

/**
 * Obtener productos con filtros y paginación
 */
export async function getProducts(params: {
  category?: string;
  collection?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<PaginatedResponse<ProductListItem>> {
  const { category, collection, page = 1, limit = 12, sortBy = "newest" } = params;

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category.slug === category);
    }

    if (collection) {
      filtered = filtered.filter((p) => p.collection?.slug === collection);
    }

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedProducts = filtered.slice(start, start + limit);

    return {
      data: paginatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        image: p.images[0]?.src || "",
        category: p.category.slug,
        isNew: p.isNew,
        isSale: p.isSale,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      ...(category && { category }),
      ...(collection && { collection }),
    });

    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }
}

/**
 * Obtener productos en oferta
 */
export async function getSaleProducts(params: {
  page?: number;
  limit?: number;
  sortBy?: string;
}): Promise<PaginatedResponse<ProductListItem>> {
  const { page = 1, limit = 12, sortBy = "discount" } = params;

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let saleProducts = mockProducts.filter((p) => p.isSale && p.salePrice);

    // Ordenar
    switch (sortBy) {
      case "price-asc":
        saleProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        saleProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "discount":
        saleProducts.sort((a, b) => {
          const discountA = a.salePrice ? (1 - a.salePrice / a.price) : 0;
          const discountB = b.salePrice ? (1 - b.salePrice / b.price) : 0;
          return discountB - discountA;
        });
        break;
      default:
        saleProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = saleProducts.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedProducts = saleProducts.slice(start, start + limit);

    return {
      data: paginatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice,
        image: p.images[0]?.src || "",
        category: p.category.slug,
        isNew: p.isNew,
        isSale: p.isSale,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  try {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sale: "true",
    });

    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      data: [],
      pagination: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }
}

// ============================================
// DATOS MOCK
// Eliminar cuando la API esté conectada
// ============================================

const mockProducts: Product[] = [
  {
    id: "prod_001",
    name: "Remera Essential Blanca",
    slug: "remera-essential-blanca",
    description: "Nuestra remera insignia en algodón pima de primera calidad. Corte relajado con caída perfecta. Una pieza atemporal que combina con todo tu guardarropa.",
    price: 45000,
    currency: "ARS",
    images: [
      { id: "img_001", src: "/images/products/remera-essential-blanca-1.jpg", alt: "Remera Essential Blanca - Frente" },
      { id: "img_002", src: "/images/products/remera-essential-blanca-2.jpg", alt: "Remera Essential Blanca - Detalle" },
      { id: "img_003", src: "/images/products/remera-essential-blanca-3.jpg", alt: "Remera Essential Blanca - Espalda" },
      { id: "img_004", src: "/images/products/remera-essential-blanca-4.jpg", alt: "Remera Essential Blanca - Modelo" },
    ],
    variants: [
      { id: "var_001", size: "XS", stock: 5, sku: "REM-ESS-BLA-XS" },
      { id: "var_002", size: "S", stock: 12, sku: "REM-ESS-BLA-S" },
      { id: "var_003", size: "M", stock: 8, sku: "REM-ESS-BLA-M" },
      { id: "var_004", size: "L", stock: 3, sku: "REM-ESS-BLA-L" },
      { id: "var_005", size: "XL", stock: 0, sku: "REM-ESS-BLA-XL" },
    ],
    category: { name: "Remeras", slug: "remeras" },
    collection: { name: "Essentials", slug: "essentials" },
    details: [
      "100% algodón pima",
      "Corte relajado",
      "Cuello redondo reforzado",
      "Costuras dobles",
      "Fabricado en Argentina",
    ],
    care: [
      "Lavar a máquina en frío",
      "No usar blanqueador",
      "Secar a temperatura baja",
      "Planchar a temperatura media",
    ],
    isNew: true,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "prod_002",
    name: "Remera Essential Negra",
    slug: "remera-essential-negra",
    description: "La versión en negro de nuestra remera insignia. Algodón pima de primera calidad con un teñido profundo que no destiñe.",
    price: 45000,
    currency: "ARS",
    images: [
      { id: "img_005", src: "/images/products/remera-essential-negra-1.jpg", alt: "Remera Essential Negra - Frente" },
      { id: "img_006", src: "/images/products/remera-essential-negra-2.jpg", alt: "Remera Essential Negra - Detalle" },
    ],
    variants: [
      { id: "var_006", size: "XS", stock: 3, sku: "REM-ESS-NEG-XS" },
      { id: "var_007", size: "S", stock: 15, sku: "REM-ESS-NEG-S" },
      { id: "var_008", size: "M", stock: 10, sku: "REM-ESS-NEG-M" },
      { id: "var_009", size: "L", stock: 7, sku: "REM-ESS-NEG-L" },
      { id: "var_010", size: "XL", stock: 2, sku: "REM-ESS-NEG-XL" },
    ],
    category: { name: "Remeras", slug: "remeras" },
    collection: { name: "Essentials", slug: "essentials" },
    details: [
      "100% algodón pima",
      "Corte relajado",
      "Cuello redondo reforzado",
      "Teñido resistente",
      "Fabricado en Argentina",
    ],
    care: [
      "Lavar a máquina en frío",
      "Lavar con colores oscuros",
      "No usar blanqueador",
      "Secar a temperatura baja",
    ],
    createdAt: "2025-02-15T00:00:00Z",
    updatedAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "prod_003",
    name: "Pantalón Wide Beige",
    slug: "pantalon-wide-beige",
    description: "Pantalón de pierna ancha en lino y algodón. Cintura alta con pinzas frontales. Perfecto para los días cálidos.",
    price: 78000,
    currency: "ARS",
    images: [
      { id: "img_007", src: "/images/products/pantalon-wide-beige-1.jpg", alt: "Pantalón Wide Beige - Frente" },
      { id: "img_008", src: "/images/products/pantalon-wide-beige-2.jpg", alt: "Pantalón Wide Beige - Lateral" },
    ],
    variants: [
      { id: "var_011", size: "XS", stock: 4, sku: "PAN-WID-BEI-XS" },
      { id: "var_012", size: "S", stock: 8, sku: "PAN-WID-BEI-S" },
      { id: "var_013", size: "M", stock: 6, sku: "PAN-WID-BEI-M" },
      { id: "var_014", size: "L", stock: 5, sku: "PAN-WID-BEI-L" },
    ],
    category: { name: "Pantalones", slug: "pantalones" },
    collection: { name: "Otoño/Invierno 2025", slug: "aw-2025" },
    details: [
      "55% lino, 45% algodón",
      "Cintura alta",
      "Pinzas frontales",
      "Bolsillos laterales",
      "Cierre con botón y cremallera",
    ],
    care: [
      "Lavar a mano o ciclo delicado",
      "Secar en horizontal",
      "Planchar a temperatura alta",
    ],
    isNew: true,
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "prod_004",
    name: "Top Minimal Negro",
    slug: "top-minimal-negro",
    description: "Top de tirantes finos en viscosa suave. Escote recto y espalda con detalle cruzado.",
    price: 38000,
    salePrice: 30400,
    currency: "ARS",
    images: [
      { id: "img_009", src: "/images/products/top-minimal-negro-1.jpg", alt: "Top Minimal Negro - Frente" },
      { id: "img_010", src: "/images/products/top-minimal-negro-2.jpg", alt: "Top Minimal Negro - Espalda" },
    ],
    variants: [
      { id: "var_015", size: "XS", stock: 6, sku: "TOP-MIN-NEG-XS" },
      { id: "var_016", size: "S", stock: 10, sku: "TOP-MIN-NEG-S" },
      { id: "var_017", size: "M", stock: 4, sku: "TOP-MIN-NEG-M" },
      { id: "var_018", size: "L", stock: 2, sku: "TOP-MIN-NEG-L" },
    ],
    category: { name: "Tops", slug: "tops" },
    details: [
      "100% viscosa",
      "Tirantes ajustables",
      "Escote recto",
      "Detalle cruzado en espalda",
    ],
    care: [
      "Lavar a mano",
      "No retorcer",
      "Secar en horizontal",
      "Planchar a temperatura baja",
    ],
    isSale: true,
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "prod_005",
    name: "Pollera Midi Plisada",
    slug: "pollera-midi-plisada",
    description: "Pollera midi con plisado fino. Cintura elástica para mayor comodidad. Una pieza versátil para el día y la noche.",
    price: 68000,
    currency: "ARS",
    images: [
      { id: "img_011", src: "/images/products/pollera-midi-plisada-1.jpg", alt: "Pollera Midi Plisada - Frente" },
      { id: "img_012", src: "/images/products/pollera-midi-plisada-2.jpg", alt: "Pollera Midi Plisada - Movimiento" },
    ],
    variants: [
      { id: "var_019", size: "XS", stock: 3, sku: "POL-MID-PLI-XS" },
      { id: "var_020", size: "S", stock: 7, sku: "POL-MID-PLI-S" },
      { id: "var_021", size: "M", stock: 5, sku: "POL-MID-PLI-M" },
      { id: "var_022", size: "L", stock: 4, sku: "POL-MID-PLI-L" },
    ],
    category: { name: "Polleras", slug: "polleras" },
    collection: { name: "Minimal Office", slug: "minimal-office" },
    details: [
      "100% poliéster reciclado",
      "Plisado permanente",
      "Cintura elástica",
      "Largo midi (75cm)",
      "Forro interior",
    ],
    care: [
      "Lavar a máquina en frío",
      "No usar secadora",
      "No planchar",
    ],
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-20T00:00:00Z",
  },
  {
    id: "prod_006",
    name: "Short Lino Natural",
    slug: "short-lino-natural",
    description: "Short de tiro alto en lino puro. Corte relajado con bolsillos laterales. Ideal para los días de calor.",
    price: 52000,
    currency: "ARS",
    images: [
      { id: "img_013", src: "/images/products/short-lino-natural-1.jpg", alt: "Short Lino Natural - Frente" },
      { id: "img_014", src: "/images/products/short-lino-natural-2.jpg", alt: "Short Lino Natural - Detalle" },
    ],
    variants: [
      { id: "var_023", size: "XS", stock: 8, sku: "SHO-LIN-NAT-XS" },
      { id: "var_024", size: "S", stock: 12, sku: "SHO-LIN-NAT-S" },
      { id: "var_025", size: "M", stock: 9, sku: "SHO-LIN-NAT-M" },
      { id: "var_026", size: "L", stock: 6, sku: "SHO-LIN-NAT-L" },
    ],
    category: { name: "Shorts", slug: "shorts" },
    collection: { name: "Weekend", slug: "weekend" },
    details: [
      "100% lino",
      "Tiro alto",
      "Bolsillos laterales",
      "Cinturón incluido",
    ],
    care: [
      "Lavar a máquina en frío",
      "Secar en sombra",
      "Planchar húmedo",
    ],
    isNew: true,
    createdAt: "2025-03-12T00:00:00Z",
    updatedAt: "2025-03-15T00:00:00Z",
  },
  {
    id: "prod_007",
    name: "Blazer Oversize Negro",
    slug: "blazer-oversize-negro",
    description: "Blazer de corte relajado en lana mixta. Solapas anchas y bolsillos de parche. La pieza statement de la temporada.",
    price: 145000,
    salePrice: 101500,
    currency: "ARS",
    images: [
      { id: "img_015", src: "/images/products/blazer-oversize-negro-1.jpg", alt: "Blazer Oversize Negro - Frente" },
      { id: "img_016", src: "/images/products/blazer-oversize-negro-2.jpg", alt: "Blazer Oversize Negro - Detalle" },
    ],
    variants: [
      { id: "var_027", size: "XS", stock: 3, sku: "BLA-OVE-NEG-XS" },
      { id: "var_028", size: "S", stock: 5, sku: "BLA-OVE-NEG-S" },
      { id: "var_029", size: "M", stock: 4, sku: "BLA-OVE-NEG-M" },
      { id: "var_030", size: "L", stock: 2, sku: "BLA-OVE-NEG-L" },
    ],
    category: { name: "Tops", slug: "tops" },
    collection: { name: "Otoño/Invierno 2025", slug: "aw-2025" },
    details: [
      "70% lana, 30% poliéster",
      "Corte oversize",
      "Solapas anchas",
      "Bolsillos de parche",
      "Forro interior",
    ],
    care: [
      "Limpieza en seco",
      "No lavar a máquina",
      "Planchar a temperatura media",
    ],
    isSale: true,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "prod_008",
    name: "Vestido Slip Satén",
    slug: "vestido-slip-saten",
    description: "Vestido de corte slip en satén de seda. Escote en V con tirantes ajustables. Elegancia minimalista.",
    price: 89000,
    salePrice: 62300,
    currency: "ARS",
    images: [
      { id: "img_017", src: "/images/products/vestido-slip-saten-1.jpg", alt: "Vestido Slip Satén - Frente" },
      { id: "img_018", src: "/images/products/vestido-slip-saten-2.jpg", alt: "Vestido Slip Satén - Espalda" },
    ],
    variants: [
      { id: "var_031", size: "XS", stock: 4, sku: "VES-SLI-SAT-XS" },
      { id: "var_032", size: "S", stock: 7, sku: "VES-SLI-SAT-S" },
      { id: "var_033", size: "M", stock: 5, sku: "VES-SLI-SAT-M" },
      { id: "var_034", size: "L", stock: 3, sku: "VES-SLI-SAT-L" },
    ],
    category: { name: "Polleras", slug: "polleras" },
    details: [
      "100% seda",
      "Corte slip",
      "Escote en V",
      "Tirantes ajustables",
      "Largo midi",
    ],
    care: [
      "Lavar a mano en frío",
      "No retorcer",
      "Secar en horizontal",
      "Planchar al revés",
    ],
    isSale: true,
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-02-15T00:00:00Z",
  },
  {
    id: "prod_009",
    name: "Camisa Lino Blanca",
    slug: "camisa-lino-blanca",
    description: "Camisa clásica en lino puro. Corte relajado con cuello italiano. Perfecta para el verano.",
    price: 62000,
    salePrice: 43400,
    currency: "ARS",
    images: [
      { id: "img_019", src: "/images/products/camisa-lino-blanca-1.jpg", alt: "Camisa Lino Blanca - Frente" },
      { id: "img_020", src: "/images/products/camisa-lino-blanca-2.jpg", alt: "Camisa Lino Blanca - Detalle" },
    ],
    variants: [
      { id: "var_035", size: "XS", stock: 6, sku: "CAM-LIN-BLA-XS" },
      { id: "var_036", size: "S", stock: 10, sku: "CAM-LIN-BLA-S" },
      { id: "var_037", size: "M", stock: 8, sku: "CAM-LIN-BLA-M" },
      { id: "var_038", size: "L", stock: 4, sku: "CAM-LIN-BLA-L" },
    ],
    category: { name: "Tops", slug: "tops" },
    collection: { name: "Essentials", slug: "essentials" },
    details: [
      "100% lino europeo",
      "Corte relajado",
      "Cuello italiano",
      "Botones de nácar",
    ],
    care: [
      "Lavar a máquina en frío",
      "Secar en sombra",
      "Planchar húmedo a temperatura alta",
    ],
    isSale: true,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-03-10T00:00:00Z",
  },
  {
    id: "prod_010",
    name: "Pantalón Pinzas Gris",
    slug: "pantalon-pinzas-gris",
    description: "Pantalón de vestir con pinzas frontales. Tiro alto y pierna recta. Elegancia atemporal.",
    price: 85000,
    salePrice: 59500,
    currency: "ARS",
    images: [
      { id: "img_021", src: "/images/products/pantalon-pinzas-gris-1.jpg", alt: "Pantalón Pinzas Gris - Frente" },
      { id: "img_022", src: "/images/products/pantalon-pinzas-gris-2.jpg", alt: "Pantalón Pinzas Gris - Lateral" },
    ],
    variants: [
      { id: "var_039", size: "XS", stock: 3, sku: "PAN-PIN-GRI-XS" },
      { id: "var_040", size: "S", stock: 6, sku: "PAN-PIN-GRI-S" },
      { id: "var_041", size: "M", stock: 5, sku: "PAN-PIN-GRI-M" },
      { id: "var_042", size: "L", stock: 4, sku: "PAN-PIN-GRI-L" },
    ],
    category: { name: "Pantalones", slug: "pantalones" },
    collection: { name: "Minimal Office", slug: "minimal-office" },
    details: [
      "98% algodón, 2% elastano",
      "Tiro alto",
      "Pinzas frontales",
      "Bolsillos laterales",
      "Cierre con cremallera",
    ],
    care: [
      "Lavar a máquina en frío",
      "No usar secadora",
      "Planchar a temperatura media",
    ],
    isSale: true,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-02-20T00:00:00Z",
  },
  {
    id: "prod_011",
    name: "Bolso Tote Cuero",
    slug: "bolso-tote-cuero",
    description: "Bolso tote en cuero vacuno natural. Amplio y funcional, perfecto para el día a día.",
    price: 125000,
    salePrice: 87500,
    currency: "ARS",
    images: [
      { id: "img_023", src: "/images/products/bolso-tote-cuero-1.jpg", alt: "Bolso Tote Cuero - Frente" },
      { id: "img_024", src: "/images/products/bolso-tote-cuero-2.jpg", alt: "Bolso Tote Cuero - Interior" },
    ],
    variants: [
      { id: "var_043", size: "Único", stock: 8, sku: "BOL-TOT-CUE-UNI" },
    ],
    category: { name: "Accesorios", slug: "accesorios" },
    details: [
      "100% cuero vacuno",
      "Forro interior de algodón",
      "Bolsillo interior con cierre",
      "Asas de 25cm",
      "Medidas: 40x30x15cm",
    ],
    care: [
      "Limpiar con paño húmedo",
      "Aplicar crema para cuero",
      "Guardar en bolsa de tela",
    ],
    isSale: true,
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2025-03-05T00:00:00Z",
  },
  {
    id: "prod_012",
    name: "Cardigan Oversize Beige",
    slug: "cardigan-oversize-beige",
    description: "Cardigan de punto grueso en lana merino. Corte oversize con botones de madera.",
    price: 98000,
    salePrice: 68600,
    currency: "ARS",
    images: [
      { id: "img_025", src: "/images/products/cardigan-oversize-beige-1.jpg", alt: "Cardigan Oversize Beige - Frente" },
      { id: "img_026", src: "/images/products/cardigan-oversize-beige-2.jpg", alt: "Cardigan Oversize Beige - Detalle" },
    ],
    variants: [
      { id: "var_044", size: "S", stock: 5, sku: "CAR-OVE-BEI-S" },
      { id: "var_045", size: "M", stock: 7, sku: "CAR-OVE-BEI-M" },
      { id: "var_046", size: "L", stock: 4, sku: "CAR-OVE-BEI-L" },
    ],
    category: { name: "Tops", slug: "tops" },
    collection: { name: "Otoño/Invierno 2025", slug: "aw-2025" },
    details: [
      "100% lana merino",
      "Punto grueso",
      "Corte oversize",
      "Botones de madera",
      "Bolsillos laterales",
    ],
    care: [
      "Lavar a mano en frío",
      "Secar en horizontal",
      "No planchar",
    ],
    isSale: true,
    createdAt: "2025-02-10T00:00:00Z",
    updatedAt: "2025-03-12T00:00:00Z",
  },
];