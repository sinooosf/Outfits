import { useEffect, useRef, useState } from 'react'

// Smoothly animates a number toward `target` (also counts up from 0 on first render).
// Change `replay` (any number) to restart the animation from 0, for example on "Analyze".
export default function useCountUp(target, { duration = 700, replay = 0 } = {}) {
  const [value, setValue] = useState(0)
  const current = useRef(0)
  const lastReplay = useRef(replay)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = lastReplay.current !== replay ? 0 : current.current
    lastReplay.current = replay
    if (reduce || from === target) {
      current.current = target
      setValue(target)
      return undefined
    }
    let raf = 0
    let start
    const tick = (now) => {
      start ??= now
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      current.current = from + (target - from) * eased
      setValue(current.current)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, replay, duration])

  return value
}
