'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnfrageFormData } from '@/types/anfrage';
import { useFormAutosave, loadFormAutosave } from '@/hooks/useFormAutosave';
import { gtmEvents } from '@/lib/gtm';
import { ProgressBar } from '@/components/form/ProgressBar';
import { Step1Fahrzeug } from '@/components/form/Step1Fahrzeug';
import { Step2Zustand } from '@/components/form/Step2Zustand';
import { Step3Ausstattung } from '@/components/form/Step3Ausstattung';
import { Step4Kontakt } from '@/components/form/Step4Kontakt';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';

type FormErrors = Partial<Record<keyof AnfrageFormData, string>>;

const DEFAULT_DATA: Partial<AnfrageFormData> = {
  deutscheZulassung: true,
  papiere: true,
  finanziert: false,
  roststellen: false,
  maengel: false,
  gewerblich: false,
  abmeldung: false,
  newsletter: false,
  dsgvoAkzeptiert: false,
  ausstattung: [],
  fotos: [],
};

function validateStep(step: number, data: Partial<AnfrageFormData>): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!data.marke) errors.marke = 'Bitte wähle eine Marke aus.';
    if (!data.modell?.trim()) errors.modell = 'Bitte gib ein Modell an.';
    if (!data.erstzulassungJahr) errors.erstzulassungJahr = 'Bitte wähle das Jahr der Erstzulassung.';
    if (!data.kraftstoff) errors.kraftstoff = 'Bitte wähle einen Kraftstoff.';
    if (!data.getriebe && data.kraftstoff !== 'Elektro') errors.getriebe = 'Bitte wähle ein Getriebe.';
    if (!data.bauform) errors.bauform = 'Bitte wähle eine Bauform.';
    if (!data.kilometerstand && data.kilometerstand !== 0)
      errors.kilometerstand = 'Bitte gib den Kilometerstand an.';
  }

  if (step === 2) {
    if (!data.optischerZustand || data.optischerZustand < 1)
      errors.optischerZustand = 'Bitte bewerte den optischen Zustand.';
  }

  if (step === 4) {
    if (!data.vorname?.trim()) errors.vorname = 'Bitte gib deinen Vornamen an.';
    if (!data.nachname?.trim()) errors.nachname = 'Bitte gib deinen Nachnamen an.';
    if (!data.plz?.trim() || data.plz.length < 4) errors.plz = 'Bitte gib eine gültige PLZ an.';
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errors.email = 'Bitte gib eine gültige E-Mail-Adresse an.';
    if (data.kontaktWeg !== 'nur_email' && (!data.telefon?.trim() || data.telefon.length < 5))
      errors.telefon = 'Bitte gib eine Telefonnummer an.';
    if (!data.dsgvoAkzeptiert)
      errors.dsgvoAkzeptiert = 'Bitte stimme den AGB und der Datenschutzerklärung zu.';
  }

  return errors;
}

export function AngebotForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AnfrageFormData>>(DEFAULT_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const formStartedRef = useRef(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Load autosaved data on mount – autosave erst danach aktivieren
  useEffect(() => {
    const saved = loadFormAutosave<AnfrageFormData>();
    if (saved) {
      // Files can't be serialized, so fotos will be empty after load
      setFormData({ ...DEFAULT_DATA, ...saved, fotos: [] });
    }
    setAutosaveEnabled(true);
  }, []);

  // Autosave (exclude File objects which can't be serialized)
  const dataToSave = { ...formData, fotos: [] };
  useFormAutosave(dataToSave, autosaveEnabled);

  const handleChange = (updates: Partial<AnfrageFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    // GTM: fire form_start once on first interaction
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      gtmEvents.form_start({ page: 'fahrzeug-verkaufen' });
    }

    // Clear related errors
    const updatedKeys = Object.keys(updates) as (keyof AnfrageFormData)[];
    setErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      scrollToTop();
      return;
    }

    gtmEvents.form_step_complete({
      step: currentStep,
      step_name: ['Fahrzeug', 'Zustand', 'Ausstattung', 'Kontakt'][currentStep - 1],
    });

    setErrors({});
    setCurrentStep((s) => s + 1);
    scrollToTop();
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(4, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Fotos in Base64 konvertieren
      const fotoBase64: string[] = await Promise.all(
        (formData.fotos ?? []).map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );

      const payload = {
        ...formData,
        fotos: fotoBase64,
        erstzulassungMonat: formData.erstzulassungMonat ?? 1,
        erstzulassungJahr: formData.erstzulassungJahr ?? new Date().getFullYear(),
        schadstoffklasse: formData.schadstoffklasse ?? 'Keine',
        leistungKw: formData.leistungKw ?? 0,
        getriebe: formData.getriebe ?? (formData.kraftstoff === 'Elektro' ? 'Automatik' : ''),
        bauform: formData.bauform ?? '',
        anzahlTueren: formData.anzahlTueren ?? '4/5',
        anzahlSitze: formData.anzahlSitze ?? 5,
        huBis: formData.huBis ?? 'Keine HU',
        farbe: formData.farbe ?? 'Andere',
        kilometerstand: formData.kilometerstand ?? 0,
        unfallfahrzeug: formData.unfallfahrzeug ?? 'Nein, kein Unfallfahrzeug',
        fahrbereitschaft: formData.fahrbereitschaft ?? 'Ja, voll fahrbereit',
        verkaufszeitpunkt: formData.verkaufszeitpunkt ?? 'Ich bin noch unentschlossen',
        ausstattung: formData.ausstattung ?? [],
      };

      const res = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('API error:', err);
        alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
        return;
      }

      gtmEvents.form_complete({
        marke: formData.marke ?? '',
        plz: formData.plz ?? '',
        zeitpunkt: formData.verkaufszeitpunkt ?? '',
      });

      const params = new URLSearchParams({
        vorname: formData.vorname ?? '',
        marke: formData.marke ?? '',
        modell: formData.modell ?? '',
        kontaktWeg: formData.kontaktWeg ?? 'email_telefon',
      });

      window.scrollTo({ top: 0, behavior: 'instant' });
      router.push(`/danke?${params.toString()}`);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const STEP_NAMES = ['Fahrzeug', 'Zustand', 'Ausstattung', 'Kontakt'];

  return (
    <div ref={formRef} className="max-w-[760px] mx-auto">
      <div className="bg-white rounded-[20px] shadow-sm border border-[#E2EDF7]">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={4} />

        {/* Form Content */}
        <div className="px-6 pb-6 sm:px-10 sm:pb-10">
          {currentStep === 1 && (
            <Step1Fahrzeug data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 2 && (
            <Step2Zustand data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 3 && (
            <Step3Ausstattung data={formData} onChange={handleChange} errors={errors} />
          )}
          {currentStep === 4 && (
            <Step4Kontakt data={formData} onChange={handleChange} errors={errors} />
          )}

          {/* Navigation */}
          <div className={`mt-8 border-t border-[#E2EDF7] pt-6 ${currentStep === 4 ? 'flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between' : 'flex items-center justify-between gap-4'}`}>
            {currentStep > 1 ? (
              <Button variant="outline" size="lg" onClick={handleBack} type="button" className={currentStep === 4 ? 'w-full sm:w-auto' : ''}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-2 h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                    clipRule="evenodd"
                  />
                </svg>
                Zurück
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button variant="primary" size="lg" onClick={handleNext} type="button">
                Weiter zu{' '}
                {STEP_NAMES[currentStep]}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="ml-2 h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                variant="coral"
                size="lg"
                onClick={handleSubmit}
                loading={isSubmitting}
                type="button"
                className="w-full sm:w-auto sm:min-w-[240px]"
              >
                <Send size={17} strokeWidth={2.5} className="mr-2" />
                Jetzt kostenlos Angebot anfordern
              </Button>
            )}
          </div>

          {/* Submit hint */}
          {currentStep === 4 && (
            <p className="mt-3 text-center text-xs text-[#64748B]">
              ✓ Kostenlos &nbsp;·&nbsp; ✓ Unverbindlich &nbsp;·&nbsp; ✓ Angebot in 2–3 Std.*
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AngebotForm;
