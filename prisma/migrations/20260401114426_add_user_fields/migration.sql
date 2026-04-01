/*
  Warnings:

  - The values [RECIPIENT] on the enum `user_role_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `recipient_status` on the `task_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_profile_id` on the `ticket` table. All the data in the column will be lost.
  - You are about to drop the `recipient_profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[edrpou]` on the table `organization_profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `edrpou` to the `organization_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volunteer_profile_id` to the `ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_role_enum_new" AS ENUM ('APP_USER', 'VOLUNTEER', 'ORGANIZATION', 'ADMIN');
ALTER TABLE "app_user" ALTER COLUMN "role" TYPE "user_role_enum_new" USING ("role"::text::"user_role_enum_new");
ALTER TYPE "user_role_enum" RENAME TO "user_role_enum_old";
ALTER TYPE "user_role_enum_new" RENAME TO "user_role_enum";
DROP TYPE "public"."user_role_enum_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "recipient_profile" DROP CONSTRAINT "fk_recipient_profile_default_location";

-- DropForeignKey
ALTER TABLE "recipient_profile" DROP CONSTRAINT "fk_recipient_profile_user";

-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "fk_ticket_recipient_profile";

-- DropIndex
DROP INDEX "idx_ticket_recipient_profile_id";

-- AlterTable
ALTER TABLE "app_user" ADD COLUMN     "city" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT;

-- AlterTable
ALTER TABLE "organization_profile" ADD COLUMN     "edrpou" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "contact_phone" DROP NOT NULL,
ALTER COLUMN "contact_email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "main_content" TEXT;

-- AlterTable
ALTER TABLE "task_assignment" DROP COLUMN "recipient_status",
ADD COLUMN     "requester_confirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ticket" DROP COLUMN "recipient_profile_id",
ADD COLUMN     "volunteer_profile_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "recipient_profile";

-- DropEnum
DROP TYPE "recipient_type_enum";

-- CreateIndex
CREATE UNIQUE INDEX "organization_profile_edrpou_key" ON "organization_profile"("edrpou");

-- CreateIndex
CREATE INDEX "idx_ticket_volunteer_profile_id" ON "ticket"("volunteer_profile_id");

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_ticket_volunteer_profile" FOREIGN KEY ("volunteer_profile_id") REFERENCES "volunteer_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
