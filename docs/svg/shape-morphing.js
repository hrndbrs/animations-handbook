// docs/svg/shape-morphing.js
// Demo 1 (hover, CSS-only `d` transition) needs no JS at all. Demos 2 and
// 3 both use utils/svg-morph.js's interpolatePath() to manually morph
// between two same-length point arrays, writing a fresh `d` attribute
// value every frame -- the technique that works everywhere, regardless of
// whether the browser supports animating `d` natively (Safari doesn't).

import { interpolatePath } from '../../utils/svg-morph.js';
import { easeInOutQuad } from '../../utils/easing.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const SQUARE_POINTS = [
  [20, 20],
  [80, 20],
  [80, 80],
  [20, 80],
];

const DIAMOND_POINTS = [
  [50, 10],
  [90, 50],
  [50, 90],
  [10, 50],
];

const loopPath = document.getElementById('morph-loop-path');

function animateLoop(timestamp) {
  if (prefersReducedMotion) {
    loopPath.setAttribute('d', interpolatePath(SQUARE_POINTS, DIAMOND_POINTS, 0.5));
    return;
  }
  const t = (Math.sin(timestamp / 1000) + 1) / 2;
  loopPath.setAttribute('d', interpolatePath(SQUARE_POINTS, DIAMOND_POINTS, t));
  requestAnimationFrame(animateLoop);
}

requestAnimationFrame(animateLoop);

// A 12-point "plus" outline and the same 12 points rotated 45 degrees
// around the shape's center, giving a plus-to-cross/X icon morph -- the
// same idea as this handbook's hamburger-to-X nav icon, but achieved via
// true path-point morphing instead of two overlapping bars rotating.
const PLUS_POINTS = [
  [42, 10], [58, 10], [58, 42], [90, 42], [90, 58], [58, 58],
  [58, 90], [42, 90], [42, 58], [10, 58], [10, 42], [42, 42],
];

const CROSS_POINTS = [
  [72.63, 16.06], [83.94, 27.37], [61.31, 50], [83.94, 72.63], [72.63, 83.94], [50, 61.31],
  [27.37, 83.94], [16.06, 72.63], [38.69, 50], [16.06, 27.37], [27.37, 16.06], [50, 38.69],
];

const iconPath = document.getElementById('morph-icon-path');
const iconTrigger = document.getElementById('morph-icon-trigger');
const MORPH_DURATION_MS = 400;
let isCross = false;

function stepIconMorph(timestamp, from, to, startTime) {
  const elapsed = timestamp - startTime;
  const rawProgress = Math.min(elapsed / MORPH_DURATION_MS, 1);
  const eased = easeInOutQuad(rawProgress);
  iconPath.setAttribute('d', interpolatePath(from, to, eased));
  if (rawProgress < 1) {
    requestAnimationFrame((next) => stepIconMorph(next, from, to, startTime));
  } else {
    iconTrigger.disabled = false;
  }
}

iconTrigger.addEventListener('click', () => {
  const from = isCross ? CROSS_POINTS : PLUS_POINTS;
  const to = isCross ? PLUS_POINTS : CROSS_POINTS;
  isCross = !isCross;
  iconTrigger.setAttribute('aria-pressed', String(isCross));

  if (prefersReducedMotion) {
    iconPath.setAttribute('d', interpolatePath(from, to, 1));
    return;
  }

  iconTrigger.disabled = true;
  requestAnimationFrame((timestamp) => stepIconMorph(timestamp, from, to, timestamp));
});
