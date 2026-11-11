# Outfit

React (Vite) + Tailwind CSS v4 + Phosphor icons + Framer Motion. No backend.

    npm install
    npm run dev        # http://localhost:5173  (also reachable from your phone on the same Wi-Fi)

## Adding / swapping clothes
Drop a transparent PNG into `public/clothes/` and add one line to `src/data/clothes.js`.
Layers: `cap` and `glasses` (together = Layer 1), `top`, `bottom`, `shoes`.
Each row loops, so it works with any number of items (min 2).

## Structure
    src/components/Layer.jsx        one carousel row (scroll-snap, faded neighbours, drag, loop)
    src/components/TopBar.jsx       top icons
    src/components/RatingPanel.jsx  stage-1 placeholder
    src/data/clothes.js             items + defaults
    src/utils/storage.js            safe localStorage helpers
    src/hooks/useTheme.js           dark / light
