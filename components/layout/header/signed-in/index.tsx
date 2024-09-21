import { getUserById } from '@/lib/actions/user.actions';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function CustomUserButton() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);

  if (!user) {
    return null;
  }

  return (
    <SignedIn>
      <div className="flex gap-6">
        <div className="flex items-center gap-1">
          <span className="text-lg font-semibold text-yellow-600">
            {user.coins}
          </span>
          <img src="/icons/coins.svg" alt="coins" className="h-6 w-6" />
        </div>
        <div className="cursor-pointer rounded-lg px-2 pt-1 transition-all ease-in-out hover:bg-slate-100">
          <UserButton />
        </div>
      </div>
    </SignedIn>
  );
}
