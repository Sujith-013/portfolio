// @flow strict

// Flat hover card shell for Experience/Education. Replaces the old
// mouse-tracked GlowCard (card.scss's conic-gradient + blur "glow"
// effect, plus a pointermove listener) — see docs/DESIGN-SYSTEM.md
// "Audit: gradients, glow, blur, decorative stripes" for why that was
// removed rather than recolored. The border swap on hover is an instant
// color change, not a transition — see docs/DESIGN-SYSTEM.md "Audit:
// motion restraint" for why an eased hover was removed here.
const Card = ({ children }) => (
  <article className="h-fit cursor-pointer border border-border bg-surface text-text-secondary rounded-md hover:border-accent w-full">
    {children}
  </article>
);

export default Card;
