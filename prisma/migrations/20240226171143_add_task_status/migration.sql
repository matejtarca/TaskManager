-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'COMPLETED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
