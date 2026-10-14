/*
  Warnings:

  - Made the column `coverImageUrl` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "coverImageUrl" SET NOT NULL;
