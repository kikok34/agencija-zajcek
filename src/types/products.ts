export interface ProductColor {
  name: string;
  hex: string;
}

export interface VolumeDiscount {
  qty: string;
  price: number;
}

export interface PrintingPosition {
  id: string; // "pokrov", "desna_stran", "leva_stran", "prsa_levo", "spredaj", "hrbet", etc.
  name: string; // "Pokrov", "Desna stran", "Leva stran"
  description: string;
  maxPrintArea: string; // "100 × 60 mm (demo)"
  technique: string; // "Laserska gravura ali tamponski tisk"
  previewImage?: string;
  dashedArea: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}

export type ProductStatus = "published" | "draft" | "needs_review";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  priceFrom: number;
  regularPrice?: number;
  outletPrice?: number;
  minQuantity: number;
  quantityIncrement?: number;
  stock: number;
  localStock?: number;
  supplierStock?: number;
  isOutlet?: boolean;
  featured?: boolean;
  badge?: string;
  images: string[];
  colors: ProductColor[];
  sizes?: string[];
  materials: string;
  printTechniques: string[];
  deliveryTime: string;
  suitableFor: string[];
  specs: Record<string, string>;
  volumeDiscounts: VolumeDiscount[];
  relatedProductIds: string[];

  // Demo 2 extensions
  status?: ProductStatus;
  vatRate?: number; // default 22%
  priceVatIncluded?: boolean; // default false (B2B prices are excl. VAT)
  allowPersonalization?: boolean;
  printingPositions?: PrintingPosition[];

  // Supplier linkage
  supplierId?: "supplier-a" | "supplier-b" | null;
  supplierName?: string;
  supplierSku?: string;
  supplierPurchasePrice?: number; // NEVER shown on customer-facing pages!
  manualPriceOverride?: boolean; // protects manual prices from sync overwrite
  marginPercent?: number; // e.g. 35
  lastSupplierSync?: string;
}
