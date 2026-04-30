-- CreateTable
CREATE TABLE "leave_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "leave_date" DATE NOT NULL,
    "leave_type" VARCHAR(20) NOT NULL,
    "reason" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_leave_requests_leave_date" ON "leave_requests"("leave_date");

-- CreateIndex
CREATE INDEX "idx_leave_requests_user_id" ON "leave_requests"("user_id");

-- CreateIndex
CREATE INDEX "idx_leave_requests_status" ON "leave_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "leave_requests_user_id_leave_date_key" ON "leave_requests"("user_id", "leave_date");

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
