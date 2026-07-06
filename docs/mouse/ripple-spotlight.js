// docs/mouse/ripple-spotlight.js
// Ripple: creates one <span> per click at the click position, lets a CSS
// animation expand+fade it, then removes it from the DOM once the
// animation ends. Detects keyboard-triggered clicks (event.detail === 0
// for a non-mouse activation) and centers the ripple on the button
// instead of using a nonsensical (0, 0) click coordinate.
//
// Spotlight: pointermove only updates two CSS custom properties; the
// glow's actual show/hide is handled by :hover/:focus-within in CSS, no
// JS needed for that part.

const rippleButton = document.getElementById('ripple-button');

function createRipple(event) {
  const rect = rippleButton.getBoundingClientRect();
  const isKeyboardActivation = event.detail === 0;
  const clickX = isKeyboardActivation ? rect.width / 2 : event.clientX - rect.left;
  const clickY = isKeyboardActivation ? rect.height / 2 : event.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-demo__ripple';
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${clickX - size / 2}px`;
  ripple.style.top = `${clickY - size / 2}px`;

  rippleButton.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

rippleButton.addEventListener('click', createRipple);

const spotlightCard = document.getElementById('spotlight-card');

function handleSpotlightMove(event) {
  const rect = spotlightCard.getBoundingClientRect();
  spotlightCard.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
  spotlightCard.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
}

spotlightCard.addEventListener('pointermove', handleSpotlightMove, { passive: true });
