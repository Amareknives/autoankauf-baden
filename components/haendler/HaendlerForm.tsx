'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { gtmEvents } from '@/lib/gtm'

const schema = z.object({
  firma: z.string().min(2, 'Bitte Firma eintragen'),
  vorname: z.string().min(2, 'Bitte Vorname eintragen'),
  nachname: z.string().min(2, 'Bitte Nachname eintragen'),
  telefon: z.string().min(6, 'Bitte Telefonnummer eintragen'),
  email: z.string().email('Bitte gültige E-Mail eintragen'),
  fahrzeugAnzahl: z.string().min(1, 'Bitte Anzahl angeben'),
  nachricht: z.string().optional(),
  datenschutz: z.boolean().refine(v => v === true, 'Datenschutz muss akzeptiert werden'),
})

type FormData = z.infer<typeof schema>

export default function HaendlerForm() {
  const [gesendet, setGesendet] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/haendler-anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Fehler beim Senden')

      gtmEvents.haendler_form_complete({ fahrzeugAnzahl: data.fahrzeugAnzahl })
      setGesendet(true)
    } catch {
      toast.error('Etwas ist schiefgelaufen. Bitte versuche es erneut.')
    }
  }

  if (gesendet) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2EDF7] p-8 text-center">
        <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Danke für deine Anfrage!</h3>
        <p className="text-sm text-[#64748B]">
          Wir melden uns innerhalb von 24–48 Stunden bei dir und freuen uns auf eine mögliche Zusammenarbeit.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2EDF7] p-6 md:p-8">
      <h2 className="text-lg font-bold text-[#0F172A] mb-1">Kooperation anfragen</h2>
      <p className="text-sm text-[#64748B] mb-6">
        Kein Druck, kein Mindestumsatz – wir reden einfach und schauen, was passt.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Firma */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Firma / Unternehmen <span className="text-[#FB6F6F]">*</span>
          </label>
          <input
            {...register('firma')}
            type="text"
            placeholder="Mustermann GmbH"
            autoComplete="organization"
            autoCapitalize="words"
            className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all"
          />
          {errors.firma && (
            <p className="text-xs text-[#FB6F6F] mt-1">{errors.firma.message}</p>
          )}
        </div>

        {/* Vorname + Nachname */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Vorname <span className="text-[#FB6F6F]">*</span>
            </label>
            <input
              {...register('vorname')}
              type="text"
              placeholder="Max"
              autoComplete="given-name"
              autoCapitalize="words"
              className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all"
            />
            {errors.vorname && (
              <p className="text-xs text-[#FB6F6F] mt-1">{errors.vorname.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Nachname <span className="text-[#FB6F6F]">*</span>
            </label>
            <input
              {...register('nachname')}
              type="text"
              placeholder="Mustermann"
              autoComplete="family-name"
              autoCapitalize="words"
              className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all"
            />
            {errors.nachname && (
              <p className="text-xs text-[#FB6F6F] mt-1">{errors.nachname.message}</p>
            )}
          </div>
        </div>

        {/* Telefon + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              Telefon <span className="text-[#FB6F6F]">*</span>
            </label>
            <input
              {...register('telefon')}
              type="tel"
              placeholder="+49 7251 ..."
              autoComplete="tel"
              inputMode="tel"
              className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all"
            />
            {errors.telefon && (
              <p className="text-xs text-[#FB6F6F] mt-1">{errors.telefon.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              E-Mail <span className="text-[#FB6F6F]">*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="info@firma.de"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all"
            />
            {errors.email && (
              <p className="text-xs text-[#FB6F6F] mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Fahrzeuge pro Woche */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Fahrzeuge pro Woche (ca.) <span className="text-[#FB6F6F]">*</span>
          </label>
          <select
            {...register('fahrzeugAnzahl')}
            className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all bg-white"
          >
            <option value="">Bitte wählen</option>
            <option value="1">1 Fahrzeug</option>
            <option value="2-3">2–3 Fahrzeuge</option>
            <option value="4-5">4–5 Fahrzeuge</option>
            <option value="mehr-als-5">Mehr als 5 Fahrzeuge</option>
            <option value="unregelmäßig">Unregelmäßig / nach Bedarf</option>
          </select>
          {errors.fahrzeugAnzahl && (
            <p className="text-xs text-[#FB6F6F] mt-1">{errors.fahrzeugAnzahl.message}</p>
          )}
        </div>

        {/* Nachricht */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
            Nachricht (optional)
          </label>
          <textarea
            {...register('nachricht')}
            rows={3}
            placeholder="z.B. welche Fahrzeugtypen du anbietest, ob auch Unfallwagen dabei sind, wie regelmäßig du verkaufen möchtest..."
            autoCapitalize="sentences"
            autoCorrect="on"
            className="w-full px-4 py-3 border border-[#E2EDF7] rounded-xl text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all resize-y min-h-[80px]"
          />
        </div>

        {/* Datenschutz */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              {...register('datenschutz')}
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-[#E2EDF7] text-[#0369A1] focus:ring-[#0369A1]"
            />
            <span className="text-xs text-[#64748B] leading-relaxed">
              Ich habe die{' '}
              <a href="/agb" className="text-[#0369A1] hover:underline" target="_blank" rel="noopener noreferrer">
                AGB
              </a>{' '}
              und die{' '}
              <a href="/datenschutz" className="text-[#0369A1] hover:underline" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung
              </a>{' '}
              gelesen und stimme diesen zu. <span className="text-[#FB6F6F]">*</span>
            </span>
          </label>
          {errors.datenschutz && (
            <p className="text-xs text-[#FB6F6F] mt-1">{errors.datenschutz.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#94A3B8] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[52px]"
        >
          {isSubmitting ? 'Wird gesendet...' : 'Anfrage absenden'}
        </button>
      </form>
    </div>
  )
}
