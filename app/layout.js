import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { AccountProvider } from "@/components/AccountProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import CartDrawer from "@/components/CartDrawer";
import BackToTop from "@/components/BackToTop";

export const metadata = {
  metadataBase: new URL("https://www.reetcollections.com"),
  title: { default: "Reet Collections — Indian Ethnic Wear, Live Every Evening", template: "%s — Reet Collections" },
  description: "Handpicked Indian ethnic & fusion wear, selected with love & care. Join Reet Collections live every evening to shop the newest drops — sarees, lehengas, kurtis & more.",
  keywords: ["Indian ethnic wear", "sarees", "lehengas", "kurtis", "Anarkali", "fusion wear", "Reet Collections"],
  icons: { icon: "/images/logo-gold.png", apple: "/images/logo-gold.png" },
  openGraph: {
    title: "Reet Collections — Indian Ethnic Wear, Live Every Evening",
    description: "Handpicked Indian ethnic & fusion wear, selected with love & care.",
    type: "website", locale: "en_US", siteName: "Reet Collections",
    images: [{ url: "/images/logo-gold.png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&family=Noto+Serif+Devanagari:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          <AccountProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <BackToTop />
          </WishlistProvider>
          </AccountProvider>
        </CartProvider>
      </body>
    </html>
  );
}
