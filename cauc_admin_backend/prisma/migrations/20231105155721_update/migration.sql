/*
  Warnings:

  - You are about to drop the column `status` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `status`,
    ADD COLUMN `error_status` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `operate_status` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `order_status` INTEGER NOT NULL DEFAULT 0;
