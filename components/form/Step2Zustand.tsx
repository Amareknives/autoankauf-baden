'use client';

import { AnfrageFormData } from '@/types/anfrage';
import {
  UNFALLFAHRZEUG_OPTIONS,
  FAHRBEREITSCHAFT_OPTIONS,
  VERKAUFSZEITPUNKT_OPTIONS,
} from '@/constants/formOptions';
import { StarRating } from '@/components/ui/StarRating';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { FieldTooltip } from '@/components/form/FieldTooltip';

interface Step2Props {
  data: Partial<AnfrageFormData>;
  onChange: (updates: Partial<AnfrageFormData>) => void;
  errors: Partial<Record<keyof AnfrageFormData, string>>;
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
      <span className="text-[15px] text-[#0F172A]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          checked ? 'bg-[#0369A1]' : 'bg-[#E2EDF7]',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </label>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  required,
  error,
  beschreibungen,
  infoText,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
  /** Optionale Kurzbeschreibung pro Option: Record<optionValue, beschreibung> */
  beschreibungen?: Record<string, string>;
  /** Optionaler Erklärungstext unter dem Label */
  infoText?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
        {label}
        {!required && <span className="text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>}
      </span>
      {infoText && (
        <p className="text-[12px] text-[#64748B] leading-relaxed -mt-1 flex items-start gap-1.5">
          <span className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E8F4FD] text-[#0369A1] text-[9px] font-bold mt-0.5">i</span>
          {infoText}
        </p>
      )}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={[
              'flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-all duration-150',
              value === opt
                ? 'border-[#0369A1] bg-[#F0F7FF]'
                : 'border-[#E2EDF7] bg-white hover:border-[#0369A1]',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 mt-0.5',
                value === opt ? 'border-[#0369A1]' : 'border-[#CBD5E1]',
              ].join(' ')}
            >
              {value === opt && (
                <span className="h-2 w-2 rounded-full bg-[#0369A1]" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[15px] text-[#0F172A] leading-snug">{opt}</span>
              {beschreibungen?.[opt] && (
                <p className="text-[12px] text-[#94A3B8] mt-0.5 leading-relaxed">{beschreibungen[opt]}</p>
              )}
            </div>
            <input
              type="radio"
              className="sr-only"
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
          </label>
        ))}
      </div>
      {error && <span className="text-xs text-[#EF4444]">{error}</span>}
    </div>
  );
}

export function Step2Zustand({ data, onChange, errors }: Step2Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Fahrzeug-Zustand</h2>
        <p className="mt-1 text-sm text-[#64748B]">Je mehr Details, desto besser unser Angebot.</p>
      </div>

      {/* Optischer Zustand */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
          Optischer Zustand
        </span>
        <StarRating
          value={data.optischerZustand ?? 0}
          onChange={(v) => onChange({ optischerZustand: v })}
        />
        {errors.optischerZustand && (
          <span className="text-xs text-[#EF4444]">{errors.optischerZustand}</span>
        )}
      </div>

      {/* Unfallfahrzeug */}
      <RadioGroup
        label="Unfallfahrzeug"
        options={UNFALLFAHRZEUG_OPTIONS}
        value={data.unfallfahrzeug ?? ''}
        onChange={(v) => onChange({ unfallfahrzeug: v })}
        infoText="Bezieht sich auf die gesamte Fahrzeughistorie — auch bei früheren Vorbesitzern."
        beschreibungen={{
          'Nein, kein Unfallfahrzeug':
            'Weder du noch frühere Vorbesitzer hatten einen registrierten Unfall mit diesem Fahrzeug.',
          'Ja, Unfallfahrzeug (repariert)':
            'Das Fahrzeug hatte einen oder mehrere Unfälle, die fachgerecht und ordnungsgemäß repariert wurden.',
          'Ja, Unfallfahrzeug (nicht repariert)':
            'Das Fahrzeug hatte Unfälle, die bisher nicht oder nicht vollständig behoben wurden.',
        }}
      />

      {/* Fahrbereitschaft */}
      <RadioGroup
        label="Fahrbereitschaft"
        options={FAHRBEREITSCHAFT_OPTIONS}
        value={data.fahrbereitschaft ?? ''}
        onChange={(v) => onChange({ fahrbereitschaft: v })}
      />

      {/* Roststellen */}
      <ToggleField
        label="Roststellen vorhanden"
        checked={data.roststellen ?? false}
        onChange={(v) => onChange({ roststellen: v })}
      />

      {/* Mängel */}
      <div className="flex flex-col gap-2">
        <ToggleField
          label="Technische Mängel vorhanden"
          checked={data.maengel ?? false}
          onChange={(v) => onChange({ maengel: v })}
        />
        {data.maengel && (
          <Textarea
            label="Mängel beschreiben"
            placeholder="Bitte beschreiben Sie die Mängel so genau wie möglich..."
            value={data.maengelText ?? ''}
            onChange={(e) => onChange({ maengelText: e.target.value })}
          />
        )}
      </div>

      {/* Gewerblich */}
      <div className="flex flex-col gap-2">
        <ToggleField
          label="Gewerblicher Verkauf"
          checked={data.gewerblich ?? false}
          onChange={(v) => onChange({ gewerblich: v })}
        />
        {data.gewerblich && (
          <Input
            label="Firmenname"
            placeholder="Ihre Firma GmbH"
            value={data.firmenname ?? ''}
            onChange={(e) => onChange({ firmenname: e.target.value })}
          />
        )}
      </div>

      {/* Fotos */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide flex items-center gap-1.5">
          Fotos hochladen
          <span className="text-[10px] font-normal normal-case tracking-normal text-[#94A3B8]">(optional)</span>
        </span>
        <p className="text-[12px] text-[#64748B] leading-relaxed -mt-1 flex items-start gap-1.5">
          <span className="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#E8F4FD] text-[#0369A1] text-[9px] font-bold mt-0.5">i</span>
          Fotos sind nicht erforderlich — helfen uns aber, ein besseres Angebot zu erstellen.
        </p>
        <div className="rounded-lg bg-[#FFF7ED] border border-[#FED7AA] px-4 py-2.5">
          <p className="text-xs text-[#92400E]">
            <span className="font-semibold">Tipp:</span> Mehr Fotos = besseres Angebot! Bis zu 8 Bilder, je max. 8 MB. Bitte keine Personen auf den Bildern.
          </p>
        </div>
        <FileDropzone
          files={data.fotos ?? []}
          onFilesChange={(files) => onChange({ fotos: files })}
          maxFiles={8}
          maxSizeMB={8}
        />
      </div>

      {/* Preisvorstellung */}
      <Input
        label="Preisvorstellung"
        placeholder="z.B. 8500"
        type="text"
        value={data.preisvorstellung ?? ''}
        onChange={(e) => onChange({ preisvorstellung: e.target.value })}
      />

      {/* Verkaufszeitpunkt */}
      <RadioGroup
        label="Wann möchten Sie verkaufen?"
        options={VERKAUFSZEITPUNKT_OPTIONS}
        value={data.verkaufszeitpunkt ?? ''}
        onChange={(v) => onChange({ verkaufszeitpunkt: v })}
      />

      {/* Abmeldung */}
      <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
        <span className="flex items-center gap-1.5 text-[15px] text-[#0F172A]">
          Ich kümmere mich selbst um die Abmeldung
          <FieldTooltip text="Kein Problem, wenn nicht – wir übernehmen die Abmeldung kostenlos für dich!" />
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={data.abmeldung ?? false}
          onClick={() => onChange({ abmeldung: !(data.abmeldung ?? false) })}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            (data.abmeldung ?? false) ? 'bg-[#0369A1]' : 'bg-[#E2EDF7]',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out',
              (data.abmeldung ?? false) ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </label>

      {/* Weitere Infos */}
      <Textarea
        label="Weitere Informationen"
        placeholder="Alles was uns noch helfen könnte, z.B. Standort, Besonderheiten..."
        value={data.weitereInfos ?? ''}
        onChange={(e) => onChange({ weitereInfos: e.target.value })}
      />
    </div>
  );
}

export default Step2Zustand;
