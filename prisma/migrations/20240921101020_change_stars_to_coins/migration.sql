/*
  Warnings:

  - You are about to drop the column `stars` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stars",
ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 50;
