// docs/text/letter-word-reveal.js
// Splits a paragraph by word, then reveals all words with a per-word
// stagger once the paragraph scrolls into view — combining split-text.js
// with the same IntersectionObserver technique Phase 1's Scroll Reveal
// chapter uses for whole list items, applied here at the word level.

import { splitText } from '../../utils/split-text.js';

const paragraph = document.getElementById('reveal-paragraph');
const words = splitText(paragraph, { by: 'word' });

words.forEach((word, index) => {
  word.style.transitionDelay = `${index * 60}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        words.forEach((word) => word.classList.add('is-visible'));
        observer.disconnect();
      }
    });
  },
  { threshold: 0.3 }
);

observer.observe(paragraph);
