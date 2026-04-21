-- CreateTable
CREATE TABLE "fundraising_category" (
    "id" SERIAL NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fundraising_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_category_campaign_id_category_id_key" ON "fundraising_category"("campaign_id", "category_id");

-- AddForeignKey
ALTER TABLE "fundraising_category" ADD CONSTRAINT "fundraising_category_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_category" ADD CONSTRAINT "fundraising_category_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "fundraising_campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
