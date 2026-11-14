import { useEffect, useRef } from 'react'
import ProtectedImage from './ProtectedImage.jsx'

// Full-size image viewer. `item` = { src, fullSrc?, alt, title }; renders nothing when null.
// Shows `fullSrc` (a higher-resolution file) when given, otherwise `src`.
// Closes on Esc, backdrop click or the close button, and locks body scroll while open.
function ImageLightbox({ item, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!item) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-3 backdrop-blur-sm sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-xl bg-white p-2 shadow-2xl sm:p-3"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-1 right-1 z-10 flex sm:-top-3 sm:-right-3 h-10 w-10 items-center justify-center rounded-lg border-2 border-brand bg-ink text-white shadow-glow transition-colors hover:bg-brand hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {/* `relative` gives ProtectedImage's overlay the image's box (not the title or close button). */}
        <div className="relative">
          <ProtectedImage
            src={item.fullSrc ?? item.src}
            alt={item.alt}
            // With known dimensions, scale up to fill the viewport (by width or height, whichever runs out first).
            style={item.width ? { width: `min(100vw, calc((100vh - 7rem) * ${item.width / item.height}))` } : undefined}
            className="block h-auto max-h-[calc(100vh-7rem)] w-auto max-w-[calc(100vw-2.5rem)] object-contain sm:max-w-[calc(100vw-5rem)]"
          />
        </div>
        <p className="mt-2 text-center font-display text-sm font-semibold text-ink sm:text-base">
          {item.title}
        </p>
      </div>
    </div>
  )
}

export default ImageLightbox






