// utils/math.js
// Small, dependency-free math helpers used throughout the handbook's
// animation demos. Each function is pure (no side effects) so it's easy to
// reason about and reuse.

/**
 * Linearly interpolates between a and b.
 * t = 0 returns a, t = 1 returns b, t = 0.5 returns the midpoint.
 * Values of t outside [0, 1] extrapolate beyond a/b — callers who need the
 * result confined to the [a, b] range should clamp t first.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Restricts value to the [min, max] range. Used everywhere a computed
 * animation value (opacity, progress, distance) must not overshoot its
 * valid bounds.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Re-maps value from the [inMin, inMax] range to the [outMin, outMax]
 * range. This is the building block behind most "scroll progress drives an
 * animation value" techniques: map the scroll position range onto the
 * property's range.
 */
export function map(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
}

/**
 * Hermite interpolation producing a smooth 0->1 curve with zero velocity at
 * both ends, instead of the linear ramp `map()` would give. Commonly used
 * to ease a scroll-driven or pointer-driven value without needing a full
 * easing-curve library.
 */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}
