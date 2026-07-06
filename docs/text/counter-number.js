// docs/text/counter-number.js
// Animates a number counting up to a target value, eased with
// easeOutCubic from utils/easing.js so the count decelerates into its
// final value instead of incrementing at a constant rate.

import { easeOutCubic } from '../../utils/easing.js';

const TARGET_VALUE = 2400;
const DURATION_MS = 1500;

const counterEl = document.getElementById('counter-value');
const trigger = document.getElementById('counter-trigger');

function runCounter() {
  trigger.disabled = true;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / DURATION_MS, 1);
    const easedT = easeOutCubic(t);
    const value = Math.round(easedT * TARGET_VALUE);
    counterEl.textContent = value.toLocaleString();
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      trigger.disabled = false;
    }
  }

  requestAnimationFrame(frame);
}

trigger.addEventListener('click', runCounter);
runCounter();
