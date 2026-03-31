'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [passwort, setPasswort] = useState('')
  const [passwort2, setPasswort2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) setError('Kein gültiger Reset-Link.')
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwort.length < 6) { setError('Mindestens 6 Zeichen.'); return }
    if (passwort !== passwort2) { setError('Passwörter stimmen nicht überein.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard/reset-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, passwort }),
      })
      if (res.ok) {
        setDone(true)
        setTimeout(() => router.push('/dashboard/login'), 2500)
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Fehler beim Speichern.')
      }
    } catch {
      setError('Verbindungsfehler.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0369A1] rounded-2xl mb-4">
            <span className="text-white font-black text-lg">AAB</span>
          </div>
          <h1 className="text-2xl font-black text-white">Neues Passwort</h1>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
          {done ? (
            <div className="text-center">
              <p className="text-white font-bold text-lg mb-2">Passwort gesetzt ✓</p>
              <p className="text-[#64748B] text-sm">Du wirst zum Login weitergeleitet…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">Neues Passwort</label>
                <input
                  type="password"
                  value={passwort}
                  onChange={e => setPasswort(e.target.value)}
                  placeholder="Mindestens 6 Zeichen"
                  required
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#CBD5E1] mb-2">Passwort bestätigen</label>
                <input
                  type="password"
                  value={passwort2}
                  onChange={e => setPasswort2(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all text-sm"
                />
              </div>
              {error && (
                <div className="bg-[#FB6F6F]/10 border border-[#FB6F6F]/30 rounded-xl p-3">
                  <p className="text-sm text-[#FB6F6F]">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#334155] disabled:text-[#64748B] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[52px]"
              >
                {loading ? 'Wird gespeichert...' : 'Passwort speichern'}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-4">
          <Link href="/dashboard/login" className="text-sm text-[#475569] hover:text-[#64748B] transition-colors">
            ← Zurück zum Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
