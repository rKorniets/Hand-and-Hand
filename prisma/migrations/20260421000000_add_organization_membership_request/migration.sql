-- CreateEnum
CREATE TYPE "organization_membership_request_status_enum" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "organization_membership_request" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "organization_membership_request_status_enum" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMPTZ(6),

    CONSTRAINT "organization_membership_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_org_membership_request" ON "organization_membership_request"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_org_membership_request_org_id" ON "organization_membership_request"("organization_id");

-- CreateIndex
CREATE INDEX "idx_org_membership_request_user_id" ON "organization_membership_request"("user_id");

-- AddForeignKey
ALTER TABLE "organization_membership_request" ADD CONSTRAINT "fk_org_membership_request_org" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_membership_request" ADD CONSTRAINT "fk_org_membership_request_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
