/*
  Warnings:

  - Added the required column `user_uuid` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `projects` ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
