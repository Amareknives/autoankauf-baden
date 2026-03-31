-- AlterTable: add archiviert and zweiteMailGesendetAm columns
ALTER TABLE "Anfrage" ADD COLUMN "archiviert" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Anfrage" ADD COLUMN "zweiteMailGesendetAm" DATETIME;
