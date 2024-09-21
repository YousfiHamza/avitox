import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import CreateListingForm from '@/components/modules/create-listing-form';
import { VerticalAds } from '@/components/modules/Ads/Vertical';

import { getUserById } from '@/lib/actions/user.actions';
import { LatestPosts } from '@/components/modules/LatestPosts';

export default async function NewAdvertPage() {
  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const user = await getUserById(userId);

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="container mx-auto pb-8">
      <h1 className="mb-6 font-poppins text-3xl font-bold text-blue-900">
        <span className="italic">Hello {user.firstName}</span> 👋🏼
      </h1>
      <div className="flex w-full gap-2">
        <CreateListingForm ownerId={user.id} />
        <div className="flex min-h-full flex-col justify-between gap-3 self-stretch">
          <LatestPosts />
          <VerticalAds />
        </div>
      </div>
    </div>
  );
}
