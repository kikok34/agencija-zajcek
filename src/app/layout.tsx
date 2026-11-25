import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AnalyticsProvider } from "@/context/AnalyticsContext";
import { ModalProvider } from "@/context/ModalContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { InquiryModal } from "@/components/InquiryModal";
import { SampleRequestModal } from "@/components/SampleRequestModal";
import { PdfViewerModal } from "@/components/PdfViewerModal";
import { SearchModal } from "@/components/SearchModal";
import { AnalyticsBadge } from "@/components/AnalyticsBadge";
import { Toast } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Agencija Zajček – Poslovna darila in promocijski material",
  description:
    "Sodobna B2B rešitev za promocijska darila, promo tekstil, tisk logotipov in outlet ponudbo v Sloveniji. Hitra ponudba in strokovno svetovanje.",
  keywords: [
    "poslovna darila",
    "promocijski material",
    "promo tekstil",
    "tisk logotipa",
    "vezenje",
    "Agencija Zajček",
    "Ljubljana",
    "poslovna darila za podjetja",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
        <AnalyticsProvider>
          <CartProvider>
            <ModalProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />

              {/* Global Interactive Modals & Drawers */}
              <CartDrawer />
              <InquiryModal />
              <SampleRequestModal />
              <PdfViewerModal />
              <SearchModal />
              <AnalyticsBadge />
              <Toast />
            </ModalProvider>
          </CartProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
