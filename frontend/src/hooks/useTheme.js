import { useCallback, useEffect, useState } from 'react'
import { load, save } from '../utils/storage'

// Dark by default, light by toggle. Saved in localStorage.
export default function useTheme() {
  const [theme, setTheme] = useState(() =>
    load('theme', 'dark', (v) => v === 'dark' || v === 'light'),
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#050505' : '#e9e9e9')
    save('theme', theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle]
}
