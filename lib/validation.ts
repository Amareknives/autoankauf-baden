import { z } from "zod";

export const anfrageSchema = z.object({
  name: z.string().min(2, "Bitte gib deinen Namen ein"),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein"),
  telefon: z.string().min(6, "Bitte gib eine gültige Telefonnummer ein"),
  plz: z.string().min(3, "Bitte gib eine gültige PLZ ein"),
  marke: z.string().min(1, "Bitte gib die Automarke ein"),
  modell: z.string().min(1, "Bitte gib das Automodell ein"),
  baujahr: z.number().int().gte(1900, "Bitte gib ein gültiges Baujahr ein").lte(new Date().getFullYear() + 1, "Bitte gib ein gültiges Baujahr ein"),
  kilometer: z.number().int().nonnegative("Kilometerstand darf nicht negativ sein"),
  zustand: z.enum(["Top Zustand", "Guter Zustand", "Mäßiger Zustand", "Schlechter Zustand"]),
  message: z.string().max(1000).optional(),
  consent: z.boolean().refine((v) => v === true, {
    message: "DSGVO-Zustimmung ist erforderlich",
  }),
});

export type AnfrageFormValues = z.infer<typeof anfrageSchema>;
