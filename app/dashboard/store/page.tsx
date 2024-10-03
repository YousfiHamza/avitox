import Image from 'next/image';
import Link from 'next/link';
import { Building, Store, CircleUser } from 'lucide-react';

import { PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

import Checkout from '@/components/ui/checkout';
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Icon = ({
  name,
  className = '',
}: {
  name: string;
  className?: string;
}) => {
  switch (name) {
    case 'Individual':
      return <CircleUser className={className} size={48} />;
    case 'Small Business':
      return <Store className={className} size={48} />;
    case 'Entreprise':
      return <Building className={className} size={48} />;
    default:
      return null;
  }
};

export default async function StorePage() {
  const { userId } = auth();

  const user = await getUserByClerkId(userId);

  if (!user) {
    console.error('Error fetching listings:');
    redirect('/dashboard/listings');
  }

  const displayButton = (plan: any) => {
    if (plan.name === 'Individual') {
      return (
        <Button disabled variant="outline" className="mx-auto w-full">
          Free Consumable
        </Button>
      );
    } else if (plan.name === 'Small Business') {
      return (
        <Checkout
          plan={plan.name}
          amount={plan.price}
          coins={plan.credits}
          buyerId={user.id.toString()}
        />
      );
    } else if (plan.name === 'Entreprise') {
      return (
        <Link href="/support">
          <Button
            variant="outline"
            className="mx-auto w-full bg-black text-white hover:bg-gray-600 hover:text-white"
          >
            Contact Sales
          </Button>
        </Link>
      );
    } else return null;
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg bg-white shadow-md shadow-black/40">
      <h1 className="font-poppins text-5xl font-bold drop-shadow-2xl">
        🤩 Choose A Plan 🤩
      </h1>
      <section>
        <ul className="credits-list">
          {PLANS.map(plan => (
            <li key={plan.name} className="relative">
              {plan.isPopular && (
                <p className="absolute right-0 top-0 rounded-bl-[16px] rounded-tr-[16px] bg-red-500 p-4 text-xl font-medium italic text-slate-100 sm:-top-10 md:rounded-bl-none md:rounded-tl-[16px] md:rounded-tr-none md:p-2 lg:-top-11">
                  Popular
                </p>
              )}

              <div
                className={`credits-item rounded-[16px] ${plan.isPopular ? 'border-4 border-red-500 md:rounded-tr-none' : 'border-2 border-purple-200/20'}`}
              >
                <div className="">
                  <div className="w-full flex-col items-center gap-1 text-center">
                    <Icon name={plan.name} className="mx-auto text-blue-800" />
                    {/* <Image src={plan.icon} alt="check" width={50} height={50} /> */}
                    <p className="text-2xl font-bold text-blue-500">
                      {plan.name}
                    </p>
                    <p className="text-dark-600 font-semibold">${plan.price}</p>
                    <p className="p-16-regular">{plan.credits} Coins</p>
                  </div>
                  {/* Inclusions */}
                  <ul className="flex flex-col gap-4 py-8">
                    {plan.inclusions.map(inclusion => (
                      <li
                        key={plan.name + inclusion.label}
                        className="flex items-center gap-4"
                      >
                        <Image
                          src={`/icons/${
                            inclusion.isIncluded ? 'check.svg' : 'cross.svg'
                          }`}
                          alt="check"
                          width={24}
                          height={24}
                        />
                        <p className="p-16-regular">{inclusion.label}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>{displayButton(plan)}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
