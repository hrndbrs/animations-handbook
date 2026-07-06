// docs/mouse/hover-distortion.js
// The zoom demo needs no JS at all — it's a plain :hover/:focus-within CSS
// rule. Only the distortion demo needs JS, mapping cursor position within
// the box to a skew angle on each axis, same pattern as the Tilt Cards
// chapter but using skew() instead of rotateX/rotateY.

const distortBox = document.getElementById('distort-box');
const MAX_SKEW_DEGREES = 10;

function handlePointerMove(event) {
  const rect = distortBox.getBoundingClientRect();
  const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
  const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
  distortBox.style.setProperty('--distort-x', `${relativeX * MAX_SKEW_DEGREES}deg`);
  distortBox.style.setProperty('--distort-y', `${relativeY * MAX_SKEW_DEGREES}deg`);
}

function resetDistort() {
  distortBox.style.setProperty('--distort-x', '0deg');
  distortBox.style.setProperty('--distort-y', '0deg');
}

distortBox.addEventListener('pointermove', handlePointerMove, { passive: true });
distortBox.addEventListener('pointerleave', resetDistort, { passive: true });
