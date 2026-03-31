-- CreateTable MailLog für E-Mail Protokoll
CREATE TABLE "MailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anfrageId" TEXT,
    "typ" TEXT NOT NULL,
    "empfaenger" TEXT NOT NULL,
    "betreff" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'gesendet',
    "fehler" TEXT
);

CREATE INDEX "MailLog_createdAt_idx" ON "MailLog"("createdAt");
CREATE INDEX "MailLog_anfrageId_idx" ON "MailLog"("anfrageId");
