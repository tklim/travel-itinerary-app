import type { Metadata } from "next";

import "@/app/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
