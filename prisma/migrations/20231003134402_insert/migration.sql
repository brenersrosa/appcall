/*
  Warnings:

  - You are about to drop the column `is_private` on the `schedulings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `is_private`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `schedule_private` BOOLEAN NOT NULL DEFAULT false;
