/*
  Warnings:

  - You are about to drop the column `osmId` on the `Shop` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Product_lastUpdated_idx";

-- DropIndex
DROP INDEX "Product_shopId_name_key";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "osmId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Product_shopId_name_idx" ON "Product"("shopId", "name");

-- CreateIndex
CREATE INDEX "Shop_category_idx" ON "Shop"("category");
