import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import CreateListingForm from '@/components/modules/create-listing-form';
import { VerticalAds } from '@/components/modules/Ads/Vertical';
import { HotListings } from '@/components/modules/hot-listings';

import { getUserByClerkId } from '@/lib/actions/user.actions';

export default async function NewAdvertPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    return redirect('/auth/sign-in');
  }

  return (
    <div className="container mx-auto pb-8">
      <div className="flex w-full gap-2">
        <CreateListingForm ownerId={user.id} />
        <div className="flex min-h-full flex-col justify-between gap-3 self-stretch">
          <HotListings />
          <VerticalAds />
        </div>
      </div>
    </div>
  );
}
