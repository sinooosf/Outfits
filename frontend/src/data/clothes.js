// Every item: { id, layer, type?, name, image, color, style, impact }
//   layer  : "head" | "top" | "bottom" | "shoes"
//   type   : only for the "head" layer: "cap" | "hair" | "glasses"
//   color  : black | white | gray | beige | navy are "neutral", anything else is "loud"
//   style  : casual | streetwear | sporty | formal | survival
//   impact : 1-5 (how much the piece "speaks")
//   fit    : optional, tops and pants only: slim | regular | loose (default regular). The rating
//            balances loose with fitted, so tag baggy pieces "loose".
// Images are transparent PNGs in /public/clothes. Swap them with your own files;
// to add an item, drop in a PNG and add one line below.
//
// Rows (carousels), top to bottom: headtop (empty, caps, hair), glasses (empty, glasses),
// top, bottom, shoes. The "empty" items are added automatically below, you never list them.

const img = (file) => `/clothes/${file}.png`

export const CLOTHES = [
  // ---- Layer 1a: head-top row (caps and hair share one row, so only one shows) ----
  { id: 'cap-1', layer: 'head', type: 'cap', name: 'Black Sport Cap', image: img('cap-1'), color: 'black', style: 'sporty', impact: 3 },
  { id: 'cap-2', layer: 'head', type: 'cap', name: 'Fitted Street Cap', image: img('cap-2'), color: 'black', style: 'streetwear', impact: 4 },
  { id: 'cap-3', layer: 'head', type: 'cap', name: 'Bandana Cap', image: img('cap-3'), color: 'black', style: 'streetwear', impact: 4 },
  { id: 'cap-4', layer: 'head', type: 'cap', name: 'Bucket Hat', image: img('cap-4'), color: 'black', style: 'casual', impact: 3 },
  { id: 'hair-1', layer: 'head', type: 'hair', name: 'Hair 1', image: '/clothes/hair-1.png', color: 'black', style: 'casual', impact: 6 },

  // ---- Layer 1b: glasses row ----
  { id: 'glasses-1', layer: 'head', type: 'glasses', name: 'Black Sunglasses', image: img('glasses-1'), color: 'black', style: 'streetwear', impact: 4 },
  { id: 'glasses-2', layer: 'head', type: 'glasses', name: 'Wire Rim Glasses', image: img('glasses-2'), color: 'gray', style: 'formal', impact: 2 },
  { id: 'glasses-3', layer: 'head', type: 'glasses', name: 'Classic Frames', image: img('glasses-3'), color: 'black', style: 'casual', impact: 2 },
  { id: 'glasses-4', layer: 'head', type: 'glasses', name: 'Clear Frames', image: img('glasses-4'), color: 'white', style: 'casual', impact: 2 },

  // ---- Layer 2: hoodie / t-shirt ----
  { id: 'top-1', layer: 'top', name: 'Zip Polo', image: img('top-1'), color: 'black', style: 'casual', impact: 6, fit: 'regular' },
  { id: 'top-2', layer: 'top', name: 'Black Shirt', image: img('top-2'), color: 'black', style: 'formal', impact: 3, fit: 'regular' },
  { id: 'top-3', layer: 'top', name: 'Gray Hoodie', image: img('top-3'), color: 'gray', style: 'streetwear', impact: 4, fit: 'loose' },
  { id: 'top-4', layer: 'top', name: 'Puffer Jacket', image: img('top-4'), color: 'black', style: 'streetwear', impact: 5, fit: 'loose' },

  // ---- Layer 3: pants ----
  { id: 'bottom-1', layer: 'bottom', name: 'Gray Sweatpants', image: img('bottom-1'), color: 'gray', style: 'sporty', impact: 2, fit: 'regular' },
  { id: 'bottom-2', layer: 'bottom', name: 'Track Pants', image: img('bottom-2'), color: 'white', style: 'sporty', impact: 4, fit: 'slim' },
  { id: 'bottom-3', layer: 'bottom', name: 'Wide Black Pants', image: img('bottom-3'), color: 'black', style: 'streetwear', impact: 3, fit: 'loose' },
  { id: 'bottom-4', layer: 'bottom', name: 'Relaxed Black Pants', image: img('bottom-4'), color: 'black', style: 'casual', impact: 3, fit: 'loose' },

  // ---- Layer 4: shoes ----
  { id: 'shoes-1', layer: 'shoes', name: 'Panda Sneakers', image: img('shoes-1'), color: 'white', style: 'streetwear', impact: 4 },
  { id: 'shoes-2', layer: 'shoes', name: 'Suede Trainers', image: img('shoes-2'), color: 'black', style: 'streetwear', impact: 3 },
  { id: 'shoes-3', layer: 'shoes', name: 'Chunky Loafers', image: img('shoes-3'), color: 'black', style: 'formal', impact: 6 },
  { id: 'shoes-4', layer: 'shoes', name: 'Terrace Sneakers', image: img('shoes-4'), color: 'black', style: 'casual', impact: 3 },
]

// Carousel rows, top to bottom.
export const SLOTS = ['headtop', 'glasses', 'top', 'bottom', 'shoes']

// Rows that can be left empty ("not wearing it"). The other rows can never be empty.
export const OPTIONAL_SLOTS = ['glasses']

// Which row an item lives in.
export const rowOf = (c) =>
  c.layer === 'head' ? (c.type === 'glasses' ? 'glasses' : 'headtop') : c.layer

// The blank item: renders nothing, but takes the same space as a real item.
const emptyItem = (slot) => ({
  id: `empty-${slot}`,
  layer: 'head',
  type: 'empty',
  empty: true,
  name: slot === 'glasses' ? 'No glasses' : 'Nothing on head',
  image: null,
  color: 'none',
  style: 'none',
  impact: 0,
})

export const ITEMS_BY_SLOT = SLOTS.reduce((acc, slot) => {
  const items = CLOTHES.filter((c) => rowOf(c) === slot)
  acc[slot] = OPTIONAL_SLOTS.includes(slot) ? [emptyItem(slot), ...items] : items
  return acc
}, {})

// What's on screen the first time (cap, sunglasses, gray hoodie, wide black pants,
// panda sneakers). Values are indexes inside each row's list (index 0 of headtop and
// glasses is the empty item).
export const DEFAULT_SELECTION = { headtop: 1, glasses: 1, top: 2, bottom: 2, shoes: 0 }