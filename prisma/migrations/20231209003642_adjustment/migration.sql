/*
  Warnings:

  - You are about to drop the column `notificationId` on the `schedulings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_notificationId_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `schedulingId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `notificationId`;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_schedulingId_fkey` FOREIGN KEY (`schedulingId`) REFERENCES `schedulings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
