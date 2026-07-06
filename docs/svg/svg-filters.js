// docs/svg/svg-filters.js
// Both demos animate a <filter> primitive's own attribute directly --
// there is no CSS-variable bridge into a filter's internals, so JS
// setAttribute (here, via a lerped requestAnimationFrame loop) is the
// only way to animate these smoothly.

import { lerp } from '../../utils/math.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Demo 1: animated blur on hover/focus ---
const BLUR_MAX = 6;
const blurPrimitive = document.getElementById('blur-primitive');
const blurCard = document.getElementById('blur-card');
let blurCurrent = 0;
let blurTarget = 0;

function animateBlur() {
  if (prefersReducedMotion) {
    blurPrimitive.setAttribute('stdDeviation', String(blurTarget));
    return;
  }
  blurCurrent = lerp(blurCurrent, blurTarget, 0.2);
  blurPrimitive.setAttribute('stdDeviation', blurCurrent.toFixed(2));
  if (Math.abs(blurTarget - blurCurrent) > 0.05) {
    requestAnimationFrame(animateBlur);
  }
}

blurCard.addEventListener('pointerenter', () => {
  blurTarget = BLUR_MAX;
  animateBlur();
});
blurCard.addEventListener('pointerleave', () => {
  blurTarget = 0;
  animateBlur();
});
blurCard.addEventListener('focus', () => {
  blurTarget = BLUR_MAX;
  animateBlur();
});
blurCard.addEventListener('blur', () => {
  blurTarget = 0;
  animateBlur();
});

// --- Demo 2: continuous animated turbulence/displacement ("liquid") ---
const turbulence = document.getElementById('liquid-turbulence');
const displacement = document.getElementById('liquid-displacement');

function animateLiquid(timestamp) {
  if (prefersReducedMotion) {
    displacement.setAttribute('scale', '15');
    return;
  }
  const wobble = Math.sin(timestamp / 800) * 0.01 + 0.02;
  turbulence.setAttribute('baseFrequency', `${wobble.toFixed(4)} 0.04`);
  displacement.setAttribute('scale', '20');
  requestAnimationFrame(animateLiquid);
}

requestAnimationFrame(animateLiquid);
