// utils/split-text.js
// Splits an element's text content into one <span> per character or word,
// so chapters can animate individual characters/words independently
// (stagger reveal, scramble effects) without each reimplementing the same
// DOM-splitting logic — and, critically, without each reimplementing the
// accessibility fix this technique requires.
//
// Text-splitting for animation is a common source of real accessibility
// bugs: naively replacing "Hello" with five separate <span>H</span>
// <span>e</span>... spans makes some screen readers announce it letter by
// letter, or skip it if the spans are later hidden with display: none.
// This function avoids both: the generated spans are aria-hidden (so
// assistive tech ignores the fragmented markup), and the original full
// text is preserved in a visually-hidden (not display: none) element,
// which screen readers read exactly as if no splitting had happened.

export function splitText(element, { by = 'char' } = {}) {
  const originalText = element.textContent;

  const pieces =
    by === 'word'
      ? originalText.split(/(\s+)/).filter((piece) => piece.length > 0)
      : originalText.split('');

  const visuallyHidden = document.createElement('span');
  visuallyHidden.textContent = originalText;
  visuallyHidden.style.position = 'absolute';
  visuallyHidden.style.width = '1px';
  visuallyHidden.style.height = '1px';
  visuallyHidden.style.overflow = 'hidden';
  visuallyHidden.style.clip = 'rect(0 0 0 0)';
  visuallyHidden.style.whiteSpace = 'nowrap';

  const fragment = document.createDocumentFragment();
  const pieceSpans = [];

  pieces.forEach((piece) => {
    const span = document.createElement('span');
    span.textContent = piece;
    span.setAttribute('aria-hidden', 'true');
    span.classList.add('split-text__piece');
    fragment.appendChild(span);
    if (piece.trim().length > 0) {
      pieceSpans.push(span);
    }
  });

  element.textContent = '';
  element.appendChild(visuallyHidden);
  element.appendChild(fragment);

  return pieceSpans;
}
