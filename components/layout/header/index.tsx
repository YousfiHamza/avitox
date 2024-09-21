/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { ShoppingBasket, PlusIcon, Newspaper, Headphones } from 'lucide-react';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="flex w-full items-center border-[1px] border-b-black bg-white p-5">
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
          <Link href="#" className="nav-link">
            <Newspaper /> News
          </Link>
          <Link href="#" className="nav-link">
            <Headphones />
            Support
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <SignedIn>
            <div className="flex-center cursor-pointer gap-2 rounded-lg px-2 py-1 transition-all ease-in-out hover:bg-slate-100">
              <UserButton showName />
            </div>
          </SignedIn>
          <Button
            asChild
            className="w-fit bg-rose-700 text-white shadow-transparent hover:bg-rose-600 hover:shadow-sm hover:shadow-rose-600"
          >
            <Link href="/dashboard/new-advert">
              <PlusIcon className="mr-2 font-bold text-white" /> New Advert
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
