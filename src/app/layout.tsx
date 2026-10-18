import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://expirely.app"),
  title: {
    default: "Expirely | Smart Expiry Tracker & Inventory Manager",
    template: "%s | Expirely"
  },
  description: "Stop wasting food and money. Expirely helps you track expiry dates, manage inventory, and get smart alerts before products expire.",
  keywords: ["expiry tracker", "food waste", "inventory manager", "smart alerts", "grocery tracker", "expirely app"],
  authors: [{ name: "Expirely Team" }],
  creator: "Expirely",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://expirely.app",
    siteName: "Expirely",
    title: "Expirely | Smart Expiry Tracker",
    description: "The premium way to track your household inventory and avoid waste.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Expirely Dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expirely | Smart Expiry Tracker",
    description: "Never let your groceries expire again.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo1.png",
    apple: "/logo1.png",
  },
};

import StoreProvider from "@/components/StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      {adsenseClient && (
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        />
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >
        <StoreProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#11151f',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.14)',
              },
              success: {
                iconTheme: {
                  primary: '#1E50A2',
                  secondary: '#ffffff',
                },
              },
            }} 
          />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
