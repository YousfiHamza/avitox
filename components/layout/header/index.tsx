/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ShoppingBasket, Newspaper, Headphones } from 'lucide-react';

import CustomUserButtons from '@/components/modules/custom-user-buttons';

export default async function Header() {
  return (
    <header className="sticky top-0 z-30 flex w-full items-center border-[1px] border-b-black bg-white px-5 py-2">
      <div className="mx-auto flex w-full max-w-7xl justify-between">
        <Link href="/" className="flex items-center">
          <img src="/icons/logo.svg" alt="Avitox's logo" className="h-10" />{' '}
          <span className="text-2xl font-bold">X</span>
        </Link>
        <nav className="flex flex-1 items-center justify-center gap-5 font-poppins font-medium lg:gap-10">
          <Link href="/market" className="nav-link">
            <ShoppingBasket />
            Market Place
          </Link>
          <Link href="/news" className="nav-link">
            <Newspaper /> News
          </Link>
          <Link href="/support" className="nav-link">
            <Headphones />
            Support
          </Link>
        </nav>
        <CustomUserButtons />
      </div>
    </header>
  );
}
