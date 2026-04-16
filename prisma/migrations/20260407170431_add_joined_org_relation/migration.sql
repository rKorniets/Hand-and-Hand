/*
  Warnings:

  - You are about to drop the `project_registration` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `mission` on table `organization_profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "project_registration" DROP CONSTRAINT "fk_project_registration_project";

-- DropForeignKey
ALTER TABLE "project_registration" DROP CONSTRAINT "fk_project_registration_user";

-- AlterTable
ALTER TABLE "app_user" ADD COLUMN     "joined_organization_id" INTEGER;

-- AlterTable
ALTER TABLE "organization_profile" ALTER COLUMN "mission" SET NOT NULL;

-- DropTable
DROP TABLE "project_registration";

-- CreateTable
CREATE TABLE "organization_category" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_organization_category_category_id" ON "organization_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_organization_category_org_id" ON "organization_category"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_organization_category" ON "organization_category"("organization_id", "category_id");

-- AddForeignKey
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_joined_organization_id_fkey" FOREIGN KEY ("joined_organization_id") REFERENCES "organization_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_org" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
