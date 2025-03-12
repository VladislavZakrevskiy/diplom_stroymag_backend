/*
  Warnings:

  - Made the column `discount` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE DOUBLE PRECISION;
