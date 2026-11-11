import { ITEMS_BY_SLOT, SLOTS } from '../data/clothes'

// selection = { headtop: 1, glasses: 0, top: 2, ... } (indexes) -> { headtop: item, ... }
export const pickItems = (sel) =>
  Object.fromEntries(SLOTS.map((s) => [s, ITEMS_BY_SLOT[s][sel[s]]]))

// Same outfit -> same key (used for stable taglines and the cabinet).
export const outfitKey = (sel) => SLOTS.map((s) => ITEMS_BY_SLOT[s][sel[s]]?.id ?? '-').join('|')

// Saved outfits store item ids (not indexes), so adding clothes never breaks them.
export const idsOf = (sel) =>
  Object.fromEntries(SLOTS.map((s) => [s, ITEMS_BY_SLOT[s][sel[s]]?.id]))

export function selectionFromIds(ids) {
  const sel = {}
  for (const s of SLOTS) {
    const i = ITEMS_BY_SLOT[s].findIndex((it) => it.id === ids?.[s])
    if (i < 0) return null
    sel[s] = i
  }
  return sel
}
