import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import ClothesImage from './ClothesImage'

/**
 * One horizontal carousel = one layer of the outfit.
 * - Native CSS scroll-snap (x mandatory), touch-action: pan-x.
 * - Items are rendered 3x so the row loops and there are ALWAYS neighbours on
 *   both sides (like the design). After a scroll settles we silently jump back
 *   to the middle copy, which looks identical.
 * - Opacity / scale / blur are computed from each item's distance to the row centre.
 * - Mouse: drag, trackpad scroll (native), click a faded neighbour to centre it.
 * - It only ever reports ITS OWN index through onSelect(slot, index).
 */
const COPIES = 3
const VERTICAL = { top: 'center top', bottom: 'center bottom', center: 'center center' }

// d = distance from the centre, measured in item widths (0 = centred, 1 = direct neighbour)
function look(d) {
  const t = Math.min(d, 2)
  const opacity = t <= 1 ? 1 - 0.7 * t : 0.3 - 0.17 * (t - 1) // 1 -> 0.3 -> 0.13
  const scale = 1 - 0.17 * Math.min(t, 1.6)
  const blur = t < 0.04 ? 0 : Math.min(t, 1.5) * 1.4
  return { opacity, scale, blur }
}

export default function Layer({
  slot,
  items,
  index,
  onSelect,
  label,
  anchor = 'center', // where the image sits inside its box: 'top' | 'center' | 'bottom'
  grow = 1,
  fit = 1, // how much of the item box the image may fill (0-1)
}) {
  const n = items.length
  const list = useMemo(
    () => Array.from({ length: COPIES * n }, (_, k) => items[k % n]),
    [items, n],
  )

  const rowRef = useRef(null)
  const itemEls = useRef([])
  const innerEls = useRef([])
  const metrics = useRef({ centers: [], half: 0 })
  const activeK = useRef(n + index) // position in the tripled list
  const shownIdx = useRef(index)
  const raf = useRef(0)
  const settleTimer = useRef(0)
  const snapTimer = useRef(0)
  const touching = useRef(false)
  const drag = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  const measure = useCallback(() => {
    const row = rowRef.current
    if (!row) return
    metrics.current = {
      centers: itemEls.current.map((el) => (el ? el.offsetLeft + el.offsetWidth / 2 : 0)),
      half: row.clientWidth / 2,
      itemW: itemEls.current[0]?.offsetWidth || 1,
    }
  }, [])

  const centerOf = (k) => metrics.current.centers[k] - metrics.current.half

  const paint = useCallback(() => {
    raf.current = 0
    const row = rowRef.current
    const { centers, half, itemW } = metrics.current
    if (!row || !centers.length) return
    const mid = row.scrollLeft + half
    let best = 0
    let bestDist = Infinity
    for (let k = 0; k < centers.length; k++) {
      const dist = Math.abs(centers[k] - mid)
      if (dist < bestDist) {
        bestDist = dist
        best = k
      }
      const el = innerEls.current[k]
      if (!el) continue
      const { opacity, scale, blur } = look(dist / itemW)
      el.style.opacity = opacity.toFixed(3)
      el.style.transform = `scale(${scale.toFixed(3)})`
      el.style.filter = blur ? `blur(${blur.toFixed(2)}px)` : 'none'
    }
    activeK.current = best
    const idx = best % n
    if (idx !== shownIdx.current) {
      shownIdx.current = idx
      onSelectRef.current(slot, idx) // live update
    }
  }, [n, slot])

  const schedulePaint = useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(paint)
  }, [paint])

  // Jump (instantly) back to the middle copy once scrolling has stopped.
  const settle = useCallback(() => {
    const row = rowRef.current
    if (!row || drag.current || touching.current) return
    const k = activeK.current
    if (k >= n && k < 2 * n) return
    const target = (k % n) + n
    row.scrollTo({ left: centerOf(target), behavior: 'instant' })
    activeK.current = target
    schedulePaint()
  }, [n, schedulePaint])

  const scrollToK = useCallback((k, behavior = 'smooth') => {
    const row = rowRef.current
    if (!row || k < 0 || k >= COPIES * n) return
    row.scrollTo({ left: centerOf(k), behavior })
  }, [n])

  const onScroll = () => {
    schedulePaint()
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(settle, 140)
  }

  // Initial position + keep centred when the size changes (rotate, resize).
  useLayoutEffect(() => {
    const row = rowRef.current
    measure()
    const k = n + index
    row.scrollTo({ left: centerOf(k), behavior: 'instant' })
    activeK.current = k
    shownIdx.current = index
    paint()

    const ro = new ResizeObserver(() => {
      measure()
      row.scrollTo({ left: centerOf(activeK.current), behavior: 'instant' })
      paint()
    })
    ro.observe(row)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf.current)
      clearTimeout(settleTimer.current)
      clearTimeout(snapTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  // The index changed from OUTSIDE (e.g. loading a saved outfit): glide to it.
  useEffect(() => {
    if (index === shownIdx.current) return
    let best = index + n
    for (let c = 0; c < COPIES; c++) {
      const k = index + c * n
      if (Math.abs(k - activeK.current) < Math.abs(best - activeK.current)) best = k
    }
    scrollToK(best)
  }, [index, n, scrollToK])

  // ---- desktop: drag with the mouse ----
  const nearestK = (x) => {
    const { centers } = metrics.current
    let best = 0
    for (let k = 1; k < centers.length; k++) {
      if (Math.abs(centers[k] - x) < Math.abs(centers[best] - x)) best = k
    }
    return best
  }

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const row = rowRef.current
    clearTimeout(snapTimer.current)
    drag.current = { x: e.clientX, left: row.scrollLeft, moved: false, v: 0, lastX: e.clientX, lastT: e.timeStamp }
    row.style.scrollSnapType = 'none' // free movement while dragging
    row.classList.add('is-dragging')

    const move = (ev) => {
      const d = drag.current
      if (!d) return
      if (Math.abs(ev.clientX - d.x) > 4) d.moved = true
      row.scrollLeft = d.left - (ev.clientX - d.x)
      const dt = ev.timeStamp - d.lastT
      if (dt > 0) d.v = 0.8 * d.v + 0.2 * (-(ev.clientX - d.lastX) / dt) // scroll velocity px/ms
      d.lastX = ev.clientX
      d.lastT = ev.timeStamp
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      const d = drag.current
      row.classList.remove('is-dragging')
      if (!d) return
      // glide to the item the drag was heading for (a flick carries it further)
      const target = nearestK(row.scrollLeft + metrics.current.half + d.v * 220)
      scrollToK(target)
      snapTimer.current = setTimeout(() => {
        row.style.scrollSnapType = ''
        drag.current = null
        settle()
      }, 380)
      drag.current = { ...d, ended: true }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const onItemClick = (k) => {
    if (drag.current?.moved) return // it was a drag, not a click
    if (k !== activeK.current) scrollToK(k)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToK(activeK.current - 1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollToK(activeK.current + 1) }
  }

  const position = VERTICAL[anchor] ?? VERTICAL.center
  const origin = anchor === 'top' ? 'center top' : anchor === 'bottom' ? 'center bottom' : 'center center'

  return (
    <div
      ref={rowRef}
      dir="ltr"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      data-slot={slot}
      data-index={index}
      tabIndex={0}
      className="carousel min-h-0 select-none"
      style={{ flex: `${grow} 1 0` }}
      onScroll={onScroll}
      onPointerDown={onPointerDown}
      onTouchStart={() => (touching.current = true)}
      onTouchEnd={() => { touching.current = false; clearTimeout(settleTimer.current); settleTimer.current = setTimeout(settle, 140) }}
      onTouchCancel={() => (touching.current = false)}
      onKeyDown={onKeyDown}
    >
      {list.map((item, k) => (
        <div
          key={k}
          ref={(el) => (itemEls.current[k] = el)}
          className="carousel-item h-full"
          onClick={() => onItemClick(k)}
          aria-hidden={k % n !== shownIdx.current ? true : undefined}
        >
          <div
            ref={(el) => (innerEls.current[k] = el)}
            className="mx-auto h-full will-change-[transform,opacity,filter]"
            style={{ transformOrigin: origin, width: `${fit * 100}%` }}
          >
            <ClothesImage src={item.image} alt={item.name} slot={slot} position={position} />
          </div>
        </div>
      ))}
    </div>
  )
}
