// docs/transform/transform-deep-dive.js
// Demo 1 (transform order) and Demo 3 (preserve-3d toggle) are both
// plain class toggles reacting to CSS -- no animation loop, no JS motion
// to gate behind prefers-reduced-motion. Demo 2 (matrix3d sliders) is
// direct manipulation, not animation -- moving a slider updates the
// matrix immediately, same as this site's Transform Variants chapter
// (Phase 2) already established for its own sliders.

// --- Demo 1: transform order ---
const orderToggleBtn = document.getElementById('order-toggle-btn');
const orderBoxes = document.querySelectorAll('.order-demo__box');

orderToggleBtn.addEventListener('click', () => {
  orderBoxes.forEach((box) => box.classList.toggle('is-transformed'));
});

// --- Demo 2: matrix3d composition ---
const matrixRotate = document.getElementById('matrix-rotate');
const matrixTranslate = document.getElementById('matrix-translate');
const matrixScale = document.getElementById('matrix-scale');
const matrixBox = document.getElementById('matrix-box');
const matrixOutput = document.getElementById('matrix-output');

function updateMatrix() {
  const angle = Number(matrixRotate.value) * (Math.PI / 180);
  const tx = Number(matrixTranslate.value);
  const scale = Number(matrixScale.value);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // A rotateZ + uniform scale + translateX composed by hand into a 4x4
  // matrix, laid out in the column-major order CSS's matrix3d() expects
  // (each group of 4 numbers is one column).
  const values = [
    scale * cos, scale * sin, 0, 0,
    -scale * sin, scale * cos, 0, 0,
    0, 0, 1, 0,
    tx, 0, 0, 1,
  ];
  const matrixString = `matrix3d(${values.map((v) => v.toFixed(3)).join(', ')})`;
  matrixBox.style.transform = matrixString;
  matrixOutput.textContent = matrixString;
}

[matrixRotate, matrixTranslate, matrixScale].forEach((slider) => {
  slider.addEventListener('input', updateMatrix);
});

updateMatrix();

// --- Demo 3: preserve-3d toggle ---
const preserve3dToggle = document.getElementById('preserve-3d-toggle');
const stackGroup = document.getElementById('stack-group');

preserve3dToggle.addEventListener('change', () => {
  stackGroup.classList.toggle('is-flat', !preserve3dToggle.checked);
});
