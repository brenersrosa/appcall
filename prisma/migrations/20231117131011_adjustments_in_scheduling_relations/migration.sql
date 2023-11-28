/*
  Warnings:

  - Added the required column `creator_id` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schedulings` ADD COLUMN `creator_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
