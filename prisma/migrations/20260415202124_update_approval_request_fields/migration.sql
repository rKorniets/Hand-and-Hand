/*
  Warnings:

  - The values [NEWS,PROJECT,FUNDRAISING] on the enum `approval_request_type_enum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "approval_request_type_enum_new" AS ENUM ('ORGANIZATION', 'VOLUNTEER', 'OTHER');
ALTER TABLE "approval_request" ALTER COLUMN "type" TYPE "approval_request_type_enum_new" USING ("type"::text::"approval_request_type_enum_new");
ALTER TYPE "approval_request_type_enum" RENAME TO "approval_request_type_enum_old";
ALTER TYPE "approval_request_type_enum_new" RENAME TO "approval_request_type_enum";
DROP TYPE "public"."approval_request_type_enum_old";
COMMIT;
