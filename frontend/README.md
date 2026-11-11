# Outfit

React (Vite) + Tailwind CSS v4 + Phosphor icons + Framer Motion. No backend.

    npm install
    npm run dev        # http://localhost:5173  (also reachable from your phone on the same Wi-Fi)

## Adding / swapping clothes
Drop a transparent PNG into `public/clothes/` and add one line to `src/data/clothes.js`.
Rows: `headtop` (caps + hair, `type: 'cap' | 'hair'`), `glasses` (`type: 'glasses'`), `top`, `bottom`, `shoes`.
`headtop` and `glasses` get an empty item first automatically. Each row loops (min 2 items).
Tag every item with `color`, `style` and `impact`: the rating reads those.

## Rating
`src/utils/rateOutfit.js` holds the rules (the numbers at the top are the knobs).
`src/data/taglines.js` holds the funny lines, 6+ per score range.

## Structure
    src/components/Layer.jsx          one carousel row (scroll-snap, faded neighbours, drag, loop)
    src/components/TopBar.jsx         theme, language menu, stylist, cabinet, account, favorite
    src/components/RatingPanel.jsx    live rating + Analyze button
    src/components/Sheet.jsx          bottom sheet used by Analyze / stylist / cabinet / account
    src/data/clothes.js               items + defaults
    src/data/taglines.js              taglines per score range
    src/utils/rateOutfit.js           rule-based rating
    src/utils/storage.js              safe localStorage helpers
    src/hooks/                        useTheme, useLang, useOutfits (cabinet), useCountUp
    src/i18n.js                       EN / FR / AR UI strings
