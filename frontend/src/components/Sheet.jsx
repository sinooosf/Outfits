import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { X } from '@phosphor-icons/react'

// Bottom sheet: Esc, tap the backdrop, the X, or drag the handle down to close.
export default function Sheet({ open, onClose, title, closeLabel = 'Close', children }) {
  const controls = useDragControls()
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current()
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-lg rounded-t-[28px] border border-b-0 border-line text-fg backdrop-blur-2xl pb-[max(env(safe-area-inset-bottom),16px)]"
            style={{ background: 'color-mix(in srgb, var(--bg) 86%, transparent)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose()
            }}
          >
            <div className="flex cursor-grab touch-none justify-center pb-1 pt-3" onPointerDown={(e) => controls.start(e)}>
              <span className="h-1 w-10 rounded-full bg-line" />
            </div>
            <div className="flex items-center justify-between px-5 pb-2">
              <h2 className="text-base font-semibold">{title}</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="glass grid h-9 w-9 place-items-center rounded-full transition-transform active:scale-95"
              >
                <X size={16} weight="bold" />
              </button>
            </div>
            <div className="max-h-[68dvh] overflow-y-auto px-5 pb-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
