import type { Metadata } from "next";
import "./globals.css";
import { StoreShell } from "@/components/layout/StoreShell";
import { ThemeProvider } from "@/lib/ThemeContext";
import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";
import { SeoHead } from "@/components/seo/SeoHead";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Beauty Cosmetic Store",
  description: "Your premium beauty and cosmetic products store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/fontawesome-all.min.css" />
        <link rel="stylesheet" href="/css/all.css" />
        <link rel="stylesheet" href="/css/animation.css" />
        <link rel="stylesheet" href="/css/aos.css" />
        <link rel="stylesheet" href="/css/owl.carousel.css" />
        <link rel="stylesheet" href="/css/slick.min.css" />
        <link rel="stylesheet" href="/css/effect.css" />
        <link rel="stylesheet" href="/css/style.min.css" />
        <link rel="stylesheet" href="/css/woocommerce-layout.css" />
        <link rel="stylesheet" href="/css/woocommerce.css" />
        <link rel="stylesheet" href="/css/woocommerce-smallscreen.css" media="only screen and (max-width: 768px)" />
        <link rel="stylesheet" href="/css/wc-blocks.css" />
        <link rel="stylesheet" href="/css/homepage.css" />
        <link rel="stylesheet" href="/css/header-footer.css" />
        <link rel="stylesheet" href="/css/all-pages.css" />
        <link rel="stylesheet" href="/css/media.css" />
        <link rel="stylesheet" href="/css/style(1).css" />
        <link rel="stylesheet" href="/css/google-font.css" />
        <link rel="stylesheet" href="/css/dashicons.min.css" />
        <link rel="stylesheet" href="/css/chosen.min.css" />
        <link rel="stylesheet" href="/css/jquery.selectBox.css" />
        <link rel="stylesheet" href="/css/prettyPhoto.css" />
        <link rel="stylesheet" href="/css/front.css" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/topbar_style.css" />
        <link rel="stylesheet" href="/css/wp-notification-bars-public.css" />
        <link rel="stylesheet" href="/admin/admin.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="home page-template" suppressHydrationWarning>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <SeoHead />
              <ChatWidget />
              <StoreShell>{children}</StoreShell>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
