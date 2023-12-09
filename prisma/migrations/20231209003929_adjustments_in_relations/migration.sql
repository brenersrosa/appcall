/*
  Warnings:

  - You are about to drop the column `schedulingId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `notification_id` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_schedulingId_fkey`;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `schedulingId`;

-- AlterTable
ALTER TABLE `schedulings` ADD COLUMN `notification_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
