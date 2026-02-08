/*
  Warnings:

  - You are about to drop the column `category` on the `Shop` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_name_idx";

-- DropIndex
DROP INDEX "Shop_category_idx";

-- DropIndex
DROP INDEX "Shop_phone_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'other';

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "category",
ADD COLUMN     "categories" TEXT[];

-- CreateIndex
CREATE INDEX "Product_name_category_idx" ON "Product"("name", "category");
