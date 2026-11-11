import { useEffect, useMemo, useState } from 'react'
import { LANGS, makeT } from '../i18n'
import { load, save } from '../utils/storage'

// English by default. Saved in localStorage. Arabic flips the page to right-to-left
// (the carousels stay left-to-right, see dir="ltr" in Layer.jsx).
export default function useLang() {
  const [lang, setLang] = useState(() => load('lang', 'en', (v) => LANGS.some((l) => l.code === v)))

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    save('lang', lang)
  }, [lang])

  const t = useMemo(() => makeT(lang), [lang])
  return [lang, setLang, t]
}
