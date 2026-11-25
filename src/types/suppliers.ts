export interface SupplierProductSyncItem {
  supplierSku: string;
  supplierVariantId: string;
  name: string;
  category: string;
  supplierStock: number;
  purchasePriceEur: number;
  sourceCurrency: string;
  leadTimeDays: string;
  colors: string[];
  sizes?: string[];
  imageUrl: string;
  description: string;
}

export interface SupplierInfo {
  id: "supplier-a" | "supplier-b";
  name: string;
  code: string;
  connectionStatus: "Aktivna (simulirano)" | "Prekinjena" | "Vzdrževanje";
  lastSyncTimestamp: string;
  linkedProductsCount: number;
  defaultMarkupPercent: number; // e.g. 35%
  apiEndpointSimulated: string;
  catalogFormat: "REST JSON API (simulirano)" | "SOAP / XML feed (simulirano)";
}

export interface SyncReport {
  timestamp: string;
  supplierId: string;
  supplierName: string;
  newImportedCount: number;
  stockUpdatedCount: number;
  priceUpdatedCount: number;
  reviewRequiredCount: number;
  failedRecordsCount: number;
  details: {
    type: "new" | "stock" | "price" | "review" | "error";
    sku: string;
    message: string;
    oldValue?: string | number;
    newValue?: string | number;
  }[];
}
