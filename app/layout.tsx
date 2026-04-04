import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "@/app/globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-primary"
});

export const metadata: Metadata = {
  title: "Travel Itinerary App",
  description: "Private travel itinerary app for family trip coordination."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
