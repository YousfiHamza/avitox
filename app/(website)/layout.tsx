import { auth } from '@clerk/nextjs/server';

import Header from '@/components/layout/header';
import { HorizontalAds } from '@/components/modules/Ads/Horizontal';

import { getUserByClerkId } from '@/lib/actions/user.actions';

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  const user = await getUserByClerkId(userId);

  return (
    <>
      <Header user={user} />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <HorizontalAds />
        <div className="mx-auto w-fit">{children}</div>
      </main>
    </>
  );
}
