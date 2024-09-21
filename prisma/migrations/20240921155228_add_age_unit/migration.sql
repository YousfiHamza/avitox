/*
  Warnings:

  - Added the required column `ageUnit` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgeUnitEnum" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "ageUnit" "AgeUnitEnum" NOT NULL;
