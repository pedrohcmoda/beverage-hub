-- CreateEnum
CREATE TYPE "AlcoholType" AS ENUM ('ALCOOLICO', 'NAO_ALCOOLICO');

-- AlterTable
ALTER TABLE "Drink" ADD COLUMN     "alcoholType" "AlcoholType" NOT NULL DEFAULT 'ALCOOLICO';
