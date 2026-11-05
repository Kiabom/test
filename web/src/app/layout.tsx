import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BRAND, SITE } from "@/config/brand";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${SITE.name}`, template: `%s · ${BRAND.name}` },
  description: "سامانه توزین، کنترل تردد، اسکن بار و پایش تولید معدن",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#102a43", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
