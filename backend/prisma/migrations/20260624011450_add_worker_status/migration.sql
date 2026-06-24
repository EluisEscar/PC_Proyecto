-- CreateEnum
CREATE TYPE "WorkerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "status" "WorkerStatus" NOT NULL DEFAULT 'PENDING';
