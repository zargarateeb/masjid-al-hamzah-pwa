import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, Amiri } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import OfflineBanner from '@/components/ui/OfflineBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['SOFT', 'WONK', 'opsz'] });
const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' });

export const metadata: Metadata = {
  title: 'Masjid Al-Hamzah',
  description: 'Our Faith · Our Community',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Masjid Al-Hamzah',
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
      <body className="font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
        <OfflineBanner />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}