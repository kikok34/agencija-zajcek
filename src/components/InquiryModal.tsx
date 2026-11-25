"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Send,
  Building2,
  Mail,
  Phone,
  User,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export const InquiryModal: React.FC = () => {
  const { isInquiryOpen, inquiryData, closeInquiry } = useModals();
  const { trackEvent } = useAnalytics();

  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("promo-tekstil");
  const [quantity, setQuantity] = useState("100");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prepopulate from inquiryData when modal opens
  useEffect(() => {
    if (inquiryData) {
      if (inquiryData.productName) {
        setNotes((prev) =>
          prev
            ? prev
            : `Zanima me izdelek: ${inquiryData.productName} (Šifra: ${inquiryData.sku || "N/A"})`
        );
      } else if (inquiryData.catalogTitle) {
        setNotes((prev) =>
          prev ? prev : `Povpraševanje za katalog: ${inquiryData.catalogTitle}`
        );
      }
      if (inquiryData.quantity) {
        setQuantity(String(inquiryData.quantity));
      }
      if (inquiryData.interest) {
        setInterest(inquiryData.interest);
      }
    }
  }, [inquiryData]);

  if (!isInquiryOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = "Vnesite vaše ime in priimek.";
    if (!company.trim()) err.company = "Vnesite naziv podjetja.";
    if (!email.trim() || !email.includes("@")) err.email = "Vnesite veljaven e-poštni naslov.";
    if (!phone.trim()) err.phone = "Vnesite telefonsko številko za kontakt.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      // Demo save to localStorage
      const inquiryPayload = {
        id: "POV-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString(),
        fullName,
        company,
        email,
        phone,
        interest,
        quantity,
        deliveryDate,
        notes,
        uploadedFileName,
        source: inquiryData?.source || "Globalni modal",
      };

      try {
        const stored = JSON.parse(localStorage.getItem("az_demo_inquiries") || "[]");
        localStorage.setItem("az_demo_inquiries", JSON.stringify([inquiryPayload, ...stored]));
      } catch (err) {
        console.error("Failed to save demo inquiry", err);
      }

      // Track demo analytics event
      trackEvent(
        "inquiry_submit",
        `Povpraševanje oddano (${company})`,
        `${fullName} za ${interest} (${quantity} kos)`,
        inquiryPayload
      );

      setLoading(false);
      setSubmitted(true);
    }, 450);
  };

  const resetForm = () => {
    setFullName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setInterest("promo-tekstil");
    setQuantity("100");
    setDeliveryDate("");
    setNotes("");
    setUploadedFileName(null);
    setErrors({});
    setSubmitted(false);
    closeInquiry();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600 bg-accent-50 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              B2B Ponudba brez obveznosti
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Zahtevajte brezplačno ponudbo
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pošljite nam vaše želje in pripravili vam bomo natančen izračun z možnostmi tiska.
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Hvala! Vaše povpraševanje je bilo uspešno poslano.
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Podatke smo shranili v demo sistem. Naš skrbnik bo pregledal specifikacijo in vam
              v najkrajšem možnem času poslal ponudbo z brezplačnim grafičnim predogledom.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl max-w-sm mx-auto text-xs text-slate-500 border border-slate-200 text-left">
              <div><strong>Podjetje:</strong> {company}</div>
              <div><strong>Kontakt:</strong> {fullName} ({email})</div>
              <div><strong>Količina:</strong> {quantity} kos</div>
              {uploadedFileName && <div><strong>Logotip:</strong> {uploadedFileName}</div>}
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
              >
                Zapri okno
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4 text-left">
            {/* Row 1: Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ime in priimek <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="npr. Luka Novak"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.fullName ? "border-red-500 bg-red-50/50" : "border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Podjetje / Organizacija <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="npr. Poslovne rešitve d.o.o."
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.company ? "border-red-500 bg-red-50/50" : "border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                  />
                </div>
                {errors.company && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.company}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-pošta za ponudbo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="luka.novak@podjetje.si"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.email ? "border-red-500 bg-red-50/50" : "border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefonska številka <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="041 123 456"
                    className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                      errors.phone ? "border-red-500 bg-red-50/50" : "border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Row 3: Category Interest & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Glavno področje zanimanja
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                >
                  <option value="promo-tekstil">Promo tekstil (majice, jope, kape)</option>
                  <option value="torbe-in-potovanja">Torbe in vrečke</option>
                  <option value="pisalni-pripomocki">Pisalni pripomočki & gravura</option>
                  <option value="mobile-and-tech">Mobile & Tech pripomočki</option>
                  <option value="dom-in-zivljenje">Dom, steklenice & pisarna</option>
                  <option value="darila-zaposleni">Welcome pack / darila za zaposlene</option>
                  <option value="sejmi-dogodki">Sejmi in večji promocijski dogodki</option>
                  <option value="outlet-shop">Outlet artikli z zaloge</option>
                  <option value="drugo">Drugo / individualno svetovanje</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Okvirna količina (kos)
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="npr. 50, 100, 250, 500"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            {/* Row 4: Desired delivery date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Želeni rok dobave (opcijsko)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="npr. do 25. v mesecu ali čim prej"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            {/* Row 5: Notes & Specification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Opombe in specifične želje (barve, pozicija tiska, šifre artiklov)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opišite vaše želje, specifične barve, ali imate že pripravljen logotip v vektorski obliki..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            {/* Row 6: Logo upload demo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Naložite logotip za brezplačen predogled (PDF, AI, SVG, PNG)
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-slate-100 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors">
                <UploadCloud className="w-5 h-5 text-brand-700 flex-shrink-0" />
                <div className="text-xs text-slate-600">
                  {uploadedFileName ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <FileCheck className="w-4 h-4" /> Naloženo: {uploadedFileName}
                    </span>
                  ) : (
                    <span>
                      Kliknite za izbiro datoteke z logotipom{" "}
                      <span className="text-slate-400">(demo simulator nalaganja)</span>
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.ai,.eps,.svg,.png,.jpg"
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-[11px] text-slate-400">
                Brez obveznosti. Ponudbo prejmete na vaš e-naslov v 24h.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brand-900 hover:bg-brand-950 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <span>Pripravljam...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Pošlji povpraševanje</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
