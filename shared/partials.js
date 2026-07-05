// shared/partials.js
// Native Web Components for the shared header, nav, and footer. Uses light
// DOM (no shadow root) so shared/doc-page.css applies normally, and inline
// template strings (no fetch()) so the site works under file:// with zero
// server dependency.

const CHAPTERS = [
  { href: 'docs/css-basics/transitions.html', title: 'CSS Transitions & Transform Basics' },
  { href: 'docs/scroll/intersection-reveal.html', title: 'Scroll Reveal with IntersectionObserver' },
  { href: 'docs/canvas/particles.html', title: 'Canvas Particle System' },
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
    const items = CHAPTERS.map((chapter) => {
      const isCurrent = chapter.href === current;
      const currentAttr = isCurrent ? ' aria-current="page"' : '';
      return `<li><a href="${base}${chapter.href}"${currentAttr}>${chapter.title}</a></li>`;
    }).join('');
    this.innerHTML = `
      <nav class="site-nav" aria-label="Chapters">
        <ul>${items}</ul>
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
