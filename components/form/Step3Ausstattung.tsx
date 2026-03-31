'use client';

import { AnfrageFormData } from '@/types/anfrage';
import { AUSSTATTUNG_GRUPPEN } from '@/constants/formOptions';
import { Textarea } from '@/components/ui/Textarea';

interface Step3Props {
  data: Partial<AnfrageFormData>;
  onChange: (updates: Partial<AnfrageFormData>) => void;
  errors: Partial<Record<keyof AnfrageFormData, string>>;
}

export function Step3Ausstattung({ data, onChange }: Step3Props) {
  const selected = data.ausstattung ?? [];

  const toggle = (item: string) => {
    if (selected.includes(item)) {
      onChange({ ausstattung: selected.filter((s) => s !== item) });
    } else {
      onChange({ ausstattung: [...selected, item] });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Ausstattung</h2>
        <p className="mt-1 text-sm text-[#64748B]">Wähle alle vorhandenen Extras aus.</p>
      </div>

      {/* Hinweis-Banner */}
      <div className="flex items-start gap-3 rounded-lg bg-[#F0F7FF] border border-[#BAE0F9] px-4 py-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#0369A1"
          className="h-5 w-5 shrink-0 mt-0.5"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-[#0369A1]">
          Gut ausgestattete Fahrzeuge erzielen einen besseren Preis! Bitte nur vorhandene Extras
          ankreuzen.
        </p>
      </div>

      {/* Ausstattungs-Gruppen */}
      {Object.entries(AUSSTATTUNG_GRUPPEN).map(([gruppenName, items]) => (
        <div key={gruppenName} className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2EDF7] pb-2">
            {gruppenName}
          </h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((item) => {
              const isChecked = selected.includes(item);
              return (
                <label
                  key={item}
                  className={[
                    'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-150',
                    isChecked
                      ? 'border-[#0369A1] bg-[#F0F7FF]'
                      : 'border-[#E2EDF7] bg-white hover:border-[#0369A1] hover:bg-[#F8FAFC]',
                  ].join(' ')}
                >
                  {/* Custom Checkbox */}
                  <span
                    className={[
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-150',
                      isChecked
                        ? 'border-[#0369A1] bg-[#0369A1]'
                        : 'border-[#CBD5E1] bg-white',
                    ].join(' ')}
                  >
                    {isChecked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="white"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggle(item)}
                  />
                  <span className="text-[14px] text-[#0F172A] leading-tight">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Zusammenfassung */}
      {selected.length > 0 && (
        <div className="rounded-lg bg-[#F0FDF4] border border-[#86EFAC] px-4 py-3">
          <p className="text-xs font-semibold text-[#166534]">
            {selected.length} Extra{selected.length !== 1 ? 's' : ''} ausgewählt
          </p>
        </div>
      )}

      {/* Sonstige Besonderheiten */}
      <Textarea
        label="Sonstige Besonderheiten / Ausstattung (optional)"
        placeholder="z.B. Originalfelgen, Sonderlackierung, Anhängerkupplung, Standheizung..."
        value={data.sonstigeAusstattung ?? ''}
        onChange={(e) => onChange({ sonstigeAusstattung: e.target.value })}
      />
    </div>
  );
}

export default Step3Ausstattung;
