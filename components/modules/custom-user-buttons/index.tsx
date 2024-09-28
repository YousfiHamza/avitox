import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { PlusIcon, User, LayoutDashboard, Mails } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { getUserByClerkId } from '@/lib/actions/user.actions';

export default async function CustomUserButtons({ user }: any) {
  return user ? (
    <div className="flex items-center gap-6">
      <Link href="/dashboard/messages" className="relative">
        <Mails className="text-green-700" size={30} />
        <div className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-700 pb-[2px] font-semibold text-white">
          3
        </div>
      </Link>
      <Link href="/dashboard/store" className="flex items-center gap-1">
        <span className="text-xl font-semibold text-yellow-600">
          {user.coins}
        </span>
        <img src="/icons/coins.svg" alt="coins" className="h-6 w-6" />
      </Link>
      <div className="min-h-[50px] min-w-[56px] cursor-pointer rounded-lg px-2 pt-1 transition-all ease-in-out hover:bg-slate-100">
        <UserButton />
      </div>
      <Button
        asChild
        className="w-fit bg-rose-700 text-white shadow-transparent hover:bg-rose-600 hover:shadow-sm hover:shadow-rose-600"
      >
        <Link href="/dashboard/listings">
          <LayoutDashboard className="mr-2 font-bold text-white" /> Dashboard
        </Link>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/sign-in"
        className="flex h-10 w-fit items-center justify-center rounded-xl bg-green-800 p-2 font-medium text-slate-100"
      >
        <User size={30} />
      </Link>
      <Button
        asChild
        className="h-full w-fit bg-rose-700 text-white shadow-transparent hover:bg-rose-600 hover:shadow-sm hover:shadow-rose-600"
      >
        <Link href="/dashboard/listings/new" className="self-stretch">
          <PlusIcon className="mr-2 font-bold text-white" /> New Listing
        </Link>
      </Button>
    </div>
  );
}
