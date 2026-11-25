"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  AlertCircle,
  Truck,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useProducts } from "@/context/ProductContext";
import { useOrders } from "@/context/OrderContext";

export default function AdminDashboardPage() {
  const { products, metrics, suppliers, syncSupplier, resetAllDemoData } = useProducts();
  const { orders, newOrdersCount } = useOrders();
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleQuickSync = () => {
    setSyncing(true);
    const reportA = syncSupplier("supplier-a");
    const reportB = syncSupplier("supplier-b");
    setSyncing(false);
    setSyncNotice(
      `Sinhronizacija zaključena! Posodobljenih zalog: ${
        reportA.stockUpdatedCount + reportB.stockUpdatedCount
      }, novih izdelkov: ${reportA.newImportedCount + reportB.newImportedCount}.`
    );
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const needsReviewProducts = products.filter((p) => p.status === "needs_review");
  const recentOrders = orders.slice(0, 5);

  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("sl-SI", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Nadzorna plošča za lastnika
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pregled poslovanja & kataloga
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Upravljajte ponudbo izdelkov, marže, dobavitelje in prejeta B2B povpraševanja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/izdelki?action=new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm shadow-sm transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj izdelek</span>
            </Link>

            <button
              type="button"
              onClick={handleQuickSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-2xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-brand-600 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Sinhroniziram..." : "Sinhroniziraj dobavitelje"}</span>
            </button>
          </div>
        </div>

        {/* Sync notification toast */}
        {syncNotice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncNotice}</span>
            </div>
            <Link
              href="/admin/dobavitelji"
              className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900 ml-4"
            >
              Poglej podrobno poročilo →
            </Link>
          </div>
        )}

        {/* 4 Primary Business Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Published Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Objavljeni izdelki
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {metrics.publishedCount}
              </span>
              <span className="text-xs text-slate-400">
                od skupno {metrics.totalCount}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vidno v trgovini
              </span>
              <Link href="/admin/izdelki" className="text-brand-600 hover:underline font-medium">
                Upravljaj →
              </Link>
            </div>
          </div>

          {/* 2. Test Orders */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Prejeta testna naročila
              </span>
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {orders.length}
              </span>
              {newOrdersCount > 0 && (
                <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                  {newOrdersCount} novih
                </span>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Brez spletnega plačila</span>
              <Link href="/admin/narocila" className="text-brand-600 hover:underline font-medium">
                Poglej naročila →
              </Link>
            </div>
          </div>

          {/* 3. Products Needing Review */}
          <div
            className={`p-5 rounded-2xl border shadow-xs transition-colors ${
              metrics.needsReviewCount > 0
                ? "bg-amber-50/60 border-amber-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Potreben pregled
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  metrics.needsReviewCount > 0
                    ? "bg-amber-100 text-amber-700 font-bold"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold ${
                  metrics.needsReviewCount > 0 ? "text-amber-800" : "text-slate-900"
                }`}
              >
                {metrics.needsReviewCount}
              </span>
              <span className="text-xs text-slate-500">izdelkov čaka</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-amber-700 font-medium">Uvoz dobaviteljev</span>
              <Link
                href="/admin/izdelki?filter=needs_review"
                className="text-amber-800 hover:underline font-semibold"
              >
                Odpri za pregled →
              </Link>
            </div>
          </div>

          {/* 4. Last Supplier Update */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Zadnja sinhronizacija
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-base font-bold text-slate-900 truncate">
                {formatDateTime(metrics.lastSupplierUpdate)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                2 simulirana dobavitelja
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Povezava: Aktivna</span>
              <Link href="/admin/dobavitelji" className="text-brand-600 hover:underline font-medium">
                Nastavitve marž →
              </Link>
            </div>
          </div>
        </div>

        {/* Needs Review Alert Banner if any */}
        {needsReviewProducts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold text-amber-900">
                    {needsReviewProducts.length} novo uvoženih izdelkov potrebuje pregled pred objavo
                  </h2>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Dobaviteljski uvoz samodejno shrani nove izdelke s statusom »Potreben pregled«. Določite prodajno ceno z maržo ter tiskarske pozicije.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/izdelki?filter=needs_review"
                className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Preglej izdelke zdaj
              </Link>
            </div>
          </div>
        )}

        {/* Two-Column Overview: Recent Orders & Catalog Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Recent Orders */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-brand-600" />
                  Zadnja prejeta naročila (testna)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Naročila oddana preko spletne košarice brez spletnega plačila
                </p>
              </div>
              <Link
                href="/admin/narocila"
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1"
              >
                Vsa naročila ({orders.length}) →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  Trenutno ni nobenega prejetega naročila.
                </div>
              ) : (
                recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === "Novo"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.status === "V pregledu"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 truncate">
                        {ord.customer.company} ({ord.customer.fullName})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ord.items.length} artiklov • {ord.createdAt}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900">
                        {ord.subtotal.toFixed(2)} €
                        <span className="text-[10px] text-slate-500 font-normal ml-0.5">brez DDV</span>
                      </div>
                      {ord.hasBrandedItems && (
                        <span className="text-[10px] text-brand-700 font-semibold block">
                          + tisk po potrditvi
                        </span>
                      )}
                      <Link
                        href={`/admin/narocila?id=${ord.id}`}
                        className="text-xs text-brand-600 hover:underline font-medium inline-block mt-1"
                      >
                        Podrobnosti →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Suppliers Status & Stock Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Povezani dobavitelji (simulirano)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Avtomatska sinhronizacija zalog in nabavnih cen
                </p>
              </div>
              <Link
                href="/admin/dobavitelji"
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1"
              >
                Upravljaj povezave →
              </Link>
            </div>

            <div className="p-5 space-y-4 flex-1">
              {suppliers.map((sup) => (
                <div
                  key={sup.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {sup.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {sup.code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Format: {sup.catalogFormat}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Zadnja posodobitev: {formatDateTime(sup.lastSyncTimestamp)}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-700 block">
                      {sup.linkedProductsCount} povezanih artiklov
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Privzeta marža: {sup.defaultMarkupPercent}%
                    </span>
                    <div className="mt-1">
                      <Link
                        href={`/admin/dobavitelji?sup=${sup.id}`}
                        className="text-xs font-semibold text-brand-700 hover:underline"
                      >
                        Uvozi / Sinhroniziraj
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 flex items-start gap-3 text-xs text-brand-900">
                <SlidersHorizontal className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Zaščita ročnih cen lastnika:</span>{" "}
                  Če je za izdelek vklopljena možnost »Ročno določena cena«, avtomatska sinhronizacija dobavitelja nikoli ne prepiše vaše prodajne cene, temveč posodobi le nabavno ceno v ozadju.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Product Management Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-brand-600" />
                Hitri pregled kataloga izdelkov
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Vse spremembe so takoj vidne strankam v spletni trgovini
              </p>
            </div>
            <Link
              href="/admin/izdelki"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
            >
              <span>Odpri celoten katalog izdelkov z urejanjem ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Izdelek</th>
                  <th className="py-3 px-4">SKU / Kategorija</th>
                  <th className="py-3 px-4">Prodajna cena (brez DDV)</th>
                  <th className="py-3 px-4">Zaloga (lokalna / dobavitelj)</th>
                  <th className="py-3 px-4">Personalizacija & Tisk</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {products.slice(0, 6).map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-xs">
                            {prod.name}
                          </div>
                          {prod.supplierName && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              Dobavitelj: {prod.supplierName.split("(")[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-700 block">
                        {prod.sku}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {prod.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {prod.priceFrom.toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        DDV ni vklj. (+22%)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">
                        {prod.stock} kos
                      </span>
                      {prod.supplierStock !== undefined && (
                        <span className="text-[10px] text-slate-400 block">
                          Dobavitelj: {prod.supplierStock} | Lastna: {prod.localStock || 0}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {prod.printingPositions && prod.printingPositions.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {prod.printingPositions.length} pozicij tiska
                        </span>
                      ) : prod.allowPersonalization ? (
                        <span className="text-[11px] text-slate-600">Omogočeno</span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Brez tiska</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === "published" || !prod.status
                            ? "bg-emerald-100 text-emerald-800"
                            : prod.status === "needs_review"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {prod.status === "published" || !prod.status
                          ? "Objavljeno"
                          : prod.status === "needs_review"
                          ? "Potreben pregled"
                          : "Osnutek"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/izdelki?edit=${prod.id}`}
                        className="text-brand-600 hover:text-brand-800 font-semibold text-xs hover:underline"
                      >
                        Uredi
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
