"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import { useModals } from "@/context/ModalContext";

export const Footer: React.FC = () => {
  const { openInquiry } = useModals();
  const [activeLegalModal, setActiveLegalModal] = useState<"terms" | "privacy" | null>(null);

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-24 xl:pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
            {/* Column 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3 group inline-block">
                <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-sm">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C10.5 2 9.5 3.5 10 5.5L10.8 9C8.5 9.2 6.5 10.5 5.5 12.5C4.2 15 5 18 7.5 19.5C9 20.5 11 20.8 13 20.5C14.5 20.3 16 19.5 17 18.2C18.2 16.7 18.5 14.5 17.8 12.8L19.5 8C20 6.2 19 4.5 17.5 4.5C16.2 4.5 15.3 5.5 15 7L14.2 9.2C13.5 9.1 12.8 9 12 9V2Z" />
                    <circle cx="9" cy="13" r="1.2" fill="#f97316" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    Agencija <span className="text-brand-400">Zajček</span>
                  </span>
                  <div className="text-xs text-slate-400">
                    Poslovna darila in promocijski material
                  </div>
                </div>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Vaš zanesljiv B2B partner za izbiro, kakovosten tisk, vezenje in pravočasno
                dobavo promocijskih izdelkov po meri vašega podjetja.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ID za DDV: {COMPANY_INFO.idVat}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-accent-400" />
                  10+ let zaupanja
                </span>
              </div>
            </div>

            {/* Column 2: Program & Ponudba */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Program & Kategorije
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/katalogi" className="hover:text-white transition-colors">
                    Vsi B2B katalogi
                  </Link>
                </li>
                <li>
                  <Link href="/kategorije/promo-tekstil" className="hover:text-white transition-colors">
                    Promo tekstil & delovna oblačila
                  </Link>
                </li>
                <li>
                  <Link href="/kategorije/torbe-in-potovanja" className="hover:text-white transition-colors">
                    Torbe, vrečke & nahrbtniki
                  </Link>
                </li>
                <li>
                  <Link href="/kategorije/pisalni-pripomocki" className="hover:text-white transition-colors">
                    Pisalni pripomočki z gravuro
                  </Link>
                </li>
                <li>
                  <Link href="/kategorije/mobile-and-tech" className="hover:text-white transition-colors">
                    Mobile & Tech pripomočki
                  </Link>
                </li>
                <li>
                  <Link href="/kategorije/dom-in-zivljenje" className="hover:text-white transition-colors">
                    Dom, steklenice & pisarna
                  </Link>
                </li>
                <li>
                  <Link href="/outlet" className="text-accent-400 font-medium hover:text-accent-300 transition-colors">
                    Outlet Shop (do -50%)
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Rešitve & Hitre povezave */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Posebne rešitve
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/az-darila" className="hover:text-white transition-colors">
                    AZ darila – Kurirani paketi
                  </Link>
                </li>
                <li>
                  <Link href="/az-darila#welcome-pack" className="hover:text-white transition-colors">
                    Welcome pack za zaposlene
                  </Link>
                </li>
                <li>
                  <Link href="/az-darila#sejmi" className="hover:text-white transition-colors">
                    Paketi za sejme in dogodke
                  </Link>
                </li>
                <li>
                  <Link href="/az-darila#poslovna" className="hover:text-white transition-colors">
                    Ekskluzivna poslovna darila
                  </Link>
                </li>
                <li>
                  <Link href="/o-nas" className="hover:text-white transition-colors">
                    O nas in naše prednosti
                  </Link>
                </li>
                <li>
                  <Link href="/kontakt" className="hover:text-white transition-colors">
                    Kontakt in svetovanje
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Kontaktni podatki */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                Kontakt v Ljubljani
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white block font-medium">Agencija Zajček</span>
                    <span>{COMPANY_INFO.address.street}</span>
                    <span className="block">{COMPANY_INFO.address.postalCode} {COMPANY_INFO.address.city}</span>
                  </div>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors text-white font-medium">
                    {COMPANY_INFO.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-accent-400 flex-shrink-0" />
                  <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors break-all">
                    {COMPANY_INFO.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-slate-400">{COMPANY_INFO.workingHours}</span>
                </li>
              </ul>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => openInquiry({ source: "footer-button" })}
                  className="w-full py-2.5 px-4 bg-brand-800 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Zahtevaj ponudbo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Social Icons & Bottom Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 Agencija Zajček. Vse pravice pridržane. Demo B2B spletna predstavitev.
            </div>

            {/* Social Placeholder links */}
            <div className="flex items-center gap-4">
              <span className="text-slate-500">Sledite nam:</span>
              <div className="flex items-center gap-3">
                <a
                  href="#linkedin"
                  onClick={(e) => e.preventDefault()}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="LinkedIn (demo)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.54a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
                  </svg>
                </a>
                <a
                  href="#facebook"
                  onClick={(e) => e.preventDefault()}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Facebook (demo)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95Z" />
                  </svg>
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Instagram (demo)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Legal Modals triggers */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveLegalModal("terms")}
                className="hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
              >
                Splošni pogoji poslovanja
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveLegalModal("privacy")}
                className="hover:text-slate-300 transition-colors underline-offset-4 hover:underline"
              >
                Politika zasebnosti & GDPR
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900">
                {activeLegalModal === "terms"
                  ? "Splošni pogoji poslovanja (B2B)"
                  : "Politika zasebnosti in varstvo podatkov"}
              </h4>
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-xs text-slate-600 space-y-3 max-h-72 overflow-y-auto leading-relaxed">
              {activeLegalModal === "terms" ? (
                <>
                  <p>
                    <strong>1. Veljavnost:</strong> Ti splošni pogoji veljajo za vsa naročila,
                    povpraševanja in pogodbe, sklenjene med Agencijo Zajček in pravnimi osebami
                    ali podjetniki (B2B poslovanje).
                  </p>
                  <p>
                    <strong>2. Ponudbe in cene:</strong> Vse navedene cene na spletnem mestu so
                    informativne narave in ne vključujejo DDV, razen če je izrecno navedeno drugače.
                    Natančna ponudba se oblikuje na podlagi količine, izbrane tehnike tiska in
                    grafične priprave.
                  </p>
                  <p>
                    <strong>3. Vizualni predogled (e-korektura):</strong> Pred pričetkom tiska
                    naročnik prejme digitalni predogled. Naročnik je odgovoren za potrditev
                    pravilnosti besedil, barv in postavitve.
                  </p>
                  <p>
                    <strong>4. Dobavni roki:</strong> Standardni dobavni rok za artikle z zaloge je
                    2–4 delovne dni, za artikle z dotiskom pa 5–8 delovnih dni od potrjene korekture.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Upravljavec osebnih podatkov:</strong> Agencija Zajček, Dunajska
                    cesta 114, 1000 Ljubljana, info@agencija-zajcek.net.
                  </p>
                  <p>
                    <strong>2. Namen obdelave:</strong> Posredovane kontaktne podatke (ime, e-pošta,
                    telefon, podjetje) uporabljamo izključno za pripravo ponudbe, komunikacijo glede
                    naročila in izvedbo pogodbenih obveznosti.
                  </p>
                  <p>
                    <strong>3. Varnost:</strong> Podatkov ne posredujemo nepooblaščenim tretjim osebam.
                    V tej demo različici se podatki hranijo zgolj v vašem lokalnem brskalniku
                    (localStorage).
                  </p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Zapri
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
