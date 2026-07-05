// docs/css-basics/transitions.js
// The animation is entirely CSS (transition + transform). This script only
// toggles state — it never sets style/transform properties itself, which is
// the point of this chapter: state changes, CSS animates.

import { cubicBezier } from '../../utils/easing.js';

const trigger = document.getElementById('flip-card-trigger');

trigger.addEventListener('click', () => {
  const isPressed = trigger.getAttribute('aria-pressed') === 'true';
  trigger.setAttribute('aria-pressed', String(!isPressed));
});

// The same cubic-bezier(0.65, 0, 0.35, 1) curve used by the CSS transition
// above (see transitions.css) can be evaluated in JavaScript with
// utils/easing.js's cubicBezier() — this is conceptually what the browser
// computes internally, frame by frame, to interpolate the transition. This
// samples a few points to make that concrete rather than purely abstract.
const flipEasing = cubicBezier(0.65, 0, 0.35, 1);
const sampleOutput = document.getElementById('bezier-sample-output');
if (sampleOutput) {
  const samples = [0, 0.25, 0.5, 0.75, 1]
    .map((t) => `t=${t} → ${flipEasing(t).toFixed(3)}`)
    .join('   ');
  sampleOutput.textContent = samples;
}
