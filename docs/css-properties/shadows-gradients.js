// docs/css-properties/shadows-gradients.js
// Only the box/text-shadow card needs JS (a click toggle). The gradient
// bar below it is a continuous CSS @keyframes animation — no interaction,
// no script involvement at all.

const toggle = document.getElementById('shadow-toggle');

toggle.addEventListener('click', () => {
  const isPressed = toggle.getAttribute('aria-pressed') === 'true';
  toggle.setAttribute('aria-pressed', String(!isPressed));
});
