// @flow strict

// Flat hover card shell for Experience/Education. Replaces the old
// mouse-tracked GlowCard (card.scss's conic-gradient + blur "glow"
// effect, plus a pointermove listener) — see docs/DESIGN-SYSTEM.md
// "Audit: gradients, glow, blur, decorative stripes" for why that was
// removed rather than recolored. No JS is needed for a border-color
// transition, so this is a plain server component, not a client one.
const Card = ({ children }) => (
  <article className="h-fit cursor-pointer border border-border bg-surface text-text-secondary rounded-xl transition-colors duration-300 hover:border-accent w-full">
    {children}
  </article>
);

export default Card;
