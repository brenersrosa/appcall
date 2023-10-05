/*
  Warnings:

  - You are about to drop the column `userId` on the `schedulings` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_userId_fkey`;

-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `userId`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('friend_request', 'scheduling') NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
