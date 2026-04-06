'use client';

import { AnfrageFormData } from '@/types/anfrage';
import { MARKEN_BELIEBTESTE, MARKEN_ALLE } from '@/constants/marken';
import { MODELLE_PRO_MARKE } from '@/constants/modelle';
import {
  KRAFTSTOFF_OPTIONS,
  SCHADSTOFFKLASSE_OPTIONS,
  GETRIEBE_OPTIONS,
  BAUFORM_OPTIONS,
  TUEREN_OPTIONS,
  HU_JAHR_OPTIONS,
  FARBEN_OPTIONS,
} from '@/constants/formOptions';
import { Input } from '@/components/ui/Input';
import { FieldTooltip } from '@/components/form/FieldTooltip';
import { ChipSelect } from '@/components/ui/ChipSelect';

interface Step1Props {
  data: Partial<AnfrageFormData>;
  onChange: (updates: Partial<AnfrageFormData>) => void;
  errors: Partial<Record<keyof AnfrageFormData, string>>;
}

const MARKEN_SECTIONS = [
  { label: 'Beliebte Marken', items: MARKEN_BELIEBTESTE },
  { label: 'Alle Marken', items: [...MARKEN_ALLE, 'Sonstige'] },
];


const MONTH_LABELS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

const THIS_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [
  ...Array.from({ length: THIS_YEAR - 1949 }, (_, i) => String(THIS_YEAR - i)),
  'Vor 1950',
];

// Hilfsfunktionen für Erstzulassungs-Konvertierung
function jahrToOption(jahr: number | undefined): string {
  if (jahr === undefined) return '';
  if (jahr === 0) return 'Vor 1950';
  return String(jahr);
}
function optionToJahr(opt: string): number | undefined {
  if (!opt) return undefined;
  if (opt === 'Vor 1950') return 0;
  return Number(opt);
}
function monatToOption(monat: number | undefined): string {
  if (!monat) return '';
  return MONTH_LABELS[monat - 1] ?? '';
}
function optionToMonat(opt: string): number | undefined {
  if (!opt) return undefined;
  const idx = MONTH_LABELS.indexOf(opt);
  return idx >= 0 ? idx + 1 : undefined;
}

// HU-Hilfsfunktionen: "März 2026" ↔ zwei separate Felder
const HU_SONDER = ['Abgelaufen', 'Keine HU'];
function huBisToJahr(huBis: string): string {
  if (!huBis) return '';
  if (HU_SONDER.includes(huBis)) return huBis;
  const parts = huBis.split(' ');
  return parts.length === 2 ? parts[1] : huBis;
}
function huBisToMonat(huBis: string): string {
  if (!huBis || HU_SONDER.includes(huBis)) return '';
  const parts = huBis.split(' ');
  return parts.length === 2 ? parts[0] : '';
}
function buildHuBis(jahr: string, monat: string): string {
  if (!jahr) return '';
  if (HU_SONDER.includes(jahr)) return jahr;
  return monat ? `${monat} ${jahr}` : jahr;
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

export function Step1Fahrzeug({ data, onChange, errors }: Step1Props) {
  const isElektro = data.kraftstoff === 'Elektro';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Fahrzeug-Details</h2>
        <p className="mt-1 text-sm text-[#64748B]">Felder ohne <span className="text-[#94A3B8]">(optional)</span> sind Pflichtfelder.</p>
      </div>

      {/* Marke + Modell als Chip-Auswahl */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChipSelect
          label="Marke"
          required
          sections={MARKEN_SECTIONS}
          value={data.marke ?? ''}
          onChange={(v) => onChange({ marke: v, modell: '' })}
          placeholder="Marke eingeben z.B. BMW, VW..."
          rightPanel
          error={errors.marke}
          autoOpen
        />
        <ChipSelect
          label="Modell"
          required
          options={MODELLE_PRO_MARKE[data.marke ?? ''] ?? []}
          value={data.modell ?? ''}
          onChange={(v) => onChange({ modell: v })}
          placeholder="Modell eingeben z.B. Golf, A4..."
          rightPanel
          error={errors.modell}
          emptyHint={!data.marke ? 'Bitte zuerst eine Marke wählen' : undefined}
        />
      </div>

      {/* Erstzulassung: Jahr (Pflicht) + Monat (optional) */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F172A]">
          Erstzulassung
        </span>
        <div className="grid grid-cols-2 gap-4">
          <ChipSelect
            label="Jahr"
            required
            options={YEAR_OPTIONS}
            value={jahrToOption(data.erstzulassungJahr)}
            onChange={(v) => onChange({ erstzulassungJahr: optionToJahr(v) })}
            placeholder="Jahr wählen"
            rightPanel
            error={errors.erstzulassungJahr}
          />
          <ChipSelect
            label="Monat"
            options={MONTH_LABELS}
            value={monatToOption(data.erstzulassungMonat)}
            onChange={(v) => onChange({ erstzulassungMonat: optionToMonat(v) })}
            placeholder="Monat (optional)"
          />
        </div>
      </div>

      {/* Kraftstoff */}
      <ChipSelect
        label="Kraftstoff"
        required
        placeholder="Kraftstoff wählen"
        value={data.kraftstoff ?? ''}
        options={KRAFTSTOFF_OPTIONS}
        error={errors.kraftstoff}
        onChange={(v) => onChange({ kraftstoff: v })}
      />

      {/* Schadstoffklasse – nicht bei Elektro */}
      {!isElektro && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
              Schadstoffklasse
            </label>
            <FieldTooltip text="Zu finden in Feld V.9 Ihres Fahrzeugscheins (Zulassungsbescheinigung Teil I)." />
          </div>
          <ChipSelect
            placeholder="Schadstoffklasse"
            value={data.schadstoffklasse ?? ''}
            options={SCHADSTOFFKLASSE_OPTIONS}
            onChange={(v) => onChange({ schadstoffklasse: v })}
          />
        </div>
      )}

      {/* Leistung + Hubraum (Hubraum entfällt bei Elektro) */}
      <div className={`grid grid-cols-1 gap-4 ${!isElektro ? 'sm:grid-cols-2' : ''}`}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
              Leistung (kW)
            </label>
            <FieldTooltip text="Feld P.2 in Ihrem Fahrzeugschein – bitte kW angeben, nicht PS!" />
          </div>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="z.B. 110"
            min={1}
            value={data.leistungKw ?? ''}
            error={errors.leistungKw}
            onChange={(e) => onChange({ leistungKw: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {!isElektro && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
                Hubraum (ccm)
              </label>
              <FieldTooltip text="Feld P.1 in Ihrem Fahrzeugschein. Optional, aber hilfreich für eine genaue Bewertung." />
            </div>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="z.B. 1968"
              min={1}
              value={data.hubraum ?? ''}
              onChange={(e) =>
                onChange({ hubraum: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>
        )}
      </div>

      {/* Getriebe (entfällt bei Elektro) + Bauform */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {!isElektro && (
          <ChipSelect
            label="Getriebe"
            required
            placeholder="Getriebe wählen"
            value={data.getriebe ?? ''}
            options={GETRIEBE_OPTIONS}
            error={errors.getriebe}
            onChange={(v) => onChange({ getriebe: v })}
          />
        )}
        <ChipSelect
          label="Bauform"
          required
          placeholder="Bauform wählen"
          value={data.bauform ?? ''}
          options={BAUFORM_OPTIONS}
          error={errors.bauform}
          onChange={(v) => onChange({ bauform: v })}
        />
      </div>

      {/* Türen + Sitze */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChipSelect
          label="Türen"
          placeholder="Türen wählen"
          value={data.anzahlTueren ?? ''}
          options={TUEREN_OPTIONS}
          onChange={(v) => onChange({ anzahlTueren: v })}
        />
        <Input
          label="Sitze"
          type="number"
          inputMode="numeric"
          placeholder="z.B. 5"
          min={1}
          max={9}
          value={data.anzahlSitze ?? ''}
          onChange={(e) => onChange({ anzahlSitze: e.target.value ? Number(e.target.value) : undefined })}
        />
      </div>

      {/* Kilometerstand + Fahrzeugfarbe */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Input
            label="Kilometerstand"
            required
            type="number"
            inputMode="numeric"
            placeholder="z.B. 85000"
            min={0}
            value={data.kilometerstand ?? ''}
            error={errors.kilometerstand}
            onChange={(e) => onChange({ kilometerstand: e.target.value ? Number(e.target.value) : undefined })}
          />
          {(data.kilometerstand ?? 0) > 0 && (
            <p className="text-xs text-[#0369A1] mt-0.5">
              = {(data.kilometerstand ?? 0).toLocaleString('de-DE')} km
            </p>
          )}
        </div>
        <ChipSelect
          label="Fahrzeugfarbe"
          placeholder="Farbe wählen"
          value={data.farbe ?? ''}
          options={FARBEN_OPTIONS}
          onChange={(v) => onChange({ farbe: v })}
        />
      </div>

      {/* HU gültig bis: Monat + Jahr in einer Zeile */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0F172A]">
            HU gültig bis
          </span>
          <FieldTooltip text="Aufgedruckt auf dem TÜV-Aufkleber an Ihrem Kennzeichen. Monat/Jahr." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ChipSelect
            label="Monat"
            placeholder="Monat wählen"
            value={huBisToMonat(data.huBis ?? '')}
            options={MONTH_LABELS}
            disabled={HU_SONDER.includes(huBisToJahr(data.huBis ?? ''))}
            onChange={(v) => onChange({ huBis: buildHuBis(huBisToJahr(data.huBis ?? ''), v) })}
          />
          <ChipSelect
            label="Jahr"
            placeholder="Jahr wählen"
            value={huBisToJahr(data.huBis ?? '')}
            options={HU_JAHR_OPTIONS}
            onChange={(v) => onChange({ huBis: buildHuBis(v, HU_SONDER.includes(v) ? '' : huBisToMonat(data.huBis ?? '')) })}
          />
        </div>
        {errors.huBis && <span className="text-xs text-[#EF4444]">{errors.huBis}</span>}
      </div>

      {/* Toggle-Felder */}
      <div className="flex flex-col gap-3">
        <ToggleField
          label="Deutsche Zulassung"
          checked={data.deutscheZulassung ?? true}
          onChange={(v) => onChange({ deutscheZulassung: v })}
        />
        <ToggleField
          label="Fahrzeugpapiere vorhanden"
          checked={data.papiere ?? true}
          onChange={(v) => onChange({ papiere: v })}
        />
        <div className="flex items-center gap-2 rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
          <span className="flex-1 text-[15px] text-[#0F172A]">Fahrzeug noch finanziert?</span>
          <FieldTooltip text="Kein Problem! Wir klären die Ablöse direkt mit Ihrer Bank." />
          <button
            type="button"
            role="switch"
            aria-checked={data.finanziert ?? false}
            onClick={() => onChange({ finanziert: !(data.finanziert ?? false) })}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              (data.finanziert ?? false) ? 'bg-[#0369A1]' : 'bg-[#E2EDF7]',
            ].join(' ')}
          >
            <span
              className={[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out',
                (data.finanziert ?? false) ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step1Fahrzeug;
