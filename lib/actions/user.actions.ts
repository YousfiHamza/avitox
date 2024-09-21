'use server';

import prisma from '@/prisma';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    console.log('user: ', user);
    const newUser = await prisma.user.create({
      data: user,
    });

    console.log('user: ', newUser);
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

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    console.log('clerkId: ', clerkId);

    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: { clerkId },
    });

    console.log('userToDelete: ', userToDelete);

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
