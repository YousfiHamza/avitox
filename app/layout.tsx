import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';

import { cn } from '@/lib/utils';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Avitox 2.0',
  description: 'Votre Produit, Votre Marché, Notre Expertise',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-slate-200 antialiased',
          geistSans.variable,
          poppins.variable,
          geistMono.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
