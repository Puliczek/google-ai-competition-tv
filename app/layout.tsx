import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Unofficial - Google AI Competition TV",
  description: "Explore innovative AI projects from the Google AI Competition. Watch demo videos, search for specific apps, and discover cutting-edge AI applications.",
  keywords: "Google AI, AI Competition, AI projects, machine learning, artificial intelligence",
  authors: [
    {
      name: "Maciej Pulikowski",
      url: "https://x.com/pulik_io",
    },
  ],
  openGraph: {
    title: "Unofficial - Google AI Competition TV",
    description: "Discover innovative AI projects from the Google AI Competition",
    images: [`opengraph-image.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unofficial - Google AI Competition TV",
    description: "Explore cutting-edge AI projects from the Google AI Competition",
    images: [`opengraph-image.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
