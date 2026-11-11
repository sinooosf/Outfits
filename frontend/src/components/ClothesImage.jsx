import { useEffect, useState } from 'react'

// Simple stand-in shapes, shown when an image file is missing.
const SHAPES = {
  cap: 'h-[62%] w-[70%] rounded-t-full rounded-b-lg',
  glasses: 'h-[55%] w-[80%] rounded-xl',
  top: 'h-[90%] w-[62%] rounded-3xl',
  bottom: 'h-[94%] w-[42%] rounded-2xl',
  shoes: 'h-[55%] w-[75%] rounded-full',
}

export default function ClothesImage({ src, alt, slot, position = 'center' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center" style={{ alignItems: position === 'center' ? 'center' : position.includes('bottom') ? 'flex-end' : 'flex-start' }}>
        <div className={`glass border-dashed ${SHAPES[slot] ?? SHAPES.top}`} role="img" aria-label={alt} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      decoding="async"
      onError={() => setFailed(true)}
      className="pointer-events-none h-full w-full select-none object-contain"
      style={{ objectPosition: position }}
    />
  )
}
