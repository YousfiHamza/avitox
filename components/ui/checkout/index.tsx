'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { checkoutCoins } from '@/lib/actions/user.actions';
import { toast } from 'react-toastify';

const Checkout = ({
  plan,
  amount,
  coins,
  buyerId,
}: {
  plan: string;
  amount: number;
  coins: number;
  buyerId: string;
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      toast.success(
        'Order placed: You will soon receive a confirmation email ',
      );
    }

    if (query.get('canceled')) {
      toast.error(
        "Order canceled: Continue to shop around and checkout when you're ready",
      );
    }
  }, []);

  const onCheckout = async () => {
    setLoading(true);
    const transaction = {
      plan,
      amount,
      coins,
      buyerId,
    };

    await checkoutCoins(transaction);
    setLoading(true);
  };

  return (
    <form action={onCheckout} method="POST" className="flex-1">
      <section>
        <Button
          disabled={loading}
          type="submit"
          role="link"
          className="w-full rounded-full bg-cover text-slate-100 hover:opacity-75 disabled:cursor-not-allowed"
        >
          Buy Now
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
