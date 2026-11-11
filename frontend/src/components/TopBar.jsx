import { CoatHanger, Globe, Heart, Moon, Robot, Sun, User, CaretDown } from '@phosphor-icons/react'

const round =
  'glass pointer-events-auto grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg transition-transform active:scale-95 md:h-[52px] md:w-[52px]'

// STAGE 1: the theme toggle works. The other buttons are visual only for now and get
// wired up in stage 3 (language, chatbot, cabinet, account, favorites).
export default function TopBar({ theme, onToggleTheme }) {
  const dark = theme === 'dark'
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-4 pt-[max(env(safe-area-inset-top),14px)] md:px-7 md:pt-6">
      {/* top-left: theme + language */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* phone: single round button */}
        <button type="button" className={`${round} md:hidden`} onClick={onToggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
          {dark ? <Sun size={20} weight="regular" /> : <Moon size={20} weight="regular" />}
        </button>
        {/* desktop: sun | moon pill, the one you can switch to is lit */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="glass pointer-events-auto hidden h-[52px] items-center gap-4 rounded-full px-5 md:flex"
        >
          <Sun size={24} weight={dark ? 'fill' : 'regular'} className={dark ? 'text-fg' : 'text-muted'} />
          <Moon size={24} weight={dark ? 'regular' : 'fill'} className={dark ? 'text-muted' : 'text-fg'} />
        </button>

        <button type="button" className={`${round} md:hidden`} aria-label="Language">
          <Globe size={20} />
        </button>
        <button type="button" className="glass pointer-events-auto hidden h-[52px] items-center gap-3 rounded-full px-5 text-sm font-medium md:flex" aria-label="Language">
          <Globe size={24} />
          EN
          <CaretDown size={14} />
        </button>
      </div>

      {/* top-right: chatbot, cabinet, account, heart (heart on its own line on phone) */}
      <div className="flex flex-col items-end gap-2.5 md:flex-row md:items-center md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <button type="button" className={round} aria-label="Stylist chat"><Robot size={22} weight="fill" /></button>
          <button type="button" className={round} aria-label="Cabinet"><CoatHanger size={22} /></button>
          <button type="button" className={round} aria-label="Account"><User size={22} weight="fill" /></button>
        </div>
        <span className="hidden h-8 w-px bg-line md:block" aria-hidden="true" />
        <button type="button" className={round} aria-label="Favorite"><Heart size={22} weight="fill" /></button>
      </div>
    </header>
  )
}
