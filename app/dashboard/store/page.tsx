import Image from 'next/image';
import Link from 'next/link';
import { Building } from 'lucide-react';

import { PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

import Checkout from '@/components/ui/checkout';
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function StorePage() {
  const { userId } = auth();

  const user = await getUserByClerkId(userId);

  if (!user) {
    console.error('Error fetching listings:');
    redirect('/dashboard/listings');
  }

  const displayButton = (plan: any) => {
    if (plan.name === 'Free') {
      return (
        <Button disabled variant="outline" className="credits-btn">
          Free Consumable
        </Button>
      );
    } else if (plan.name === 'Small Business') {
      console.log('plan', plan);
      return (
        <Checkout
          plan={plan.name}
          amount={plan.price}
          coins={plan.credits}
          buyerId={user.id.toString()}
        />
      );
    } else if (plan.name === 'Enterprise') {
      return (
        <Link href="/support">
          <Button variant="outline" className="credits-btn">
            Contact Sales
          </Button>
        </Link>
      );
    } else return null;
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-10 rounded-lg bg-white">
      <h1 className="font-poppins text-5xl font-bold drop-shadow-2xl">
        Store Page
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
                  <div className="flex-center flex-col gap-1">
                    <Image src={plan.icon} alt="check" width={50} height={50} />
                    <p className="p-20-semibold text-purple-500">{plan.name}</p>
                    <p className="h1-semibold text-dark-600">${plan.price}</p>
                    <p className="p-16-regular">{plan.credits} Credits</p>
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
