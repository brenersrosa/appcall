/*
  Warnings:

  - Added the required column `meet_duration` to the `user_time_intervals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_time_intervals` ADD COLUMN `meet_duration` INTEGER NOT NULL;
