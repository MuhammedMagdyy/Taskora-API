/*
  Warnings:

  - Added the required column `user_uuid` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tags` ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
