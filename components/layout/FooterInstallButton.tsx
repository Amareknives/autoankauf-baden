'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState = 'hidden' | 'android' | 'ios' | 'installed'

export function FooterInstallButton() {
  const [state, setState] = useState<InstallState>('hidden')
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosHint, setShowIosHint] = useState(false)

  useEffect(() => {
    // Bereits als PWA geöffnet → nicht anzeigen
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // iOS Safari erkennen
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)

    if (isIos && isSafari) {
      setState('ios')
      return
    }

    // Android / Chrome / Desktop
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setState('android')
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setState('installed'))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (state === 'hidden' || state === 'installed') return null

  if (state === 'ios') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowIosHint((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
          aria-label="App auf dem iPhone installieren"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16" />
          </svg>
          App installieren
        </button>

        {showIosHint && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowIosHint(false)}
            />
            {/* Tooltip */}
            <div className="absolute bottom-8 right-0 z-50 w-64 rounded-xl bg-white text-[#0F172A] shadow-2xl p-4">
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 shadow-sm" />
              <p className="text-xs font-semibold mb-2 text-[#0369A1]">App auf iPhone installieren</p>
              <ol className="text-xs text-[#334155] space-y-1.5 leading-relaxed">
                <li>
                  <span className="font-medium">1.</span> Tippe auf das{' '}
                  <span className="font-semibold">Teilen-Symbol</span>{' '}
                  <span className="inline-block">
                    <svg className="w-3.5 h-3.5 inline -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </span>{' '}
                  unten in Safari
                </li>
                <li>
                  <span className="font-medium">2.</span> Wähle{' '}
                  <span className="font-semibold">„Zum Home-Bildschirm"</span>
                </li>
                <li>
                  <span className="font-medium">3.</span> Tippe auf{' '}
                  <span className="font-semibold">„Hinzufügen"</span>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
    )
  }

  // Android / Chrome
  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setState('installed')
  }

  return (
    <button
      onClick={handleInstall}
      className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors duration-200"
      aria-label="App installieren"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16" />
      </svg>
      App installieren
    </button>
  )
}
