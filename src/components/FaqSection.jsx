import { useId, useState } from 'react'
import { surgeryFaqs } from '../data/surgeryFaqs.js'

// Light styles are the base. Every dark rule is prefixed with .faq-section--dark,
// which adds one class of specificity, so it always wins over its light counterpart.
// Colours and fonts come from the theme tokens in index.css.
const styles = `
.faq-section {
  background: var(--color-page);
  font-family: var(--font-body);
}
.faq-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 56px 16px;
}
.faq-inner {
  max-width: 680px;
}
.faq-title {
  margin: 0 0 24px;
  color: var(--color-deep);
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
  text-align: left;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.faq-item {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}
.faq-item.is-open {
  border-color: color-mix(in srgb, var(--color-brand) 55%, white);
  box-shadow: var(--shadow-glow);
}
.faq-heading {
  margin: 0;
}
.faq-button {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--color-deep);
  font: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;
  text-align: left;
  cursor: pointer;
}
.faq-button:focus {
  outline: none;
}
.faq-button:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}
.faq-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--color-brand-ink);
}
.faq-icon-vertical {
  transform-origin: center;
  transition: transform 0.25s ease;
}
.faq-item.is-open .faq-icon-vertical {
  transform: scaleY(0);
}
.faq-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  visibility: hidden;
  transition: grid-template-rows 0.3s ease, opacity 0.3s ease, visibility 0s linear 0.3s;
}
.faq-item.is-open .faq-panel {
  grid-template-rows: 1fr;
  opacity: 1;
  visibility: visible;
  transition: grid-template-rows 0.3s ease, opacity 0.3s ease, visibility 0s;
}
.faq-panel-inner {
  min-height: 0;
  overflow: hidden;
}
.faq-answer {
  margin: 0;
  padding: 0 20px 20px;
  color: #475569;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.7;
}
@media (min-width: 640px) {
  .faq-container {
    padding: 72px 24px;
  }
  .faq-button {
    padding: 20px 24px;
    font-size: 1.0625rem;
  }
  .faq-answer {
    padding: 0 24px 22px;
  }
}

/* Dark variant: centred, deep-to-ink with brand accents */
.faq-section--dark {
  background:
    radial-gradient(ellipse 50% 45% at 50% 0%, color-mix(in srgb, var(--color-brand) 14%, transparent), transparent 70%),
    radial-gradient(ellipse 45% 50% at 100% 100%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 70%),
    linear-gradient(180deg, var(--color-deep), var(--color-ink));
}
.faq-section--dark .faq-container {
  padding: 64px 16px;
}
.faq-section--dark .faq-inner {
  max-width: 770px;
  margin: 0 auto;
}
.faq-section--dark .faq-title {
  max-width: 640px;
  margin: 0 auto 40px;
  color: #fff;
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;
  text-wrap: balance;
}
.faq-section--dark .faq-list {
  gap: 12px;
}
.faq-section--dark .faq-item {
  background: rgb(255 255 255 / 0.04);
  border-color: rgb(255 255 255 / 0.1);
  box-shadow: none;
}
.faq-section--dark .faq-item:not(.is-open):hover {
  border-color: rgb(255 255 255 / 0.22);
}
.faq-section--dark .faq-item.is-open {
  border-color: color-mix(in srgb, var(--color-brand) 60%, transparent);
  background: rgb(255 255 255 / 0.06);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-brand) 15%, transparent), 0 16px 40px rgb(0 0 0 / 0.35);
}
.faq-section--dark .faq-button {
  padding: 18px;
  color: #cbd5e1;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.25s ease;
}
.faq-section--dark .faq-item:not(.is-open):hover .faq-button {
  color: #fff;
}
.faq-section--dark .faq-item.is-open .faq-button {
  color: #fff;
}
.faq-section--dark .faq-button:focus-visible {
  outline-color: var(--color-brand);
}
.faq-section--dark .faq-icon {
  color: var(--color-brand);
  transition: transform 0.3s ease;
}
.faq-section--dark .faq-item.is-open .faq-icon {
  transform: rotate(180deg);
}
.faq-section--dark .faq-answer {
  padding: 0 18px 18px;
  color: #a8b3c7;
  font-size: 0.9375rem;
  line-height: 1.75;
}
@media (min-width: 640px) {
  .faq-section--dark .faq-container {
    padding: 96px 24px;
  }
  .faq-section--dark .faq-title {
    margin-bottom: 56px;
  }
  .faq-section--dark .faq-button {
    padding: 22px 24px;
    font-size: 1.0625rem;
  }
  .faq-section--dark .faq-answer {
    padding: 0 24px 22px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .faq-item,
  .faq-icon-vertical,
  .faq-panel,
  .faq-item.is-open .faq-panel,
  .faq-section--dark .faq-button,
  .faq-section--dark .faq-icon {
    transition: none;
  }
}
`

function PlusMinusIcon() {
  return (
    <svg
      className="faq-icon"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 10h12" />
      <path className="faq-icon-vertical" d="M10 4v12" />
    </svg>
  )
}

// Points down; the dark variant rotates it 180° when the item is open.
function ChevronIcon() {
  return (
    <svg
      className="faq-icon"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

function FaqSection({
  title = 'Frequently asked questions',
  items = surgeryFaqs,
  variant = 'light', // 'light' | 'dark'
  defaultOpen = null, // index of the item open on first render, or null
}) {
  const [openIndex, setOpenIndex] = useState(defaultOpen)
  const baseId = useId()
  const titleId = `${baseId}-title`
  const isDark = variant === 'dark'

  if (!items.length) return null

  return (
    <section
      className={`faq-section${isDark ? ' faq-section--dark' : ''}`}
      aria-labelledby={titleId}
    >
      <style>{styles}</style>
      <div className="faq-container">
        <div className="faq-inner">
          <h2 id={titleId} className="faq-title">
            {title}
          </h2>
          <ul className="faq-list">
            {items.map((item, i) => {
              const isOpen = openIndex === i
              const buttonId = `${baseId}-q${i}`
              const panelId = `${baseId}-a${i}`
              return (
                <li key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                  <h3 className="faq-heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="faq-button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                    >
                      <span>{item.question}</span>
                      {isDark ? <ChevronIcon /> : <PlusMinusIcon />}
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="faq-panel">
                    <div className="faq-panel-inner">
                      <p className="faq-answer">{item.answer}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
