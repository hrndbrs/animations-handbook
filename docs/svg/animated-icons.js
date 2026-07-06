// docs/svg/animated-icons.js
// Demo 1: a real accessible checkbox. The box "pops" via point
// interpolation (utils/svg-morph.js), driven by JS every frame; the
// checkmark draws in via stroke-dashoffset, driven purely by CSS reacting
// to the button's own aria-checked attribute -- no JS needed for that
// half at all.
//
// Demos 2 and 3: the same two effects (a scale pulse, a continuous
// rotation), each shown once via SMIL and once via CSS, so the two
// mechanisms can be compared directly.

import { interpolatePath } from '../../utils/svg-morph.js';
import { easeInOutQuad } from '../../utils/easing.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Demo 1: checkbox ---
const BOX_REST_POINTS = [[6, 6], [18, 6], [18, 18], [6, 18]];
const BOX_CHECKED_POINTS = [[2, 2], [22, 2], [22, 22], [2, 22]];
const BOX_MORPH_DURATION_MS = 250;

const checkbox = document.getElementById('icon-checkbox');
const boxPath = document.getElementById('icon-checkbox-box');

function stepBoxMorph(timestamp, from, to, startTime) {
  const rawProgress = Math.min((timestamp - startTime) / BOX_MORPH_DURATION_MS, 1);
  const eased = easeInOutQuad(rawProgress);
  boxPath.setAttribute('d', interpolatePath(from, to, eased));
  if (rawProgress < 1) {
    requestAnimationFrame((next) => stepBoxMorph(next, from, to, startTime));
  } else {
    checkbox.disabled = false;
  }
}

checkbox.addEventListener('click', () => {
  const isChecked = checkbox.getAttribute('aria-checked') === 'true';
  const from = isChecked ? BOX_CHECKED_POINTS : BOX_REST_POINTS;
  const to = isChecked ? BOX_REST_POINTS : BOX_CHECKED_POINTS;
  checkbox.setAttribute('aria-checked', String(!isChecked));

  if (prefersReducedMotion) {
    boxPath.setAttribute('d', interpolatePath(from, to, 1));
    return;
  }

  checkbox.disabled = true;
  requestAnimationFrame((timestamp) => stepBoxMorph(timestamp, from, to, timestamp));
});

// --- Demo 2: like-button pulse, SMIL vs CSS ---
const likeSmilAnim = document.getElementById('like-smil-anim');
const likeBtnSmil = document.getElementById('like-btn-smil');
const likeDotCss = document.getElementById('like-dot-css');
const likeBtnCss = document.getElementById('like-btn-css');

likeBtnSmil.addEventListener('click', () => {
  if (prefersReducedMotion) {
    return;
  }
  likeSmilAnim.beginElement();
});

likeBtnCss.addEventListener('click', () => {
  likeDotCss.classList.remove('is-pulsing');
  // Force a reflow so the removed class is committed before the next line
  // re-adds it -- otherwise the browser can batch both changes into one
  // recalculation and the animation never restarts on a second click.
  void likeDotCss.getBoundingClientRect();
  likeDotCss.classList.add('is-pulsing');
});

likeDotCss.addEventListener('animationend', () => {
  likeDotCss.classList.remove('is-pulsing');
});

// --- Demo 3: loading spinner, SMIL vs CSS ---
// The CSS spinner is already covered by the sitewide prefers-reduced-motion
// rule in shared/doc-page.css (it shrinks the animation duration). The
// SMIL spinner is not -- SMIL isn't CSS, so that media query cannot reach
// it. pauseAnimations() (an SVGSVGElement method) is the correct way to
// stop it explicitly.
if (prefersReducedMotion) {
  document.querySelectorAll('.icon-demo__spinner').forEach((svg) => {
    if (typeof svg.pauseAnimations === 'function') {
      svg.pauseAnimations();
    }
  });
}
