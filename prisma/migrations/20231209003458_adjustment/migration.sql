/*
  Warnings:

  - You are about to drop the column `scheduling_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notification_id` on the `schedulings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_notification_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `scheduling_id`;

-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `notification_id`,
    ADD COLUMN `notificationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `notifications`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
