import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../context/I18nContext'

export default function ChatWidget() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: t('chatWelcome') }])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const listRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const send = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || pending) return

    setMessages((prev) => [...prev, { from: 'user', text }])
    setDraft('')
    setPending(true)

    timerRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: t('chatAiReply') }])
      setPending(false)
    }, 900)
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {open && (
        <div className="absolute bottom-16 right-0 w-[min(20rem,calc(100vw-3rem))] h-96 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center border border-white/20 text-base">
              🤖
            </div>
            <div>
              <p className="font-bold text-xs">{t('chatTitle')}</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">● Online</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('closeMenu')}
              className="ml-auto text-white/60 hover:text-white font-bold text-base"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.from === 'user' ? 'justify-end' : ''}`}>
                <div
                  className={`max-w-[85%] p-3 shadow-sm text-xs leading-relaxed rounded-2xl ${
                    message.from === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                  }`}
                >
                  {message.from === 'bot' && (
                    <span className="font-bold text-[10px] text-amber-600 block mb-1">{t('chatAiLabel')}</span>
                  )}
                  {message.text}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-3 py-2 shadow-sm text-xs text-slate-400">
                  •••
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="border-t border-slate-100 p-2 bg-white flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('chatPlaceholder')}
              aria-label={t('chatPlaceholder')}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-xs text-slate-800"
            />
            <button type="submit" className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-slate-800">
              {t('chatSend')}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('chatOpen')}
        className="w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 relative"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
        </span>
        <span className="text-2xl">💬</span>
      </button>
    </div>
  )
}