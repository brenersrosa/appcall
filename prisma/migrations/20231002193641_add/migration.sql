/*
  Warnings:

  - You are about to drop the column `user_id` on the `schedulings` table. All the data in the column will be lost.
  - Added the required column `userId` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `schedulings` DROP FOREIGN KEY `schedulings_user_id_fkey`;

-- AlterTable
ALTER TABLE `schedulings` DROP COLUMN `user_id`,
    ADD COLUMN `is_private` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `friends` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `friend_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedulings` ADD CONSTRAINT `schedulings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_friend_id_fkey` FOREIGN KEY (`friend_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
