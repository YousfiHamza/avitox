import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import DashboardTabs from '@/components/modules/dashboard-tabs';
import { VerticalAds } from '@/components/modules/Ads/Vertical';
import { HotListings } from '@/components/modules/hot-listings';
import Header from '@/components/layout/header';
import { HorizontalAds } from '@/components/modules/Ads/Horizontal';

import { getUserByClerkId } from '@/lib/actions/user.actions';
import { UserProvider } from '@/providers/user';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    return redirect('/auth/sign-in');
  }

  return (
    <>
      <Header user={user} />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <HorizontalAds />
        <div className="container mx-auto pb-8">
          <div className="flex w-full gap-2">
            <div className="flex flex-1 flex-col gap-2">
              <DashboardTabs />
              <UserProvider user={user}>{children}</UserProvider>
            </div>
            <div className="flex min-h-full flex-col justify-between gap-3 self-stretch">
              <HotListings />
              <VerticalAds />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
