/*
  Warnings:

  - You are about to drop the column `source_name` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `source_url` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `news` table. All the data in the column will be lost.
  - Added the required column `description` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `main_content` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "warning_severity_enum" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "warning_status_enum" AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "news" DROP COLUMN "source_name",
DROP COLUMN "source_url",
DROP COLUMN "tags",
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "main_content" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "admin_profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warnings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "warning_status_enum" NOT NULL DEFAULT 'ACTIVE',
    "severity" "warning_severity_enum" NOT NULL DEFAULT 'MEDIUM',
    "issued_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "resolved_at" TIMESTAMPTZ(6),
    "related_entity_type" TEXT,
    "related_entity_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_user_id_key" ON "admin_profile"("user_id");

-- CreateIndex
CREATE INDEX "idx_warnings_created_by" ON "warnings"("created_by");

-- CreateIndex
CREATE INDEX "idx_warnings_user_id" ON "warnings"("user_id");

-- CreateIndex
CREATE INDEX "idx_news_created_by" ON "news"("created_by");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "fk_news_created_by" FOREIGN KEY ("created_by") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_profile" ADD CONSTRAINT "fk_admin_profile_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "fk_warnings_created_by" FOREIGN KEY ("created_by") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "fk_warnings_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
