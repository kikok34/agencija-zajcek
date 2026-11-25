"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Box, Send, Sparkles } from "lucide-react";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";

export const SampleRequestModal: React.FC = () => {
  const { isSampleOpen, sampleProduct, closeSample } = useModals();
  const { trackEvent } = useAnalytics();

  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [colorChoice, setColorChoice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSampleOpen || !sampleProduct) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const sampleOrder = {
        id: "VZR-" + Math.floor(10000 + Math.random() * 90000),
        timestamp: new Date().toISOString(),
        productName: sampleProduct.name,
        sku: sampleProduct.sku,
        company,
        contactName,
        email,
        phone,
        address,
        color: colorChoice || sampleProduct.colors[0]?.name || "Privzeta",
      };

      try {
        const stored = JSON.parse(localStorage.getItem("az_demo_samples") || "[]");
        localStorage.setItem("az_demo_samples", JSON.stringify([sampleOrder, ...stored]));
      } catch (err) {
        console.error(err);
      }

      trackEvent(
        "sample_request",
        `Zahteva za vzorec (${sampleProduct.sku})`,
        `${company} želi vzorec artikla ${sampleProduct.name}`,
        sampleOrder
      );

      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  const handleClose = () => {
    setSubmitted(false);
    closeSample();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full mb-1">
              <Box className="w-3.5 h-3.5" />
              B2B Vzorec za podjetja
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Zahtevajte fizični vzorec
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Zahteva za vzorec je sprejeta!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Za artikel »<strong>{sampleProduct.name}</strong>« smo zabeležili vašo zahtevo.
              Vzorec bomo pripravili in odposlali na naslov podjetja {company}.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 bg-brand-900 text-white text-xs font-semibold rounded-xl"
              >
                Zapri
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-left text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-200">
              <img
                src={sampleProduct.images[0]}
                alt={sampleProduct.name}
                className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-100"
              />
              <div>
                <div className="font-bold text-slate-900">{sampleProduct.name}</div>
                <div className="text-slate-500">Šifra: {sampleProduct.sku}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Podjetje *
                </label>
                <input
                  required
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Naziv podjetja"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kontaktna oseba *
                </label>
                <input
                  required
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ime in priimek"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  E-pošta *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e-naslov"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telefon *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="041 123 456"
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Naslov za dostavo vzorca *
              </label>
              <input
                required
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ulica, hišna številka, poštna številka in kraj"
                className="w-full px-3 py-2 border rounded-xl border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            {sampleProduct.colors.length > 0 && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Želena barva vzorca
                </label>
                <select
                  value={colorChoice}
                  onChange={(e) => setColorChoice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-700"
                >
                  {sampleProduct.colors.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Pošiljamo nepotisnjene vzorce za preverjanje materiala.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-brand-900 text-white font-semibold rounded-xl shadow-md hover:bg-brand-950 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pošlji zahtevo za vzorec</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
