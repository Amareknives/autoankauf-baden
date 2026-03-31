'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'
import { gtmEvents } from '@/lib/gtm'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

let sessionId = ''
function getSessionId(): string {
  if (sessionId) return sessionId
  if (typeof window !== 'undefined') {
    let id = sessionStorage.getItem('aab_chat_session')
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36)
      sessionStorage.setItem('aab_chat_session', id)
    }
    sessionId = id
  }
  return sessionId
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const shown = localStorage.getItem('aab_chat_shown')
    if (shown) return
    const timer = setTimeout(() => {
      setIsOpen(true)
      localStorage.setItem('aab_chat_shown', '1')
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true)
      setMessages([{
        role: 'assistant',
        content: 'Hallo! Ich bin Max 👋 Wie kann ich dir beim Autoverkauf helfen?',
      }])
      gtmEvents.chat_open()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, hasGreeted])

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    gtmEvents.chat_message_sent({ count: messages.filter(m => m.role === 'user').length + 1 })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      })

      if (!response.ok) throw new Error('Chat-Fehler')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Kein Stream')

      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Entschuldigung, da ist etwas schiefgelaufen. Ruf uns gerne direkt an!',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-widget" style={{ zIndex: 50 }}>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-2xl border border-[#E2EDF7] flex flex-col overflow-hidden"
          style={{ width: '300px', height: '400px' }}
          role="dialog"
          aria-label="Chat mit Max"
        >
          {/* Header */}
          <div className="bg-[#0369A1] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <div>
                <div className="text-white text-sm font-semibold leading-tight">Max – Dein Assistent</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span className="text-white/70 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors p-1 rounded"
              aria-label="Chat schließen"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#F8FAFC]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0369A1] text-white rounded-br-sm'
                      : 'bg-white text-[#0F172A] shadow-sm border border-[#E2EDF7] rounded-bl-sm'
                  }`}
                >
                  {msg.content || (
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-[#E2EDF7] bg-white flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreib eine Nachricht..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 border border-[#E2EDF7] rounded-lg focus:outline-none focus:border-[#0369A1] focus:ring-1 focus:ring-[#0369A1] transition-colors disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Nachricht senden"
              className="w-9 h-9 rounded-lg bg-[#0369A1] hover:bg-[#0284c7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? 'Chat schließen' : 'Chat öffnen'}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#0369A1',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(3, 105, 161, 0.4)',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          position: 'relative',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.transform = 'scale(1.08)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.transform = 'scale(1)'
        }}
      >
        {isOpen
          ? <X size={22} strokeWidth={2.5} color="white" />
          : <MessageCircle size={24} strokeWidth={2.5} color="white" />
        }
      </button>
    </div>
  )
}
