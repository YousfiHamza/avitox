'use server';

import { User } from '@prisma/client';

import prisma from '@/prisma';

import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

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
    console.log('user updated');
    revalidatePath('/', 'layout');
    console.log('path revalidate');
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

// READ
export async function getUserByClerkId(
  userId: string | null,
): Promise<User | null> {
  try {
    if (!userId) return null;

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) throw new Error('User not found: getUserById');

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
    return null;
  }
}
