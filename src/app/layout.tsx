import type { Metadata } from "next";
import localFont from "next/font/local";

import { Nav } from "@/components/Nav";

import "./globals.css";

const ojuju = localFont({
  src: "./fonts/Ojuju-VariableFont_wght.ttf",
  variable: "--font-ojuju",
  display: "swap",
  weight: "200 800",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Nipase",
  description: "SS26 Collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ojuju.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#1a1a1a] [isolation:isolate]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
