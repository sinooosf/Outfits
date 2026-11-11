import { useEffect, useRef, useState } from 'react'
import { PaperPlaneTilt } from '@phosphor-icons/react'
import Sheet from './Sheet'
import { ITEMS_BY_SLOT, SLOTS } from '../data/clothes'
import { outfitKey, pickItems } from '../utils/outfit'
import { rateOutfit } from '../utils/rateOutfit'

// A small rule-based stylist (no backend): it uses the same rating rules as the panel.
const rate = (sel) => rateOutfit(pickItems(sel), outfitKey(sel))
const IMPROVE = /improve|better|fix|am[ée]liore|mieux|حسّن|حسن|تحسين/i
const SURPRISE = /surprise|random|shuffle|surprend|hasard|فاجئني|مفاجأة|عشوائي/i
const RATE = /rate|score|note|noter|قيّم|قيم|تقييم/i

export default function StylistSheet({ open, onClose, t, selection, rating, onApply }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, open])

  const doRate = () =>
    `${t('rated', { score: rating.score.toFixed(1), label: rating.label, tagline: rating.tagline })}\n${rating.reasons.join(' · ')}`

  // Try every single swap and keep the one that raises the score the most.
  const doImprove = () => {
    let best = null
    for (const slot of SLOTS) {
      ITEMS_BY_SLOT[slot].forEach((_, i) => {
        if (i === selection[slot]) return
        const sel = { ...selection, [slot]: i }
        const score = rate(sel).score
        if (!best || score > best.score) best = { slot, i, sel, score }
      })
    }
    if (!best || best.score <= rating.score + 0.05) return t('noImprove')
    onApply(best.sel)
    return t('improved', {
      slot: t(`slot_${best.slot}`),
      item: ITEMS_BY_SLOT[best.slot][best.i].name,
      from: rating.score.toFixed(1),
      to: best.score.toFixed(1),
    })
  }

  const doSurprise = () => {
    const sel = {}
    for (const s of SLOTS) sel[s] = Math.floor(Math.random() * ITEMS_BY_SLOT[s].length)
    onApply(sel)
    return t('surprise', { score: rate(sel).score.toFixed(1) })
  }

  const ask = (question, action) => {
    const reply = action()
    setMessages((m) => [...m, { from: 'me', text: question }, { from: 'bot', text: reply }])
  }

  const submit = (e) => {
    e.preventDefault()
    const q = text.trim()
    if (!q) return
    setText('')
    const action = IMPROVE.test(q) ? doImprove : SURPRISE.test(q) ? doSurprise : RATE.test(q) ? doRate : () => t('unknown')
    ask(q, action)
  }

  const chips = [
    [t('chipRate'), doRate],
    [t('chipImprove'), doImprove],
    [t('chipSurprise'), doSurprise],
  ]

  const bubble = 'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-snug'

  return (
    <Sheet open={open} onClose={onClose} title={t('stylist')} closeLabel={t('close')}>
      <div className="flex h-[38dvh] flex-col gap-2 overflow-y-auto pb-2" aria-live="polite">
        <p className={`glass self-start ${bubble}`}>{t('hello')}</p>
        {messages.map((m, i) => (
          <p key={i} className={m.from === 'me' ? `self-end bg-fg text-bg ${bubble}` : `glass self-start ${bubble}`}>
            {m.text}
          </p>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        {chips.map(([label, action]) => (
          <button
            key={label}
            type="button"
            onClick={() => ask(label, action)}
            className="glass rounded-full px-3.5 py-1.5 text-xs font-medium transition-transform active:scale-95"
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mb-3 flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('chatPlaceholder')}
          aria-label={t('chatPlaceholder')}
          className="glass h-11 min-w-0 flex-1 rounded-full px-4 text-sm text-fg outline-none focus:border-fg"
        />
        <button
          type="submit"
          aria-label={t('send')}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform active:scale-95"
        >
          <PaperPlaneTilt size={18} weight="fill" />
        </button>
      </form>
    </Sheet>
  )
}
