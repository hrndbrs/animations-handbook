// docs/css-properties/opacity-compositing.js
// The crossfade animation is entirely CSS (transition on opacity). This
// script only toggles state — same aria-pressed-driven pattern as Chapter 1
// (CSS Transitions & Transform Basics).

const toggle = document.getElementById('opacity-toggle');
const stack = document.getElementById('opacity-stack');

toggle.addEventListener('click', () => {
  const isPressed = toggle.getAttribute('aria-pressed') === 'true';
  toggle.setAttribute('aria-pressed', String(!isPressed));
  stack.classList.toggle('is-crossfaded', !isPressed);
});
