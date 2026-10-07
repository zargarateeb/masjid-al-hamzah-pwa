import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, Amiri } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import OfflineBanner from '@/components/ui/OfflineBanner';
import InstallPrompt from '@/components/ui/InstallPrompt';
import BackButtonHandler from '@/components/ui/BackButtonHandler';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['SOFT', 'WONK', 'opsz'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' });

export const metadata: Metadata = {
  title: 'Masjid Al-Hamzah',
  description: 'Our Faith · Our Community',
  manifest: '/manifest.json',
  applicationName: 'Masjid Al-Hamzah',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Masjid Al-Hamzah',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#031A18',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${amiri.variable}`}>
      <head>
        {/* Load the install capture BEFORE anything else */}
        <Script src="/install-capture.js" strategy="beforeInteractive" />
      </head>
      <body className="font-sans">
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
        <OfflineBanner />
        <InstallPrompt />
        <BackButtonHandler />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}