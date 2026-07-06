# Animations Handbook

A guidebook for animating on the web with plain HTML, CSS, and
JavaScript — no frameworks, no libraries.

## Who this is for

You should already be comfortable writing plain HTML, CSS, and JS. This
guide doesn't teach the languages themselves — it teaches what to do with
them to make things move. No prior animation experience assumed.

## Chapter format

Every chapter follows the same ten-section structure, in this order:

1. **Theory** — what the technique is and why it works the way it does.
2. **Browser internals** — the rendering behavior (layout/paint/composite)
   behind the technique, and what that costs.
3. **Step-by-step implementation** — the full working code, commented and
   built up piece by piece, so you can see exactly why each part exists.
4. **Live interactive demo** — a working version embedded in the page.
   Play with it, change its inputs, watch what breaks, before reading
   further.
5. **Exercises** — small modifications to make to the demo yourself. Do
   these before moving on; they're how you confirm you actually understood
   the technique rather than just recognizing it.
6. **Common mistakes** — the specific ways people get this technique
   wrong, and why those mistakes happen.
7. **Performance considerations** — what this technique costs the browser,
   and how to keep it cheap.
8. **Accessibility considerations** — the concrete keyboard/screen-reader
   fallback for this specific technique, not a generic disclaimer.
9. **Mobile considerations** — how the technique degrades or adapts
   without a mouse/hover/large viewport.
10. **Browser compatibility** — a support table with the earliest version
    per major browser, and any caveats.

Read the demo and its source side by side — the explanation clicks once
you've seen the code move, not before.

## Suggested path

Chapters don't require each other, but if you're new to web animation
altogether, this order builds understanding in layers instead of
scattering it:

1. **Core Engines** first — these are the three fundamentally different
   ways to animate on the web (declarative CSS, observer-driven JS,
   imperative Canvas). Everything else is a variation on one of these
   three.
2. **CSS Properties** next — goes deep on the declarative engine from
   step 1, one animatable property at a time.
3. **Text**, **Mouse Interactions**, and **SVG** after that, in any
   order — each combines the engines above into a specific category of
   effect. Mouse Interactions in particular reuses the pointer-tracking
   pattern introduced in the Core Engines' Canvas chapter, so it lands
   easier once that one's done.

If you already know which effect you need, skip straight to it — the
chapters don't assume you've read the others.

## Table of Contents

**Core Engines**
- [CSS Transitions & Transform Basics](docs/css-basics/transitions.html)
- [Scroll Reveal with IntersectionObserver](docs/scroll/intersection-reveal.html)
- [Canvas Particle System](docs/canvas/particles.html)

**CSS Properties**
- [Opacity & Compositing](docs/css-properties/opacity-compositing.html)
- [Transform Variants](docs/css-properties/transform-variants.html)
- [Filters & Masking](docs/css-properties/filters-masking.html)
- [Shadows & Gradients](docs/css-properties/shadows-gradients.html)
- [CSS Custom Properties & @property](docs/css-properties/custom-properties.html)

**Text Animations**
- [Split Text Foundations](docs/text/split-text-foundations.html)
- [Typing & Scramble Effects](docs/text/typing-scramble.html)
- [Letter/Word Reveal & Stagger](docs/text/letter-word-reveal.html)
- [Gradient Text & Underline Animation](docs/text/gradient-underline.html)
- [Counter & Number Animation](docs/text/counter-number.html)

**Mouse Interactions**
- [Cursor Tracking & Mouse Follower](docs/mouse/cursor-follower.html)
- [Magnetic Buttons](docs/mouse/magnetic-buttons.html)
- [Tilt Cards](docs/mouse/tilt-cards.html)
- [Ripple & Spotlight Effects](docs/mouse/ripple-spotlight.html)
- [Hover Reveal & Image Distortion](docs/mouse/hover-distortion.html)

**SVG**
- [Path Drawing](docs/svg/path-drawing.html)
- [Shape Morphing](docs/svg/shape-morphing.html)
- [Animated Icons](docs/svg/animated-icons.html)
- [SVG Filters & Effects](docs/svg/svg-filters.html)
- [SMIL vs CSS vs JS Animation](docs/svg/smil-css-js-comparison.html)
