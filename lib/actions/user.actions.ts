'use server';

import Stripe from 'stripe';
import { Listing, User } from '@prisma/client';

import prisma from '@/prisma';

import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: user,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    if (!updatedUser) throw new Error('User update failed');
    revalidatePath('/', 'layout');
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!userToDelete) {
      throw new Error('User not found: deleteUser');
    }

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: { clerkId },
    });

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export type UserWithListings = User & {
  listings: Listing[];
};

// READ
export async function getUserByClerkId(
  userId: string | null,
): Promise<UserWithListings | null> {
  try {
    if (!userId) return null;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { listings: true },
    });

    if (!user) throw new Error('User not found: getUserById');

    revalidatePath('/', 'layout');

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error);

    revalidatePath('/', 'layout');

    return null;
  }
}

// Buy Coins
export async function checkoutCoins(transaction: BuyCoinsParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = transaction.amount * 100;

  console.log('transaction', transaction);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'mad',
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      coins: transaction.coins,
      buyerId: transaction.buyerId,
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/listings`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard/store`,
  });

  redirect(session.url!);
}

// Webhook Transaction
export async function createCoinsTransaction(
  transaction: CreateCoinsTransactionParams,
) {
  try {
    // TO-DO: Create a transaction tables to save transactions and follow profit 💰

    // Create a new transaction with a buyerId
    await prisma.user.update({
      where: { id: Number(transaction.buyerId) },
      data: {
        coins: {
          increment: transaction.coins,
        },
      },
    });

    revalidatePath('/dashboard/listings', 'layout');

    return JSON.parse(
      JSON.stringify({ message: 'Transaction completed, coins added' }),
    );
  } catch (error) {
    handleError(error);
  }
}
