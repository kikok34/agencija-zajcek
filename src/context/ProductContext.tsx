"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductStatus } from "@/types/products";
import { SupplierInfo, SyncReport } from "@/types/suppliers";
import { PRODUCTS } from "@/data/products";
import { clearAllArtworkFiles } from "@/lib/indexedDb";

interface ProductContextType {
  products: Product[];
  publishedProducts: Product[];
  isLoading: boolean;
  getProduct: (id: string) => Product | undefined;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetAllDemoData: () => Promise<void>;
  suppliers: SupplierInfo[];
  syncSupplier: (supplierId: "supplier-a" | "supplier-b") => SyncReport;
  syncReports: SyncReport[];
  importSupplierCsv: (supplierId: "supplier-a" | "supplier-b", csvText: string) => { report: SyncReport; success: boolean; message: string };
  metrics: {
    publishedCount: number;
    needsReviewCount: number;
    totalCount: number;
    lastSupplierUpdate: string;
  };
}

const STORAGE_KEY_PRODUCTS = "az_demo_products_v2";
const STORAGE_KEY_SUPPLIERS = "az_demo_suppliers_v2";
const STORAGE_KEY_SYNC_REPORTS = "az_demo_sync_reports_v2";

const INITIAL_SUPPLIERS: SupplierInfo[] = [
  {
    id: "supplier-a",
    name: "Demo dobavitelj A (PromoTextile Europe)",
    code: "PTE-EU",
    connectionStatus: "Aktivna (simulirano)",
    lastSyncTimestamp: new Date().toISOString(),
    linkedProductsCount: 8,
    defaultMarkupPercent: 35,
    apiEndpointSimulated: "https://api.demo-promotextile.example.com/v2/catalog",
    catalogFormat: "REST JSON API (simulirano)",
  },
  {
    id: "supplier-b",
    name: "Demo dobavitelj B (TechPromo Direct)",
    code: "TPD-GLOBAL",
    connectionStatus: "Aktivna (simulirano)",
    lastSyncTimestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    linkedProductsCount: 6,
    defaultMarkupPercent: 40,
    apiEndpointSimulated: "https://edi.demo-techpromo.example.com/soap/sync",
    catalogFormat: "SOAP / XML feed (simulirano)",
  },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [suppliers, setSuppliers] = useState<SupplierInfo[]>(INITIAL_SUPPLIERS);
  const [syncReports, setSyncReports] = useState<SyncReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (storedProds) {
        setProducts(JSON.parse(storedProds));
      } else {
        // Seed default products
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(PRODUCTS));
      }

      const storedSuppliers = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
      if (storedSuppliers) {
        setSuppliers(JSON.parse(storedSuppliers));
      }

      const storedReports = localStorage.getItem(STORAGE_KEY_SYNC_REPORTS);
      if (storedReports) {
        setSyncReports(JSON.parse(storedReports));
      }
    } catch (err) {
      console.error("Failed to load products/suppliers from localStorage", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  };

  const saveSuppliers = (updated: SupplierInfo[]) => {
    setSuppliers(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save suppliers to localStorage", e);
    }
  };

  const saveReports = (updated: SyncReport[]) => {
    setSyncReports(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SYNC_REPORTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save sync reports to localStorage", e);
    }
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
  };

  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    saveProducts(updated);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const resetAllDemoData = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY_PRODUCTS);
      localStorage.removeItem(STORAGE_KEY_SUPPLIERS);
      localStorage.removeItem(STORAGE_KEY_SYNC_REPORTS);
      localStorage.removeItem("az_demo_orders_v2");
      localStorage.removeItem("az_cart_v2");
      await clearAllArtworkFiles();
      setProducts(PRODUCTS);
      setSuppliers(INITIAL_SUPPLIERS);
      setSyncReports([]);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(PRODUCTS));
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(INITIAL_SUPPLIERS));
    } catch (e) {
      console.error("Reset failed", e);
    }
  };

  /**
   * Simulate supplier synchronization.
   * Respects manualPriceOverride: Does NOT overwrite owner's manual selling price!
   * Requires review for new items.
   * Updates supplierStock separately from localStock.
   */
  const syncSupplier = (supplierId: "supplier-a" | "supplier-b"): SyncReport => {
    const targetSupplier = suppliers.find((s) => s.id === supplierId);
    const supplierName = targetSupplier ? targetSupplier.name : supplierId;

    const report: SyncReport = {
      timestamp: new Date().toISOString(),
      supplierId,
      supplierName,
      newImportedCount: 0,
      stockUpdatedCount: 0,
      priceUpdatedCount: 0,
      reviewRequiredCount: 0,
      failedRecordsCount: 0,
      details: [],
    };

    const updatedProducts = products.map((prod) => {
      if (prod.supplierId !== supplierId) return prod;

      // Simulate stock fluctuation (+/- 50 to 200)
      const stockDelta = Math.floor(Math.random() * 200) - 80;
      const oldStock = prod.supplierStock || prod.stock;
      const newSupplierStock = Math.max(50, oldStock + stockDelta);

      report.stockUpdatedCount++;
      report.details.push({
        type: "stock",
        sku: prod.sku,
        message: `Posodobljena dobaviteljska zaloga za »${prod.name}«`,
        oldValue: oldStock,
        newValue: newSupplierStock,
      });

      // Price update simulation:
      // If owner has manualPriceOverride === true, preserve manual selling price!
      let newPurchasePrice = prod.supplierPurchasePrice || prod.priceFrom * 0.6;
      const purchasePriceShift = (Math.random() * 0.3 - 0.1); // small fluctuation
      newPurchasePrice = Math.round((newPurchasePrice + purchasePriceShift) * 100) / 100;

      let newSellingPrice = prod.priceFrom;
      if (prod.manualPriceOverride) {
        // PRESERVED!
        report.details.push({
          type: "price",
          sku: prod.sku,
          message: `Ohranjena ročno določena prodajna cena lastnika (${prod.priceFrom.toFixed(2)} € brez DDV). Nabavna cena posodobljena na ${newPurchasePrice.toFixed(2)} €.`,
          oldValue: prod.supplierPurchasePrice || 0,
          newValue: newPurchasePrice,
        });
      } else {
        // Automatic markup
        const markup = (prod.marginPercent || 35) / 100;
        const calculatedSelling = Math.round(newPurchasePrice * (1 + markup) * 100) / 100;
        if (calculatedSelling !== prod.priceFrom) {
          report.priceUpdatedCount++;
          report.details.push({
            type: "price",
            sku: prod.sku,
            message: `Posodobljena priporočena prodajna cena z maržo ${prod.marginPercent || 35}%`,
            oldValue: `${prod.priceFrom.toFixed(2)} €`,
            newValue: `${calculatedSelling.toFixed(2)} €`,
          });
          newSellingPrice = calculatedSelling;
        }
      }

      return {
        ...prod,
        supplierStock: newSupplierStock,
        stock: (prod.localStock || 0) + newSupplierStock,
        supplierPurchasePrice: newPurchasePrice,
        priceFrom: newSellingPrice,
        lastSupplierSync: report.timestamp,
      };
    });

    // Check if we should simulate 1 new imported product needing review
    const existingImported = updatedProducts.find((p) => p.sku === `${supplierId === "supplier-a" ? "PTE" : "TPD"}-NEW-99`);
    if (!existingImported) {
      const isA = supplierId === "supplier-a";
      const newProd: Product = {
        id: `imp-${Date.now()}`,
        sku: isA ? "PTE-NEW-99" : "TPD-NEW-99",
        name: isA
          ? "Nova termo steklenica Arctic Bamboo 600ml (Novo od dobavitelja)"
          : "Novi hitri brezžični polnilec Stand Fast Qi 15W (Novo od dobavitelja)",
        category: isA ? "dom-in-zivljenje" : "mobile-and-tech",
        categoryName: isA ? "Dom in življenje" : "Mobile & Tech",
        shortDescription: "Izdelek pravkar uvožen iz kataloga dobavitelja. Potreben pregled pred javno objavo.",
        fullDescription: "Avtomatsko uvožen opis iz podatkovnega vira dobavitelja. Pred objavo preverite maržo, tiskarske pozicije in vsebino.",
        priceFrom: isA ? 8.50 : 12.90,
        minQuantity: 25,
        quantityIncrement: 5,
        stock: 500,
        localStock: 0,
        supplierStock: 500,
        status: "needs_review", // REQUIRES REVIEW!
        vatRate: 22,
        priceVatIncluded: false,
        allowPersonalization: true,
        supplierId,
        supplierName,
        supplierSku: isA ? "PTE-ART-600" : "TPD-FAST-15W",
        supplierPurchasePrice: isA ? 5.20 : 7.80,
        manualPriceOverride: false,
        marginPercent: 35,
        lastSupplierSync: report.timestamp,
        images: [
          isA
            ? "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?auto=format&fit=crop&w=800&q=80",
        ],
        colors: [{ name: "Naravna / Srebrna", hex: "#cbd5e1" }],
        materials: isA ? "Bambus, nerjaveče jeklo" : "Recikliran ABS aluminij",
        printTechniques: ["Laserska gravura", "Tamponski tisk"],
        deliveryTime: "5–7 delovnih dni",
        suitableFor: ["Poslovna darila", "Zaposleni"],
        specs: { "Poreklo": "EU distribucija", "Status uvoza": "Čaka na odobritev lastnika" },
        volumeDiscounts: [
          { qty: "25–49 kos", price: isA ? 9.50 : 14.50 },
          { qty: "50+ kos", price: isA ? 8.50 : 12.90 },
        ],
        relatedProductIds: ["home-01", "tek-01"],
      };

      updatedProducts.unshift(newProd);
      report.newImportedCount = 1;
      report.reviewRequiredCount = 1;
      report.details.unshift({
        type: "new",
        sku: newProd.sku,
        message: `Uvožen nov izdelek: »${newProd.name}«. Dodeljen status: Potreben pregled.`,
        newValue: `${newProd.priceFrom.toFixed(2)} € (nabavna: ${newProd.supplierPurchasePrice?.toFixed(2)} €)`,
      });
    }

    saveProducts(updatedProducts);

    // Update supplier info
    const updatedSuppliers = suppliers.map((s) => {
      if (s.id === supplierId) {
        return {
          ...s,
          lastSyncTimestamp: report.timestamp,
          linkedProductsCount: updatedProducts.filter((p) => p.supplierId === supplierId).length,
        };
      }
      return s;
    });
    saveSuppliers(updatedSuppliers);

    const updatedReports = [report, ...syncReports].slice(0, 15);
    saveReports(updatedReports);

    return report;
  };

  /**
   * CSV Import parser with validation
   */
  const importSupplierCsv = (
    supplierId: "supplier-a" | "supplier-b",
    csvText: string
  ): { report: SyncReport; success: boolean; message: string } => {
    const report: SyncReport = {
      timestamp: new Date().toISOString(),
      supplierId,
      supplierName: supplierId === "supplier-a" ? "Demo dobavitelj A" : "Demo dobavitelj B",
      newImportedCount: 0,
      stockUpdatedCount: 0,
      priceUpdatedCount: 0,
      reviewRequiredCount: 0,
      failedRecordsCount: 0,
      details: [],
    };

    try {
      const lines = csvText.trim().split("\n");
      if (lines.length < 2) {
        return { report, success: false, message: "CSV datoteka je prazna ali nima veljavne glave." };
      }

      // Expected header: sku,name,category,purchasePrice,supplierStock,minQty
      const rows = lines.slice(1);
      const newItems: Product[] = [];

      rows.forEach((row, idx) => {
        const parts = row.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
        if (parts.length < 5) {
          report.failedRecordsCount++;
          report.details.push({
            type: "error",
            sku: `Vrstica ${idx + 2}`,
            message: "Napačno število stolpcev (pričakovano vsaj 5).",
          });
          return;
        }

        const [sku, name, cat, purchasePriceStr, stockStr] = parts;
        const purchasePrice = parseFloat(purchasePriceStr) || 0;
        const supplierStock = parseInt(stockStr) || 0;

        if (!sku || !name || purchasePrice <= 0) {
          report.failedRecordsCount++;
          report.details.push({
            type: "error",
            sku: sku || `Vrstica ${idx + 2}`,
            message: "Neveljavna cena ali manjkajoč SKU.",
          });
          return;
        }

        // Check if product exists
        const existingIndex = products.findIndex((p) => p.sku === sku || p.supplierSku === sku);
        if (existingIndex > -1) {
          report.stockUpdatedCount++;
          report.details.push({
            type: "stock",
            sku,
            message: `Posodobljena zaloga iz CSV za »${name}«`,
            newValue: supplierStock,
          });
        } else {
          // New product
          const margin = 35;
          const sellingPrice = Math.round(purchasePrice * 1.35 * 100) / 100;
          const newProd: Product = {
            id: `csv-${Date.now()}-${idx}`,
            sku,
            name,
            category: cat || "promo-tekstil",
            categoryName: "Uvoz dobavitelja",
            shortDescription: `Uvoženo preko CSV (${supplierId}).`,
            fullDescription: `Opis izdelka ${name} uvoženega iz dobaviteljskega CSV kataloga.`,
            priceFrom: sellingPrice,
            minQuantity: 25,
            quantityIncrement: 5,
            stock: supplierStock,
            localStock: 0,
            supplierStock,
            status: "needs_review",
            vatRate: 22,
            priceVatIncluded: false,
            allowPersonalization: true,
            supplierId,
            supplierSku: sku,
            supplierPurchasePrice: purchasePrice,
            marginPercent: margin,
            lastSupplierSync: report.timestamp,
            images: [
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
            ],
            colors: [{ name: "Standard", hex: "#0f172a" }],
            materials: "Standardna sestava dobavitelja",
            printTechniques: ["Sitotisk", "Tamponski tisk"],
            deliveryTime: "5–7 delovnih dni",
            suitableFor: ["B2B darila"],
            specs: { "Uvoz": "CSV datoteka", "Datum uvoza": new Date().toLocaleDateString("sl-SI") },
            volumeDiscounts: [{ qty: "25+ kos", price: sellingPrice }],
            relatedProductIds: ["tek-01"],
          };
          newItems.push(newProd);
          report.newImportedCount++;
          report.reviewRequiredCount++;
          report.details.push({
            type: "new",
            sku,
            message: `Nov izdelek »${name}« uvožen iz CSV (potreben pregled).`,
            newValue: `${sellingPrice.toFixed(2)} €`,
          });
        }
      });

      if (newItems.length > 0) {
        saveProducts([...newItems, ...products]);
      }

      const updatedReports = [report, ...syncReports].slice(0, 15);
      saveReports(updatedReports);

      return {
        report,
        success: true,
        message: `Uspešno obdelanih ${rows.length} vrstic. Novih: ${report.newImportedCount}, Posodobljenih: ${report.stockUpdatedCount}, Napak: ${report.failedRecordsCount}.`,
      };
    } catch (err: any) {
      return {
        report,
        success: false,
        message: `Napaka pri razčlenjevanju CSV: ${err.message}`,
      };
    }
  };

  const publishedProducts = products.filter((p) => p.status === "published" || !p.status);
  const needsReviewCount = products.filter((p) => p.status === "needs_review").length;
  const lastSupplierUpdate = suppliers.reduce((latest, s) => {
    return s.lastSyncTimestamp > latest ? s.lastSyncTimestamp : latest;
  }, suppliers[0]?.lastSyncTimestamp || new Date().toISOString());

  return (
    <ProductContext.Provider
      value={{
        products,
        publishedProducts,
        isLoading,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        resetAllDemoData,
        suppliers,
        syncSupplier,
        syncReports,
        importSupplierCsv,
        metrics: {
          publishedCount: publishedProducts.length,
          needsReviewCount,
          totalCount: products.length,
          lastSupplierUpdate,
        },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
