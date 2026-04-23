-- CreateTable
CREATE TABLE "project_category" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_category" ON "project_category"("project_id", "category_id");

-- AddForeignKey
ALTER TABLE "project_category" ADD CONSTRAINT "fk_project_category_category" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_category" ADD CONSTRAINT "fk_project_category_project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
