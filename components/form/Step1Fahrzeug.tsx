'use client';

import { AnfrageFormData } from '@/types/anfrage';
import { MARKEN_BELIEBTESTE, MARKEN_ALLE } from '@/constants/marken';
import {
  KRAFTSTOFF_OPTIONS,
  SCHADSTOFFKLASSE_OPTIONS,
  GETRIEBE_OPTIONS,
  BAUFORM_OPTIONS,
  TUEREN_OPTIONS,
  HU_OPTIONS,
  FARBEN_OPTIONS,
} from '@/constants/formOptions';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FieldTooltip } from '@/components/form/FieldTooltip';

interface Step1Props {
  data: Partial<AnfrageFormData>;
  onChange: (updates: Partial<AnfrageFormData>) => void;
  errors: Partial<Record<keyof AnfrageFormData, string>>;
}

const MONTHS = [
  { value: '1', label: 'Januar' },
  { value: '2', label: 'Februar' },
  { value: '3', label: 'März' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mai' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Dezember' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1949 }, (_, i) => {
  const y = currentYear - i;
  return { value: String(y), label: String(y) };
});

function toOpts(arr: string[]) {
  return arr.map((v) => ({ value: v, label: v }));
}

const SELECT_CLASS = 'form-field';

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

      {/* Marke mit Optgroups + Modell */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
            Marke
          </label>
          <input
            list="marken-list"
            value={data.marke ?? ''}
            onChange={(e) => onChange({ marke: e.target.value })}
            placeholder="Marke tippen oder wählen"
            autoCapitalize="words"
            autoComplete="off"
            className={SELECT_CLASS}
          />
          <datalist id="marken-list">
            {MARKEN_BELIEBTESTE.map((m) => <option key={`b-${m}`} value={m} />)}
            {MARKEN_ALLE.map((m) => <option key={`a-${m}`} value={m} />)}
            <option value="Sonstige" />
          </datalist>
          {errors.marke && <span className="text-xs text-[#EF4444]">{errors.marke}</span>}
        </div>

        <Input
          label="Modell"
          required
          placeholder="z.B. A4, Golf, 3er"
          value={data.modell ?? ''}
          error={errors.modell}
          autoCapitalize="words"
          autoComplete="off"
          onChange={(e) => onChange({ modell: e.target.value })}
        />
      </div>

      {/* Erstzulassung */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Erstzulassung Monat"
          placeholder="Monat"
          value={data.erstzulassungMonat ? String(data.erstzulassungMonat) : ''}
          options={MONTHS}
          onChange={(e) => onChange({ erstzulassungMonat: Number(e.target.value) })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
            Erstzulassung Jahr
          </label>
          <input
            list="jahre-list"
            inputMode="numeric"
            placeholder="z.B. 2018"
            value={data.erstzulassungJahr ? String(data.erstzulassungJahr) : ''}
            onChange={(e) => {
              const v = Number(e.target.value)
              if (!isNaN(v) && v > 0) onChange({ erstzulassungJahr: v })
              else if (e.target.value === '') onChange({ erstzulassungJahr: undefined })
            }}
            className={SELECT_CLASS}
          />
          <datalist id="jahre-list">
            {YEARS.map(y => <option key={y.value} value={y.value} />)}
          </datalist>
          {errors.erstzulassungJahr && (
            <span className="text-xs text-[#EF4444]">{errors.erstzulassungJahr}</span>
          )}
        </div>
      </div>

      {/* Kraftstoff */}
      <Select
        label="Kraftstoff"
        required
        placeholder="Kraftstoff wählen"
        value={data.kraftstoff ?? ''}
        options={toOpts(KRAFTSTOFF_OPTIONS)}
        error={errors.kraftstoff}
        onChange={(e) => onChange({ kraftstoff: e.target.value })}
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
          <Select
            placeholder="Schadstoffklasse"
            value={data.schadstoffklasse ?? ''}
            options={toOpts(SCHADSTOFFKLASSE_OPTIONS)}
            onChange={(e) => onChange({ schadstoffklasse: e.target.value })}
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
            onChange={(e) => onChange({ leistungKw: Number(e.target.value) })}
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
          <Select
            label="Getriebe"
            required
            placeholder="Getriebe wählen"
            value={data.getriebe ?? ''}
            options={toOpts(GETRIEBE_OPTIONS)}
            error={errors.getriebe}
            onChange={(e) => onChange({ getriebe: e.target.value })}
          />
        )}
        <Select
          label="Bauform"
          required
          placeholder="Bauform wählen"
          value={data.bauform ?? ''}
          options={toOpts(BAUFORM_OPTIONS)}
          error={errors.bauform}
          onChange={(e) => onChange({ bauform: e.target.value })}
        />
      </div>

      {/* Türen + Sitze */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Türen"
          placeholder="Türen wählen"
          value={data.anzahlTueren ?? ''}
          options={toOpts(TUEREN_OPTIONS)}
          onChange={(e) => onChange({ anzahlTueren: e.target.value })}
        />
        <Input
          label="Sitze"
          type="number"
          inputMode="numeric"
          placeholder="z.B. 5"
          min={1}
          max={9}
          value={data.anzahlSitze ?? ''}
          onChange={(e) => onChange({ anzahlSitze: Number(e.target.value) })}
        />
      </div>

      {/* HU + Farbe */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
              HU gültig bis
            </label>
            <FieldTooltip text="Aufgedruckt auf dem TÜV-Aufkleber an Ihrem Kennzeichen. Monat/Jahr." />
          </div>
          <Select
            placeholder="HU wählen"
            value={data.huBis ?? ''}
            options={toOpts(HU_OPTIONS)}
            onChange={(e) => onChange({ huBis: e.target.value })}
          />
        </div>
        <Select
          label="Farbe"
          placeholder="Farbe wählen"
          value={data.farbe ?? ''}
          options={toOpts(FARBEN_OPTIONS)}
          onChange={(e) => onChange({ farbe: e.target.value })}
        />
      </div>

      {/* Kilometerstand mit formatierter Anzeige */}
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
          onChange={(e) => onChange({ kilometerstand: Number(e.target.value) })}
        />
        {(data.kilometerstand ?? 0) > 0 && (
          <p className="text-xs text-[#0369A1] mt-0.5">
            = {(data.kilometerstand ?? 0).toLocaleString('de-DE')} km
          </p>
        )}
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
