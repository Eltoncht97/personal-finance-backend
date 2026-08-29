-- CreateEnum
CREATE TYPE "TransferDirection" AS ENUM ('IN', 'OUT');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "transferDirection" "TransferDirection",
ADD COLUMN     "transferId" TEXT;
