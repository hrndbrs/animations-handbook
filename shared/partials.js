// shared/partials.js
// Native Web Components for the shared header, nav, and footer. Uses light
// DOM (no shadow root) so shared/doc-page.css applies normally, and inline
// template strings (no fetch()) so the header/nav/footer render with zero
// server dependency (the site as a whole still requires a server, since
// browsers block ES module script loading over file:// regardless).

const CHAPTERS = [
  { href: 'docs/css-basics/transitions.html', title: 'CSS Transitions & Transform Basics', category: 'CSS Basics' },
  { href: 'docs/scroll/intersection-reveal.html', title: 'Scroll Reveal with IntersectionObserver', category: 'Scroll' },
  { href: 'docs/canvas/particles.html', title: 'Canvas Particle System', category: 'Canvas' },
  { href: 'docs/css-properties/opacity-compositing.html', title: 'Opacity & Compositing', category: 'CSS Properties' },
  { href: 'docs/css-properties/transform-variants.html', title: 'Transform Variants', category: 'CSS Properties' },
  { href: 'docs/css-properties/filters-masking.html', title: 'Filters & Masking', category: 'CSS Properties' },
  { href: 'docs/css-properties/shadows-gradients.html', title: 'Shadows & Gradients', category: 'CSS Properties' },
  { href: 'docs/css-properties/custom-properties.html', title: 'CSS Custom Properties & @property', category: 'CSS Properties' },
  { href: 'docs/text/split-text-foundations.html', title: 'Split Text Foundations', category: 'Text' },
  { href: 'docs/text/typing-scramble.html', title: 'Typing & Scramble Effects', category: 'Text' },
  { href: 'docs/text/letter-word-reveal.html', title: 'Letter/Word Reveal & Stagger', category: 'Text' },
  { href: 'docs/text/gradient-underline.html', title: 'Gradient Text & Underline Animation', category: 'Text' },
  { href: 'docs/text/counter-number.html', title: 'Counter & Number Animation', category: 'Text' },
  { href: 'docs/mouse/cursor-follower.html', title: 'Cursor Tracking & Mouse Follower', category: 'Mouse' },
  { href: 'docs/mouse/magnetic-buttons.html', title: 'Magnetic Buttons', category: 'Mouse' },
  { href: 'docs/mouse/tilt-cards.html', title: 'Tilt Cards', category: 'Mouse' },
  { href: 'docs/mouse/ripple-spotlight.html', title: 'Ripple & Spotlight Effects', category: 'Mouse' },
  { href: 'docs/mouse/hover-distortion.html', title: 'Hover Reveal & Image Distortion', category: 'Mouse' },
  { href: 'docs/svg/path-drawing.html', title: 'Path Drawing', category: 'SVG' },
  { href: 'docs/svg/shape-morphing.html', title: 'Shape Morphing', category: 'SVG' },
  { href: 'docs/svg/animated-icons.html', title: 'Animated Icons', category: 'SVG' },
  { href: 'docs/svg/svg-filters.html', title: 'SVG Filters & Effects', category: 'SVG' },
  { href: 'docs/svg/smil-css-js-comparison.html', title: 'SMIL vs CSS vs JS Animation', category: 'SVG' },
];

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || './';
    this.innerHTML = `
      <header class="site-header">
        <a class="site-header__brand" href="${base}index.html">Animations Handbook</a>
        <button type="button" class="site-header__menu-toggle" aria-expanded="false" aria-controls="site-nav-panel">
          <span class="site-header__menu-icon" aria-hidden="true"></span>
          Menu
        </button>
      </header>
    `;

    // Mobile: the hamburger button shows/hides the whole nav panel. CSS
    // alone handles the hamburger-to-X icon transform (driven by the
    // button's own aria-expanded attribute); a custom event tells <site-nav>
    // (a separate custom element with no direct reference to this one) to
    // animate its panel open/closed, since that motion needs a
    // JS-measured target height rather than a fixed CSS value.
    const toggle = this.querySelector('.site-header__menu-toggle');
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.dispatchEvent(new CustomEvent('nav-toggle', { detail: { open: isOpen } }));
    });
  }
}

class SiteNav extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || './';
    const current = this.getAttribute('current') || '';

    // Group chapters by category, preserving first-appearance order (not
    // alphabetical) so the nav reads in the same order chapters were added.
    const categories = [];
    const byCategory = new Map();
    CHAPTERS.forEach((chapter) => {
      if (!byCategory.has(chapter.category)) {
        byCategory.set(chapter.category, []);
        categories.push(chapter.category);
      }
      byCategory.get(chapter.category).push(chapter);
    });

    // Each category is a native <details>/<summary> disclosure widget:
    // on mobile it's an accordion section (click to expand/collapse that
    // category's links); on desktop the same markup becomes a click-to-open
    // dropdown menu (see shared/doc-page.css). The shared `name` attribute
    // makes the browser keep only one group open at a time, in browsers
    // that support exclusive <details> groups (older browsers just allow
    // more than one open at once — a harmless degradation).
    const groups = categories
      .map((category) => {
        const items = byCategory
          .get(category)
          .map((chapter) => {
            const isCurrent = chapter.href === current;
            const currentAttr = isCurrent ? ' aria-current="page"' : '';
            return `<li><a href="${base}${chapter.href}"${currentAttr}>${chapter.title}</a></li>`;
          })
          .join('');
        // The <details> content is split into two layers: .site-nav__group-panel
        // is the plain, padding-free box whose max-height gets animated
        // (see below) — max-height: 0 cannot fully collapse a box that has
        // its own padding, since the padding still occupies space
        // regardless of the height constraint. The <ul> inside carries all
        // the visual padding/background/border instead, since it isn't
        // itself height-constrained.
        return `
          <details class="site-nav__group" name="site-nav-group">
            <summary class="site-nav__group-title">${category}</summary>
            <div class="site-nav__group-panel">
              <ul>${items}</ul>
            </div>
          </details>
        `;
      })
      .join('');

    // Give the custom element itself a stable id so SiteHeader's hamburger
    // button can reference it via aria-controls, without the two
    // components needing a direct reference to each other.
    if (!this.id) {
      this.id = 'site-nav-panel';
    }

    this.innerHTML = `
      <nav class="site-nav" aria-label="Chapters">
        ${groups}
      </nav>
    `;

    const nav = this.querySelector('.site-nav');
    const allDetails = Array.from(this.querySelectorAll('.site-nav__group'));

    // Native <details> toggles its content instantly with no way to
    // transition — there's no CSS-only way to animate "height: 0 to
    // height: auto" for content whose size isn't known in advance. So
    // click handling is taken over manually: prevent the native toggle,
    // then animate max-height between 0 and the content's actual measured
    // height (content.scrollHeight), keeping the `open` attribute (and
    // therefore native semantics/CSS hooks like the +/- indicator) in
    // sync with the animation rather than snapping instantly.

    function openGroup(details) {
      const content = details.querySelector('.site-nav__group-panel');
      details.setAttribute('open', '');
      content.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
      const targetHeight = content.scrollHeight;
      content.style.maxHeight = '0px';
      // Force a reflow so the browser commits the 0px starting point
      // before the next line changes it — otherwise both values could be
      // batched into one style recalculation with no observable "before"
      // state, and the transition would be skipped (same technique used
      // in docs/text/split-text-foundations.js).
      void content.offsetHeight;
      content.style.maxHeight = `${targetHeight}px`;
      uncapPanelWhileNested();
    }

    function closeGroup(details) {
      const content = details.querySelector('.site-nav__group-panel');
      // Block keyboard focus into the collapsing content immediately,
      // rather than waiting for the animation to finish — a still-focusable
      // link inside a visually-shrinking panel is a common accordion
      // accessibility bug.
      content.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
      content.style.maxHeight = `${content.scrollHeight}px`;
      void content.offsetHeight;
      content.style.maxHeight = '0px';
      const onTransitionEnd = (event) => {
        if (event.propertyName !== 'max-height') {
          return;
        }
        content.removeEventListener('transitionend', onTransitionEnd);
        details.removeAttribute('open');
      };
      content.addEventListener('transitionend', onTransitionEnd);
      uncapPanelWhileNested();
    }

    // The outer mobile panel would otherwise clip a category accordion
    // expanding inside it: reading nav.scrollHeight right as the accordion
    // starts its own transition catches it mid-flight near 0, not at its
    // target size, so computing a precise new outer cap here is unreliable.
    // Instead, remove the outer cap entirely (max-height: none) whenever a
    // nested accordion is toggled while the panel is open — with no cap,
    // the panel's box simply tracks its content's real height every frame
    // via normal layout, which already matches the nested accordion's
    // animation step for step without needing a second, separately-timed
    // transition on the outer element. No-op at desktop widths, where CSS
    // forces the panel's max-height to `none` unconditionally anyway.
    function uncapPanelWhileNested() {
      if (document.body.classList.contains('nav-open')) {
        nav.style.maxHeight = 'none';
      }
    }

    allDetails.forEach((details) => {
      const summary = details.querySelector('summary');
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        const isOpen = details.hasAttribute('open');
        if (isOpen) {
          closeGroup(details);
          return;
        }
        // Replicate the native <details name="..."> exclusive-group
        // behavior manually, since preventDefault() above bypasses it.
        allDetails.forEach((other) => {
          if (other !== details && other.hasAttribute('open')) {
            closeGroup(other);
          }
        });
        openGroup(details);
      });
    });

    // Mobile: animate the whole panel open/closed in response to
    // SiteHeader's hamburger toggle.
    document.addEventListener('nav-toggle', (event) => {
      if (event.detail.open) {
        nav.style.maxHeight = `${nav.scrollHeight}px`;
      } else {
        // The panel's max-height may currently be 'none' (uncapped, if a
        // category accordion was expanded while the panel was open) —
        // transitioning directly from 'none' doesn't animate, it just
        // snaps. Pin it to its actual current height as an explicit pixel
        // value first, force a reflow to commit that as the starting
        // point, then animate down to 0.
        nav.style.maxHeight = `${nav.scrollHeight}px`;
        void nav.offsetHeight;
        nav.style.maxHeight = '0px';
      }
    });

    // Desktop dropdown polish: clicking outside the nav closes any open
    // category dropdown, so it behaves like a real menu instead of staying
    // pinned open. Harmless on mobile too (an open accordion section just
    // closes if you tap elsewhere on the page).
    document.addEventListener('click', (event) => {
      if (this.contains(event.target)) {
        return;
      }
      allDetails.forEach((details) => {
        if (details.hasAttribute('open')) {
          closeGroup(details);
        }
      });
    });
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <p>Animations Handbook — built with HTML, CSS, and vanilla JavaScript only.</p>
      </footer>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
