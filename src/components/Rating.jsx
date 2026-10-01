export default function Rating({ stars = 0, reviews = 0, className = '' }) {
  return (
    <div className={`flex items-center gap-1 text-amber-500 text-xs ${className}`}>
      <span aria-hidden="true">
        {'★'.repeat(stars)}
        {'☆'.repeat(Math.max(0, 5 - stars))}
      </span>
      {reviews > 0 && <span className="text-slate-400 font-semibold ml-1">({reviews.toLocaleString('en-US')})</span>}
    </div>
  )
}