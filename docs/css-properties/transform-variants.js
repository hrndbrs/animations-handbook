// docs/css-properties/transform-variants.js
// Each slider's 'input' event forwards its value into a CSS custom
// property on the box. The transform itself (translateX/rotate/scale/skew
// combined via var()) is entirely defined in transform-variants.css — this
// script never sets `transform` directly, only the custom properties it
// reads from.

const box = document.getElementById('transform-box');
const translateXInput = document.getElementById('translate-x');
const rotateInput = document.getElementById('rotate');
const scaleInput = document.getElementById('scale');
const skewInput = document.getElementById('skew');

function update() {
  box.style.setProperty('--tx', `${translateXInput.value}px`);
  box.style.setProperty('--rot', `${rotateInput.value}deg`);
  box.style.setProperty('--scl', String(Number(scaleInput.value) / 100));
  box.style.setProperty('--skx', `${skewInput.value}deg`);
}

[translateXInput, rotateInput, scaleInput, skewInput].forEach((input) => {
  input.addEventListener('input', update, { passive: true });
});

update();
