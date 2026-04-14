/*
  Warnings:

  - You are about to drop the column `cost_points` on the `reward` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `reward` table. All the data in the column will be lost.
  - You are about to drop the column `points_spent` on the `reward_redemption` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `reward_redemption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reward_id,user_id]` on the table `reward_redemption` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mission` on table `organization_profile` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `threshold_points` to the `reward` table without a default value. This is not possible if the table is not empty.

*/
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
CREATE TABLE "password_reset_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_organization_category_category_id" ON "organization_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_organization_category_org_id" ON "organization_category"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_organization_category" ON "organization_category"("organization_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");

-- CreateIndex
CREATE INDEX "idx_password_reset_token_user_id" ON "password_reset_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_reward_redemption_unique" ON "reward_redemption"("reward_id", "user_id");

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_org" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "fk_password_reset_token_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
