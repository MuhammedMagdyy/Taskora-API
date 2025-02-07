-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_user_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `tags` DROP FOREIGN KEY `tags_user_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_user_uuid_fkey`;

-- DropIndex
DROP INDEX `projects_user_uuid_fkey` ON `projects`;

-- DropIndex
DROP INDEX `tags_user_uuid_fkey` ON `tags`;

-- DropIndex
DROP INDEX `tasks_user_uuid_fkey` ON `tasks`;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_user_uuid_fkey` FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
