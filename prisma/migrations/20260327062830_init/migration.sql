-- CreateTable
CREATE TABLE "Anfrage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'neu',
    "marke" TEXT NOT NULL,
    "modell" TEXT NOT NULL,
    "erstzulassungMonat" INTEGER NOT NULL,
    "erstzulassungJahr" INTEGER NOT NULL,
    "kraftstoff" TEXT NOT NULL,
    "schadstoffklasse" TEXT NOT NULL,
    "leistungKw" INTEGER NOT NULL,
    "hubraum" INTEGER,
    "getriebe" TEXT NOT NULL,
    "bauform" TEXT NOT NULL,
    "anzahlTueren" TEXT NOT NULL,
    "anzahlSitze" INTEGER NOT NULL,
    "huBis" TEXT NOT NULL,
    "farbe" TEXT NOT NULL,
    "kilometerstand" INTEGER NOT NULL,
    "deutscheZulassung" BOOLEAN NOT NULL,
    "papiere" BOOLEAN NOT NULL,
    "finanziert" BOOLEAN NOT NULL,
    "optischerZustand" INTEGER NOT NULL,
    "unfallfahrzeug" TEXT NOT NULL,
    "repariert" BOOLEAN,
    "fahrbereitschaft" TEXT NOT NULL,
    "roststellen" BOOLEAN NOT NULL,
    "maengel" BOOLEAN NOT NULL,
    "maengelText" TEXT,
    "gewerblich" BOOLEAN NOT NULL,
    "firmenname" TEXT,
    "preisvorstellung" TEXT,
    "verkaufszeitpunkt" TEXT NOT NULL,
    "abmeldung" BOOLEAN NOT NULL,
    "weitereInfos" TEXT,
    "ausstattung" JSONB NOT NULL,
    "fotos" JSONB NOT NULL,
    "vorname" TEXT NOT NULL,
    "nachname" TEXT NOT NULL,
    "plz" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "dsgvoAkzeptiert" BOOLEAN NOT NULL DEFAULT true,
    "angebotspreis" REAL,
    "angebotArt" TEXT,
    "angebotNachricht" TEXT,
    "angebotGueltigBis" DATETIME,
    "angebotGesendetAm" DATETIME,
    "terminVorschlag1" DATETIME,
    "terminVorschlag2" DATETIME,
    "abholadresse" TEXT,
    "abholart" TEXT,
    "terminToken" TEXT,
    "terminBestaetigt" DATETIME,
    "terminBestaetigtAm" DATETIME,
    "notizen" TEXT
);

-- CreateTable
CREATE TABLE "HaendlerAnfrage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'neu',
    "firmenname" TEXT NOT NULL,
    "ansprechpartner" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "anzahlFahrzeuge" TEXT NOT NULL,
    "fahrzeugarten" TEXT NOT NULL,
    "nachricht" TEXT,
    "notizen" TEXT
);

-- CreateTable
CREATE TABLE "AktivitaetsLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "anfrageId" TEXT NOT NULL,
    "aktion" TEXT NOT NULL,
    "details" TEXT,
    CONSTRAINT "AktivitaetsLog_anfrageId_fkey" FOREIGN KEY ("anfrageId") REFERENCES "Anfrage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Einstellung" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wert" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Anfrage_terminToken_key" ON "Anfrage"("terminToken");

-- CreateIndex
CREATE INDEX "Anfrage_status_idx" ON "Anfrage"("status");

-- CreateIndex
CREATE INDEX "Anfrage_createdAt_idx" ON "Anfrage"("createdAt");

-- CreateIndex
CREATE INDEX "Anfrage_plz_idx" ON "Anfrage"("plz");
