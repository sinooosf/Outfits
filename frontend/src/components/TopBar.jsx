import { useEffect, useRef, useState } from 'react'
import { CaretDown, Check, CoatHanger, Globe, Heart, Moon, Robot, Sun, User } from '@phosphor-icons/react'
import { LANGS } from '../i18n'

const round =
  'glass pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg transition-transform active:scale-95 md:h-[52px] md:w-[52px]'

// Theme toggle, language menu, stylist chat, cabinet, account, and the heart
// (favorites the outfit on screen). onOpen('chat' | 'cabinet' | 'account') opens a sheet.
export default function TopBar({ theme, onToggleTheme, lang, onLang, t, isFav, onFav, onOpen }) {
  const dark = theme === 'dark'
  const themeLabel = dark ? t('themeLight') : t('themeDark')

  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  useEffect(() => {
    if (!langOpen) return undefined
    const away = (e) => {
      if (!langRef.current?.contains(e.target)) setLangOpen(false)
    }
    const esc = (e) => e.key === 'Escape' && setLangOpen(false)
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [langOpen])

  const toggleLang = () => setLangOpen((o) => !o)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-[max(env(safe-area-inset-top),14px)] md:px-7 md:pt-6">
      {/* top-left: theme + language */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* phone: single round button */}
        <button type="button" className={`${round} md:hidden`} onClick={onToggleTheme} aria-label={themeLabel}>
          {dark ? <Sun size={20} weight="regular" /> : <Moon size={20} weight="regular" />}
        </button>
        {/* desktop: sun | moon pill, the one you can switch to is lit */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={themeLabel}
          className="glass pointer-events-auto hidden h-[52px] items-center gap-4 rounded-full px-5 md:flex"
        >
          <Sun size={24} weight={dark ? 'fill' : 'regular'} className={dark ? 'text-fg' : 'text-muted'} />
          <Moon size={24} weight={dark ? 'regular' : 'fill'} className={dark ? 'text-muted' : 'text-fg'} />
        </button>

        <div ref={langRef} className="relative">
          <button
            type="button"
            className={`${round} md:hidden`}
            aria-label={t('language')}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={toggleLang}
          >
            <Globe size={20} />
          </button>
          <button
            type="button"
            className="glass pointer-events-auto hidden h-[52px] items-center gap-3 rounded-full px-5 text-sm font-medium md:flex"
            aria-label={t('language')}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            onClick={toggleLang}
          >
            <Globe size={24} />
            {lang.toUpperCase()}
            <CaretDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <ul
              role="listbox"
              aria-label={t('language')}
              className="glass pointer-events-auto absolute start-0 top-full z-40 mt-2 w-44 overflow-hidden rounded-2xl p-1"
              style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)' }}
            >
              {LANGS.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === lang}>
                  <button
                    type="button"
                    onClick={() => {
                      onLang(l.code)
                      setLangOpen(false)
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-fg hover:bg-glass-strong"
                  >
                    {l.name}
                    {l.code === lang && <Check size={16} weight="bold" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* top-right: chatbot, cabinet, account, heart (heart on its own line on phone) */}
      <div className="flex flex-col items-end gap-2.5 md:flex-row md:items-center md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" className={round} aria-label={t('stylist')} onClick={() => onOpen('chat')}>
            <Robot size={22} weight="fill" />
          </button>
          <button type="button" className={round} aria-label={t('cabinet')} onClick={() => onOpen('cabinet')}>
            <CoatHanger size={22} />
          </button>
          <button type="button" className={round} aria-label={t('account')} onClick={() => onOpen('account')}>
            <User size={22} weight="fill" />
          </button>
        </div>
        <span className="hidden h-8 w-px bg-line md:block" aria-hidden="true" />
        <button
          type="button"
          className={round}
          aria-label={isFav ? t('unfavorite') : t('favorite')}
          aria-pressed={isFav}
          onClick={onFav}
        >
          <Heart size={22} weight={isFav ? 'fill' : 'regular'} />
        </button>
      </div>
    </header>
  )
}
