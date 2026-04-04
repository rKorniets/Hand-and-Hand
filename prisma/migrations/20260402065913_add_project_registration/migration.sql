-- CreateTable
CREATE TABLE "project_registration" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "volunteer_profile_id" INTEGER NOT NULL,
    "registered_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_registration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_project_registration_project_id" ON "project_registration"("project_id");

-- CreateIndex
CREATE INDEX "idx_project_registration_volunteer_profile_id" ON "project_registration"("volunteer_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_project_registration" ON "project_registration"("project_id", "volunteer_profile_id");

-- AddForeignKey
ALTER TABLE "project_registration" ADD CONSTRAINT "fk_project_registration_project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project_registration" ADD CONSTRAINT "fk_project_registration_volunteer" FOREIGN KEY ("volunteer_profile_id") REFERENCES "volunteer_profile"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
