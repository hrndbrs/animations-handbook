// docs/canvas/particles.js
// A cursor-reactive particle field drawn directly to <canvas> and animated
// with a manual requestAnimationFrame loop — the imperative counterpart to
// the declarative CSS engine (Chapter 1) and the observer-driven engine
// (Chapter 2).

import { lerp, clamp } from '../../utils/math.js';

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const PARTICLE_COUNT = 80;
const PULL_RADIUS = 160;
const PULL_STRENGTH = 0.05;
const EASE_TOWARD_TARGET = 0.08;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.baseX = randomBetween(0, canvas.width);
    this.baseY = randomBetween(0, canvas.height);
    this.x = this.baseX;
    this.y = this.baseY;
    this.radius = randomBetween(1, 3);
  }

  update(pointer) {
    const dx = pointer.x - this.x;
    const dy = pointer.y - this.y;
    const distance = Math.hypot(dx, dy);
    // influence is 1 right at the pointer, fading to 0 at PULL_RADIUS away.
    const influence = clamp(1 - distance / PULL_RADIUS, 0, 1);
    const pushX = influence * -dx * PULL_STRENGTH;
    const pushY = influence * -dy * PULL_STRENGTH;
    // Ease the particle toward (home position + push offset) rather than
    // snapping directly, so motion reads as smooth drift, not a jump.
    this.x = lerp(this.x, this.baseX + pushX, EASE_TOWARD_TARGET);
    this.y = lerp(this.y, this.baseY + pushY, EASE_TOWARD_TARGET);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.85)';
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < PARTICLE_COUNT; i += 1) {
  particles.push(new Particle());
}

const pointer = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener(
  'pointermove',
  (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
  },
  { passive: true }
);

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => particle.draw());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((particle) => {
    particle.update(pointer);
    particle.draw();
  });
  requestAnimationFrame(animate);
}

// CSS's prefers-reduced-motion media query cannot stop a JS rAF loop, so
// this chapter's demo checks matchMedia() directly and renders one static
// frame instead of starting the loop.
if (prefersReducedMotion) {
  drawFrame();
} else {
  requestAnimationFrame(animate);
}
