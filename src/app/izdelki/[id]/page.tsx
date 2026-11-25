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
} from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === id);
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
  const [quantity, setQuantity] = useState(product.minQuantity);

  // Related products
  const relatedProducts = PRODUCTS.filter((p) =>
    product.relatedProductIds.includes(p.id)
  ).slice(0, 4);

  // Calculate tier price based on current quantity
  const currentTierPrice = (() => {
    if (!product.volumeDiscounts || product.volumeDiscounts.length === 0) {
      return product.priceFrom;
    }
    // Simple tiered matching
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
        printTechnique: selectedPrint,
        minQuantity: product.minQuantity,
        stock: product.stock,
        isOutlet: product.isOutlet,
      },
      quantity
    );

    trackEvent(
      "cart_add",
      `Dodano v košarico: ${product.name}`,
      `${quantity} kos, barva: ${selectedColor}, tisk: ${selectedPrint}`
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
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Big Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square sm:aspect-4/3 max-h-[500px]">
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
                  Outlet cena
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
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
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
                <Truck className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span className="text-slate-700 font-medium">{product.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Brezplačna e-korektura tiska</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Strokovno B2B svetovanje</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Tiers & Configurator */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>SKU: {product.sku}</span>
                <span className="text-emerald-600 font-semibold font-sans">
                  Na zalogi: {product.stock} kos
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
                    <span className="text-xs text-slate-500">/ kos + DDV</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Minimalno naročilo:</span>
                  <span className="text-sm font-bold text-slate-800">
                    {product.minQuantity} kos
                  </span>
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
            {product.colors.length > 0 && (
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

            {/* Print Techniques Selector */}
            {product.printTechniques.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Želena tehnika tiska / dodelave:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.printTechniques.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => setSelectedPrint(tech)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedPrint === tech
                          ? "border-brand-900 bg-brand-50 text-brand-950 font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tech}</span>
                        {selectedPrint === tech && (
                          <Check className="w-3.5 h-3.5 text-brand-800" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Količina za naročilo / povpraševanje:
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.max(product.minQuantity, q - 10))
                    }
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-l-xl font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.minQuantity}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 text-center font-bold text-sm py-2 border-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 10)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-r-xl font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Skupni okvirni znesek:{" "}
                  <strong className="text-slate-900 font-extrabold text-sm">
                    {(currentTierPrice * quantity).toFixed(2)} €
                  </strong>
                </span>
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
                    <td className="px-4 py-3 font-semibold text-slate-700 w-1/3">
                      Material
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.materials}</td>
                  </tr>
                  {Object.entries(product.specs).map(([key, val]) => (
                    <tr key={key}>
                      <td className="px-4 py-3 font-semibold text-slate-700">{key}</td>
                      <td className="px-4 py-3 text-slate-600">{val}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      Podprti tiski
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {product.printTechniques.join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Primerno za (Suitability) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Za kakšne priložnosti je artikel primeren?
            </h3>
            <div className="space-y-2.5">
              {product.suitableFor.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-800 font-medium"
                >
                  <div className="w-6 h-6 rounded-lg bg-brand-100 text-brand-900 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-brand-950 text-white rounded-2xl text-xs space-y-2 mt-4">
              <div className="font-bold text-accent-300 flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                Predogled vašega logotipa je brezplačen
              </div>
              <p className="text-slate-300 leading-relaxed">
                Po oddanem povpraševanju vam naš grafični oblikovalec pripravi digitalno simulacijo
                (e-korekturo) z vašim logotipom, da se pred potrditvijo naročila natančno prepričate
                o barvah, velikosti in poziciji.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Podobni in dopolnilni promocijski izdelki
                </h3>
                <p className="text-xs text-slate-500">
                  Izdelki, ki jih podjetja pogosto kombinirajo v darilnih kompletih.
                </p>
              </div>
              <Link
                href={`/kategorije/${product.category}`}
                className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1"
              >
                <span>Vsi v kategoriji</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    <Link href={`/izdelki/${rel.id}`} className="block relative h-40 bg-slate-100 overflow-hidden">
                      <img
                        src={rel.images[0]}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <div className="p-3.5 space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">
                        {rel.sku}
                      </div>
                      <Link href={`/izdelki/${rel.id}`}>
                        <h4 className="text-xs font-bold text-slate-900 hover:text-brand-900 transition-colors line-clamp-1">
                          {rel.name}
                        </h4>
                      </Link>
                      <div className="text-xs font-extrabold text-slate-900 pt-1">
                        od {rel.priceFrom.toFixed(2)} €
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 pt-0">
                    <Link
                      href={`/izdelki/${rel.id}`}
                      className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Ogled artikla</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
