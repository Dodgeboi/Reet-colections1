import "./globals.css";
import { Cormorant_Garamond, Jost, Noto_Serif_Devanagari } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { AccountProvider } from "@/components/AccountProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import CartDrawer from "@/components/CartDrawer";
import BackToTop from "@/components/BackToTop";
import HideOnAdmin from "@/components/HideOnAdmin";
import PhotoEditMode from "@/components/PhotoEditMode";
import { siteUrl } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"],
  variable: "--font-cormorant", display: "swap",
});
const jost = Jost({
  subsets: ["latin"], weight: ["300", "400", "500", "600"],
  variable: "--font-jost", display: "swap",
});
const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"], weight: ["400", "500", "600"],
  variable: "--font-deva", display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Reet Collections — Indian Ethnic Wear, Live Every Evening",
    template: "%s — Reet Collections",
  },
  description:
    "Handpicked Indian ethnic & fusion wear, selected with love & care. Join Reet Collections live every evening to shop the newest drops — sarees, lehengas, kurtis & more.",
  keywords: ["Indian ethnic wear", "sarees", "lehengas", "kurtis", "Anarkali", "fusion wear", "Reet Collections"],
  icons: { icon: "/images/logo-gold.png", apple: "/images/logo-gold.png" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Reet Collections — Indian Ethnic Wear, Live Every Evening",
    description: "Handpicked Indian ethnic & fusion wear, selected with love & care.",
    type: "website",
    locale: "en_US",
    siteName: "Reet Collections",
    images: [{ url: "/images/products/pink-ombre-suit-front.png", width: 1024, height: 1536, alt: "Reet Collections pink ombre embroidered suit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reet Collections — Indian Ethnic Wear, Live Every Evening",
    description: "Handpicked Indian ethnic & fusion wear, selected with love & care.",
    images: ["/images/products/pink-ombre-suit-front.png"],
  },
};

export const viewport = {
  themeColor: "#FBF6EF",
  width: "device-width",
  initialScale: 1,
};

// Basic store info for search engines.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Reet Collections",
  slogan: "Selected with love & care, just for you.",
  url: siteUrl(),
  logo: `${siteUrl()}/images/logo-gold.png`,
  sameAs: ["https://www.facebook.com/Reetcollections068/"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${devanagari.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <AccountProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <HideOnAdmin><Footer /></HideOnAdmin>
              <CartDrawer />
              <BackToTop />
              <HideOnAdmin><PhotoEditMode /></HideOnAdmin>
            </WishlistProvider>
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
