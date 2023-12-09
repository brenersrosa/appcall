/*
  Warnings:

  - You are about to drop the column `notification_id` on the `schedulings` table. All the data in the column will be lost.
  - Added the required column `scheduling_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_notification_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `scheduling_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `notification_id`;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_scheduling_id_fkey` FOREIGN KEY (`scheduling_id`) REFERENCES `schedulings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
