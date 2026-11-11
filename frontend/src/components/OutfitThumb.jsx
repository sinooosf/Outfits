import ClothesImage from './ClothesImage'
import { SLOTS } from '../data/clothes'

// How much of the thumbnail height each row gets.
const SHARE = { headtop: 14, glasses: 9, top: 32, bottom: 33, shoes: 12 }

// Small static picture of an outfit (used in the cabinet). items = { headtop, glasses, ... }
export default function OutfitThumb({ items }) {
  return (
    <div className="flex h-28 w-[4.5rem] shrink-0 flex-col" aria-hidden="true">
      {SLOTS.map((s) => (
        <div key={s} className="min-h-0" style={{ flex: `${SHARE[s]} 1 0` }}>
          {items[s] && !items[s].empty && <ClothesImage src={items[s].image} alt="" slot={s} />}
        </div>
      ))}
    </div>
  )
}
