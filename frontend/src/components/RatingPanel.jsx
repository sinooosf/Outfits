// STAGE 1 PLACEHOLDER: just reserves the space and shows the glass shells.
// Stage 2 replaces this with the real rating (score, Color Match, Style Impact).
export default function RatingPanel() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-2.5 px-4 md:px-0" aria-hidden="true">
      <div className="glass h-[76px] w-full rounded-[26px] md:h-[116px] md:w-[min(46vw,770px)] md:rounded-[34px]" />
      <div className="glass h-[52px] w-full rounded-[22px] md:hidden" />
    </div>
  )
}
