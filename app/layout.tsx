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

const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("theme");
    const theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={roboto.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
