'use client';

import { AnfrageFormData } from '@/types/anfrage';
import { Input } from '@/components/ui/Input';
import { FieldTooltip } from '@/components/form/FieldTooltip';
import { PlzRegionCheck } from '@/components/form/PlzRegionCheck';
import Link from 'next/link';

interface Step4Props {
  data: Partial<AnfrageFormData>;
  onChange: (updates: Partial<AnfrageFormData>) => void;
  errors: Partial<Record<keyof AnfrageFormData, string>>;
}

export function Step4Kontakt({ data, onChange, errors }: Step4Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A]">Kontaktdaten</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Wir melden uns innerhalb von 2–3 Stunden* persönlich mit deinem Angebot.
        </p>
        <p className="mt-0.5 text-[11px] text-[#94A3B8]">
          *Werktags 7:30–18:30 Uhr · Samstag 8–15 Uhr
        </p>
      </div>

      {/* Vorname + Nachname */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Vorname"
          required
          placeholder="Max"
          autoComplete="given-name"
          autoCapitalize="words"
          value={data.vorname ?? ''}
          error={errors.vorname}
          onChange={(e) => onChange({ vorname: e.target.value })}
        />
        <Input
          label="Nachname"
          required
          placeholder="Mustermann"
          autoComplete="family-name"
          autoCapitalize="words"
          value={data.nachname ?? ''}
          error={errors.nachname}
          onChange={(e) => onChange({ nachname: e.target.value })}
        />
      </div>

      {/* PLZ + Region Check */}
      <div className="flex flex-col gap-2">
        <Input
          label="PLZ"
          required
          placeholder="76131"
          maxLength={5}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="postal-code"
          value={data.plz ?? ''}
          error={errors.plz}
          onChange={(e) => onChange({ plz: e.target.value })}
        />
        <PlzRegionCheck plz={data.plz ?? ''} />
      </div>

      {/* E-Mail */}
      <Input
        label="E-Mail-Adresse"
        required
        type="email"
        placeholder="max@beispiel.de"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        value={data.email ?? ''}
        error={errors.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />

      {/* Kontaktpräferenz */}
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
          Wie sollen wir dich kontaktieren?
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {([
            { value: 'email_telefon', label: 'E-Mail + Telefonanruf', sub: 'Wir rufen dich an' },
            { value: 'nur_email',     label: 'Nur per E-Mail',         sub: 'Kein Anruf von uns' },
          ] as const).map(opt => (
            <label
              key={opt.value}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors duration-150',
                (data.kontaktWeg ?? 'email_telefon') === opt.value
                  ? 'border-[#0369A1] bg-[#EFF6FF]'
                  : 'border-[#E2EDF7] bg-white hover:border-[#0369A1]',
              ].join(' ')}
            >
              <input
                type="radio"
                name="kontaktWeg"
                value={opt.value}
                checked={(data.kontaktWeg ?? 'email_telefon') === opt.value}
                onChange={() => onChange({ kontaktWeg: opt.value })}
                className="sr-only"
              />
              <span className={[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                (data.kontaktWeg ?? 'email_telefon') === opt.value
                  ? 'border-[#0369A1] bg-[#0369A1]'
                  : 'border-[#CBD5E1] bg-white',
              ].join(' ')}>
                {(data.kontaktWeg ?? 'email_telefon') === opt.value && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span>
                <span className="text-sm font-medium text-[#0F172A]">{opt.label}</span>
                <span className="block text-xs text-[#64748B]">{opt.sub}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Telefon — nur wenn E-Mail + Telefon gewählt */}
      {(data.kontaktWeg ?? 'email_telefon') === 'email_telefon' && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wide">
              Telefonnummer
            </label>
            <FieldTooltip text="Wir rufen dich an, um dein persönliches Angebot zu besprechen. Kein Spam, versprochen!" />
          </div>
          <Input
            type="tel"
            placeholder="+49 721 123456"
            autoComplete="tel"
            inputMode="tel"
            value={data.telefon ?? ''}
            error={errors.telefon}
            onChange={(e) => onChange({ telefon: e.target.value })}
          />
        </div>
      )}

      {/* Gewerblich */}
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
          <span className="text-[15px] text-[#0F172A]">Gewerblicher Verkauf</span>
          <button
            type="button"
            role="switch"
            aria-checked={data.gewerblich ?? false}
            onClick={() => onChange({ gewerblich: !(data.gewerblich ?? false) })}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              (data.gewerblich ?? false) ? 'bg-[#0369A1]' : 'bg-[#E2EDF7]',
            ].join(' ')}
          >
            <span
              className={[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ease-in-out',
                (data.gewerblich ?? false) ? 'translate-x-5' : 'translate-x-0',
              ].join(' ')}
            />
          </button>
        </label>
        {data.gewerblich && (
          <Input
            label="Firmenname"
            placeholder="Ihre Firma GmbH"
            value={data.firmenname ?? ''}
            onChange={(e) => onChange({ firmenname: e.target.value })}
          />
        )}
      </div>

      {/* Newsletter */}
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
        <input
          type="checkbox"
          className="sr-only"
          checked={data.newsletter ?? false}
          onChange={() => onChange({ newsletter: !(data.newsletter ?? false) })}
        />
        <span
          className={[
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-150 pointer-events-none',
            (data.newsletter ?? false)
              ? 'border-[#0369A1] bg-[#0369A1]'
              : 'border-[#CBD5E1] bg-white',
          ].join(' ')}
        >
          {(data.newsletter ?? false) && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-3.5 w-3.5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          )}
        </span>
        <span className="text-[14px] text-[#64748B]">
          Ich möchte gelegentlich Tipps &amp; Angebote per E-Mail erhalten. (optional)
        </span>
      </label>

      {/* DSGVO + AGB – PFLICHT, niemals vorausgefüllt */}
      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E2EDF7] bg-white px-4 py-3 hover:border-[#0369A1] transition-colors duration-150">
          <input
            type="checkbox"
            className="sr-only"
            checked={data.dsgvoAkzeptiert ?? false}
            onChange={() => onChange({ dsgvoAkzeptiert: !(data.dsgvoAkzeptiert ?? false) })}
          />
          <span
            className={[
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-150 pointer-events-none',
              (data.dsgvoAkzeptiert ?? false)
                ? 'border-[#0369A1] bg-[#0369A1]'
                : errors.dsgvoAkzeptiert
                ? 'border-[#EF4444] bg-white'
                : 'border-[#CBD5E1] bg-white',
            ].join(' ')}
          >
            {(data.dsgvoAkzeptiert ?? false) && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            )}
          </span>
          <span className="text-[14px] text-[#0F172A]">
            Ich habe die{' '}
            <Link href="/agb" target="_blank" className="text-[#0369A1] underline hover:text-[#025d8f]">
              AGB
            </Link>{' '}
            und{' '}
            <Link href="/datenschutz" target="_blank" className="text-[#0369A1] underline hover:text-[#025d8f]">
              Datenschutzerklärung
            </Link>{' '}
            gelesen und stimme zu.{' '}
            <span className="text-[#EF4444]">*</span>
          </span>
        </label>
        {errors.dsgvoAkzeptiert && (
          <span className="text-xs text-[#EF4444]">{errors.dsgvoAkzeptiert}</span>
        )}
      </div>
    </div>
  );
}

export default Step4Kontakt;
