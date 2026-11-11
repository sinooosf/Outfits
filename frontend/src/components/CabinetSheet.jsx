import { useState } from 'react'
import { Check, Heart, Plus, Star, Trash } from '@phosphor-icons/react'
import Sheet from './Sheet'
import OutfitThumb from './OutfitThumb'

const tabClass = (on) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${on ? 'bg-fg text-bg' : 'glass text-fg'}`

export default function CabinetSheet({ open, onClose, t, rows, isSaved, onSave, onRemove, onWear }) {
  const [tab, setTab] = useState('all')
  const shown = tab === 'fav' ? rows.filter((r) => r.fav) : rows

  return (
    <Sheet open={open} onClose={onClose} title={t('cabinet')} closeLabel={t('close')}>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaved}
        className="glass flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-transform active:scale-[0.98] disabled:opacity-60"
      >
        {isSaved ? <Check size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
        {isSaved ? t('saved') : t('saveOutfit')}
      </button>

      <div className="mt-4 flex gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'all'} className={tabClass(tab === 'all')} onClick={() => setTab('all')}>
          {t('tabAll')}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'fav'} className={tabClass(tab === 'fav')} onClick={() => setTab('fav')}>
          {t('tabFavs')}
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">{t('cabinetEmpty')}</p>
      ) : (
        <ul className="mb-3 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shown.map((r) => (
            <li key={r.id} className="glass flex items-center gap-3 rounded-2xl p-3">
              <OutfitThumb items={r.items} />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-1.5 text-lg font-semibold tabular-nums">
                  <Star weight="fill" size={16} aria-hidden="true" />
                  {r.score.toFixed(1)}
                  {r.fav && <Heart weight="fill" size={14} className="ms-auto" aria-hidden="true" />}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onWear(r.sel)
                    onClose()
                  }}
                  className="h-9 rounded-full bg-fg text-sm font-medium text-bg transition-transform active:scale-95"
                >
                  {t('wear')}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(r.id)}
                  aria-label={t('remove')}
                  className="glass inline-flex h-9 items-center justify-center gap-1.5 rounded-full text-xs text-muted transition-transform active:scale-95"
                >
                  <Trash size={14} aria-hidden="true" />
                  {t('remove')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  )
}
