"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Box,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  Eye,
  Layers,
  FileCheck,
  Info,
  Truck,
  Paintbrush,
  Maximize2,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import { PrintingPosition, Product } from "@/types/products";
import { PrintingPositionModal } from "@/components/PrintingPositionModal";
import { ArtworkUploader } from "@/components/ArtworkUploader";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { getProduct, products } = useProducts();
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const { addItem } = useCart();
  const { openInquiry, openSample } = useModals();
  const { trackEvent } = useAnalytics();

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(0);

  // Customization state
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || "Privzeta"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedPrint, setSelectedPrint] = useState(
    product.printTechniques[0] || "Brez tiska"
  );

  // Demo 2: Branding & Printing Position State
  const [printOption, setPrintOption] = useState<"unbranded" | "branded">(
    product.allowPersonalization !== false ? "branded" : "unbranded"
  );
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [selectedPrintingPosition, setSelectedPrintingPosition] = useState<PrintingPosition | null>(
    product.printingPositions?.[0] || null
  );
  const [uploadedArtwork, setUploadedArtwork] = useState<{
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    previewUrl?: string;
  } | null>(null);
  const [itemNotes, setItemNotes] = useState("");

  // Quantity with increment step
  const incrementStep = product.quantityIncrement || 5;
  const [quantity, setQuantity] = useState(product.minQuantity);

  // Related products
  const relatedProducts = products
    .filter((p) => product.relatedProductIds?.includes(p.id) && p.id !== product.id)
    .slice(0, 4);

  // Calculate tier price based on current quantity
  const currentTierPrice = (() => {
    if (!product.volumeDiscounts || product.volumeDiscounts.length === 0) {
      return product.priceFrom;
    }
    for (let i = product.volumeDiscounts.length - 1; i >= 0; i--) {
      const tier = product.volumeDiscounts[i];
      const match = tier.qty.match(/(\d+)/);
      if (match && quantity >= parseInt(match[1])) {
        return tier.price;
      }
    }
    return product.priceFrom;
  })();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: currentTierPrice,
        image: product.images[selectedImage] || product.images[0],
        color: selectedColor,
        size: selectedSize,
        printTechnique: printOption === "branded" ? selectedPrint : "Brez tiska",
        minQuantity: product.minQuantity,
        stock: product.stock,
        isOutlet: product.isOutlet,
        printOption,
        printingPosition: printOption === "branded" ? selectedPrintingPosition || undefined : undefined,
        artworkFileId: printOption === "branded" ? uploadedArtwork?.fileId : undefined,
        artworkFileName: printOption === "branded" ? uploadedArtwork?.fileName : undefined,
        artworkFileSize: printOption === "branded" ? uploadedArtwork?.fileSize : undefined,
        artworkFileType: printOption === "branded" ? uploadedArtwork?.fileType : undefined,
        artworkPreviewUrl: printOption === "branded" ? uploadedArtwork?.previewUrl : undefined,
        notes: itemNotes.trim() ? itemNotes.trim() : undefined,
      },
      quantity
    );

    trackEvent(
      "cart_add",
      `Dodano v košarico: ${product.name}`,
      `${quantity} kos, opcija: ${printOption}, cona: ${selectedPrintingPosition?.name || "brez"}`
    );
  };

  const handleQuote = () => {
    trackEvent(
      "quote_click",
      `Zahtevaj ponudbo za: ${product.name}`,
      `Količina: ${quantity} kos, SKU: ${product.sku}`
    );
    openInquiry({
      productName: product.name,
      sku: product.sku,
      quantity: quantity,
      interest: product.category,
      source: `Product Page: ${product.name} (${product.sku})`,
    });
  };

  const handleSample = () => {
    trackEvent(
      "sample_request",
      `Zahteva za vzorec: ${product.name}`,
      `SKU: ${product.sku}`
    );
    openSample(product);
  };

  return (
    <div className="py-10 space-y-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            Domov
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href={`/kategorije/${product.category}`}
            className="hover:text-brand-900 transition-colors"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          {/* Left Column: Gallery & Position Visualizer */}
          <div className="lg:col-span-7 space-y-5">
            {/* Big Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square sm:aspect-4/3 max-h-[500px] shadow-xs">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-brand-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {product.badge}
                </div>
              )}
              {product.isOutlet && (
                <div className="absolute top-4 right-4 bg-accent-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Outlet ponudba
                </div>
              )}

              {/* Printing Position Dashed Preview Indicator on Main Image */}
              {printOption === "branded" && selectedPrintingPosition && (
                <div
                  className="absolute border-2 border-dashed border-brand-500 bg-brand-500/20 rounded-lg flex items-center justify-center p-1 pointer-events-none transition-all"
                  style={{
                    top: selectedPrintingPosition.dashedArea.top,
                    left: selectedPrintingPosition.dashedArea.left,
                    width: selectedPrintingPosition.dashedArea.width,
                    height: selectedPrintingPosition.dashedArea.height,
                  }}
                >
                  {uploadedArtwork?.previewUrl ? (
                    <img
                      src={uploadedArtwork.previewUrl}
                      alt="Logotip"
                      className="max-h-full max-w-full object-contain filter drop-shadow opacity-90"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-brand-950 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs">
                      {selectedPrintingPosition.name}
                    </span>
                  )}
                </div>
              )}

              {printOption === "branded" && selectedPrintingPosition && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs py-1.5 px-3 rounded-xl flex items-center justify-between">
                  <span>
                    Cona tiska: <strong>{selectedPrintingPosition.name}</strong> ({selectedPrintingPosition.maxPrintArea})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPositionModalOpen(true)}
                    className="text-brand-300 hover:text-white underline text-[11px] font-semibold"
                  >
                    Spremeni cono →
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel / List */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? "border-brand-700 shadow-md scale-105"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} pogled ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Points Banner Under Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-700 shrink-0" />
                <span className="text-slate-700 font-medium">{product.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 font-medium">Brezplačen vizualni predogled</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-600 shrink-0" />
                <span className="text-slate-700 font-medium">Brez spletnega plačila</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Tiers & Configurator */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>SKU: {product.sku}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold font-sans">
                  Zaloga: {product.stock} kos (demo)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Price Box & Volume Discount Table */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Cena za izbrano količino:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-brand-950">
                      {currentTierPrice.toFixed(2)} €
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">brez DDV</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    (z 22% DDV: {(currentTierPrice * 1.22).toFixed(2)} €)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Minimalno naročilo:</span>
                  <span className="text-sm font-bold text-slate-800">
                    {product.minQuantity} kos
                  </span>
                  {product.quantityIncrement && (
                    <span className="text-[10px] text-slate-400 block">
                      (korak: +{product.quantityIncrement} kos)
                    </span>
                  )}
                </div>
              </div>

              {/* Volume Discount Tiers */}
              {product.volumeDiscounts && product.volumeDiscounts.length > 0 && (
                <div className="pt-2 border-t border-brand-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-900 block mb-2">
                    Količinski popusti (več naročite, manj plačate):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                    {product.volumeDiscounts.map((tier, idx) => {
                      const isCurrent = currentTierPrice === tier.price;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl text-xs border transition-all ${
                            isCurrent
                              ? "bg-brand-900 text-white border-brand-950 font-bold shadow-xs scale-102"
                              : "bg-white text-slate-700 border-brand-100"
                          }`}
                        >
                          <div className="text-[10px] opacity-80">{tier.qty}</div>
                          <div className="font-extrabold text-xs mt-0.5">
                            {tier.price.toFixed(2)} €
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Colors Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Izberite barvo: <span className="text-brand-900 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedColor === c.name
                          ? "border-brand-900 ring-2 ring-brand-900/20 bg-brand-50/50 font-bold text-brand-950"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes (if available) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Velikost: <span className="text-brand-900 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedSize === s
                          ? "bg-brand-900 text-white border-brand-950 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DEMO 2: Personalization & Printing Option Toggle */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <label className="block text-xs font-bold text-slate-800">
                Prilagoditev z vašim logotipom:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrintOption("unbranded")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    printOption === "unbranded"
                      ? "border-brand-700 bg-brand-50/60 ring-2 ring-brand-700 font-bold text-brand-950"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">Brez tiska</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Čisti artikli za takojšnjo dobavo
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintOption("branded")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    printOption === "branded"
                      ? "border-brand-700 bg-brand-50/60 ring-2 ring-brand-700 font-bold text-brand-950"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>Z vašim logotipom</span>
                    <Sparkles className="w-3.5 h-3.5 text-accent-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Tisk, laserska gravura ali vezenje
                  </div>
                </button>
              </div>

              {/* Position selector and artwork uploader when 'branded' is chosen */}
              {printOption === "branded" && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
                  {/* Selected Printing Position Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Paintbrush className="w-3.5 h-3.5 text-brand-700" />
                        <span>Pozicija tiska za ta artikel:</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => setIsPositionModalOpen(true)}
                        className="text-xs font-bold text-brand-700 hover:text-brand-900 underline"
                      >
                        {selectedPrintingPosition ? "Spremeni cono" : "Izberi cono"} →
                      </button>
                    </div>

                    {selectedPrintingPosition ? (
                      <div
                        onClick={() => setIsPositionModalOpen(true)}
                        className="p-3 bg-white rounded-xl border border-brand-200 shadow-2xs hover:border-brand-400 cursor-pointer transition-colors flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-brand-950">
                            {selectedPrintingPosition.name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Maks. dimenzija: <strong>{selectedPrintingPosition.maxPrintArea}</strong> • Tehnika: {selectedPrintingPosition.technique}
                          </div>
                        </div>
                        <span className="text-[11px] text-brand-700 font-semibold px-2 py-1 bg-brand-50 rounded-md shrink-0">
                          Spremeni
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPositionModalOpen(true)}
                        className="w-full p-3 bg-white border border-dashed border-slate-300 rounded-xl text-center text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                      >
                        + Izberite pozicijo tiska (Pokrov, Desna stran, Leva stran...)
                      </button>
                    )}
                  </div>

                  {/* Artwork Uploader Component */}
                  <ArtworkUploader
                    onFileSelected={(fileData) => setUploadedArtwork(fileData)}
                    currentFileName={uploadedArtwork?.fileName}
                    currentFileSize={uploadedArtwork?.fileSize}
                    currentPreviewUrl={uploadedArtwork?.previewUrl}
                    label="Naložite logotip za ta artikel (PDF, SVG, PNG, JPG):"
                  />

                  {/* Optional Item Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Opombe za tisk tega artikla (neobvezno):</span>
                    </label>
                    <textarea
                      rows={2}
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      placeholder="npr. Bela barva logotipa, Pantone 286C, postavitev na sredino..."
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-600 focus:outline-hidden"
                    />
                  </div>

                  <div className="text-[11px] text-brand-800 bg-brand-100/60 p-2.5 rounded-xl border border-brand-200/80">
                    💡 <strong>Cena tiska in dostave:</strong> Bo v celoti potrjena pred izvedbo naročila. Pred tiskom prejmete brezplačen vizualni predogled.
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector enforcing minimums and increments */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Količina za naročilo:
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(product.minQuantity, q - incrementStep))
                    }
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.minQuantity}
                    step={incrementStep}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || product.minQuantity;
                      setQuantity(Math.max(product.minQuantity, val));
                    }}
                    className="w-20 text-center font-bold text-sm py-2 border-0 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + incrementStep)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-slate-500">
                  <span>Okvirni znesek artiklov: </span>
                  <strong className="text-slate-900 font-extrabold text-sm">
                    {(currentTierPrice * quantity).toFixed(2)} €
                  </strong>
                  <span className="text-[10px] text-slate-400 ml-1">brez DDV</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 bg-brand-900 hover:bg-brand-950 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Dodaj v košarico ({quantity} kos)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuote}
                  className="py-3 px-4 bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Zahtevaj ponudbo</span>
                </button>

                <button
                  type="button"
                  onClick={handleSample}
                  className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5 text-brand-700" />
                  <span>Zahtevaj vzorec</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Suitability */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 border-t border-slate-200">
          {/* Tech Specs Table */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Tehnične specifikacije in materiali
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.fullDescription}
            </p>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/70">
                    <td className="py-2.5 px-4 font-semibold text-slate-500 w-1/3">
                      Material
                    </td>
                    <td className="py-2.5 px-4 text-slate-900 font-medium">
                      {product.materials}
                    </td>
                  </tr>
                  {product.specs &&
                    Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key}>
                        <td className="py-2.5 px-4 font-semibold text-slate-500">
                          {key}
                        </td>
                        <td className="py-2.5 px-4 text-slate-900">{val}</td>
                      </tr>
                    ))}
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-500">
                      Dobavni rok
                    </td>
                    <td className="py-2.5 px-4 text-slate-900">
                      {product.deliveryTime}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-500">
                      Zaloga (demo)
                    </td>
                    <td className="py-2.5 px-4 text-slate-900">
                      {product.stock} kosov v skladišču (lokalno: {product.localStock || 0}, dobavitelj: {product.supplierStock || product.stock})
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Suitable For */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Priporočeno za
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.suitableFor?.map((suit) => (
                <div
                  key={suit}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-800">{suit}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-100 text-xs text-brand-900 space-y-1 mt-6">
              <span className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                Vzorci in garancija kakovosti
              </span>
              <p className="text-brand-800/80 text-[11px] leading-relaxed">
                Za vsa večja naročila vam pred začetkom izdelave brezplačno pripravimo vizualno korekturo in po želji pošljemo fizični vzorec izdelka.
              </p>
            </div>
          </div>
        </div>

        {/* Printing Position Modal */}
        <PrintingPositionModal
          isOpen={isPositionModalOpen}
          onClose={() => setIsPositionModalOpen(false)}
          product={product}
          selectedPosition={selectedPrintingPosition}
          onSelectPosition={(pos) => setSelectedPrintingPosition(pos)}
          logoPreviewUrl={uploadedArtwork?.previewUrl}
        />
      </div>
    </div>
  );
}
