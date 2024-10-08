import React from 'react';

import Header from '@/components/layout/header';
import { HorizontalAds } from '@/components/modules/Ads/Horizontal';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <HorizontalAds />
        <div className="mx-auto w-fit">{children}</div>
      </main>
    </>
  );
}
