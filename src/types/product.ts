// ---------------------------------------------------------------------------
// Product types for deer-antler.jewelry
// Matches the Shopify JSON structure exported from jewelrybyjohan.com
// ---------------------------------------------------------------------------

export interface ProductImage {
  id:         number;
  position:   number;
  src:        string;
  alt:        string | null;
  width?:     number;
  height?:    number;
  variant_ids?: number[];
}

export interface ProductVariant {
  id:            number;
  title:         string;
  price:         string;         // string like "249.00" — never displayed on this site
  compare_at_price: string | null;
  available:     boolean;
  sku?:          string;
  option1?:      string | null;
  option2?:      string | null;
  option3?:      string | null;
  inventory_quantity?: number;
  requires_shipping?: boolean;
  taxable?:      boolean;
  weight?:       number;
  weight_unit?:  string;
}

export interface ProductOption {
  id:       number;
  name:     string;
  position: number;
  values:   string[];
}

export interface Product {
  id:           number;
  title:        string;
  handle:       string;
  body_html:    string;
  vendor:       string;
  product_type: string;          // used for collection routing
  tags:         string[];        // comma-separated in raw JSON → parsed to array
  images:       ProductImage[];
  variants:     ProductVariant[];
  options?:     ProductOption[];
  published_at: string;
  created_at?:  string;
  updated_at:   string;
  status?:      string;
}

export interface ProductsResponse {
  products: Product[];
}
