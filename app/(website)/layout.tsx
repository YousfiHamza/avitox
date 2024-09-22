import { auth } from '@clerk/nextjs/server';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { HorizontalAds } from '@/components/modules/Ads/Horizontal';

import { getUserByClerkId } from '@/lib/actions/user.actions';
import { UserProvider } from '@/providers/user';

export default async function Websiteayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  const user = await getUserByClerkId(userId);

  return (
    <UserProvider user={user}>
      <Header />
      <main className="mx-auto w-full max-w-screen-xl flex-1">
        <HorizontalAds />
        {children}
      </main>
      <Footer />
    </UserProvider>
  );
}
