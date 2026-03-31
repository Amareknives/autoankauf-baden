'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { DashboardStats } from '@/types/dashboard'
import { Inbox, BarChart2, ClipboardList, Calendar, Archive, Handshake } from 'lucide-react'

interface StatCard {
  label: string
  value: number | string
  sub: string | null
  icon: ReactNode
  color: string
  bg: string
  href: string | null
}

interface AnfragePreview {
  id: string
  vorname: string
  nachname: string
  marke: string
  modell: string
  status: string
  createdAt: string
  plz: string
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  neu:              { label: 'Neu',              bg: 'bg-blue-100',    text: 'text-blue-800' },
  kontaktiert:      { label: 'Kontaktiert',      bg: 'bg-yellow-100',  text: 'text-yellow-800' },
  angebot_gesendet: { label: 'Angebot gesendet', bg: 'bg-purple-100',  text: 'text-purple-800' },
  termin_vereinbart:{ label: 'Termin vereinbart',bg: 'bg-green-100',   text: 'text-green-800' },
  abgeschlossen:    { label: 'Abgeschlossen',    bg: 'bg-emerald-100', text: 'text-emerald-800' },
  abgelehnt:        { label: 'Abgelehnt',        bg: 'bg-red-100',     text: 'text-red-800' },
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentAnfragen, setRecentAnfragen] = useState<AnfragePreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, anfragenRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/anfragen?limit=5'),
        ])
        if (statsRes.ok) setStats(await statsRes.json() as DashboardStats)
        if (anfragenRes.ok) {
          const data = await anfragenRes.json() as { anfragen: AnfragePreview[] }
          setRecentAnfragen(data.anfragen)
        }
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const statCards: StatCard[] = [
    { label: 'Neue Anfragen heute', value: stats?.neueHeuteCount ?? 0, sub: null, icon: <Inbox size={22} strokeWidth={2.5} />, color: 'text-[#0369A1]', bg: 'bg-[#E8F4FD]', href: '/dashboard/anfragen' },
    { label: 'Anfragen diese Woche', value: stats?.wocheCount ?? 0, sub: stats?.wocheTrend ? `${stats.wocheTrend > 0 ? '+' : ''}${stats.wocheTrend}% zur Vorwoche` : null, icon: <BarChart2 size={22} strokeWidth={2.5} />, color: 'text-[#0369A1]', bg: 'bg-[#E8F4FD]', href: null },
    { label: 'Offene Angebote', value: stats?.offeneAngebotsCount ?? 0, sub: null, icon: <ClipboardList size={22} strokeWidth={2.5} />, color: 'text-[#FB6F6F]', bg: 'bg-[#FFE4E4]', href: null },
    { label: 'Termine diese & nächste Woche', value: loading ? '–' : `${stats?.termineWocheCount ?? 0} | ${stats?.termineNaechsteWocheCount ?? 0}`, sub: 'diese | nächste', icon: <Calendar size={22} strokeWidth={2.5} />, color: 'text-[#16A34A]', bg: 'bg-[#DCFCE7]', href: '/dashboard/termine' },
    { label: 'Händleranfragen (14 Tage)', value: stats?.haendlerAnfragen14TageCount ?? 0, sub: null, icon: <Handshake size={22} strokeWidth={2.5} />, color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]', href: null },
    { label: 'Im Archiv', value: stats?.archivCount ?? 0, sub: null, icon: <Archive size={22} strokeWidth={2.5} />, color: 'text-[#64748B]', bg: 'bg-[#F1F5F9]', href: '/dashboard/anfragen?archiv=1' },
  ]

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Übersicht</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          href="/dashboard/anfragen"
          className="px-4 py-2 bg-[#0369A1] hover:bg-[#0284c7] text-white text-sm font-semibold rounded-xl transition-colors duration-200"
        >
          Alle Anfragen
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(card => {
          const inner = (
            <>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-medium text-[#64748B] leading-snug max-w-[120px]">{card.label}</p>
                <span className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className={card.color}>{card.icon}</span>
                </span>
              </div>
              <p className={`text-3xl font-black ${card.color}`}>
                {loading && typeof card.value !== 'string' ? '–' : card.value}
              </p>
              {card.sub && (
                <p className="text-xs text-[#16A34A] mt-1 font-medium">{card.sub}</p>
              )}
            </>
          )
          return card.href ? (
            <Link key={card.label} href={card.href} className="bg-white rounded-2xl border border-[#E2EDF7] p-5 hover:border-[#0369A1] transition-colors">
              {inner}
            </Link>
          ) : (
            <div key={card.label} className="bg-white rounded-2xl border border-[#E2EDF7] p-5">
              {inner}
            </div>
          )
        })}
      </div>

      {/* Neueste Anfragen */}
      <div className="bg-white rounded-2xl border border-[#E2EDF7]">
        <div className="flex items-center justify-between p-6 border-b border-[#E2EDF7]">
          <h2 className="font-bold text-[#0F172A]">Neueste Anfragen</h2>
          <Link href="/dashboard/anfragen" className="text-sm text-[#0369A1] hover:underline font-medium">
            Alle anzeigen →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#94A3B8] text-sm">Lädt...</div>
        ) : recentAnfragen.length === 0 ? (
          <div className="p-8 text-center text-[#94A3B8] text-sm">Noch keine Anfragen</div>
        ) : (
          <div className="divide-y divide-[#E2EDF7]">
            {recentAnfragen.map(a => {
              const s = STATUS_CONFIG[a.status] ?? { label: a.status, bg: 'bg-gray-100', text: 'text-gray-800' }
              return (
                <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#E8F4FD] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#0369A1]">
                        {a.vorname[0]}{a.nachname[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A] text-sm">{a.vorname} {a.nachname}</p>
                      <p className="text-xs text-[#64748B]">{a.marke} {a.modell} · PLZ {a.plz}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                    <p className="text-xs text-[#94A3B8] hidden md:block">{formatDate(a.createdAt)}</p>
                    <Link
                      href={`/dashboard/anfragen/${a.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FB6F6F] hover:bg-[#f95c5c] text-white font-semibold transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
