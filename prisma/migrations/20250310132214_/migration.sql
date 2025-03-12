/*
  Warnings:

  - Added the required column `deliveryCost` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryMethod` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryCost" INTEGER NOT NULL,
ADD COLUMN     "deliveryMethod" TEXT NOT NULL;
