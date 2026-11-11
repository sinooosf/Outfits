import { AnimatePresence, motion } from 'framer-motion'
import { ChartBar, Sparkle, Star, TrendUp } from '@phosphor-icons/react'
import useCountUp from '../hooks/useCountUp'

// Five dots that fill with the percentage (the numbers come from useCountUp, so they animate).
function Dots({ pct }) {
  const filled = pct / 20
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-fg transition-opacity duration-300 md:h-2.5 md:w-2.5"
          style={{ opacity: filled >= i + 0.5 ? 1 : 0.2 }}
        />
      ))}
    </div>
  )
}

function Bar({ pct }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line md:h-2.5" aria-hidden="true">
      <div className="h-full rounded-full bg-fg" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Metric({ label, pct, children }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex items-baseline justify-between gap-2 text-[10px] font-medium md:mb-2.5 md:text-sm">
        <span className="truncate text-muted">{label}</span>
        <span className="tabular-nums text-fg">{Math.round(pct)}%</span>
      </div>
      {children}
    </div>
  )
}

function Tagline({ text, className }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={text}
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.16 }}
      >
        {text}
      </motion.p>
    </AnimatePresence>
  )
}

// Live rating. `replay` restarts the count-up / bar animation (the Analyze button bumps it).
export default function RatingPanel({ rating, replay, onAnalyze, t }) {
  const score = useCountUp(rating.score, { replay })
  const color = useCountUp(rating.colorMatch, { replay })
  const style = useCountUp(rating.styleImpact, { replay })

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-2.5 px-4 md:gap-3 md:px-0">
      <div
        role="group"
        aria-label={`${rating.score.toFixed(1)} / 10, ${rating.label}. ${t('colorMatch')} ${rating.colorMatch}%. ${t('styleImpact')} ${rating.styleImpact}%.`}
        className="glass flex h-[76px] w-full items-center gap-3 rounded-[26px] px-4 md:h-[116px] md:w-[min(46vw,770px)] md:gap-8 md:rounded-[34px] md:px-9"
      >
        <div className="flex shrink-0 items-center gap-2.5 md:gap-4" aria-hidden="true">
          <Star weight="fill" className="size-6 md:size-9" />
          <div>
            <div className="text-[26px] font-semibold leading-none tabular-nums md:text-5xl">
              {score.toFixed(1)}
              <span className="ms-1 text-xs font-medium text-muted md:text-lg">/ 10</span>
            </div>
            <div className="mt-1 text-xs font-medium text-muted md:mt-1.5 md:text-base">{rating.label}</div>
          </div>
        </div>

        <div className="ms-auto flex w-[50%] flex-col gap-1.5 md:w-auto md:flex-1 md:flex-row md:gap-10">
          <Metric label={t('colorMatch')} pct={color}>
            <Dots pct={color} />
          </Metric>
          <Metric label={t('styleImpact')} pct={style}>
            <Bar pct={style} />
          </Metric>
        </div>
      </div>

      {/* phone: the second bar with the tagline */}
      <div className="glass flex h-[52px] w-full items-center gap-3 rounded-[22px] px-4 md:hidden">
        <Sparkle weight="fill" size={18} className="shrink-0" aria-hidden="true" />
        <Tagline text={rating.tagline} className="min-w-0 flex-1 text-center text-[13px] font-medium leading-tight" />
        <TrendUp size={18} className="shrink-0 text-muted" aria-hidden="true" />
      </div>

      {/* desktop: the tagline as one quiet line under the panel */}
      <div className="hidden items-center gap-2 text-sm text-muted md:flex">
        <Sparkle weight="fill" size={14} aria-hidden="true" />
        <Tagline text={rating.tagline} />
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        className="glass inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-medium text-fg transition-transform active:scale-95"
      >
        <ChartBar size={14} weight="bold" aria-hidden="true" />
        {t('analyze')}
      </button>
    </div>
  )
}
