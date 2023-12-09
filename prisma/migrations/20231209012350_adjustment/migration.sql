-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `notifications_scheduling_id_fkey`;

-- AlterTable
ALTER TABLE `notifications` MODIFY `scheduling_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_scheduling_id_fkey` FOREIGN KEY (`scheduling_id`) REFERENCES `schedulings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
