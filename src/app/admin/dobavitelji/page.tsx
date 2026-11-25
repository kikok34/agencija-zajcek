"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  RefreshCw,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  HelpCircle,
  Check,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useProducts } from "@/context/ProductContext";
import { SyncReport } from "@/types/suppliers";

export default function AdminSuppliersPage() {
  const { products, suppliers, syncSupplier, syncReports, importSupplierCsv } = useProducts();

  const [activeReport, setActiveReport] = useState<SyncReport | null>(
    syncReports[0] || null
  );
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // CSV Import State
  const [csvText, setCsvText] = useState("");
  const [csvSelectedSupplier, setCsvSelectedSupplier] = useState<"supplier-a" | "supplier-b">("supplier-a");
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[] | null>(null);
  const [csvImportFeedback, setCsvImportFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSync = (supplierId: "supplier-a" | "supplier-b") => {
    setSyncingId(supplierId);
    setTimeout(() => {
      const report = syncSupplier(supplierId);
      setActiveReport(report);
      setSyncingId(null);
    }, 600);
  };

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

  // Sample CSV template generator & download
  const handleDownloadSampleCsv = () => {
    const csvContent = `sku,name,category,purchasePrice,supplierStock,leadTimeDays,materials,colors\n` +
      `PTE-SAMPLE-01,"Bombažna promocijska vrečka Eko 140g",promo-tekstil,1.45,1800,3,"100% bombaž","Naravna,Črna,Modra"\n` +
      `PTE-SAMPLE-02,"Kovinski termovakuumski lonček Travel 400ml",dom-in-zivljenje,5.20,650,4,"Nerjaveče jeklo 18/8","Črna,Srebrna,Mornarska"\n` +
      `TPD-SAMPLE-03,"Aluminijasti powerbank Slim 5000mAh",mobile-and-tech,6.80,420,5,"Eloksiran aluminij","Siva,Črna"\n`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "agencija-zajcek-dobavitelj-sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV file selection
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);

      // Parse preview
      const lines = text.trim().split("\n");
      if (lines.length > 1) {
        const preview = lines.slice(1, 6).map((l, i) => {
          const parts = l.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
          return {
            row: i + 1,
            sku: parts[0] || "—",
            name: parts[1] || "—",
            cat: parts[2] || "—",
            price: parts[3] || "—",
            stock: parts[4] || "—",
            valid: Boolean(parts[0] && parts[1] && parseFloat(parts[3]) > 0),
          };
        });
        setCsvPreviewRows(preview);
      }
    };
    reader.readAsText(file);
  };

  // Run CSV Import
  const handleRunCsvImport = () => {
    if (!csvText.trim()) return;
    const result = importSupplierCsv(csvSelectedSupplier, csvText);
    setCsvImportFeedback({ success: result.success, msg: result.message });
    if (result.success) {
      setActiveReport(result.report);
      setCsvPreviewRows(null);
      setCsvText("");
    }
  };

  // Supplier-linked products for mapping table
  const mappedProducts = products.filter((p) => p.supplierId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Truck className="w-3.5 h-3.5" />
              Simulirana integracija z dobavitelji
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Povezava in sinhronizacija dobaviteljev
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Simulacija uvoza podatkov, zalog, nabavnih cen ter zaščita ročnih prodajnih cen lastnika.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-2xs transition-all"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Vzorčni CSV dobavitelja</span>
            </button>
          </div>
        </div>

        {/* Supplier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suppliers.map((sup) => {
            const isSyncing = syncingId === sup.id;
            const linkedCount = products.filter((p) => p.supplierId === sup.id).length;

            return (
              <div
                key={sup.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-6 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {sup.name}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {sup.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {sup.apiEndpointSimulated}
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {sup.connectionStatus}
                    </span>
                  </div>

                  {/* Supplier Specs */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Povezanih artiklov:</span>
                      <span className="font-bold text-slate-800 text-sm">{linkedCount} artiklov</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Privzeta marža:</span>
                      <span className="font-bold text-slate-800 text-sm">+{sup.defaultMarkupPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Protokol:</span>
                      <span className="font-medium text-slate-700">{sup.catalogFormat}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Zadnji uspešen klic:</span>
                      <span className="font-medium text-slate-700">{formatDateTime(sup.lastSyncTimestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Zadnja posodobitev: {formatDateTime(sup.lastSyncTimestamp)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleSync(sup.id)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Sinhroniziram..." : "Simuliraj sinhronizacijo"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sync Report Section */}
        {activeReport && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Poročilo zadnje sinhronizacije: {activeReport.supplierName}
                  </h2>
                  <span className="text-xs text-slate-500">
                    ({formatDateTime(activeReport.timestamp)})
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Podroben pregled sprememb zalog, cen in novo uvoženih artiklov
                </p>
              </div>

              {activeReport.newImportedCount > 0 && (
                <Link
                  href="/admin/izdelki?filter=needs_review"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Preglej nove artikle ({activeReport.newImportedCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 text-center py-4 bg-white">
              <div className="p-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Novo uvoženi</span>
                <div className="text-xl font-extrabold text-blue-600 mt-0.5">
                  +{activeReport.newImportedCount}
                </div>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Spremembe zaloge</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeReport.stockUpdatedCount}
                </div>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Spremembe cen</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeReport.priceUpdatedCount}
                </div>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Potreben pregled</span>
                <div className="text-xl font-extrabold text-amber-600 mt-0.5">
                  {activeReport.reviewRequiredCount}
                </div>
              </div>
              <div className="p-2">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Neuspešni zapisi</span>
                <div className="text-xl font-extrabold text-slate-400 mt-0.5">
                  {activeReport.failedRecordsCount}
                </div>
              </div>
            </div>

            {/* Details list */}
            <div className="p-6 space-y-2.5 max-h-80 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dnevnik sprememb (Audit Log)
              </h3>
              {activeReport.details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === "new" ? (
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                        NOVO
                      </span>
                    ) : item.type === "stock" ? (
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">
                        ZALOGA
                      </span>
                    ) : item.type === "price" ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        CENA
                      </span>
                    ) : item.type === "error" ? (
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                        NAPAKA
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                        PREGLED
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800">
                      {item.sku}: {item.message}
                    </div>
                    {(item.oldValue !== undefined || item.newValue !== undefined) && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {item.oldValue !== undefined ? `Prej: ${item.oldValue}` : ""}
                        {item.oldValue !== undefined && item.newValue !== undefined ? " → " : ""}
                        {item.newValue !== undefined ? `Novo: ${item.newValue}` : ""}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CSV Import with Live Validation Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Uvoz dobaviteljskega CSV kataloga z validacijo
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Naložite CSV datoteko za simulacijo serijskega uvoza ali posodobitve artiklov
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={csvSelectedSupplier}
                onChange={(e) => setCsvSelectedSupplier(e.target.value as any)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
              >
                <option value="supplier-a">Demo dobavitelj A (PTE)</option>
                <option value="supplier-b">Demo dobavitelj B (TPD)</option>
              </select>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Izberi CSV datoteko</span>
                <input
                  type="file"
                  accept=".csv, text/csv"
                  onChange={handleCsvFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Feedback notice */}
          {csvImportFeedback && (
            <div
              className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
                csvImportFeedback.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <span>{csvImportFeedback.msg}</span>
              <button
                type="button"
                onClick={() => setCsvImportFeedback(null)}
                className="font-bold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Validation Preview Table if CSV loaded */}
          {csvPreviewRows ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Predogled in validacija vrstic (prvih 5):
                </span>
                <button
                  type="button"
                  onClick={handleRunCsvImport}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Potrdi in uvozi v bazo</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Naziv</th>
                      <th className="py-2.5 px-3">Kategorija</th>
                      <th className="py-2.5 px-3">Nabavna cena</th>
                      <th className="py-2.5 px-3">Zaloga</th>
                      <th className="py-2.5 px-3">Validacija</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvPreviewRows.map((r) => (
                      <tr key={r.row} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono text-slate-400">{r.row}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">{r.sku}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{r.name}</td>
                        <td className="py-2 px-3 text-slate-500">{r.cat}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{r.price} €</td>
                        <td className="py-2 px-3 text-slate-700">{r.stock} kos</td>
                        <td className="py-2 px-3">
                          {r.valid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Veljavno
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                              <AlertCircle className="w-3 h-3" />
                              Napačni podatki
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
              Izberite CSV datoteko ali prenesite vzorčni primer zgoraj za preizkus uvoza.
            </div>
          )}
        </div>

        {/* Product Mapping & Price Protection Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" />
                Mapiranje artiklov: Dobavitelj ↔ Trgovina
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pregled nabavnih cen, zaščite ročnih prodajnih cen in ločevanja dobaviteljske od lokalne zaloge
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Povezanih artiklov: {mappedProducts.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Trgovina (Izdelek & SKU)</th>
                  <th className="py-3 px-4">Dobavitelj & SKU</th>
                  <th className="py-3 px-4">Nabavna cena (zaupno)</th>
                  <th className="py-3 px-4">Prodajna cena (brez DDV)</th>
                  <th className="py-3 px-4">Zaščita ročne cene</th>
                  <th className="py-3 px-4">Lokalna zaloga</th>
                  <th className="py-3 px-4">Dobaviteljska zaloga</th>
                  <th className="py-3 px-4 text-right">Uredi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {mappedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-xs">
                        {prod.name}
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        SKU: {prod.sku}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                        {prod.supplierId === "supplier-a" ? "Dobavitelj A" : "Dobavitelj B"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
                        {prod.supplierSku || "—"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">
                        {prod.supplierPurchasePrice ? `${prod.supplierPurchasePrice.toFixed(2)} €` : "—"}
                      </span>
                      <span className="text-[10px] text-amber-700 block">
                        Skrito strankam
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-brand-900 text-sm">
                        {prod.priceFrom.toFixed(2)} €
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        z DDV: {(prod.priceFrom * 1.22).toFixed(2)} €
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {prod.manualPriceOverride ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Zaščiteno (ročno)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Avtomatska marža (+{prod.marginPercent || 35}%)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {prod.localStock || 0} kos
                    </td>

                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {prod.supplierStock || 0} kos
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

        {/* Future Integration Architecture Documentation */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold">
              API
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Prihodnje integracijske točke v produkciji (Arhitekturni načrt)
              </h2>
              <p className="text-xs text-slate-400">
                Pripravljeni vmesniki za neposredno povezavo z ERP in dobaviteljskimi sistemi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">1. REST API (JSON/OAuth2)</div>
              <p className="text-slate-400 leading-relaxed">
                Periodično sinhroniziranje cen in stanja zalog preko varnega cron opravila v ozadju z uporabo API ključev ali OAuth2 avtentikacije.
              </p>
              <div className="text-[11px] font-mono text-brand-400">
                POST /api/v1/suppliers/sync
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">2. XML / SFTP Batch Feed</div>
              <p className="text-slate-400 leading-relaxed">
                Avtomatski nočni prenos celotnega kataloga z več kot 10.000 artikli preko varnega SFTP strežnika v formatu XML ali CSV.
              </p>
              <div className="text-[11px] font-mono text-brand-400">
                sftp://partner.agencija-zajcek.net
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="font-bold text-white text-sm">3. Real-time Webhook zalog</div>
              <p className="text-slate-400 leading-relaxed">
                Takojšnje obveščanje ob izpraznitvi ali dopolnitvi zaloge pri dobavitelju, kar prepreči naročila nedosegljivih artiklov.
              </p>
              <div className="text-[11px] font-mono text-brand-400">
                webhook.agencija-zajcek.net/stock
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
