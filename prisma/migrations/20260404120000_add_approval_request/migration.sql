-- CreateEnum
CREATE TYPE "approval_request_type_enum" AS ENUM ('NEWS', 'PROJECT', 'VOLUNTEER', 'ORGANIZATION', 'FUNDRAISING');

-- CreateEnum
CREATE TYPE "approval_request_status_enum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "organization_profile" ALTER COLUMN "mission" SET NOT NULL;

-- AlterTable
ALTER TABLE "reward" DROP COLUMN "cost_points",
DROP COLUMN "stock",
ADD COLUMN     "threshold_points" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reward_redemption" DROP COLUMN "points_spent",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "organization_category" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_request" (
    "id" SERIAL NOT NULL,
    "type" "approval_request_type_enum" NOT NULL,
    "status" "approval_request_status_enum" NOT NULL DEFAULT 'PENDING',
    "entity_id" INTEGER NOT NULL,
    "submitted_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ(6),

    CONSTRAINT "approval_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_organization_category_category_id" ON "organization_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_organization_category_org_id" ON "organization_category"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_organization_category" ON "organization_category"("organization_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_approval_request_submitted_by" ON "approval_request"("submitted_by");

-- CreateIndex
CREATE INDEX "idx_approval_request_reviewed_by" ON "approval_request"("reviewed_by");

-- CreateIndex
CREATE INDEX "idx_approval_request_type_status" ON "approval_request"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "idx_reward_redemption_unique" ON "reward_redemption"("reward_id", "user_id");

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_org" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "approval_request" ADD CONSTRAINT "fk_approval_request_submitter" FOREIGN KEY ("submitted_by") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "approval_request" ADD CONSTRAINT "fk_approval_request_reviewer" FOREIGN KEY ("reviewed_by") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
