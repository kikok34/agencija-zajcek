"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Send,
  Building2,
  User,
  Calendar,
  HelpCircle,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import { useAnalytics } from "@/context/AnalyticsContext";
import { useModals } from "@/context/ModalContext";

export default function ContactPage() {
  const { trackEvent } = useAnalytics();
  const { openInquiry } = useModals();

  // Form State
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("promo tekstil");
  const [quantity, setQuantity] = useState("100");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedLogo(e.target.files[0].name);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim()) err.fullName = "Vnesite ime in priimek.";
    if (!company.trim()) err.company = "Vnesite naziv podjetja.";
    if (!email.trim() || !email.includes("@")) err.email = "Vnesite veljaven e-poštni naslov.";
    if (!phone.trim()) err.phone = "Vnesite telefonsko številko.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const payload = {
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
        uploadedLogo,
        source: "Kontaktna stran",
      };

      try {
        const stored = JSON.parse(localStorage.getItem("az_demo_inquiries") || "[]");
        localStorage.setItem("az_demo_inquiries", JSON.stringify([payload, ...stored]));
      } catch (err) {
        console.error(err);
      }

      trackEvent(
        "inquiry_submit",
        `Povpraševanje s kontaktne strani (${company})`,
        `${fullName} za ${interest} (${quantity} kos)`,
        payload
      );

      setLoading(false);
      setSubmitted(true);
    }, 450);
  };

  return (
    <div className="py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
            <Mail className="w-3.5 h-3.5" />
            Hitra odzivnost v 24 urah
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kontakt in povpraševanje
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Zaupajte nam vaše promocijske potrebe. Pripravili vam bomo natančen izračun
            z možnostmi tiska, količino in predvidenim dobavnim rokom.
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Cards & Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info & Maps Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Action Large CTA Button */}
            <div className="p-6 bg-brand-900 text-white rounded-3xl shadow-xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-300">
                Imate pripravljeno povpraševanje?
              </span>
              <h3 className="text-xl font-bold">
                Pripravimo vam ponudbo z brezplačnim predogledom tiska.
              </h3>
              <button
                type="button"
                onClick={() => openInquiry({ source: "Kontaktna stran Big Banner" })}
                className="w-full py-3.5 px-4 bg-accent-500 hover:bg-accent-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Zahtevaj ponudbo</span>
              </button>
            </div>

            {/* Contact Details Card */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
              <h3 className="text-lg font-bold text-slate-900">
                Podatki podjetja Agencija Zajček
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-700 flex-shrink-0 shadow-xs">
                    <Phone className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Telefonska številka:</div>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-900 transition-colors"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Dosegljivi vsak delovnik: {COMPANY_INFO.workingHours}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-700 flex-shrink-0 shadow-xs">
                    <Mail className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">E-poštni naslov za povpraševanja:</div>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-900 transition-colors break-all"
                    >
                      {COMPANY_INFO.email}
                    </a>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Odziv z izračunom v 24 urah
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-700 flex-shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Sedež in prevzemno mesto:</div>
                    <div className="text-sm font-bold text-slate-900">
                      {COMPANY_INFO.address.street}
                    </div>
                    <div className="text-xs text-slate-600">
                      {COMPANY_INFO.address.postalCode} {COMPANY_INFO.address.city}, Slovenija
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Interactive Card Placeholder */}
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-700" />
                  <span>Lokacija v Ljubljani</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Brezplačno parkirišče
                </span>
              </div>

              <div className="h-44 rounded-2xl bg-slate-200 relative overflow-hidden border border-slate-300 flex items-center justify-center text-center p-4 group">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0c3c6e_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center mx-auto shadow-md">
                    <MapPin className="w-5 h-5 text-accent-400" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Dunajska cesta 114, 1000 Ljubljana
                  </div>
                  <a
                    href="https://maps.google.com/?q=Dunajska+cesta+114+1000+Ljubljana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-brand-900 text-xs font-bold rounded-lg shadow-sm border border-slate-300 transition-colors"
                  >
                    <span>Pokaži na zemljevidu (Google Maps)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Obrazec za povpraševanje
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Izpolnite spodnja polja. Obrazec validira podatke in jih shrani v demo bazo.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">
                    Hvala! Vaše povpraševanje je bilo poslano.
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Odgovorili vam bomo v najkrajšem možnem času. Naš skrbnik bo pripravil
                    uradno ponudbo in brezplačen digitalni predogled tiska.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-brand-900 text-white text-xs font-semibold rounded-xl"
                    >
                      Pošlji novo povpraševanje
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Row 1: Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Ime in priimek <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="npr. Marko Zupan"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.fullName ? "border-red-500 bg-red-50" : "border-slate-300"
                          } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Podjetje <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="npr. Adria Media d.o.o."
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.company ? "border-red-500 bg-red-50" : "border-slate-300"
                          } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                      </div>
                      {errors.company && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        E-pošta <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="marko.zupan@adria.si"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.email ? "border-red-500 bg-red-50" : "border-slate-300"
                          } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Telefon <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+386 41 123 456"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.phone ? "border-red-500 bg-red-50" : "border-slate-300"
                          } focus:outline-none focus:ring-2 focus:ring-brand-700`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Interest & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Zanimanje za skupino izdelkov
                      </label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                      >
                        <option value="promo tekstil">Promo tekstil (majice, jakne, kape)</option>
                        <option value="torbe">Torbe in eko vrečke</option>
                        <option value="pisala">Pisala in gravura</option>
                        <option value="tehnika">Tehnika & Powerbanki</option>
                        <option value="darila za zaposlene">Darila za zaposlene (Welcome pack)</option>
                        <option value="sejmi">Sejmi in večji dogodki</option>
                        <option value="drugo">Drugo / individualno povpraševanje</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Želena količina (kos)
                      </label>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="npr. 50, 100, 250, 500+"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>

                  {/* Row 4: Delivery Date */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Želeni rok dobave
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        placeholder="npr. do 15. prihodnjega meseca"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>

                  {/* Row 5: Notes */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Opomba in podrobnosti (barve, pozicija tiska, šifre)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Navedite vse podrobnosti, da vam lahko pripravimo kar najbolj natančno ponudbo..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  {/* Row 6: Logo upload demo input */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Naloži logotip (demo file input)
                    </label>
                    <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-slate-100 rounded-xl p-3 flex items-center justify-center gap-3 cursor-pointer transition-colors">
                      <UploadCloud className="w-5 h-5 text-brand-700 flex-shrink-0" />
                      <div className="text-slate-600">
                        {uploadedLogo ? (
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <FileCheck className="w-4 h-4" /> Naloženo: {uploadedLogo}
                          </span>
                        ) : (
                          <span>
                            Izberite datoteko logotipa (.pdf, .ai, .svg, .png) za brezplačen predogled
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

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Pošiljam povpraševanje...</span>
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
        </div>
      </div>

      {/* 4 Pogosta vprašanja (FAQ Accordion) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              Pojasnila & Nasveti
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pogosta vprašanja pred naročilom
            </h2>
          </div>

          <div className="space-y-3">
            {COMPANY_INFO.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-brand-900 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-brand-700" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
