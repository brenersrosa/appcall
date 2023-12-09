/*
  Warnings:

  - Added the required column `notification_id` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `scheduling_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedulings` ADD COLUMN `notification_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_notification_id_fkey` FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
