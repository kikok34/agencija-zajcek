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
} from "lucide-react";
import { useCart, getItemKey } from "@/context/CartContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export default function CartAndCheckoutPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { trackEvent } = useAnalytics();

  // Checkout form fields
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postalCity, setPostalCity] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = "Vnesite ime in priimek kontaktne osebe.";
    if (!company.trim()) err.company = "Vnesite naziv podjetja.";
    if (!email.trim() || !email.includes("@")) err.email = "Vnesite veljaven e-poštni naslov.";
    if (!phone.trim()) err.phone = "Vnesite telefonsko številko.";
    if (!address.trim()) err.address = "Vnesite naslov podjetja (ulica in hišna št.).";
    if (!postalCity.trim()) err.postalCity = "Vnesite poštno številko in kraj.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const orderNumber = "AZ-" + Math.floor(100000 + Math.random() * 900000);
      const orderData = {
        orderNumber,
        createdAt: new Date().toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customer: {
          fullName,
          company,
          email,
          phone,
          address: `${address}, ${postalCity}`,
          vatNumber,
          notes,
        },
        items: [...items],
        subtotal,
        vat: subtotal * 0.22,
        totalWithVat: subtotal * 1.22,
      };

      // Store in localStorage
      try {
        const storedOrders = JSON.parse(localStorage.getItem("az_demo_orders") || "[]");
        localStorage.setItem("az_demo_orders", JSON.stringify([orderData, ...storedOrders]));
      } catch (err) {
        console.error("Failed to store order in localStorage", err);
      }

      // Track analytics event
      trackEvent(
        "order_complete",
        `Oddano naročilo / povpraševanje: ${orderNumber}`,
        `Podjetje: ${company}, Znesek: ${(subtotal * 1.22).toFixed(2)} €, Artikli: ${totalItems} kos`,
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
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Demo Naročilo Uspešno Oddano
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hvala za vaše B2B naročilo!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Številka vašega demo naročila je{" "}
              <strong className="text-slate-900 font-mono text-base">
                #{orderConfirmed.orderNumber}
              </strong>
              . Podatke smo shranili v vaš lokalni brskalnik (localStorage).
            </p>
          </div>

          {/* Order Details summary */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-3">
            <div className="flex justify-between pb-2 border-b border-slate-200 font-medium">
              <span className="text-slate-500">Čas oddaje:</span>
              <span className="text-slate-800">{orderConfirmed.createdAt}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200 font-medium">
              <span className="text-slate-500">Podjetje & kontakt:</span>
              <span className="text-slate-800 font-bold">
                {orderConfirmed.customer.company} ({orderConfirmed.customer.fullName})
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200 font-medium">
              <span className="text-slate-500">Dostava na naslov:</span>
              <span className="text-slate-800">{orderConfirmed.customer.address}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200 font-medium">
              <span className="text-slate-500">E-pošta & telefon:</span>
              <span className="text-slate-800">
                {orderConfirmed.customer.email} • {orderConfirmed.customer.phone}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 block mb-1">Naročeni artikli:</span>
              <div className="space-y-1">
                {orderConfirmed.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-slate-700">
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span className="font-semibold">
                      {(it.price * it.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Skupaj z DDV:</span>
              <span className="text-brand-900 font-extrabold text-base">
                {orderConfirmed.totalWithVat.toFixed(2)} €
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              Nazaj na prvo stran
            </Link>
            <Link
              href="/katalogi"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            >
              Preglej ostale kataloge
            </Link>
          </div>
        </div>
      ) : (
        /* Cart & Checkout View */
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pregled košarice in zaključek povpraševanja
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Preverite količine in artikle ter vnesite podatke vašega podjetja za izračun ponudbe.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Vaša košarica je trenutno prazna
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Izberite artikle iz kategorij ali outleta in jih dodajte v košarico za pripravo ponudbe.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/katalogi"
                  className="px-5 py-2.5 bg-brand-900 text-white text-xs font-semibold rounded-xl"
                >
                  Katalogi 2026
                </Link>
                <Link
                  href="/outlet"
                  className="px-5 py-2.5 bg-accent-500 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Outlet artikli
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Cart items table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-base text-slate-900">
                    Artikli v košarici ({items.length})
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Izprazni košarico</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const key = getItemKey(item);
                    const itemTotal = item.price * item.quantity;

                    return (
                      <div
                        key={key}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0 border border-slate-100"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <div className="text-xs text-slate-500 flex flex-wrap gap-2 mt-0.5">
                              <span>Šifra: {item.sku}</span>
                              {item.color && <span>• {item.color}</span>}
                              {item.size && <span>• Vel. {item.size}</span>}
                            </div>
                            {item.printTechnique && (
                              <div className="text-[11px] text-brand-700 font-medium">
                                Tehnika tiska: {item.printTechnique}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity control */}
                          <div className="inline-flex items-center border border-slate-300 rounded-xl bg-slate-50">
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity - 10)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-l-xl text-xs font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(key, parseInt(e.target.value) || 1)
                              }
                              className="w-14 text-center font-bold text-xs py-1.5 bg-transparent border-0 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(key, item.quantity + 10)}
                              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-r-xl text-xs font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price & Delete */}
                          <div className="text-right min-w-20">
                            <div className="text-sm font-bold text-slate-900">
                              {itemTotal.toFixed(2)} €
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.price.toFixed(2)} €/kos
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(key)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Odstrani artikel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: B2B Checkout Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Podatki za naročilo / ponudbo
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Vnesite podatke podjetja za izdajo predračuna ali ponudbe.
                    </p>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Ime in priimek kontaktne osebe *
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="npr. Ana Kovač"
                        className={`w-full p-2.5 rounded-xl border ${
                          errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300"
                        } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                      />
                      {errors.fullName && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Naziv podjetja / Zavoda *
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="npr. Global IT d.o.o."
                        className={`w-full p-2.5 rounded-xl border ${
                          errors.company ? "border-red-500 bg-red-50" : "border-slate-300"
                        } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                      />
                      {errors.company && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.company}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          E-pošta za račun *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ana@podjetje.si"
                          className={`w-full p-2.5 rounded-xl border ${
                            errors.email ? "border-red-500 bg-red-50" : "border-slate-300"
                          } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                        {errors.email && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="041 555 777"
                          className={`w-full p-2.5 rounded-xl border ${
                            errors.phone ? "border-red-500 bg-red-50" : "border-slate-300"
                          } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                        {errors.phone && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Naslov za dostavo (Ulica in št.) *
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="npr. Dunajska cesta 120"
                        className={`w-full p-2.5 rounded-xl border ${
                          errors.address ? "border-red-500 bg-red-50" : "border-slate-300"
                        } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                      />
                      {errors.address && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pošta in Kraj *
                        </label>
                        <input
                          type="text"
                          value={postalCity}
                          onChange={(e) => setPostalCity(e.target.value)}
                          placeholder="1000 Ljubljana"
                          className={`w-full p-2.5 rounded-xl border ${
                            errors.postalCity ? "border-red-500 bg-red-50" : "border-slate-300"
                          } bg-white focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                        {errors.postalCity && (
                          <p className="text-[10px] text-red-500 mt-0.5">{errors.postalCity}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Davčna številka (ID za DDV)
                        </label>
                        <input
                          type="text"
                          value={vatNumber}
                          onChange={(e) => setVatNumber(e.target.value)}
                          placeholder="SI12345678"
                          className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Opomba / Želeni datum dostave
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Npr. Prosimo za dostavo do konca meseca ali pošljite vzorec..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>

                    {/* Cost summary */}
                    <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Znesek artiklov brez DDV:</span>
                        <span className="font-semibold text-slate-800">
                          {subtotal.toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>DDV (22%):</span>
                        <span className="font-semibold text-slate-800">
                          {(subtotal * 0.22).toFixed(2)} €
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                        <span>Skupaj za plačilo / ponudbo:</span>
                        <span className="text-brand-900">
                          {(subtotal * 1.22).toFixed(2)} €
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Obdelujem naročilo...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Oddaj demo naročilo / ponudbo</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
