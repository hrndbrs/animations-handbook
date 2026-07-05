// docs/scroll/intersection-reveal.js
// Reveals list items as they enter the viewport, using IntersectionObserver
// instead of a scroll event listener. The observer callback only fires when
// intersection state actually changes, so there's no per-scroll-pixel work
// and no need to manually throttle/debounce.

const items = document.querySelectorAll('.reveal-item');

// Stagger: each item's CSS transition-delay is set from its index, so items
// reveal in sequence rather than all at once even though they all cross the
// viewport threshold within the same scroll gesture.
items.forEach((item, index) => {
  item.style.transitionDelay = `${index * 80}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Reveal is one-directional here — once shown, stop observing this
        // item so re-scrolling past it doesn't do any further work.
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

items.forEach((item) => observer.observe(item));
