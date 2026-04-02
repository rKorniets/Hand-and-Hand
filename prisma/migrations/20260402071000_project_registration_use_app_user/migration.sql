-- DropForeignKey
ALTER TABLE "project_registration" DROP CONSTRAINT "fk_project_registration_volunteer";

-- DropIndex
DROP INDEX "uq_project_registration";
DROP INDEX "idx_project_registration_volunteer_profile_id";

-- AlterTable: rename volunteer_profile_id -> user_id
ALTER TABLE "project_registration" DROP COLUMN "volunteer_profile_id";
ALTER TABLE "project_registration" ADD COLUMN "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "idx_project_registration_user_id" ON "project_registration"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_registration" ON "project_registration"("project_id", "user_id");

-- AddForeignKey
ALTER TABLE "project_registration" ADD CONSTRAINT "fk_project_registration_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
