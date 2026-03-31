'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error || 'Anmeldung fehlgeschlagen')
      }
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    }

    setLoading(false)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetLoading(true)
    try {
      await fetch('/api/dashboard/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      setResetSent(true)
    } catch {
      setResetSent(true) // Keine Fehlermeldung — kein Hinweis ob E-Mail existiert
    }
    setResetLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0369A1] rounded-2xl mb-4">
            <span className="text-white font-black text-lg">AAB</span>
          </div>
          <h1 className="text-2xl font-black text-white">Dashboard Login</h1>
          <p className="text-[#64748B] text-sm mt-1">Nur für Administratoren</p>
        </div>

        {!showReset ? (
          <>
            {/* Login-Formular */}
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@autoankauf-baden.de"
                    required
                    className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                    Passwort
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#334155] disabled:text-[#64748B] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[52px]"
                >
                  {loading ? 'Anmeldung läuft...' : 'Anmelden'}
                </button>
              </form>

              <button
                onClick={() => { setShowReset(true); setResetEmail(email) }}
                className="w-full mt-4 text-sm text-[#475569] hover:text-[#64748B] transition-colors text-center"
              >
                Passwort vergessen?
              </button>
            </div>
          </>
        ) : (
          /* Reset-Formular */
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8">
            {!resetSent ? (
              <>
                <h2 className="text-white font-bold text-lg mb-1">Passwort zurücksetzen</h2>
                <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
                  Gib deine E-Mail-Adresse ein. Falls ein Konto existiert, senden wir dir ein temporäres Passwort.
                </p>
                <form onSubmit={handleReset} className="space-y-4" noValidate>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="deine@email.de"
                    required
                    className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-white placeholder:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#0369A1] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] disabled:bg-[#334155] disabled:text-[#64748B] text-white font-bold rounded-xl transition-colors duration-200 text-sm min-h-[52px]"
                  >
                    {resetLoading ? 'Wird gesendet...' : 'Temporäres Passwort senden'}
                  </button>
                </form>
                <button
                  onClick={() => setShowReset(false)}
                  className="w-full mt-4 text-sm text-[#475569] hover:text-[#64748B] transition-colors text-center"
                >
                  ← Zurück zum Login
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0369A1]/20 rounded-2xl mb-3">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <h2 className="text-white font-bold text-lg">E-Mail gesendet</h2>
                  <p className="text-[#64748B] text-sm mt-2 leading-relaxed">
                    Falls ein Konto mit dieser E-Mail existiert, wurde ein temporäres Passwort verschickt. Bitte prüfe deinen Posteingang.
                  </p>
                </div>
                <button
                  onClick={() => { setShowReset(false); setResetSent(false) }}
                  className="w-full py-3.5 bg-[#0369A1] hover:bg-[#0284c7] text-white font-bold rounded-xl transition-colors duration-200 text-sm"
                >
                  Zurück zum Login
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#475569] hover:text-[#64748B] transition-colors">
            ← Zurück zur Website
          </Link>
        </div>
      </div>
    </div>
  )
}
