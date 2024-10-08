/*
  Warnings:

  - The values [PET] on the enum `CategoryEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryEnum_new" AS ENUM ('DOG', 'CAT', 'BIRD');
ALTER TABLE "Listing" ALTER COLUMN "category" TYPE "CategoryEnum_new" USING ("category"::text::"CategoryEnum_new");
ALTER TYPE "CategoryEnum" RENAME TO "CategoryEnum_old";
ALTER TYPE "CategoryEnum_new" RENAME TO "CategoryEnum";
DROP TYPE "CategoryEnum_old";
COMMIT;
