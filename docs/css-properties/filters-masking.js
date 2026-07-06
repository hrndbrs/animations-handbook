// docs/css-properties/filters-masking.js
// Only the filter+clip-path box demo needs JS (a click toggle). The
// backdrop-filter+mask panel below it is a static illustration — pure CSS,
// no interaction, so it needs no script.

const toggle = document.getElementById('filter-toggle');

toggle.addEventListener('click', () => {
  const isPressed = toggle.getAttribute('aria-pressed') === 'true';
  toggle.setAttribute('aria-pressed', String(!isPressed));
});
