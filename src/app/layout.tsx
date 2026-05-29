import type { Metadata, Viewport } from 'next';
import { Quicksand, Baloo_2 } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const baloo = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nhà Nhỏ Vận Động',
  description: 'Bé tập vận động cùng bạn thú và trang trí ngôi nhà đáng yêu',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nhà Nhỏ',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#fef7f0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${baloo.variable} ${quicksand.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-dvh bg-bg-primary text-text-primary antialiased">
        <main className="mx-auto max-w-md md:max-w-lg lg:max-w-xl min-h-dvh flex flex-col">
          {children}
        </main>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
          }
        `,
      }}
    />
  );
}
