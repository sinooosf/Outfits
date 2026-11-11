import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Layer from './components/Layer'
import TopBar from './components/TopBar'
import RatingPanel from './components/RatingPanel'
import AnalyzeSheet from './components/AnalyzeSheet'
import StylistSheet from './components/StylistSheet'
import CabinetSheet from './components/CabinetSheet'
import AccountSheet from './components/AccountSheet'
import useTheme from './hooks/useTheme'
import useLang from './hooks/useLang'
import useOutfits from './hooks/useOutfits'
import { DEFAULT_SELECTION, ITEMS_BY_SLOT, SLOTS } from './data/clothes'
import { load, save } from './utils/storage'
import { outfitKey, pickItems } from './utils/outfit'
import { rateOutfit } from './utils/rateOutfit'

// Saved selection must be an object of valid indexes, otherwise use the defaults.
const validSelection = (v) =>
  v && typeof v === 'object' &&
  SLOTS.every((s) => Number.isInteger(v[s]) && v[s] >= 0 && v[s] < ITEMS_BY_SLOT[s].length)

const ROW_LABEL = {
  headtop: 'Headwear carousel',
  glasses: 'Glasses carousel',
  top: 'Top carousel',
  bottom: 'Pants carousel',
  shoes: 'Shoes carousel',
}

const rise = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
})

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [lang, setLang, t] = useLang()
  const [selection, setSelection] = useState(() => load('selected', DEFAULT_SELECTION, validSelection))
  const [name, setName] = useState(() => load('name', '', (v) => typeof v === 'string'))
  const [panel, setPanel] = useState(null) // 'analyze' | 'chat' | 'cabinet' | 'account' | null
  const [replay, setReplay] = useState(0)

  useEffect(() => save('selected', selection), [selection])
  useEffect(() => save('name', name), [name])

  // The rating follows the selection live.
  const key = outfitKey(selection)
  const rating = useMemo(() => rateOutfit(pickItems(selection), key), [selection, key])
  const outfits = useOutfits(selection)

  // Each row reports only its own index, so changing one layer never touches the others.
  const select = useCallback(
    (slot, i) => setSelection((s) => (s[slot] === i ? s : { ...s, [slot]: i })),
    [],
  )
  const closePanel = useCallback(() => setPanel(null), [])
  const analyze = () => {
    setReplay((r) => r + 1)
    setPanel('analyze')
  }

  const row = (slot, props = {}) => (
    <Layer slot={slot} label={ROW_LABEL[slot]} items={ITEMS_BY_SLOT[slot]} index={selection[slot]} onSelect={select} {...props} />
  )

  return (
    <div className="stage relative h-dvh w-full overflow-hidden">
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        lang={lang}
        onLang={setLang}
        t={t}
        isFav={outfits.isFav}
        onFav={outfits.toggleFav}
        onOpen={setPanel}
      />

      <main className="relative flex h-full flex-col pt-[calc(max(env(safe-area-inset-top),14px)+104px)] pb-[max(env(safe-area-inset-bottom),20px)] md:pt-5 md:pb-6">
        {/* The outfit: layers stacked, no labels, no arrows, no buttons */}
        <section className="relative flex min-h-0 flex-1 flex-col" aria-label="Outfit">
          {/* faded glass panes on the screen edges */}
          <div aria-hidden className="glass pointer-events-none absolute left-0 top-[10%] bottom-[2%] w-[12%] rounded-r-[28px] opacity-60 md:top-[20%] md:bottom-[4%] md:w-[4%]" />
          <div aria-hidden className="glass pointer-events-none absolute right-0 top-[10%] bottom-[2%] w-[12%] rounded-l-[28px] opacity-60 md:top-[20%] md:bottom-[4%] md:w-[4%]" />

          {/* Layer 1: head-top row (empty / caps / hair) + glasses row, with a real gap between */}
          <motion.div {...rise(0)} className="relative z-10 flex min-h-0 flex-col gap-3.5 md:gap-4" style={{ flex: '30 1 0' }}>
            {row('headtop', { grow: 69 })}
            {row('glasses', { grow: 36, fit: 0.86 })}
          </motion.div>
          {/* Layer 2: hoodie / t-shirt */}
          <motion.div {...rise(1)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '33 1 0' }}>
            {row('top', { anchor: 'bottom', fit: 0.82 })}
          </motion.div>
          {/* Layer 3: pants */}
          <motion.div {...rise(2)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '40 1 0' }}>
            {row('bottom', { anchor: 'top' })}
          </motion.div>
          {/* Layer 4: shoes */}
          <motion.div {...rise(3)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '18 1 0' }}>
            {row('shoes')}
          </motion.div>
        </section>

        <div className="mt-5 md:mt-5">
          <RatingPanel rating={rating} replay={replay} onAnalyze={analyze} t={t} />
        </div>
      </main>

      <AnalyzeSheet open={panel === 'analyze'} onClose={closePanel} rating={rating} replay={replay} t={t} />
      <StylistSheet open={panel === 'chat'} onClose={closePanel} t={t} selection={selection} rating={rating} onApply={setSelection} />
      <CabinetSheet
        open={panel === 'cabinet'}
        onClose={closePanel}
        t={t}
        rows={outfits.rows}
        isSaved={outfits.isSaved}
        onSave={outfits.saveCurrent}
        onRemove={outfits.remove}
        onWear={setSelection}
      />
      <AccountSheet open={panel === 'account'} onClose={closePanel} t={t} name={name} onName={setName} rows={outfits.rows} />
    </div>
  )
}
