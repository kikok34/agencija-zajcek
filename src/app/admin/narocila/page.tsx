"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  Download,
  Image as ImageIcon,
  Tag,
  ShieldCheck,
  Edit,
  Save,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useOrders } from "@/context/OrderContext";
import { DemoOrder, OrderStatus } from "@/types/orders";
import { getArtworkFile } from "@/lib/indexedDb";

const ALL_STATUSES: OrderStatus[] = [
  "Novo",
  "V pregledu",
  "Čaka na potrditev stranke",
  "Potrjeno",
  "V izvedbi",
  "Zaključeno",
  "Preklicano",
];

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const { orders, updateOrderStatus, newOrdersCount } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Selected Order for Modal / Slide-over detail inspection
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  const [tempStatus, setTempStatus] = useState<OrderStatus>("Novo");
  const [managerNote, setManagerNote] = useState("");
  const [statusSaveSuccess, setStatusSaveSuccess] = useState(false);

  // IndexedDB Artwork Preview Map (fileId -> dataUrl)
  const [artworkPreviews, setArtworkPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      const found = orders.find((o) => o.id === urlId || o.orderNumber === urlId);
      if (found) {
        handleOpenOrderDetail(found);
      }
    }
  }, [searchParams, orders]);

  const handleOpenOrderDetail = async (order: DemoOrder) => {
    setSelectedOrder(order);
    setTempStatus(order.status);
    setManagerNote("");

    // Load artwork previews from IndexedDB if available
    const previews: Record<string, string> = {};
    for (const item of order.items) {
      if (item.artworkFileId) {
        const fileRecord = await getArtworkFile(item.artworkFileId);
        if (fileRecord?.dataUrl) {
          previews[item.artworkFileId] = fileRecord.dataUrl;
        }
      }
    }
    setArtworkPreviews(previews);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, tempStatus, managerNote.trim() || undefined);
    setSelectedOrder({
      ...selectedOrder,
      status: tempStatus,
    });
    setStatusSaveSuccess(true);
    setTimeout(() => setStatusSaveSuccess(false), 3000);
  };

  // Status badge styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Novo":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold";
      case "V pregledu":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Čaka na potrditev stranke":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Potrjeno":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 font-semibold";
      case "V izvedbi":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Zaključeno":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Preklicano":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatusFilter === "all" ? true : ord.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              Prejeta naročila in povpraševanja
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pregled B2B naročil brez spletnega plačila
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pregled naloženih logotipov, izbranih con tiska in posodabljanje statusov naročil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
              Skupaj naročil: {orders.length}
            </span>
            {newOrdersCount > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold border border-emerald-200 animate-pulse">
                {newOrdersCount} novih
              </span>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Išči po št. naročila, podjetju, kontaktu..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-600 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 shrink-0">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:ring-2 focus:ring-brand-600"
            >
              <option value="all">Vsi statusi ({orders.length})</option>
              {ALL_STATUSES.map((st) => {
                const count = orders.filter((o) => o.status === st).length;
                return (
                  <option key={st} value={st}>
                    {st} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Št. naročila & Datum</th>
                  <th className="py-3 px-4">Podjetje / Naročnik</th>
                  <th className="py-3 px-4">Artikli & Pozicije</th>
                  <th className="py-3 px-4">Grafike (Logotip)</th>
                  <th className="py-3 px-4">Vrednost artiklov</th>
                  <th className="py-3 px-4">Status tiska & dostave</th>
                  <th className="py-3 px-4">Status naročila</th>
                  <th className="py-3 px-4 text-right">Akcija</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Nobeno naročilo ne ustreza iskalnim kriterijem.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const hasArtwork = ord.items.some((i) => i.artworkFileName) || ord.generalArtworkFileName;
                    const brandedItems = ord.items.filter((i) => i.printOption === "branded");

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-sm text-slate-900 block font-mono">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ord.createdAt}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {ord.customer.company}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {ord.customer.fullName} ({ord.customer.phone})
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            ID: {ord.customer.vatNumber}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {ord.items.length} {ord.items.length === 1 ? "izdelek" : "izdelkov"}
                          </div>
                          <div className="text-[11px] text-slate-500 space-y-0.5 mt-0.5">
                            {ord.items.slice(0, 2).map((it, idx) => (
                              <div key={idx} className="truncate max-w-xs">
                                • {it.name} ({it.quantity} kos)
                                {it.printingPosition && (
                                  <span className="text-brand-700 font-medium ml-1">
                                    [{it.printingPosition.name}]
                                  </span>
                                )}
                              </div>
                            ))}
                            {ord.items.length > 2 && (
                              <span className="text-[10px] text-slate-400 italic">
                                + še {ord.items.length - 2} artiklov
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {hasArtwork ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Priložena grafika
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Brez grafike
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 text-sm">
                            {ord.subtotal.toFixed(2)} €
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            brez DDV (+22%)
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {ord.hasBrandedItems ? (
                            <span className="inline-flex items-center text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              Po potrditvi korekture
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Brez tiska
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getStatusBadge(
                              ord.status
                            )}`}
                          >
                            {ord.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenOrderDetail(ord)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preglej</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal / Drawer */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-4 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900 font-mono">
                      Naročilo #{selectedOrder.orderNumber}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Prejeto dne {selectedOrder.createdAt} • Stranka: {selectedOrder.customer.company}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                {/* Status save notice */}
                {statusSaveSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Status naročila #{selectedOrder.orderNumber} je bil uspešno posodobljen!</span>
                  </div>
                )}

                {/* Section 1: Customer Information Dossier */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Podatki naročnika in dostava
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <span className="text-slate-400 block">Podjetje:</span>
                      <span className="font-extrabold text-sm text-slate-900 block">
                        {selectedOrder.customer.company}
                      </span>
                      <span className="font-mono text-slate-600 text-[11px]">
                        ID za DDV: {selectedOrder.customer.vatNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Kontaktna oseba:</span>
                      <span className="font-bold text-slate-800 block">
                        {selectedOrder.customer.fullName}
                      </span>
                      <a
                        href={`mailto:${selectedOrder.customer.email}`}
                        className="text-brand-700 hover:underline block"
                      >
                        {selectedOrder.customer.email}
                      </a>
                      <a
                        href={`tel:${selectedOrder.customer.phone}`}
                        className="text-slate-600 hover:underline block"
                      >
                        {selectedOrder.customer.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Naslov za dostavo:</span>
                      <span className="font-medium text-slate-800 block">
                        {selectedOrder.customer.address}
                      </span>
                      {selectedOrder.customer.requestedDeliveryDate && (
                        <span className="text-brand-800 font-bold block mt-1">
                          Želeni rok dobave: {selectedOrder.customer.requestedDeliveryDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedOrder.customer.differentBillingAddress && (
                    <div className="pt-2 border-t border-slate-200 text-[11px]">
                      <span className="font-semibold text-slate-600">Ločen naslov za račun (plačnik): </span>
                      <span className="text-slate-800">{selectedOrder.customer.billingAddress}</span>
                    </div>
                  )}

                  {selectedOrder.customer.notes && (
                    <div className="pt-2 border-t border-slate-200 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-600 block">Navodila stranke:</span>
                      <p className="italic text-slate-800 mt-0.5 leading-relaxed">
                        »{selectedOrder.customer.notes}«
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 2: Items, Printing Positions & Attached Artwork */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                    Naročeni artikli, izbrane tiskarske cone in priponke
                  </h3>

                  <div className="space-y-3">
                    {selectedOrder.items.map((it, idx) => {
                      const previewUrl = it.artworkFileId ? artworkPreviews[it.artworkFileId] : it.artworkPreviewUrl;

                      return (
                        <div
                          key={idx}
                          className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs"
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                            />

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  {it.name}
                                </span>
                                <span className="font-bold text-slate-900 text-sm">
                                  {(it.price * it.quantity).toFixed(2)} €
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-500 font-mono">
                                SKU: {it.sku} • Količina: <strong>{it.quantity} kos</strong> ({it.price.toFixed(2)} €/kos)
                              </div>

                              <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                                {it.color && (
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                                    Barva: {it.color}
                                  </span>
                                )}
                                {it.size && (
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono">
                                    Velikost: {it.size}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 bg-brand-50 text-brand-800 font-semibold rounded">
                                  {it.printOption === "branded" ? "Z logotipom" : "Brez tiska"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Printing Position Card */}
                          {it.printOption === "branded" && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Izbrana cona tiska
                                </span>
                                <span className="font-extrabold text-xs text-brand-950">
                                  {it.printingPosition?.name || "Standardna pozicija"}
                                </span>
                                <span className="text-slate-500 text-[11px] block">
                                  Maksimalna površina: <strong>{it.printingPosition?.maxPrintArea || "Po dogovoru"}</strong>
                                  {it.printingPosition?.technique && ` • ${it.printingPosition.technique}`}
                                </span>
                              </div>

                              {/* Uploaded Artwork Badge & Preview */}
                              {it.artworkFileName ? (
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                                  {previewUrl ? (
                                    <img
                                      src={previewUrl}
                                      alt="Predogled logotipa"
                                      className="w-10 h-10 object-contain rounded border border-slate-100 bg-slate-50"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                                      PDF
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-bold text-slate-900 text-[11px] truncate max-w-44">
                                      {it.artworkFileName}
                                    </div>
                                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Priloženo v naročilu
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">
                                  Grafika še ni bila naložena
                                </span>
                              )}
                            </div>
                          )}

                          {it.notes && (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                              Opomba artikla: »{it.notes}«
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: General Attachment */}
                {selectedOrder.generalArtworkFileName && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-700" />
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Splošna priponka naročila: {selectedOrder.generalArtworkFileName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Vektorski logotip ali brand book celotnega naročila
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded-md">
                      Pripravljeno za grafika
                    </span>
                  </div>
                )}

                {/* Section 4: Status Management Form */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-brand-700" />
                    <span>Upravljanje statusa naročila (Demo delovni tok)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Spremeni status naročila</label>
                      <select
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value as OrderStatus)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs font-semibold text-slate-800 bg-white"
                      >
                        {ALL_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Interna opomba skrbnika (neobvezno)</label>
                      <input
                        type="text"
                        value={managerNote}
                        onChange={(e) => setManagerNote(e.target.value)}
                        placeholder="npr. Poslana korektura tiska, čaka potrditev naročnika..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-400">
                      * Opomba: Naročilo se NE pošlje samodejno dobavitelju.
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveStatus}
                      className="px-4 py-2 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Shrani posodobljen status</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 rounded-b-3xl">
                <span className="text-xs text-slate-500 font-mono">
                  Skupni znesek artiklov: <strong>{selectedOrder.subtotal.toFixed(2)} € brez DDV</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs transition-colors"
                >
                  Zapri pregled
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-500">
          Nalaganje naročil...
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
