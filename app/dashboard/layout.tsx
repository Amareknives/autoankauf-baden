'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { LayoutDashboard, ClipboardList, Calendar, Settings, ExternalLink, LogOut, Mail } from 'lucide-react'

const navigation = [
  {
    name: 'Übersicht',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} strokeWidth={2.5} />,
    iconSm: <LayoutDashboard size={22} strokeWidth={2.5} />,
  },
  {
    name: 'Anfragen',
    href: '/dashboard/anfragen',
    icon: <ClipboardList size={20} strokeWidth={2.5} />,
    iconSm: <ClipboardList size={22} strokeWidth={2.5} />,
  },
  {
    name: 'Termine',
    href: '/dashboard/termine',
    icon: <Calendar size={20} strokeWidth={2.5} />,
    iconSm: <Calendar size={22} strokeWidth={2.5} />,
  },
  {
    name: 'Mails',
    href: '/dashboard/mail-log',
    icon: <Mail size={20} strokeWidth={2.5} />,
    iconSm: <Mail size={22} strokeWidth={2.5} />,
  },
  {
    name: 'Einstellungen',
    href: '/dashboard/einstellungen',
    icon: <Settings size={20} strokeWidth={2.5} />,
    iconSm: <Settings size={22} strokeWidth={2.5} />,
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/dashboard/logout', { method: 'POST' })
    router.push('/dashboard/login')
    router.refresh()
  }

  if (pathname === '/dashboard/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Desktop Sidebar — nur ab md sichtbar */}
      <aside className="hidden md:flex w-60 bg-[#0F172A] flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0369A1] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs">AAB</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">AutoAnkauf</p>
              <p className="text-[#64748B] text-xs mt-0.5">Baden</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#0369A1] text-white'
                    : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors duration-150"
          >
            <ExternalLink size={20} strokeWidth={2.5} />
            Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#FB6F6F] transition-colors duration-150"
          >
            <LogOut size={20} strokeWidth={2.5} />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main — auf Mobile Abstand nach unten für Bottom-Nav */}
      <main className="flex-1 min-w-0 overflow-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom-Nav — nur bis md sichtbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-white/10">
        <div className="flex items-stretch">
          {navigation.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors duration-150 min-h-[56px] ${
                  isActive
                    ? 'text-[#0EA5E9]'
                    : 'text-[#475569] hover:text-[#94A3B8]'
                }`}
              >
                {item.iconSm}
                <span>{item.name}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold text-[#475569] hover:text-[#FB6F6F] transition-colors duration-150 min-h-[56px]"
          >
            <LogOut size={22} strokeWidth={2.5} />
            <span>Abmelden</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
