// ---------------------------------------------------------------------------
// products.ts — fetches deer antler product data at Astro build time
// Data source: GitHub raw JSON (update URL once the data repo is ready)
// ---------------------------------------------------------------------------

import type { Product, ProductImage, ProductsResponse } from '../types/product';

const PRODUCTS_URL =
  'https://raw.githubusercontent.com/JohanGytHub/deer-antler-data/refs/heads/main/deer_antler_products.json';

// ---------------------------------------------------------------------------
// Collection routing map — maps product_type to URL path
// ---------------------------------------------------------------------------
export const COLLECTION_MAP: Record<string, string> = {
  'Rings':                  '/rings',
  'In Stock Wedding Bands': '/rings',   // in-stock rings display on /rings
  'Ring Sets':              '/ring-sets',
  'Ring Set':               '/ring-sets',
  'Earrings':               '/earrings',
  'Pendants':               '/pendants',
  'Necklaces':              '/pendants',
  'Cufflinks':              '/cufflinks',
  'Tie Clips':              '/tie-clips',
  'Tie Clip':               '/tie-clips',
  'Unique':                 '/unique',
};

// Products tagged with this are featured on the /custom page
export const CUSTOM_TAG = 'trophy-antler';

// ---------------------------------------------------------------------------
// getProductAlt — NEVER returns an empty string (accessibility + SEO)
// Uses img.alt if present and non-empty after trim, otherwise falls back
// to the product title.
// ---------------------------------------------------------------------------
export function getProductAlt(product: Product): string {
  const img: ProductImage | undefined =
    product.images.find((i) => i.position === 1) || product.images[0];
  return (img?.alt?.trim()) || product.title;
}

// ---------------------------------------------------------------------------
// getProductImageSrc — returns the primary image src or a placeholder
// ---------------------------------------------------------------------------
export function getProductImageSrc(product: Product): string {
  const img: ProductImage | undefined =
    product.images.find((i) => i.position === 1) || product.images[0];
  return img?.src ?? 'https://jewelrybyjohan.com/cdn/shop/products/placeholder.jpg';
}

// ---------------------------------------------------------------------------
// getProductUrl — full URL to the product page on jewelrybyjohan.com
// Used for the "Order at Jewelry by Johan" CTA buttons only
// ---------------------------------------------------------------------------
export function getProductUrl(product: Product): string {
  return `https://jewelrybyjohan.com/products/${product.handle}`;
}

// ---------------------------------------------------------------------------
// getLocalProductUrl — local product detail page on this site
// Used for image and title links so visitors read the product page first
// ---------------------------------------------------------------------------
export function getLocalProductUrl(product: Product): string {
  return `/products/${product.handle}`;
}

// ---------------------------------------------------------------------------
// getCollectionPath — returns the local collection path for a product,
// or '/' as fallback
// ---------------------------------------------------------------------------
export function getCollectionPath(product: Product): string {
  return COLLECTION_MAP[product.product_type] ?? '/rings';
}

// ---------------------------------------------------------------------------
// isCustomProduct — returns true if the product is tagged for the /custom page
// ---------------------------------------------------------------------------
export function isCustomProduct(product: Product): boolean {
  return product.tags.some(
    (t) => t.toLowerCase().replace(/\s+/g, '-') === CUSTOM_TAG
  );
}

// ---------------------------------------------------------------------------
// fetchProducts — called at Astro build time (never in the browser)
// Returns an empty array on error so the build succeeds even without data
// ---------------------------------------------------------------------------
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(PRODUCTS_URL, {
      // Tell Astro/CF to always fetch fresh at build time
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(
        `[products.ts] Could not fetch products (HTTP ${res.status}). ` +
        `URL: ${PRODUCTS_URL}\n` +
        `The site will build without product data. ` +
        `Update PRODUCTS_URL once the data repo is ready.`
      );
      return [];
    }

    const raw = await res.json();
    // Data is a flat array — handle both flat array and { products: [...] } formats
    const products: Product[] = Array.isArray(raw) ? raw : ((raw as ProductsResponse).products ?? []);

    // Normalise tags: Shopify sometimes returns tags as a comma-separated
    // string rather than an array — parse both formats.
    return products.map((p) => ({
      ...p,
      tags: normaliseTagArray(p.tags),
    }));
  } catch (err) {
    console.warn(
      `[products.ts] Fetch failed: ${err}\n` +
      `Building site without product data (placeholder mode).`
    );
    return [];
  }
}

// ---------------------------------------------------------------------------
// fetchProductByHandle — fetch a single product by handle at build time
// Used by [handle].astro getStaticPaths
// ---------------------------------------------------------------------------
export async function fetchProductByHandle(
  handle: string
): Promise<Product | null> {
  const all = await fetchProducts();
  return all.find((p) => p.handle === handle) ?? null;
}

// ---------------------------------------------------------------------------
// filterByCollection — filter products for a specific collection page
// ---------------------------------------------------------------------------
export function filterByCollection(
  products: Product[],
  productType: string | string[]
): Product[] {
  const types = Array.isArray(productType) ? productType : [productType];
  return products.filter((p) => types.includes(p.product_type));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normaliseTagArray(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}