// docs/css-properties/custom-properties.js
// Two things happen here: (1) feature-detect @property support and hide
// the typed-swatch comparison if unsupported, showing a note instead; (2)
// on toggle, sample both swatches' computed background color across a few
// animation frames to numerically confirm the untyped one snaps instantly
// while the typed one passes through intermediate values — the same
// "live comparison" pattern Chapter 1 uses for its cubicBezier evaluator.

const supportsAtProperty = typeof CSS !== 'undefined' && typeof CSS.registerProperty === 'function';

if (!supportsAtProperty) {
  document.querySelector('.custom-properties-demo').classList.add('no-at-property-support');
  const note = document.getElementById('at-property-unsupported-note');
  if (note) {
    note.hidden = false;
  }
}

const toggle = document.getElementById('color-toggle');
const untypedSwatch = document.getElementById('untyped-swatch');
const typedSwatch = document.getElementById('typed-swatch');
const output = document.getElementById('color-sample-output');

function sampleColors() {
  const samples = [];
  let frame = 0;

  function tick() {
    const untypedColor = getComputedStyle(untypedSwatch).backgroundColor;
    const typedColor = getComputedStyle(typedSwatch).backgroundColor;
    samples.push(`frame ${frame}: untyped=${untypedColor}  typed=${typedColor}`);
    frame += 1;
    if (frame < 5) {
      requestAnimationFrame(tick);
    } else if (output) {
      output.textContent = samples.join('\n');
    }
  }

  requestAnimationFrame(tick);
}

toggle.addEventListener('click', () => {
  const isPressed = toggle.getAttribute('aria-pressed') === 'true';
  toggle.setAttribute('aria-pressed', String(!isPressed));
  sampleColors();
});
