/*
  Warnings:

  - Made the column `salt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `salt` VARCHAR(191) NOT NULL;
