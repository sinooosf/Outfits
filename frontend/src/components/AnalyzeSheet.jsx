import { Sparkle, Star } from '@phosphor-icons/react'
import Sheet from './Sheet'
import useCountUp from '../hooks/useCountUp'

export default function AnalyzeSheet({ open, onClose, rating, replay, t }) {
  const score = useCountUp(rating.score, { replay })
  return (
    <Sheet open={open} onClose={onClose} title={t('breakdown')} closeLabel={t('close')}>
      <div className="flex items-center gap-4">
        <Star weight="fill" size={40} aria-hidden="true" />
        <div>
          <div className="text-5xl font-semibold leading-none tabular-nums">
            {score.toFixed(1)}
            <span className="ms-1.5 text-lg font-medium text-muted">/ 10</span>
          </div>
          <div className="mt-1.5 text-sm text-muted">{rating.label}</div>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-medium text-muted">{t('why')}</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {rating.reasons.map((r) => (
          <li key={r} className="glass rounded-2xl px-4 py-3 text-sm">
            {r}
          </li>
        ))}
      </ul>

      <p className="mb-3 mt-5 flex items-start gap-2 text-sm font-medium">
        <Sparkle weight="fill" size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>“{rating.tagline}”</span>
      </p>
    </Sheet>
  )
}
