// docs/transform/timing-easing.js
// Demo 1: drag-and-release spring, driven by utils/spring.js. Demo 2: a
// draggable cubic-bezier graph whose curve drives a CSS transition and a
// JS rAF loop side by side, using utils/easing.js's cubicBezier for the
// JS side. Demo 3: staggered reveal, comparing a linear per-item delay
// against one shaped by utils/math.js's smoothstep.

import { stepSpring } from '../../utils/spring.js';
import { cubicBezier } from '../../utils/easing.js';
import { smoothstep } from '../../utils/math.js';

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Demo 1: spring physics ---
const springStage = document.getElementById('spring-stage');
const springBox = document.getElementById('spring-box');
const stiffnessSlider = document.getElementById('spring-stiffness');
const dampingSlider = document.getElementById('spring-damping');

let springPosition = { x: 0, y: 0 };
let springVelocity = { x: 0, y: 0 };
let isDragging = false;
let springRafId = null;
let lastFrameTime = null;

function applySpringTransform() {
  springBox.style.transform = `translate(${springPosition.x}px, ${springPosition.y}px)`;
}

springBox.addEventListener('pointerdown', (event) => {
  isDragging = true;
  springBox.setPointerCapture(event.pointerId);
  if (springRafId !== null) {
    cancelAnimationFrame(springRafId);
    springRafId = null;
  }
}, { passive: true });

springBox.addEventListener('pointermove', (event) => {
  if (!isDragging) {
    return;
  }
  const rect = springStage.getBoundingClientRect();
  springPosition = {
    x: event.clientX - rect.left - springStage.clientWidth / 2,
    y: event.clientY - rect.top - springStage.clientHeight / 2,
  };
  springVelocity = { x: 0, y: 0 };
  applySpringTransform();
}, { passive: true });

function releaseSpring() {
  if (!isDragging) {
    return;
  }
  isDragging = false;
  if (prefersReducedMotion) {
    springPosition = { x: 0, y: 0 };
    applySpringTransform();
    return;
  }
  lastFrameTime = null;
  springRafId = requestAnimationFrame(animateSpring);
}

springBox.addEventListener('pointerup', releaseSpring, { passive: true });
springBox.addEventListener('pointercancel', releaseSpring, { passive: true });

function animateSpring(timestamp) {
  if (lastFrameTime === null) {
    lastFrameTime = timestamp;
  }
  const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
  lastFrameTime = timestamp;

  const stiffness = Number(stiffnessSlider.value);
  const damping = Number(dampingSlider.value);

  const stepX = stepSpring({ position: springPosition.x, velocity: springVelocity.x, target: 0, stiffness, damping, dt });
  const stepY = stepSpring({ position: springPosition.y, velocity: springVelocity.y, target: 0, stiffness, damping, dt });
  springPosition = { x: stepX.position, y: stepY.position };
  springVelocity = { x: stepX.velocity, y: stepY.velocity };
  applySpringTransform();

  const settled =
    Math.abs(springPosition.x) < 0.5 &&
    Math.abs(springPosition.y) < 0.5 &&
    Math.abs(springVelocity.x) < 0.5 &&
    Math.abs(springVelocity.y) < 0.5;

  if (!settled) {
    springRafId = requestAnimationFrame(animateSpring);
  } else {
    springPosition = { x: 0, y: 0 };
    applySpringTransform();
    springRafId = null;
  }
}

// --- Demo 2: custom cubic-bezier authoring ---
const bezierGraph = document.getElementById('bezier-graph');
const bezierHandle1 = document.getElementById('bezier-handle-1');
const bezierHandle2 = document.getElementById('bezier-handle-2');
const bezierHandleLine1 = document.getElementById('bezier-handle-line-1');
const bezierHandleLine2 = document.getElementById('bezier-handle-line-2');
const bezierCurvePath = document.getElementById('bezier-curve-path');
const bezierReadout = document.getElementById('bezier-readout');
const bezierPlayBtn = document.getElementById('bezier-play-btn');
const bezierCssBox = document.getElementById('bezier-box-css');
const bezierJsBox = document.getElementById('bezier-box-js');

let bezierP1 = { x: 0.25, y: 0.75 };
let bezierP2 = { x: 0.75, y: 0.25 };

function toSvgPoint(point) {
  return { x: point.x * 100, y: 100 - point.y * 100 };
}

function renderBezierGraph() {
  const svg1 = toSvgPoint(bezierP1);
  const svg2 = toSvgPoint(bezierP2);
  bezierHandle1.setAttribute('cx', svg1.x);
  bezierHandle1.setAttribute('cy', svg1.y);
  bezierHandle2.setAttribute('cx', svg2.x);
  bezierHandle2.setAttribute('cy', svg2.y);
  bezierHandleLine1.setAttribute('x1', 0);
  bezierHandleLine1.setAttribute('y1', 100);
  bezierHandleLine1.setAttribute('x2', svg1.x);
  bezierHandleLine1.setAttribute('y2', svg1.y);
  bezierHandleLine2.setAttribute('x1', 100);
  bezierHandleLine2.setAttribute('y1', 0);
  bezierHandleLine2.setAttribute('x2', svg2.x);
  bezierHandleLine2.setAttribute('y2', svg2.y);
  bezierCurvePath.setAttribute('d', `M 0 100 C ${svg1.x} ${svg1.y} ${svg2.x} ${svg2.y} 100 0`);
  bezierReadout.textContent = `cubic-bezier(${bezierP1.x.toFixed(2)}, ${bezierP1.y.toFixed(2)}, ${bezierP2.x.toFixed(2)}, ${bezierP2.y.toFixed(2)})`;
}

function makeHandleDraggable(handleEl, point) {
  function onPointerMove(event) {
    const rect = bezierGraph.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    point.x = Math.min(Math.max(x, 0), 1);
    point.y = y; // deliberately unclamped -- values outside 0-1 produce overshoot/bounce curves
    renderBezierGraph();
  }
  function onPointerUp() {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  }
  handleEl.addEventListener('pointerdown', () => {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
  });
}

makeHandleDraggable(bezierHandle1, bezierP1);
makeHandleDraggable(bezierHandle2, bezierP2);
renderBezierGraph();

const BEZIER_PLAY_DURATION_MS = 1000;

function playCssBox() {
  bezierCssBox.classList.remove('is-playing');
  bezierCssBox.style.transitionDuration = '0s';
  void bezierCssBox.getBoundingClientRect();
  bezierCssBox.style.transitionTimingFunction = `cubic-bezier(${bezierP1.x}, ${bezierP1.y}, ${bezierP2.x}, ${bezierP2.y})`;
  bezierCssBox.style.transitionDuration = '1s';
  bezierCssBox.classList.add('is-playing');
}

function playJsBox() {
  bezierJsBox.style.transform = 'translateX(0px)';
  if (prefersReducedMotion) {
    bezierJsBox.style.transform = 'translateX(200px)';
    return;
  }
  const ease = cubicBezier(bezierP1.x, bezierP1.y, bezierP2.x, bezierP2.y);
  const startTime = performance.now();
  function step(timestamp) {
    const rawProgress = Math.min((timestamp - startTime) / BEZIER_PLAY_DURATION_MS, 1);
    const eased = ease(rawProgress);
    bezierJsBox.style.transform = `translateX(${eased * 200}px)`;
    if (rawProgress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

bezierPlayBtn.addEventListener('click', () => {
  playCssBox();
  playJsBox();
});

// --- Demo 3: staggered sequencing ---
const STAGGER_ITEM_COUNT = 6;
const STAGGER_TOTAL_MS = 900;

const linearItems = document.querySelectorAll('#stagger-linear .stagger-demo__item');
const easedItems = document.querySelectorAll('#stagger-eased .stagger-demo__item');
const staggerRevealBtn = document.getElementById('stagger-reveal-btn');

function getLinearDelay(index) {
  return (index / (STAGGER_ITEM_COUNT - 1)) * STAGGER_TOTAL_MS;
}

function getEasedDelay(index) {
  const t = index / (STAGGER_ITEM_COUNT - 1);
  return smoothstep(0, 1, t) * STAGGER_TOTAL_MS;
}

function applyStaggerDelays(items, delayFn) {
  items.forEach((item, index) => {
    item.style.transitionDelay = `${delayFn(index)}ms`;
  });
}

applyStaggerDelays(linearItems, getLinearDelay);
applyStaggerDelays(easedItems, getEasedDelay);

staggerRevealBtn.addEventListener('click', () => {
  const allItems = [...linearItems, ...easedItems];
  allItems.forEach((item) => item.classList.remove('is-revealed'));
  void staggerRevealBtn.getBoundingClientRect();
  allItems.forEach((item) => item.classList.add('is-revealed'));
});
