import { PrintingPosition } from "./products";

export interface CartConfiguredItem {
  id: string; // product id
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
  printTechnique?: string;
  printOption?: "unbranded" | "branded"; // "Brez tiska" / "Z logotipom"
  printingPosition?: PrintingPosition;
  artworkFileId?: string;
  artworkFileName?: string;
  artworkFileSize?: number;
  artworkFileType?: string;
  artworkPreviewUrl?: string; // Informative preview for JPG/PNG
  notes?: string;
  minQuantity?: number;
  stock?: number;
  isOutlet?: boolean;
}

export type OrderStatus =
  | "Novo"
  | "V pregledu"
  | "Čaka na potrditev stranke"
  | "Potrjeno"
  | "V izvedbi"
  | "Zaključeno"
  | "Preklicano";

export interface DemoOrder {
  id: string;
  orderNumber: string; // e.g. "ZJ-2026-0042"
  createdAt: string;
  status: OrderStatus;
  customer: {
    company: string;
    fullName: string;
    email: string;
    phone: string;
    vatNumber: string;
    address: string;
    differentBillingAddress?: boolean;
    billingAddress?: string;
    requestedDeliveryDate?: string;
    notes?: string;
  };
  items: CartConfiguredItem[];
  subtotal: number; // Base product subtotal
  hasBrandedItems: boolean; // If true: "Cena tiska in dostave bo potrjena pred izvedbo."
  vatRate: number; // 22%
  vatAmount: number;
  totalEstimatedWithVat: number;
  generalArtworkFileId?: string;
  generalArtworkFileName?: string;
  acknowledgedDemoNotice: boolean;
}
