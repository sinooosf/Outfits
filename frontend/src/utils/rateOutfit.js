import { TAGLINES } from '../data/taglines'

// =====================================================================================
// RATING RULES. Each rule comes from common styling guidance (sources in brackets).
// Every number below is a knob you can tweak.
//
//  1. Palette size: about 3 main colors, neutrals and shoes included. A 4th is a small
//     cost, not a crime. [thevou.com three-colour rule, lookiero.co.uk]
//  2. 60-30-10: a neutral base covers most of the outfit, bold color works best as a small
//     accent, and a loud color should not be the dominant 60%. [thevou.com, womanandhome.com]
//  3. Color wheel: loud colors should be the same family, neighbours (analogous), opposites
//     (complementary) or evenly spaced (triadic). Other pairs fight. [sewguide.com,
//     gentlemansgazette.com, anuschkarees.com]
//  4. Light-dark contrast between top and pants looks sharp; a tonal / one-color column is
//     also fine and sleek. [so-sew-easy.com, looksmartalterations.com.au, thevou.com]
//  5. Volume: balance loose with fitted. Loose top + loose pants make a shapeless box.
//     [streetwear fit guide, petitedressing.com, cleovane blog]
//  6. Formality: all pieces should sit at the same level, and shoes must match the outfit
//     level (suit-level top with gym sneakers is the classic clash). [farnelli.com,
//     readysleek.com, outfittrends.com]
//  7. One focal point: one statement piece leads, the rest supports it. Two or more compete.
//     [k24.digital, goodmenproject.com, thewardrobeconsultant.com]
//  8. A missing top, pants or shoes is a big penalty. Empty slots and hair are neutral:
//     no penalty, no bonus (hair only counts if you tag it with a loud color).
// =====================================================================================

const NEUTRAL = new Set(['black', 'white', 'gray', 'grey', 'beige', 'navy'])

// light: 0 (dark) - 100 (light). hue: color-wheel angle (neutrals have none).
const COLORS = {
  black: { light: 8 }, navy: { light: 20 }, gray: { light: 55 }, grey: { light: 55 },
  beige: { light: 80 }, white: { light: 95 },
  red: { hue: 0, light: 45 }, burgundy: { hue: 350, light: 25 }, brown: { hue: 25, light: 30 },
  orange: { hue: 30, light: 60 }, yellow: { hue: 55, light: 85 }, olive: { hue: 75, light: 35 },
  green: { hue: 120, light: 45 }, teal: { hue: 175, light: 40 }, blue: { hue: 220, light: 50 },
  purple: { hue: 275, light: 40 }, pink: { hue: 330, light: 75 },
}

const AREA = { top: 0.32, bottom: 0.34, shoes: 0.12, headtop: 0.12, glasses: 0.04 } // how much of the look each slot covers
const FORMALITY = { formal: 5, casual: 3, streetwear: 2.5, sporty: 2, survival: 1.5 }
const VOLUME = { slim: 1, regular: 2, loose: 3, oversized: 4 }

const REQUIRED = ['top', 'bottom', 'shoes']
const REQUIRED_NAME = { top: 'top', bottom: 'pants', shoes: 'shoes' }
const MISSING_PENALTY = 5 // points out of 10, per missing top / pants / shoes
const WEIGHTS = { color: 0.35, formality: 0.25, focus: 0.15, proportion: 0.15, impact: 0.1 }

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const list = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const isLoud = (c) => !NEUTRAL.has(c)
const lightOf = (it) => COLORS[it.color]?.light ?? 50
const present = (it) => !!it && !it.empty

// Rule 3: same family / neighbours (<=45deg), triadic (105-135deg) or opposites (>=150deg) work.
function harmonious(a, b) {
  const d = Math.abs(a - b)
  const diff = Math.min(d, 360 - d)
  return diff <= 45 || (diff >= 105 && diff <= 135) || diff >= 150
}

/**
 * picked: { headtop, glasses, top, bottom, shoes }, each an item or undefined.
 * seed: any string; keeps the tagline stable for the same outfit.
 * Returns { score, colorMatch, styleImpact, label, tagline, reasons }.
 */
export function rateOutfit(picked, seed = '') {
  const missing = REQUIRED.filter((s) => !present(picked[s]))
  const entries = Object.entries(picked)
    .filter(([, it]) => present(it))
    .map(([slot, it]) => ({ slot, it, hair: it.type === 'hair' }))
  const styled = entries.filter((e) => !e.hair) // hair is neutral for everything except loud colors

  const notes = [] // { text, good, weight }
  const note = (text, good, weight) => notes.push({ text, good, weight })
  if (missing.length) note(`Missing ${list(missing.map((s) => REQUIRED_NAME[s]))}`, false, 10)

  // ---------- Color Match (rules 1-4) ----------
  let colorMatch = 0
  if (entries.length) {
    colorMatch = 80
    const inPalette = entries.filter((e) => !e.hair || isLoud(e.it.color))
    const palette = new Set(inPalette.map((e) => e.it.color))
    const loud = [...palette].filter(isLoud)

    let area = 0
    let loudArea = 0
    for (const e of inPalette) {
      const a = AREA[e.slot] ?? 0.1
      area += a
      if (isLoud(e.it.color)) loudArea += a
    }
    const loudShare = area ? loudArea / area : 0

    if (palette.size > 3) {
      colorMatch -= 8 + 14 * (palette.size - 4)
      note('Too many colors in one look', false, 4)
    }
    if (loud.length >= 3) {
      colorMatch -= 15
      note('Too many loud colors', false, 6)
    }
    if (loudShare > 0.5) {
      colorMatch -= Math.min(30, (loudShare - 0.5) * 80)
      note('Loud color takes over', false, 5)
    }
    const hues = [...new Set(loud.map((c) => COLORS[c]?.hue).filter((h) => h !== undefined))]
    let tension = 0
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) if (!harmonious(hues[i], hues[j])) tension++
    }
    if (tension) {
      colorMatch -= Math.min(36, 18 * tension)
      note('Colors fight on the color wheel', false, 6)
    }

    if (loudShare <= 0.3) colorMatch += 10 // neutral base
    if (loud.length === 0 && inPalette.length >= 2) note('Clean neutral palette', true, 2)
    if (loud.length === 1 && loudShare <= 0.3) note('One bold accent, nicely done', true, 3)

    if (present(picked.top) && present(picked.bottom)) {
      const gap = Math.abs(lightOf(picked.top) - lightOf(picked.bottom))
      if (gap >= 30) {
        colorMatch += 10
        note('Light-dark contrast works', true, 2)
      } else if (gap <= 12) {
        colorMatch += 5
        note('Tonal look, clean and sleek', true, 2)
      }
    }
    colorMatch = Math.round(clamp(colorMatch))
  }

  // ---------- Style Impact: how loudly the look speaks (hero piece + average) ----------
  const impacts = styled.map((e) => e.it.impact)
  const hero = impacts.length ? Math.max(...impacts) : 0
  const avg = impacts.length ? impacts.reduce((n, v) => n + v, 0) / impacts.length : 0
  const styleImpact = Math.round(clamp(((0.6 * hero + 0.4 * avg) / 5) * 100 - 15 * missing.length))

  // ---------- Formality match (rule 6) ----------
  let formality = 100
  const levels = styled.filter((e) => FORMALITY[e.it.style] !== undefined)
  if (levels.length > 1) {
    const sorted = [...levels].sort((a, b) => FORMALITY[a.it.style] - FORMALITY[b.it.style])
    const lo = sorted[0].it.style
    const hi = sorted[sorted.length - 1].it.style
    const spread = FORMALITY[hi] - FORMALITY[lo]
    if (spread > 1) formality -= Math.min(50, (spread - 1) * 20)
    if (spread >= 2.5) note(`${cap(hi)} and ${lo} clash`, false, 7)
    else if (spread > 1) note('Mixed formality levels', false, 3)
  }
  const level = (it) => FORMALITY[it?.style]
  if (present(picked.top) && present(picked.bottom) && present(picked.shoes) &&
      level(picked.top) && level(picked.bottom) && level(picked.shoes)) {
    const outfitLevel = (level(picked.top) + level(picked.bottom)) / 2
    if (Math.abs(level(picked.shoes) - outfitLevel) >= 1.5) {
      formality -= 15
      note('Shoes don’t match the outfit', false, 5)
    }
  }
  if (styled.length >= 3) {
    const counts = {}
    for (const e of styled) counts[e.it.style] = (counts[e.it.style] ?? 0) + 1
    if (Math.max(...Object.values(counts)) / styled.length >= 0.75) note('Consistent style', true, 2)
  }
  formality = Math.round(clamp(formality))

  // ---------- One focal point (rule 7) ----------
  const focal = styled.filter((e) => e.it.impact >= 4 || isLoud(e.it.color)).length
  const focus = { 0: 70, 1: 100, 2: 80, 3: 55 }[focal] ?? 35
  if (focal === 1) note('One clear statement piece', true, 3)
  else if (focal === 2) note('Two statement pieces compete', false, 3)
  else if (focal >= 3) note('Too many statement pieces', false, 5)
  else if (styled.length >= 3) note('Plays it safe, no focal point', false, 2)

  // ---------- Volume balance (rule 5) ----------
  let proportion = 100
  if (present(picked.top) && present(picked.bottom)) {
    const t = VOLUME[picked.top.fit] ?? 2
    const b = VOLUME[picked.bottom.fit] ?? 2
    if (t >= 3 && b >= 3) {
      proportion = 55
      note('Loose top with loose pants', false, 4)
    } else if (t === 1 && b === 1) {
      proportion = 85
    } else if (Math.max(t, b) >= 3) {
      note('Loose meets fitted, nicely balanced', true, 3)
    }
  }

  // ---------- Score (0-10) ----------
  const raw =
    (WEIGHTS.color * colorMatch + WEIGHTS.formality * formality + WEIGHTS.focus * focus +
      WEIGHTS.proportion * proportion + WEIGHTS.impact * styleImpact) / 10
  const score = Math.round(clamp(raw - MISSING_PENALTY * missing.length, 0, 10) * 10) / 10

  // ---------- Reasons: the biggest problems first, then what works ----------
  const byWeight = (a, b) => b.weight - a.weight
  const bad = notes.filter((n) => !n.good).sort(byWeight)
  const good = notes.filter((n) => n.good).sort(byWeight)
  const reasons = [...bad.slice(0, 2), ...good].slice(0, 3).map((n) => n.text)
  for (const fallback of missing.length ? ['Not a complete outfit'] : ['Balanced overall', 'Easy to wear']) {
    if (reasons.length < 2 && !reasons.includes(fallback)) reasons.push(fallback)
  }

  // ---------- Label + tagline ----------
  const label = score >= 9 ? 'Fire' : score >= 8 ? 'Sharp' : score >= 6 ? 'Solid' : score >= 4 ? 'Mid' : 'Rough'
  const range = score >= 8 ? '8-10' : score >= 6 ? '6-7' : score >= 4 ? '4-5' : '0-3'
  const lines = TAGLINES[range]
  const tagline = lines[hash(`${range}:${seed}`) % lines.length]

  return { score, colorMatch, styleImpact, label, tagline, reasons }
}