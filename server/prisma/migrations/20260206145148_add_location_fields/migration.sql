/*
  Warnings:

  - Added the required column `address` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_marketId_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_sectionId_fkey";

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "osmId" TEXT,
ALTER COLUMN "marketId" DROP NOT NULL,
ALTER COLUMN "sectionId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Shop_lat_lon_idx" ON "Shop"("lat", "lon");

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "Market"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;
