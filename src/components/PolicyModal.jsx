import { useEffect } from 'react'
import { useUi } from '../context/UiContext'

export default function PolicyModal() {
  const { activePolicy, title, paragraphs, closePolicy } = useUi()

  useEffect(() => {
    if (!activePolicy) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePolicy()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activePolicy, closePolicy])

  if (!activePolicy) return null

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={closePolicy}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 max-h-[80vh] overflow-y-auto shadow-xl relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePolicy}
          aria-label="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-xl"
        >
          ✕
        </button>
        <h3 className="text-xl font-black mb-5 text-slate-900 pr-8">{title}</h3>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed font-medium">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  )
}