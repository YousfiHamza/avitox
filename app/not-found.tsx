import Header from '@/components/layout/header';
import React from 'react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <img
          src="/icons/404.svg"
          className="mx-auto max-h-[66vh]"
          alt="error 404 illustration"
        />
      </main>
    </>
  );
}
