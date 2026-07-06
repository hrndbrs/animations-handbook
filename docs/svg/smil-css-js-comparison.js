// docs/svg/smil-css-js-comparison.js
// The SMIL and CSS panels are almost entirely declarative -- this file
// only pauses the SMIL panel under reduced motion (the sitewide CSS rule
// can't reach it) and drives the JS panel's manual requestAnimationFrame
// loop, including its Pause/Resume controls -- the one concrete
// controllability advantage this chapter demonstrates hands-on.

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- SMIL panel: pause under reduced motion (sitewide CSS rule can't reach SMIL) ---
const smilSvg = document.getElementById('smil-panel-svg');
if (prefersReducedMotion && typeof smilSvg.pauseAnimations === 'function') {
  smilSvg.pauseAnimations();
}

// --- SMIL panel: JS fallback to start the rotation when the draw finishes ---
// begin="smil-draw.end" (a standard SMIL syncbase reference) is declared on
// the markup's intent but not relied on here: current Chromium doesn't always
// reliably resolve a syncbase-dependent begin when it's the only such chained
// animation on the page, so smil-rotate is declared begin="indefinite" and
// started explicitly below instead. This listener is added unconditionally --
// if reduced motion is active, pauseAnimations() above already freezes the
// whole SMIL timeline, including whatever this triggers.
document.getElementById('smil-draw').addEventListener('endEvent', () => {
  document.getElementById('smil-rotate').beginElement();
});

// --- JS panel: manual timeline, draw-in then continuous rotation ---
const jsPath = document.getElementById('js-shape-path');
const jsPauseBtn = document.getElementById('js-pause-btn');
const jsResumeBtn = document.getElementById('js-resume-btn');

const DRAW_DURATION_MS = 1000;
const ROTATE_DURATION_MS = 1500;
const pathLength = jsPath.getTotalLength();
jsPath.style.strokeDasharray = `${pathLength}`;
jsPath.style.strokeDashoffset = `${pathLength}`;

let elapsed = 0;
let lastFrameTime = null;
let isPaused = false;

function render() {
  if (elapsed < DRAW_DURATION_MS) {
    const progress = Math.min(elapsed / DRAW_DURATION_MS, 1);
    jsPath.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
  } else {
    jsPath.style.strokeDashoffset = '0';
    const rotateElapsed = (elapsed - DRAW_DURATION_MS) % ROTATE_DURATION_MS;
    const angle = (rotateElapsed / ROTATE_DURATION_MS) * 360;
    jsPath.style.transform = `rotate(${angle}deg)`;
  }
}

function tick(timestamp) {
  if (lastFrameTime === null) {
    lastFrameTime = timestamp;
  }
  if (!isPaused) {
    elapsed += timestamp - lastFrameTime;
  }
  lastFrameTime = timestamp;
  render();
  requestAnimationFrame(tick);
}

jsPath.style.transformBox = 'fill-box';
jsPath.style.transformOrigin = 'center';

if (prefersReducedMotion) {
  elapsed = DRAW_DURATION_MS;
  render();
} else {
  requestAnimationFrame(tick);
}

jsPauseBtn.addEventListener('click', () => {
  isPaused = true;
  jsPauseBtn.disabled = true;
  jsResumeBtn.disabled = false;
});

jsResumeBtn.addEventListener('click', () => {
  isPaused = false;
  lastFrameTime = null;
  jsPauseBtn.disabled = false;
  jsResumeBtn.disabled = true;
});
