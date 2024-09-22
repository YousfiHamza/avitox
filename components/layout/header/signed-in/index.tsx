'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { User } from 'lucide-react';

import { useUser } from '@/providers/user';

export default function CustomUserButton() {
  const ctx = useUser();

  return ctx?.user ? (
    <>
      <div className="flex gap-6">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-yellow-600">
            {ctx.user.coins || -1}
          </span>
          <img src="/icons/coins.svg" alt="coins" className="h-6 w-6" />
        </div>
        <div className="cursor-pointer rounded-lg px-2 pt-1 transition-all ease-in-out hover:bg-slate-100">
          <UserButton />
        </div>
      </div>
    </>
  ) : (
    <Link
      href="/auth/sign-in"
      className="flex h-10 w-fit items-center justify-center rounded-xl bg-green-800 p-2 font-medium text-slate-100"
    >
      <User size={30} />
    </Link>
  );
}
