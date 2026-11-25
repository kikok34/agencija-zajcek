"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sparkles,
  AlertCircle,
  Clock,
  Layers,
  Upload,
  ExternalLink,
  Info,
} from "lucide-react";
import { useCart, getItemKey } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import { ArtworkUploader } from "@/components/ArtworkUploader";
import { DemoOrder } from "@/types/orders";

export default function CartAndCheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems, hasBrandedItems } = useCart();
  const { addOrder } = useOrders();
  const { trackEvent } = useAnalytics();

  // Checkout form fields
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCity, setPostalCity] = useState("");

  // Billing address toggle
  const [hasDifferentBilling, setHasDifferentBilling] = useState(false);
  const [billingAddress, setBillingAddress] = useState("");

  // Delivery & notes
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // General artwork upload
  const [generalArtwork, setGeneralArtwork] = useState<{
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    previewUrl?: string;
  } | null>(null);

  // Demo acknowledgement checkbox
  const [acknowledgedConditions, setAcknowledgedConditions] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderConfirmed, setOrderConfirmed] = useState<DemoOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!company.trim()) err.company = "Vnesite naziv podjetja.";
    if (!fullName.trim()) err.fullName = "Vnesite ime in priimek kontaktne osebe.";
    if (!email.trim() || !email.includes("@")) err.email = "Vnesite veljaven e-poštni naslov.";
    if (!phone.trim()) err.phone = "Vnesite telefonsko številko za usklajevanje.";
    if (!vatNumber.trim()) err.vatNumber = "Vnesite davčno številko (ID za DDV).";
    if (!address.trim()) err.address = "Vnesite naslov za dostavo (ulica in hišna št.).";
    if (!postalCity.trim()) err.postalCity = "Vnesite poštno številko in kraj.";
    if (hasDifferentBilling && !billingAddress.trim()) {
      err.billingAddress = "Vnesite naslov za račun.";
    }
    if (!acknowledgedConditions) {
      err.acknowledgedConditions = "Za oddajo povpraševanja morate potrditi demo pogoje.";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate submission
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const orderNumber = "ZJ-2026-" + Math.floor(1000 + Math.random() * 9000);
      const createdAt = new Date().toLocaleDateString("sl-SI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const orderData: DemoOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt,
        status: "Novo",
        customer: {
          company: company.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          vatNumber: vatNumber.trim(),
          address: `${address.trim()}, ${postalCity.trim()}`,
          differentBillingAddress: hasDifferentBilling,
          billingAddress: hasDifferentBilling ? billingAddress.trim() : undefined,
          requestedDeliveryDate: requestedDeliveryDate.trim() || undefined,
          notes: orderNotes.trim() || undefined,
        },
        items: items.map((it) => ({
          ...it,
          printOption: it.printOption || "unbranded",
        })),
        subtotal,
        hasBrandedItems,
        vatRate: 22,
        vatAmount: subtotal * 0.22,
        totalEstimatedWithVat: subtotal * 1.22,
        generalArtworkFileId: generalArtwork?.fileId,
        generalArtworkFileName: generalArtwork?.fileName,
        acknowledgedDemoNotice: true,
      };

      // Save into OrderContext (which immediately updates /admin/narocila)
      addOrder(orderData);

      // Track analytics event
      trackEvent(
        "order_complete",
        `Oddano demo naročilo: ${orderNumber}`,
        `Podjetje: ${company}, Vrednost artiklov: ${(subtotal * 1.22).toFixed(2)} €, Artikli: ${totalItems} kos`,
        orderData
      );

      // Clear the live cart and show confirmation screen
      clearCart();
      setSubmitting(false);
      setOrderConfirmed(orderData);
    }, 600);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {orderConfirmed ? (
        /* Order Confirmation Success Screen */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              Demo Naročilo Uspešno Zabeleženo
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hvala za vaše B2B naročilo v potrditev!
            </h1>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Referenčna številka vašega testnega naročila je{" "}
              <strong className="text-slate-900 font-mono text-base px-2 py-0.5 bg-slate-100 rounded">
                #{orderConfirmed.orderNumber}
              </strong>
              .
            </p>
          </div>

          {/* Prominent Demo Notice */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 text-left space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Pomembno demo obvestilo:</span>
            </div>
            <p className="leading-relaxed">
              <strong>Demo naročilo je shranjeno v tej predstavitvi. Podjetju ni bilo poslano.</strong>
            </p>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              V produkcijski različici bi sistem samodejno poslal potrditveno e-poštno sporočilo na naslov <strong>{orderConfirmed.customer.email}</strong>, obvestil prodajno ekipo Agencije Zajček ter odprl delovni nalog v ERP/CRM sistemu.
            </p>
          </div>

          {/* Order Details summary */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-4">
            <div className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
              Podrobnosti oddanega naročila
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-400 block">Naročnik:</span>
                <span className="font-bold text-slate-900">{orderConfirmed.customer.company}</span>
                <span className="text-slate-600 block">{orderConfirmed.customer.fullName} ({orderConfirmed.customer.email})</span>
                <span className="text-slate-500 block font-mono text-[11px]">ID za DDV: {orderConfirmed.customer.vatNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Dostava:</span>
                <span className="font-semibold text-slate-800">{orderConfirmed.customer.address}</span>
                {orderConfirmed.customer.requestedDeliveryDate && (
                  <span className="text-brand-800 font-medium block mt-1">
                    Želeni rok: {orderConfirmed.customer.requestedDeliveryDate}
                  </span>
                )}
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Naročeni artikli ({orderConfirmed.items.length}):
              </span>
              {orderConfirmed.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between py-1 text-slate-700">
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-slate-900">{it.name}</span>
                    <span className="text-slate-500 text-[11px] block">
                      {it.quantity} kos • {it.color || "Standard"} • {it.printOption === "branded" ? `Tisk: ${it.printingPosition?.name || "Z logotipom"}` : "Brez tiska"}
                    </span>
                    {it.artworkFileName && (
                      <span className="text-emerald-700 font-medium text-[10px] block">
                        Priložena grafika: {it.artworkFileName}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {(it.price * it.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900 text-sm">
              <span>Ocenjena vrednost artiklov (brez DDV):</span>
              <span className="text-brand-900 text-base">{orderConfirmed.subtotal.toFixed(2)} €</span>
            </div>
            {orderConfirmed.hasBrandedItems && (
              <div className="text-[11px] text-amber-800 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                Cena tiska in dostave bo potrjena pred izvedbo po pregledu grafične priprave.
              </div>
            )}
          </div>

          {/* Action Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/admin/narocila?id=${orderConfirmed.id}`}
              className="w-full sm:w-auto px-6 py-3 bg-brand-800 hover:bg-brand-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Preglej to naročilo v Demo Administraciji</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Nazaj na prvo stran trgovine
            </Link>
          </div>
        </div>
      ) : (
        /* Regular Cart and B2B Checkout Page */
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-brand-700" />
              <span>Košarica in oddaja B2B naročila</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Brez spletnega plačila. Pred potrditvijo naročila vam posredujemo končno ponudbo z rokom dobave in pripravo tiska.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-5 shadow-xs">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Vaša košarica je prazna</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Oglejte si naše kataloge ali posamezne kategorije ter konfigurirajte izdelke z vašim logotipom.
              </p>
              <div className="pt-2">
                <Link
                  href="/katalogi"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-950 transition-all"
                >
                  <span>Preglej kataloge 2026</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>Izbrani artikli</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {totalItems} kosov skupaj
                      </span>
                    </h2>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                    >
                      Izprazni košarico
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-100 space-y-4 pt-1">
                    {items.map((item) => {
                      const key = getItemKey(item);
                      const isCustomized = item.printOption === "branded";

                      return (
                        <div key={key} className="pt-4 first:pt-0 space-y-3">
                          <div className="flex gap-4 items-start">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                            />

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/izdelki/${item.id}`}
                                  className="font-bold text-sm text-slate-900 hover:text-brand-700 transition-colors line-clamp-1"
                                >
                                  {item.name}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => removeItem(key)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Odstrani iz košarice"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-xs text-slate-500 font-mono">
                                SKU: {item.sku}
                              </div>

                              <div className="flex flex-wrap gap-2 text-xs text-slate-600 pt-0.5">
                                {item.color && (
                                  <span className="px-2 py-0.5 bg-slate-100 rounded-md">
                                    Barva: {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono">
                                    Velikost: {item.size}
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 rounded-md font-semibold ${
                                    isCustomized
                                      ? "bg-brand-50 text-brand-800 border border-brand-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {isCustomized ? "Z logotipom" : "Brez tiska"}
                                </span>
                              </div>

                              {/* Printing details if branded */}
                              {isCustomized && item.printingPosition && (
                                <div className="mt-2 p-2.5 bg-brand-50/60 rounded-xl border border-brand-100 text-xs space-y-1">
                                  <div className="font-bold text-brand-950 flex items-center justify-between">
                                    <span>Cona tiska: {item.printingPosition.name}</span>
                                    <span className="font-normal text-slate-500 text-[10px]">
                                      Maks: {item.printingPosition.maxPrintArea}
                                    </span>
                                  </div>

                                  {item.artworkFileName ? (
                                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 pt-0.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>Naložena grafika: <strong>{item.artworkFileName}</strong></span>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-slate-500">
                                      Grafiko nam lahko pošljete tudi naknadno po oddaji naročila.
                                    </div>
                                  )}

                                  {item.notes && (
                                    <div className="text-[11px] text-slate-600 pt-0.5 italic">
                                      Opomba: »{item.notes}«
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quantity and Price Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                            <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white">
                              <button
                                type="button"
                                onClick={() => updateQuantity(key, Math.max(1, item.quantity - 5))}
                                className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-bold text-xs text-slate-800 min-w-12 text-center">
                                {item.quantity} kos
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(key, item.quantity + 5)}
                                className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg font-bold text-xs"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="font-extrabold text-sm text-slate-900">
                                {(item.price * item.quantity).toFixed(2)} €
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {item.price.toFixed(2)} € / kos brez DDV
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* General Order Artwork & Brandbook Upload */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-700" />
                    <span>Splošna priponka za naročilo (npr. Brand book, vektorji)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Če imate enoten logotip ali priročnik celostne grafične podobe za celotno naročilo, ga lahko naložite tukaj.
                  </p>
                  <ArtworkUploader
                    onFileSelected={(fileData) => setGeneralArtwork(fileData)}
                    currentFileName={generalArtwork?.fileName}
                    currentFileSize={generalArtwork?.fileSize}
                    currentPreviewUrl={generalArtwork?.previewUrl}
                    label="Naloži splošno grafiko ali priročnik CGP:"
                  />
                </div>
              </div>

              {/* Right Column: Customer Details Form & Submission */}
              <div className="lg:col-span-5 space-y-5">
                <form
                  onSubmit={handleOrderSubmit}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
                >
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-brand-700" />
                      <span>Podatki podjetja za B2B račun</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Vnesite uradne podatke podjetja za pripravo ponudbe in korekture
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Company name */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Naziv podjetja *</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="npr. Vzorčno Podjetje d.o.o."
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                          errors.company ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                        }`}
                      />
                      {errors.company && <p className="text-rose-600 text-[11px]">{errors.company}</p>}
                    </div>

                    {/* VAT / Tax ID */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">ID za DDV / Davčna številka *</label>
                      <input
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        placeholder="npr. SI12345678"
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden font-mono ${
                          errors.vatNumber ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                        }`}
                      />
                      {errors.vatNumber && <p className="text-rose-600 text-[11px]">{errors.vatNumber}</p>}
                    </div>

                    {/* Contact person */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Kontaktna oseba (ime in priimek) *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="npr. Janez Novak"
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                          errors.fullName ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                        }`}
                      />
                      {errors.fullName && <p className="text-rose-600 text-[11px]">{errors.fullName}</p>}
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">E-poštni naslov *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="janez@podjetje.si"
                          className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                            errors.email ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                          }`}
                        />
                        {errors.email && <p className="text-rose-600 text-[11px]">{errors.email}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Telefonska številka *</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+386 41 123 456"
                          className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                            errors.phone ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                          }`}
                        />
                        {errors.phone && <p className="text-rose-600 text-[11px]">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Naslov za dostavo *</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ulica in hišna številka"
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                          errors.address ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                        }`}
                      />
                      {errors.address && <p className="text-rose-600 text-[11px]">{errors.address}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Poštna številka in kraj *</label>
                      <input
                        type="text"
                        value={postalCity}
                        onChange={(e) => setPostalCity(e.target.value)}
                        placeholder="npr. 1000 Ljubljana"
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                          errors.postalCity ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                        }`}
                      />
                      {errors.postalCity && <p className="text-rose-600 text-[11px]">{errors.postalCity}</p>}
                    </div>

                    {/* Different Billing Address Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={hasDifferentBilling}
                          onChange={(e) => setHasDifferentBilling(e.target.checked)}
                          className="w-4 h-4 rounded text-brand-600"
                        />
                        <span>Plačnik / naslov za račun se razlikuje od naslova dostave</span>
                      </label>

                      {hasDifferentBilling && (
                        <div className="mt-2 space-y-1">
                          <input
                            type="text"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            placeholder="Naslov plačnika (ulica, pošta in kraj)"
                            className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden ${
                              errors.billingAddress ? "border-rose-400 bg-rose-50/30" : "border-slate-200"
                            }`}
                          />
                          {errors.billingAddress && <p className="text-rose-600 text-[11px]">{errors.billingAddress}</p>}
                        </div>
                      )}
                    </div>

                    {/* Requested delivery date */}
                    <div className="space-y-1 pt-1">
                      <label className="font-semibold text-slate-700">Želeni datum dobave (neobvezno)</label>
                      <input
                        type="text"
                        value={requestedDeliveryDate}
                        onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                        placeholder="npr. do 20. 12. 2026 ali čim prej"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden"
                      />
                    </div>

                    {/* Order notes */}
                    <div className="space-y-1 pt-1">
                      <label className="font-semibold text-slate-700">Dodatna navodila ali vprašanja</label>
                      <textarea
                        rows={2}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Posebne zahteve glede pakiranja, razdelitve po poslovalnicah..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Pricing Breakdown & Status Notice */}
                  <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Vrednost artiklov (brez DDV):</span>
                      <span className="font-bold text-slate-900">{subtotal.toFixed(2)} €</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Ocenjen 22% DDV:</span>
                      <span className="font-medium text-slate-800">{(subtotal * 0.22).toFixed(2)} €</span>
                    </div>

                    {hasBrandedItems ? (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>Cena tiska in dostave bo potrjena pred izvedbo.</span>
                        </div>
                        <p>
                          Znesek spodaj predstavlja ocenjeno vrednost artiklov. Končni znesek s tiskom in dostavo vam posredujemo v uradni ponudbi z vizualnim predogledom.
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-between text-slate-600">
                        <span>Cena dostave:</span>
                        <span className="font-medium text-emerald-700">Po potrditvi naročila</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                      <div>
                        <span className="text-xs text-slate-500 block">
                          {hasBrandedItems ? "Ocenjena vrednost artiklov z DDV:" : "Skupaj z DDV:"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (brez spletnega plačila ob oddaji)
                        </span>
                      </div>
                      <span className="text-2xl font-extrabold text-brand-950">
                        {(subtotal * 1.22).toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Required Demo acknowledgement */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={acknowledgedConditions}
                        onChange={(e) => setAcknowledgedConditions(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600 mt-0.5 shrink-0"
                      />
                      <span>
                        Razumem in potrjujem, da gre za <strong>predstavitveno demo naročilo</strong>. Plačilna kartica ni potrebna. Podatki se shranijo v lokalno demo bazo brskalnika. *
                      </span>
                    </label>
                    {errors.acknowledgedConditions && (
                      <p className="text-rose-600 text-[11px] mt-1">{errors.acknowledgedConditions}</p>
                    )}
                  </div>

                  {/* Final Submit Button with explicit explanation */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 px-6 bg-brand-900 hover:bg-brand-950 text-white rounded-2xl font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Zapisujem demo naročilo...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Oddaj naročilo v potrditev</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                      <strong>Brez spletnega plačila.</strong> Pred izvedbo potrdimo razpoložljivost, končno ceno, dobavni rok in pripravo za tisk.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
