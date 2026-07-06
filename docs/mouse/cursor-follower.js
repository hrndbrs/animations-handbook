// docs/mouse/cursor-follower.js
// The follower dot never snaps directly to the pointer position — each
// frame it lerps toward it, which is what produces the trailing/"catching
// up" motion instead of a rigid 1:1 cursor replacement.

import { lerp } from '../../utils/math.js';

const stage = document.getElementById('follower-stage');
const dot = document.getElementById('follower-dot');
const hint = document.getElementById('follower-hint');

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const pointer = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
const current = { x: pointer.x, y: pointer.y };
let hasPointer = false;

stage.addEventListener(
  'pointermove',
  (event) => {
    const rect = stage.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    if (!hasPointer) {
      hasPointer = true;
      hint.style.display = 'none';
    }
  },
  { passive: true }
);

stage.addEventListener(
  'pointerleave',
  () => {
    hasPointer = false;
    hint.style.display = 'flex';
  },
  { passive: true }
);

function animate() {
  if (hasPointer) {
    if (prefersReducedMotion) {
      // No smoothing to disable-partially here — jump straight to the
      // pointer position instead of trailing behind it.
      current.x = pointer.x;
      current.y = pointer.y;
    } else {
      current.x = lerp(current.x, pointer.x, 0.15);
      current.y = lerp(current.y, pointer.y, 0.15);
    }
    dot.style.transform = `translate(${current.x}px, ${current.y}px)`;
  }
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
