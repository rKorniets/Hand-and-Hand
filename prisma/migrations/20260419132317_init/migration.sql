-- CreateEnum
CREATE TYPE "user_role_enum" AS ENUM ('APP_USER', 'VOLUNTEER', 'ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "user_status_enum" AS ENUM ('ACTIVE', 'INACTIVE', 'BLOCKED', 'PENDING');

-- CreateEnum
CREATE TYPE "project_status_enum" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "task_status_enum" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "task_difficulty_enum" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "task_assignment_status_enum" AS ENUM ('ASSIGNED', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "fundraising_campaign_status_enum" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "points_transaction_type_enum" AS ENUM ('EARN', 'SPEND', 'BONUS', 'PENALTY', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "approval_request_type_enum" AS ENUM ('ORGANIZATION', 'VOLUNTEER', 'OTHER', 'NEWS', 'PROJECT', 'FUNDRAISING');

-- CreateEnum
CREATE TYPE "approval_request_status_enum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "verification_status_enum" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ticket_status_enum" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ticket_priority_enum" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "warning_status_enum" AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "warning_severity_enum" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "report_type_enum" AS ENUM ('FINANCIAL', 'RESULT', 'ACTIVITY', 'OTHER');

-- CreateTable
CREATE TABLE "app_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "user_role_enum" NOT NULL,
    "status" "user_status_enum" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "points" INTEGER NOT NULL DEFAULT 0,
    "first_name" TEXT,
    "last_name" TEXT,
    "city" TEXT,
    "organization_id" INTEGER,

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "display_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "skills_text" TEXT,
    "rating" DECIMAL(3,2),
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "edrpou" TEXT NOT NULL,
    "description" TEXT,
    "verification_status" "verification_status_enum" NOT NULL DEFAULT 'PENDING',
    "official_docs_url" TEXT,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "location_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mission" TEXT NOT NULL,

    CONSTRAINT "organization_profile_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "organization_profile_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "project_status_enum" NOT NULL DEFAULT 'DRAFT',
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "main_content" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_registration" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "ticket_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "task_status_enum" NOT NULL DEFAULT 'OPEN',
    "difficulty" "task_difficulty_enum" NOT NULL DEFAULT 'MEDIUM',
    "points_reward_base" INTEGER NOT NULL,
    "location_id" INTEGER,
    "deadline" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_category" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fundraising_campaign" (
    "id" SERIAL NOT NULL,
    "organization_profile_id" INTEGER,
    "volunteer_profile_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "main_content" TEXT NOT NULL,
    "goal_amount" DECIMAL(12,2) NOT NULL,
    "current_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "fundraising_campaign_status_enum" NOT NULL DEFAULT 'DRAFT',
    "start_at" TIMESTAMPTZ(6),
    "end_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT,
    "jar_id" TEXT,
    "jar_link" TEXT NOT NULL,
    "mono_token" TEXT NOT NULL,

    CONSTRAINT "fundraising_campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donation" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "donor_name" TEXT,
    "message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "main_content" TEXT NOT NULL,
    "created_by" INTEGER,
    "organization_id" INTEGER,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_category" (
    "id" SERIAL NOT NULL,
    "news_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "lat" DECIMAL(9,6) NOT NULL,
    "lng" DECIMAL(9,6) NOT NULL,
    "address" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "reward" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost_points" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_redemption" (
    "id" SERIAL NOT NULL,
    "reward_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "task_assignment_id" INTEGER,
    "amount" INTEGER NOT NULL,
    "type" "points_transaction_type_enum" NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "points_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "volunteer_profile_id" INTEGER NOT NULL,
    "status" "task_assignment_status_enum" NOT NULL DEFAULT 'ASSIGNED',
    "assigned_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "comment" TEXT,

    CONSTRAINT "task_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "volunteer_profile_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ticket_status_enum" NOT NULL DEFAULT 'OPEN',
    "priority" "ticket_priority_enum" NOT NULL DEFAULT 'MEDIUM',
    "location_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMPTZ(6),

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_category" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_category_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "password_reset_token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report" (
    "id" SERIAL NOT NULL,
    "organization_profile_id" INTEGER NOT NULL,
    "project_id" INTEGER,
    "title" TEXT NOT NULL,
    "type" "report_type_enum" NOT NULL,
    "file_url" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_profile_user_id_key" ON "volunteer_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_profile_display_name_key" ON "volunteer_profile"("display_name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_profile_user_id_key" ON "organization_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_profile_edrpou_key" ON "organization_profile"("edrpou");

-- CreateIndex
CREATE INDEX "idx_organization_profile_location_id" ON "organization_profile"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profile_user_id_key" ON "admin_profile"("user_id");

-- CreateIndex
CREATE INDEX "idx_project_organization_profile_id" ON "project"("organization_profile_id");

-- CreateIndex
CREATE INDEX "project_registration_project_id_idx" ON "project_registration"("project_id");

-- CreateIndex
CREATE INDEX "project_registration_user_id_idx" ON "project_registration"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_registration_project_id_user_id_key" ON "project_registration"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "idx_task_location_id" ON "task"("location_id");

-- CreateIndex
CREATE INDEX "idx_task_project_id" ON "task"("project_id");

-- CreateIndex
CREATE INDEX "idx_task_ticket_id" ON "task"("ticket_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uq_task_category" ON "task_category"("task_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_fundraising_campaign_organization_profile_id" ON "fundraising_campaign"("organization_profile_id");

-- CreateIndex
CREATE INDEX "idx_fundraising_campaign_volunteer_profile_id" ON "fundraising_campaign"("volunteer_profile_id");

-- CreateIndex
CREATE INDEX "idx_donation_campaign_id" ON "donation"("campaign_id");

-- CreateIndex
CREATE INDEX "idx_news_created_by" ON "news"("created_by");

-- CreateIndex
CREATE INDEX "news_organization_id_idx" ON "news"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_news_category" ON "news_category"("news_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_approval_request_submitted_by" ON "approval_request"("submitted_by");

-- CreateIndex
CREATE INDEX "idx_approval_request_reviewed_by" ON "approval_request"("reviewed_by");

-- CreateIndex
CREATE INDEX "idx_ticket_location_id" ON "ticket"("location_id");

-- CreateIndex
CREATE INDEX "idx_ticket_user_id" ON "ticket"("user_id");

-- CreateIndex
CREATE INDEX "idx_ticket_volunteer_profile_id" ON "ticket"("volunteer_profile_id");

-- CreateIndex
CREATE INDEX "idx_organization_category_category_id" ON "organization_category"("category_id");

-- CreateIndex
CREATE INDEX "idx_organization_category_org_id" ON "organization_category"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_organization_category" ON "organization_category"("organization_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");

-- AddForeignKey
ALTER TABLE "app_user" ADD CONSTRAINT "app_user_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_profile" ADD CONSTRAINT "fk_volunteer_profile_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_profile" ADD CONSTRAINT "fk_organization_profile_location" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_profile" ADD CONSTRAINT "fk_organization_profile_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_profile" ADD CONSTRAINT "fk_admin_profile_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "fk_project_organization" FOREIGN KEY ("organization_profile_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_registration" ADD CONSTRAINT "project_registration_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_registration" ADD CONSTRAINT "project_registration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "fk_task_location" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "fk_task_project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "fk_task_ticket" FOREIGN KEY ("ticket_id") REFERENCES "ticket"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "fk_task_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_category" ADD CONSTRAINT "fk_task_category_task" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fundraising_campaign" ADD CONSTRAINT "fk_fundraising_campaign_organization" FOREIGN KEY ("organization_profile_id") REFERENCES "organization_profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fundraising_campaign" ADD CONSTRAINT "fk_fundraising_campaign_volunteer" FOREIGN KEY ("volunteer_profile_id") REFERENCES "volunteer_profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donation" ADD CONSTRAINT "fk_donation_campaign" FOREIGN KEY ("campaign_id") REFERENCES "fundraising_campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "fk_news_created_by" FOREIGN KEY ("created_by") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_category" ADD CONSTRAINT "fk_news_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "news_category" ADD CONSTRAINT "fk_news_category_news" FOREIGN KEY ("news_id") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "approval_request" ADD CONSTRAINT "fk_approval_request_submitter" FOREIGN KEY ("submitted_by") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "approval_request" ADD CONSTRAINT "fk_approval_request_reviewer" FOREIGN KEY ("reviewed_by") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reward_redemption" ADD CONSTRAINT "fk_reward_redemption_reward" FOREIGN KEY ("reward_id") REFERENCES "reward"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reward_redemption" ADD CONSTRAINT "fk_reward_redemption_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "points_transaction" ADD CONSTRAINT "fk_points_transaction_task_assignment" FOREIGN KEY ("task_assignment_id") REFERENCES "task_assignment"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "points_transaction" ADD CONSTRAINT "fk_points_transaction_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "fk_task_assignment_task" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "fk_task_assignment_volunteer_profile" FOREIGN KEY ("volunteer_profile_id") REFERENCES "volunteer_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_ticket_location" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_ticket_app_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "fk_ticket_volunteer_profile" FOREIGN KEY ("volunteer_profile_id") REFERENCES "volunteer_profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "organization_category" ADD CONSTRAINT "fk_organization_category_org" FOREIGN KEY ("organization_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "fk_warnings_created_by" FOREIGN KEY ("created_by") REFERENCES "app_user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warnings" ADD CONSTRAINT "fk_warnings_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "fk_password_reset_token_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "fk_report_organization" FOREIGN KEY ("organization_profile_id") REFERENCES "organization_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "fk_report_project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
