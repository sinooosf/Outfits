import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layer from './components/Layer'
import TopBar from './components/TopBar'
import RatingPanel from './components/RatingPanel'
import useTheme from './hooks/useTheme'
import { DEFAULT_SELECTION, ITEMS_BY_SLOT, SLOTS } from './data/clothes'
import { load, save } from './utils/storage'

// Saved selection must be an object of valid indexes, otherwise use the defaults.
const validSelection = (v) =>
  v && typeof v === 'object' &&
  SLOTS.every((s) => Number.isInteger(v[s]) && v[s] >= 0 && v[s] < ITEMS_BY_SLOT[s].length)

const rise = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] },
})

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [selection, setSelection] = useState(() => load('selected', DEFAULT_SELECTION, validSelection))

  useEffect(() => save('selected', selection), [selection])

  // Each row reports only its own index, so changing one layer never touches the others.
  const select = useCallback(
    (slot, i) => setSelection((s) => (s[slot] === i ? s : { ...s, [slot]: i })),
    [],
  )

  const row = (slot, props = {}) => (
    <Layer slot={slot} label={`${slot} carousel`} items={ITEMS_BY_SLOT[slot]} index={selection[slot]} onSelect={select} {...props} />
  )

  return (
    <div className="stage relative h-dvh w-full overflow-hidden">
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <main className="relative flex h-full flex-col pt-[calc(max(env(safe-area-inset-top),14px)+104px)] pb-[max(env(safe-area-inset-bottom),20px)] md:pt-5 md:pb-6">
        {/* The outfit: four layers stacked, no labels, no arrows, no buttons */}
        <section className="relative flex min-h-0 flex-1 flex-col" aria-label="Outfit">
          {/* faded glass panes on the screen edges */}
          <div aria-hidden className="glass pointer-events-none absolute left-0 top-[10%] bottom-[2%] w-[12%] rounded-r-[28px] opacity-60 md:top-[20%] md:bottom-[4%] md:w-[4%]" />
          <div aria-hidden className="glass pointer-events-none absolute right-0 top-[10%] bottom-[2%] w-[12%] rounded-l-[28px] opacity-60 md:top-[20%] md:bottom-[4%] md:w-[4%]" />

          {/* Layer 1: cap + sunglasses */}
          <motion.div {...rise(0)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '15 1 0' }}>
            {row('cap', { grow: 64 })}
            {row('glasses', { grow: 36, fit: 0.66 })}
          </motion.div>
          {/* Layer 2: hoodie / t-shirt */}
          <motion.div {...rise(1)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '34 1 0' }}>
            {row('top', { anchor: 'bottom', fit: 0.82 })}
          </motion.div>
          {/* Layer 3: pants */}
          <motion.div {...rise(2)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '42 1 0' }}>
            {row('bottom', { anchor: 'top' })}
          </motion.div>
          {/* Layer 4: shoes */}
          <motion.div {...rise(3)} className="relative z-10 flex min-h-0 flex-col" style={{ flex: '9 1 0' }}>
            {row('shoes')}
          </motion.div>
        </section>

        <div className="mt-3 md:mt-5">
          <RatingPanel />
        </div>
      </main>
    </div>
  )
}
