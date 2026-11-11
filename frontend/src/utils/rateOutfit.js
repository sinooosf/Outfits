import { TAGLINES } from '../data/taglines'

// ---------- Rules (tweak the numbers here) ----------
const NEUTRAL = new Set(['black', 'white', 'gray', 'beige', 'navy']) // everything else is "loud"
const REQUIRED = ['top', 'bottom', 'shoes']
const REQUIRED_NAME = { top: 'top', bottom: 'pants', shoes: 'shoes' }
const MISSING_PENALTY = 5 // points (out of 10) for each missing top / pants / shoes
const LOUD_PENALTY = 22 // % Color Match lost for each loud color after the first
const SHADE_PENALTY = 8 // % Color Match lost for each different neutral beyond 3
const CLASH_PENALTY = 15 // % cohesion lost when two styles fight
const CLASHES = [['formal', 'sporty'], ['formal', 'survival']]
const WEIGHTS = { color: 0.45, impact: 0.25, cohesion: 0.3 }

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const list = (a) => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`)
const hash = (s) => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * picked: { headtop, glasses, top, bottom, shoes }, each an item or undefined.
 * Empty items (nothing on head / no glasses) and hair are neutral: no penalty, no bonus.
 * A missing top, pants or shoes is a big penalty.
 * seed: any string, keeps the tagline stable for the same outfit.
 */
export function rateOutfit(picked, seed = '') {
  const missing = REQUIRED.filter((s) => !picked[s] || picked[s].empty)
  const worn = Object.values(picked).filter((it) => it && !it.empty)

  // ----- Color Match -----
  const colors = worn.map((i) => i.color)
  const loud = colors.filter((c) => !NEUTRAL.has(c)).length
  const shades = new Set(colors.filter((c) => NEUTRAL.has(c))).size
  let colorMatch = worn.length ? 100 : 0
  if (loud > 1) colorMatch -= LOUD_PENALTY * (loud - 1)
  if (shades > 3) colorMatch -= SHADE_PENALTY * (shades - 3)
  colorMatch = Math.round(clamp(colorMatch))

  // ----- Style Impact: how loudly the pieces speak (avg impact 1-5), dulled by missing pieces -----
  const avg = worn.length ? worn.reduce((n, i) => n + i.impact, 0) / worn.length : 0
  const styleImpact = Math.round(clamp((avg / 5) * 100 - 15 * missing.length))

  // ----- Cohesion: do the pieces share one style? (internal, feeds the score) -----
  const counts = {}
  for (const it of worn) counts[it.style] = (counts[it.style] ?? 0) + 1
  const share = worn.length ? Math.max(...Object.values(counts)) / worn.length : 0
  const clash = CLASHES.find(([a, b]) => counts[a] && counts[b])
  const cohesion = worn.length ? clamp(50 + 50 * share - (clash ? CLASH_PENALTY : 0)) : 0

  // ----- Score (0-10) -----
  const raw = (WEIGHTS.color * colorMatch + WEIGHTS.impact * styleImpact + WEIGHTS.cohesion * cohesion) / 10
  const score = Math.round(clamp(raw - MISSING_PENALTY * missing.length, 0, 10) * 10) / 10

  // ----- Reasons (2-3 short strings) -----
  const bad = []
  const good = []
  if (missing.length) bad.push(`Missing ${list(missing.map((s) => REQUIRED_NAME[s]))}`)
  if (loud > 1) bad.push('Too many loud colors')
  if (shades > 3) bad.push('Too many different shades')
  if (clash) bad.push(`${cap(clash[0])} and ${clash[1]} clash`)
  if (worn.length >= 3 && share < 0.5) bad.push('Styles are all over the place')
  if (loud === 0 && worn.length >= 2) good.push('Clean neutral palette')
  if (loud === 1) good.push('One bold color, nicely done')
  if (worn.length >= 3 && share >= 0.75) good.push('Consistent style')
  if (styleImpact >= 70) good.push('Strong statement pieces')
  if (styleImpact < 45 && !missing.length) good.push('Plays it very safe')
  const reasons = [...bad.slice(0, 2), ...good].slice(0, 3)
  for (const fallback of missing.length ? ['Not a complete outfit'] : ['Balanced overall', 'Easy to wear']) {
    if (reasons.length < 2 && !reasons.includes(fallback)) reasons.push(fallback)
  }

  // ----- Label + tagline -----
  const label = score >= 9 ? 'Fire' : score >= 8 ? 'Sharp' : score >= 6 ? 'Solid' : score >= 4 ? 'Mid' : 'Rough'
  const range = score >= 8 ? '8-10' : score >= 6 ? '6-7' : score >= 4 ? '4-5' : '0-3'
  const lines = TAGLINES[range]
  const tagline = lines[hash(`${range}:${seed}`) % lines.length]

  return { score, colorMatch, styleImpact, label, tagline, reasons }
}
