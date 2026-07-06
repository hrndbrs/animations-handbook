// docs/mouse/magnetic-buttons.js
// The button is pulled toward the cursor as it approaches within
// MAGNET_RADIUS of the button's center, proportional to how close it is;
// leaving the radius (or the stage entirely) resets it back to rest.

import { clamp } from '../../utils/math.js';

const stage = document.getElementById('magnetic-stage');
const button = document.getElementById('magnetic-button');

const MAGNET_RADIUS = 90;
const MAGNET_STRENGTH = 0.4;

function handlePointerMove(event) {
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance < MAGNET_RADIUS) {
    const pull = clamp(1 - distance / MAGNET_RADIUS, 0, 1) * MAGNET_STRENGTH;
    button.style.setProperty('--magnet-x', `${dx * pull}px`);
    button.style.setProperty('--magnet-y', `${dy * pull}px`);
  } else {
    resetMagnet();
  }
}

function resetMagnet() {
  button.style.setProperty('--magnet-x', '0px');
  button.style.setProperty('--magnet-y', '0px');
}

stage.addEventListener('pointermove', handlePointerMove, { passive: true });
stage.addEventListener('pointerleave', resetMagnet, { passive: true });
