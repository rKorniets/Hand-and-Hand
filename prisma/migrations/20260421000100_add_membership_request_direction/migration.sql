-- CreateEnum
CREATE TYPE "organization_membership_request_direction_enum" AS ENUM ('REQUEST', 'INVITE');

-- AlterTable
ALTER TABLE "organization_membership_request"
  ADD COLUMN "direction" "organization_membership_request_direction_enum" NOT NULL DEFAULT 'REQUEST';
