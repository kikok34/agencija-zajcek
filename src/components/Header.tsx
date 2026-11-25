"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Phone,
  Mail,
  Menu,
  X,
  FileText,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useModals } from "@/context/ModalContext";
import { useAnalytics } from "@/context/AnalyticsContext";
import { COMPANY_INFO } from "@/data/company";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, subtotal, setIsCartOpen } = useCart();
  const { openInquiry, openSearch } = useModals();
  const { trackEvent } = useAnalytics();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const handleQuoteClick = (source = "header") => {
    trackEvent("quote_click", "Zahtevaj ponudbo", `Klik na glavni CTA v glavi (${source})`);
    openInquiry({ source: `Header: ${source}` });
  };

  const navLinks = [
    { label: "Domov", href: "/" },
    { label: "Katalogi", href: "/katalogi" },
    {
      label: "Izdelki",
      href: "/kategorije/promo-tekstil",
      hasDropdown: true,
    },
    { label: "Promo tekstil", href: "/kategorije/promo-tekstil" },
    { label: "Torbe", href: "/kategorije/torbe-in-potovanja" },
    { label: "Pisala", href: "/kategorije/pisalni-pripomocki" },
    { label: "Mobile & Tech", href: "/kategorije/mobile-and-tech" },
    { label: "Dom in življenje", href: "/kategorije/dom-in-zivljenje" },
    {
      label: "Outlet Shop",
      href: "/outlet",
      badge: "Outlet",
      isOutlet: true,
    },
    { label: "AZ darila", href: "/az-darila", badge: "Paketi" },
    { label: "O nas", href: "/o-nas" },
    { label: "Kontakt", href: "/kontakt" },
  ];

  const productCategoriesDropdown = [
    { name: "Promo tekstil", href: "/kategorije/promo-tekstil", count: "12 artiklov", desc: "Majice, jakne, puloverji" },
    { name: "Torbe in potovanja", href: "/kategorije/torbe-in-potovanja", count: "10 artiklov", desc: "Bombažne vrečke, nahrbtniki" },
    { name: "Pisalni pripomočki", href: "/kategorije/pisalni-pripomocki", count: "10 artiklov", desc: "Kovinska pisala, gravura" },
    { name: "Mobile & Tech", href: "/kategorije/mobile-and-tech", count: "10 artiklov", desc: "Qi polnilci, powerbanki" },
    { name: "Dom in življenje", href: "/kategorije/dom-in-zivljenje", count: "10 artiklov", desc: "Termo steklenice, skodelice" },
    { name: "Outlet Shop", href: "/outlet", count: "Akcija -50%", desc: "Hitra dobava iz skladišča" },
  ];

  return (
    <>
      {/* Top B2B Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-accent-400 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              B2B Partner za poslovna darila in promocijski tisk
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Brezplačen vizualni predogled vašega logotipa v 24 urah
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-accent-400" />
              <span>{COMPANY_INFO.phoneDisplay}</span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3 text-accent-400" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                {/* Stylized Rabbit Monogram Icon */}
                <svg
                  className="w-7 h-7 text-white fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C10.5 2 9.5 3.5 10 5.5L10.8 9C8.5 9.2 6.5 10.5 5.5 12.5C4.2 15 5 18 7.5 19.5C9 20.5 11 20.8 13 20.5C14.5 20.3 16 19.5 17 18.2C18.2 16.7 18.5 14.5 17.8 12.8L19.5 8C20 6.2 19 4.5 17.5 4.5C16.2 4.5 15.3 5.5 15 7L14.2 9.2C13.5 9.1 12.8 9 12 9V2Z" />
                  <circle cx="9" cy="13" r="1.2" fill="#f97316" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-900 transition-colors flex items-center gap-1">
                  Agencija <span className="text-brand-700">Zajček</span>
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider -mt-0.5">
                  Poslovna darila & tisk
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700 whitespace-nowrap">
              <Link
                href="/"
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname === "/" ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                Domov
              </Link>

              <Link
                href="/katalogi"
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname.startsWith("/katalogi") ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                Katalogi
              </Link>

              {/* Dropdown for Izdelki / Kategorije */}
              <div
                className="relative"
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-1 hover:text-brand-900 hover:bg-slate-100 ${
                    pathname.startsWith("/kategorije") ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                  }`}
                >
                  <span>Kategorije</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform" />
                </button>

                {productsDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
                      Kategorije izdelkov
                    </div>
                    <div className="space-y-1">
                      {productCategoriesDropdown.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setProductsDropdownOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        >
                          <div>
                            <div className="font-semibold text-slate-800 text-sm group-hover:text-brand-700">
                              {cat.name}
                            </div>
                            <div className="text-xs text-slate-500">{cat.desc}</div>
                          </div>
                          <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {cat.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Highlight Promo tekstil on larger displays */}
              <Link
                href="/kategorije/promo-tekstil"
                className={`hidden 2xl:inline-flex px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname === "/kategorije/promo-tekstil" ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                Promo tekstil
              </Link>

              <Link
                href="/outlet"
                className="relative px-2.5 xl:px-3 py-2 rounded-lg transition-colors font-semibold text-accent-700 bg-accent-50 hover:bg-accent-100 flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-accent-600" />
                <span>Outlet</span>
                <span className="text-[10px] bg-accent-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                  Akcija
                </span>
              </Link>

              <Link
                href="/az-darila"
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname === "/az-darila" ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                AZ darila
              </Link>

              <Link
                href="/o-nas"
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname === "/o-nas" ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                O nas
              </Link>

              <Link
                href="/kontakt"
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-brand-900 hover:bg-slate-100 ${
                  pathname === "/kontakt" ? "text-brand-900 font-semibold bg-brand-50/80" : ""
                }`}
              >
                Kontakt
              </Link>
            </nav>

            {/* Right Action Icons & Primary CTA */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Iskanje izdelkov in katalogov"
                className="p-2.5 rounded-xl text-slate-600 hover:text-brand-900 hover:bg-slate-100 transition-colors relative"
                title="Hitro iskanje"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Odpri košarico / povpraševanje"
                className="p-2.5 rounded-xl text-slate-700 hover:text-brand-900 hover:bg-slate-100 transition-colors relative flex items-center gap-2 group"
                title="Košarica"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-accent-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-50 duration-200">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                {totalItems > 0 && (
                  <span className="hidden md:inline text-xs font-semibold text-slate-900">
                    {subtotal.toFixed(2)} €
                  </span>
                )}
              </button>

              {/* Primary Quote CTA Button */}
              <button
                type="button"
                onClick={() => handleQuoteClick("desktop-header")}
                className="hidden lg:inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-950 hover:to-brand-900 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2"
              >
                <span>Zahtevaj ponudbo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Meni"
                className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white max-h-[85vh] overflow-y-auto px-4 pt-3 pb-8 shadow-xl animate-in fade-in duration-200">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Iskanje izdelkov, katalogov ali šifer...</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
                Glavna navigacija
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-brand-50 text-brand-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.isOutlet
                          ? "bg-accent-100 text-accent-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleQuoteClick("mobile-menu");
                }}
                className="w-full py-3 px-4 bg-brand-900 hover:bg-brand-950 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>Zahtevaj brezplačno ponudbo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-brand-700" />
                <span>Pokličite nas: {COMPANY_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Bar for Mobile Devices */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 active:bg-slate-200 text-slate-900 text-xs font-semibold rounded-xl border border-slate-300"
          >
            <Phone className="w-3.5 h-3.5 text-brand-700" />
            <span>Pokliči</span>
          </a>

          <button
            type="button"
            onClick={() => handleQuoteClick("mobile-sticky-bar")}
            className="flex-[2] inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-brand-900 active:bg-brand-950 text-white text-xs font-semibold rounded-xl shadow-sm"
          >
            <span>Zahtevaj ponudbo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 bg-slate-100 text-slate-800 rounded-xl relative"
            aria-label="Košarica"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
