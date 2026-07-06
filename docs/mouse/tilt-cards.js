// docs/mouse/tilt-cards.js
// Converts the cursor's position within the card (0..1 on each axis) into
// a tilt angle around the opposite axis: horizontal cursor movement tilts
// the card around its vertical (Y) axis, and vertical cursor movement
// tilts it around its horizontal (X) axis — matching how a physical card
// would tilt if you pushed down near one edge.

const card = document.getElementById('tilt-card');
const MAX_TILT_DEGREES = 12;

function handlePointerMove(event) {
  const rect = card.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width;
  const relativeY = (event.clientY - rect.top) / rect.height;
  const tiltX = (relativeY - 0.5) * -MAX_TILT_DEGREES * 2;
  const tiltY = (relativeX - 0.5) * MAX_TILT_DEGREES * 2;
  card.style.setProperty('--tilt-x', `${tiltX}deg`);
  card.style.setProperty('--tilt-y', `${tiltY}deg`);
}

function resetTilt() {
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
}

card.addEventListener('pointermove', handlePointerMove, { passive: true });
card.addEventListener('pointerleave', resetTilt, { passive: true });
