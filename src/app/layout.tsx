import type { Metadata } from "next";
import localFont from "next/font/local";

import { Nav } from "@/components/Nav";

import "./globals.css";

const ojuju = localFont({
  src: "../../Ojuju/Ojuju-VariableFont_wght.ttf",
  variable: "--font-ojuju",
  display: "swap",
  weight: "200 800",
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
    <html lang="en" className={`${ojuju.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#1a1a1a]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
