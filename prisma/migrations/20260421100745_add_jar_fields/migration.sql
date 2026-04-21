-- AlterTable
ALTER TABLE "fundraising_campaign" ADD COLUMN     "jar_id" TEXT,
ADD COLUMN     "jar_link" TEXT;

-- AlterTable
ALTER TABLE "ticket" ADD COLUMN     "user_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
