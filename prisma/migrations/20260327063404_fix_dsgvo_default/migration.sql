-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anfrage" (
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
    "dsgvoAkzeptiert" BOOLEAN NOT NULL,
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
INSERT INTO "new_Anfrage" ("abholadresse", "abholart", "abmeldung", "angebotArt", "angebotGesendetAm", "angebotGueltigBis", "angebotNachricht", "angebotspreis", "anzahlSitze", "anzahlTueren", "ausstattung", "bauform", "createdAt", "deutscheZulassung", "dsgvoAkzeptiert", "email", "erstzulassungJahr", "erstzulassungMonat", "fahrbereitschaft", "farbe", "finanziert", "firmenname", "fotos", "getriebe", "gewerblich", "huBis", "hubraum", "id", "kilometerstand", "kraftstoff", "leistungKw", "maengel", "maengelText", "marke", "modell", "nachname", "newsletter", "notizen", "optischerZustand", "papiere", "plz", "preisvorstellung", "repariert", "roststellen", "schadstoffklasse", "status", "telefon", "terminBestaetigt", "terminBestaetigtAm", "terminToken", "terminVorschlag1", "terminVorschlag2", "unfallfahrzeug", "updatedAt", "verkaufszeitpunkt", "vorname", "weitereInfos") SELECT "abholadresse", "abholart", "abmeldung", "angebotArt", "angebotGesendetAm", "angebotGueltigBis", "angebotNachricht", "angebotspreis", "anzahlSitze", "anzahlTueren", "ausstattung", "bauform", "createdAt", "deutscheZulassung", "dsgvoAkzeptiert", "email", "erstzulassungJahr", "erstzulassungMonat", "fahrbereitschaft", "farbe", "finanziert", "firmenname", "fotos", "getriebe", "gewerblich", "huBis", "hubraum", "id", "kilometerstand", "kraftstoff", "leistungKw", "maengel", "maengelText", "marke", "modell", "nachname", "newsletter", "notizen", "optischerZustand", "papiere", "plz", "preisvorstellung", "repariert", "roststellen", "schadstoffklasse", "status", "telefon", "terminBestaetigt", "terminBestaetigtAm", "terminToken", "terminVorschlag1", "terminVorschlag2", "unfallfahrzeug", "updatedAt", "verkaufszeitpunkt", "vorname", "weitereInfos" FROM "Anfrage";
DROP TABLE "Anfrage";
ALTER TABLE "new_Anfrage" RENAME TO "Anfrage";
CREATE UNIQUE INDEX "Anfrage_terminToken_key" ON "Anfrage"("terminToken");
CREATE INDEX "Anfrage_status_idx" ON "Anfrage"("status");
CREATE INDEX "Anfrage_createdAt_idx" ON "Anfrage"("createdAt");
CREATE INDEX "Anfrage_plz_idx" ON "Anfrage"("plz");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
