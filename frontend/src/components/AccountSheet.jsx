import Sheet from './Sheet'

function Stat({ label, value }) {
  return (
    <div className="glass rounded-2xl px-3 py-3 text-center">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] leading-tight text-muted">{label}</div>
    </div>
  )
}

// No backend yet, so the "account" is a local profile: a name plus a few stats.
export default function AccountSheet({ open, onClose, t, name, onName, rows }) {
  const best = rows.length ? Math.max(...rows.map((r) => r.score)).toFixed(1) : '–'
  const shownName = name.trim() || t('guest')
  return (
    <Sheet open={open} onClose={onClose} title={t('account')} closeLabel={t('close')}>
      <div className="flex items-center gap-4">
        <div className="glass grid h-14 w-14 shrink-0 place-items-center rounded-full text-xl font-semibold" aria-hidden="true">
          {shownName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold">{shownName}</div>
        </div>
      </div>

      <label className="mt-5 block text-sm font-medium text-muted" htmlFor="profile-name">
        {t('name')}
      </label>
      <input
        id="profile-name"
        value={name}
        maxLength={24}
        onChange={(e) => onName(e.target.value)}
        className="glass mt-2 h-11 w-full rounded-2xl px-4 text-sm text-fg outline-none focus:border-fg"
      />

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <Stat label={t('statSaved')} value={rows.length} />
        <Stat label={t('statFavs')} value={rows.filter((r) => r.fav).length} />
        <Stat label={t('statBest')} value={best} />
      </div>

      <p className="mb-3 mt-4 text-xs text-muted">{t('accountNote')}</p>
    </Sheet>
  )
}
