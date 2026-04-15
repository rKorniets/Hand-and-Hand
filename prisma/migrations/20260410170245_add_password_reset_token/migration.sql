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
CREATE UNIQUE INDEX "password_reset_token_token_key" ON "password_reset_token"("token");

-- CreateIndex
CREATE INDEX "idx_password_reset_token_user_id" ON "password_reset_token"("user_id");

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "fk_password_reset_token_user" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
