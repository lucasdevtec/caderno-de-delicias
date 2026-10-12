-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Recipe_isDraft_idx" ON "Recipe"("isDraft");
