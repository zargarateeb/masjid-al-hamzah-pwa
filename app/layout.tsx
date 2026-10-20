import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { InstallCapture } from "@/components/InstallCapture";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Masjid Al-Hamzah",
  description: "Our Faith · Our Community",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Al-Hamzah",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c4a3a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${arabic.variable}`}
    >
      <body className="font-sans antialiased">
        <InstallCapture />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}