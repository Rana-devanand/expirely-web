import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  themeColor: "#f8fafc",
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
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import StoreProvider from "@/components/StoreProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
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
