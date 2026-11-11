import { useCallback, useEffect, useMemo, useState } from 'react'
import { load, save } from '../utils/storage'
import { idsOf, outfitKey, pickItems, selectionFromIds } from '../utils/outfit'
import { rateOutfit } from '../utils/rateOutfit'

// The cabinet: saved outfits, some of them favorites. One entry per unique combination.
// Stored as item ids ({ headtop: 'cap-1', ... }) so adding clothes never breaks old saves.
const MAX = 60
const valid = (v) =>
  Array.isArray(v) && v.every((o) => o && typeof o.id === 'string' && o.ids && typeof o.ids === 'object')

export default function useOutfits(selection) {
  const [list, setList] = useState(() => load('cabinet', [], valid))
  useEffect(() => save('cabinet', list), [list])

  const key = outfitKey(selection)
  const current = list.find((o) => o.id === key)

  const make = useCallback(
    (fav) => ({ id: key, ids: idsOf(selection), fav, at: Date.now() }),
    [key, selection],
  )

  // Heart: favorite / unfavorite the outfit on screen (saves it if it isn't saved yet).
  const toggleFav = useCallback(
    () =>
      setList((l) =>
        l.some((o) => o.id === key)
          ? l.map((o) => (o.id === key ? { ...o, fav: !o.fav } : o))
          : [make(true), ...l].slice(0, MAX),
      ),
    [key, make],
  )

  const saveCurrent = useCallback(
    () => setList((l) => (l.some((o) => o.id === key) ? l : [make(false), ...l].slice(0, MAX))),
    [key, make],
  )

  const remove = useCallback((id) => setList((l) => l.filter((o) => o.id !== id)), [])

  // Entries ready to display: items resolved, score recomputed with the current rules.
  const rows = useMemo(
    () =>
      list.flatMap((o) => {
        const sel = selectionFromIds(o.ids)
        if (!sel) return [] // uses an item that no longer exists
        const items = pickItems(sel)
        return [{ ...o, sel, items, score: rateOutfit(items, o.id).score }]
      }),
    [list],
  )

  return { rows, isSaved: !!current, isFav: !!current?.fav, toggleFav, saveCurrent, remove }
}
