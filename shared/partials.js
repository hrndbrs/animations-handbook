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
];

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || './';
    this.innerHTML = `
      <header class="site-header">
        <a class="site-header__brand" href="${base}index.html">Animations Handbook</a>
      </header>
    `;
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
        return `
          <div class="site-nav__group">
            <h3 class="site-nav__group-title">${category}</h3>
            <ul>${items}</ul>
          </div>
        `;
      })
      .join('');

    this.innerHTML = `
      <nav class="site-nav" aria-label="Chapters">
        ${groups}
      </nav>
    `;
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
