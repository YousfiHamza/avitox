import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function ListingsPage() {
  return (
    <div className="mx-auto flex h-[88%] w-full flex-col items-center rounded-lg bg-white p-6">
      <div className="flex w-full items-center justify-end">
        <Button
          asChild
          className="w-fit bg-rose-700 text-white shadow-transparent hover:bg-rose-600 hover:shadow-sm hover:shadow-rose-600"
        >
          <Link href="/dashboard/listings/new" className="self-stretch">
            <PlusIcon className="mr-2 font-bold text-white" /> New Listing
          </Link>
        </Button>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-10 text-center">
        <h1 className="font-poppins text-5xl font-bold drop-shadow-2xl">
          Listings Page
        </h1>
        <p className="text-xl italic text-gray-500">Coming Soon ...</p>
      </div>
    </div>
  );
}
