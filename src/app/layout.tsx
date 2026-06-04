import type {Metadata, Viewport} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/context/LanguageContext';
import PullToRefresh from '@/components/muawin/PullToRefresh';
import Navbar from '@/components/muawin/Navbar';

export const metadata: Metadata = {
  title: 'Muawin | گھر کے کام، اب آسان',
  description: 'Muawin connects you with verified local service providers in Pakistan.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Muawin',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#088771',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&family=Noto+Nastaliq+Urdu:wght@400..700&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <LanguageProvider>
          <Navbar />
          <PullToRefresh>
            <main>
              {children}
            </main>
          </PullToRefresh>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
