// Every item: { id, layer, slot, name, image, color, style, impact }
//   layer  : "head" | "top" | "bottom" | "shoes"
//   slot   : which carousel row it lives in. The "head" layer has two rows
//            ("cap" and "glasses"); every other layer has one row (slot === layer).
//   color  : black | white | gray | beige | navy are "neutral", anything else is "loud"
//   style  : casual | streetwear | sporty | formal | survival
//   impact : 1-5 (how much the piece "speaks")
// Images are transparent PNGs in /public/clothes. Swap them with your own files;
// to add an item, drop in a PNG and add one line below.

const img = (file) => `/clothes/${file}.png`

export const CLOTHES = [
  // ---- Layer 1a: caps ----
  { id: 'cap-1', layer: 'head', slot: 'cap', name: 'Black Sport Cap', image: img('cap-1'), color: 'black', style: 'sporty', impact: 3 },
  { id: 'cap-2', layer: 'head', slot: 'cap', name: 'Fitted Street Cap', image: img('cap-2'), color: 'black', style: 'streetwear', impact: 4 },
  { id: 'cap-3', layer: 'head', slot: 'cap', name: 'Bandana Cap', image: img('cap-3'), color: 'black', style: 'streetwear', impact: 4 },
  { id: 'cap-4', layer: 'head', slot: 'cap', name: 'Bucket Hat', image: img('cap-4'), color: 'black', style: 'casual', impact: 3 },

  // ---- Layer 1b: glasses ----
  { id: 'glasses-1', layer: 'head', slot: 'glasses', name: 'Black Sunglasses', image: img('glasses-1'), color: 'black', style: 'streetwear', impact: 3 },
  { id: 'glasses-2', layer: 'head', slot: 'glasses', name: 'Wire Rim Glasses', image: img('glasses-2'), color: 'gray', style: 'formal', impact: 2 },
  { id: 'glasses-3', layer: 'head', slot: 'glasses', name: 'Classic Frames', image: img('glasses-3'), color: 'black', style: 'casual', impact: 2 },
  { id: 'glasses-4', layer: 'head', slot: 'glasses', name: 'Clear Frames', image: img('glasses-4'), color: 'white', style: 'casual', impact: 2 },

  // ---- Layer 2: hoodie / t-shirt ----
  { id: 'top-1', layer: 'top', slot: 'top', name: 'Zip Polo', image: img('top-1'), color: 'black', style: 'casual', impact: 2 },
  { id: 'top-2', layer: 'top', slot: 'top', name: 'Black Shirt', image: img('top-2'), color: 'black', style: 'formal', impact: 3 },
  { id: 'top-3', layer: 'top', slot: 'top', name: 'Gray Hoodie', image: img('top-3'), color: 'gray', style: 'streetwear', impact: 4 },
  { id: 'top-4', layer: 'top', slot: 'top', name: 'Puffer Jacket', image: img('top-4'), color: 'black', style: 'streetwear', impact: 5 },

  // ---- Layer 3: pants ----
  { id: 'bottom-1', layer: 'bottom', slot: 'bottom', name: 'Gray Sweatpants', image: img('bottom-1'), color: 'gray', style: 'sporty', impact: 2 },
  { id: 'bottom-2', layer: 'bottom', slot: 'bottom', name: 'Track Pants', image: img('bottom-2'), color: 'white', style: 'sporty', impact: 4 },
  { id: 'bottom-3', layer: 'bottom', slot: 'bottom', name: 'Wide Black Pants', image: img('bottom-3'), color: 'black', style: 'streetwear', impact: 3 },
  { id: 'bottom-4', layer: 'bottom', slot: 'bottom', name: 'Relaxed Black Pants', image: img('bottom-4'), color: 'black', style: 'casual', impact: 3 },

  // ---- Layer 4: shoes ----
  { id: 'shoes-1', layer: 'shoes', slot: 'shoes', name: 'Panda Sneakers', image: img('shoes-1'), color: 'white', style: 'streetwear', impact: 4 },
  { id: 'shoes-2', layer: 'shoes', slot: 'shoes', name: 'Suede Trainers', image: img('shoes-2'), color: 'black', style: 'streetwear', impact: 3 },
  { id: 'shoes-3', layer: 'shoes', slot: 'shoes', name: 'Chunky Loafers', image: img('shoes-3'), color: 'black', style: 'formal', impact: 3 },
  { id: 'shoes-4', layer: 'shoes', slot: 'shoes', name: 'Terrace Sneakers', image: img('shoes-4'), color: 'black', style: 'casual', impact: 3 },
]

// Carousel rows, top to bottom. `grow` is the share of the screen height.
// The "head" layer is two stacked rows (cap above glasses), as in the design.
export const SLOTS = ['cap', 'glasses', 'top', 'bottom', 'shoes']

export const ITEMS_BY_SLOT = SLOTS.reduce((acc, slot) => {
  acc[slot] = CLOTHES.filter((c) => c.slot === slot)
  return acc
}, {})

// What's on screen the first time (matches the design: cap, sunglasses, gray hoodie,
// black pants, panda sneakers). Values are indexes inside each row's item list.
export const DEFAULT_SELECTION = { cap: 0, glasses: 0, top: 2, bottom: 2, shoes: 0 }
