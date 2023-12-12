-- AlterTable
ALTER TABLE `notifications` MODIFY `type` ENUM('friend_request', 'appointment', 'cancel_appointment') NOT NULL;
