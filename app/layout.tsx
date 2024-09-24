import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { ClerkProvider } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from '@/components/layout/footer';

import { ApolloWrapper } from '@/graphql/client/apollo-wrapper';

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
    <ClerkProvider>
      <ApolloWrapper>
        <html lang="en">
          <body
            className={cn(
              'flex min-h-screen flex-col justify-between bg-slate-200 antialiased',
              geistSans.variable,
              poppins.variable,
              geistMono.variable,
            )}
          >
            {children}
            <Footer />
            <ToastContainer position="bottom-center" autoClose={5000} />
          </body>
        </html>
      </ApolloWrapper>
    </ClerkProvider>
  );
}
