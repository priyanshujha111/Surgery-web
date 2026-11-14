// An <img> that casual visitors can't easily save: no right-click / long-press menu, no drag,
// no selection, and a transparent overlay on top so clicks and taps land on the overlay
// instead of the image. Clicks still bubble up, so a wrapping button or link keeps working.
// The overlay is `absolute inset-0`, so the nearest positioned ancestor must hug the image.
// Any other prop (src, alt, className, style, loading, onError...) goes straight to the <img>.
// This only deters casual saving; screenshots and DevTools can still get the image.

const noSave = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserDrag: 'none',
}

const block = (e) => e.preventDefault()

function ProtectedImage({ alt, style, ...imgProps }) {
  return (
    <>
      <img
        {...imgProps}
        alt={alt}
        draggable={false}
        onContextMenu={block}
        onDragStart={block}
        style={{ ...noSave, ...style }}
      />
      <span
        aria-hidden="true"
        onContextMenu={block}
        onDragStart={block}
        className="absolute inset-0"
        style={noSave}
      />
    </>
  )
}

export default ProtectedImage
