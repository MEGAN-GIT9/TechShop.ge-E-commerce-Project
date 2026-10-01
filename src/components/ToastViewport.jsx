import { useToast } from '../context/ToastContext'

export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-md">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className="pointer-events-auto w-full text-left bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl animate-fade-up"
        >
          {toast.message}
        </button>
      ))}
    </div>
  )
}