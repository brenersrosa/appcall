/*
  Warnings:

  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - The values [scheduling] on the enum `notifications_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `is_read`,
    ADD COLUMN `as_read` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `type` ENUM('friend_request', 'appointment') NOT NULL;
