// docs/text/split-text-foundations.js
// Reference example for utils/split-text.js: splits a sentence by
// character, then stagger-fades each character in via a per-piece
// transition-delay (same technique Phase 1's Scroll Reveal chapter uses
// for list items, applied here at the character level).

import { splitText } from '../../utils/split-text.js';

const target = document.getElementById('split-text-target');
const trigger = document.getElementById('split-text-trigger');

function runReveal() {
  const pieces = splitText(target, { by: 'char' });
  pieces.forEach((piece, index) => {
    piece.style.transitionDelay = `${index * 30}ms`;
  });
  // Force a reflow so the browser registers the "not yet visible" state
  // before the next frame adds is-visible — otherwise the transition
  // could be skipped since both states would apply in the same frame.
  void target.offsetWidth;
  requestAnimationFrame(() => {
    pieces.forEach((piece) => piece.classList.add('is-visible'));
  });
}

trigger.addEventListener('click', runReveal);
runReveal();
