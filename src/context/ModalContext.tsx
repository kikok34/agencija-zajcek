"use client";

import React, { createContext, useContext, useState } from "react";
import { Catalog } from "@/data/catalogs";
import { Product } from "@/data/products";

export interface InquiryInitialData {
  interest?: string;
  productName?: string;
  sku?: string;
  quantity?: number;
  catalogTitle?: string;
  source?: string;
  notes?: string;
}

interface ModalContextType {
  // Inquiry Modal
  isInquiryOpen: boolean;
  inquiryData: InquiryInitialData | null;
  openInquiry: (data?: InquiryInitialData) => void;
  closeInquiry: () => void;

  // Sample Modal
  isSampleOpen: boolean;
  sampleProduct: Product | null;
  openSample: (product: Product) => void;
  closeSample: () => void;

  // PDF Viewer Modal
  isPdfOpen: boolean;
  activeCatalog: Catalog | null;
  openPdf: (catalog: Catalog) => void;
  closePdf: () => void;

  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryInitialData | null>(null);

  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const [sampleProduct, setSampleProduct] = useState<Product | null>(null);

  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [activeCatalog, setActiveCatalog] = useState<Catalog | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openInquiry = (data?: InquiryInitialData) => {
    setInquiryData(data || null);
    setIsInquiryOpen(true);
  };

  const closeInquiry = () => {
    setIsInquiryOpen(false);
    setInquiryData(null);
  };

  const openSample = (product: Product) => {
    setSampleProduct(product);
    setIsSampleOpen(true);
  };

  const closeSample = () => {
    setIsSampleOpen(false);
    setSampleProduct(null);
  };

  const openPdf = (catalog: Catalog) => {
    setActiveCatalog(catalog);
    setIsPdfOpen(true);
  };

  const closePdf = () => {
    setIsPdfOpen(false);
    setActiveCatalog(null);
  };

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isInquiryOpen,
        inquiryData,
        openInquiry,
        closeInquiry,
        isSampleOpen,
        sampleProduct,
        openSample,
        closeSample,
        isPdfOpen,
        activeCatalog,
        openPdf,
        closePdf,
        isSearchOpen,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
};
