/*
  Warnings:

  - A unique constraint covering the columns `[shopId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_shopId_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopId_name_key" ON "Product"("shopId", "name");
