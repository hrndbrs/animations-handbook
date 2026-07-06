// utils/spring.js
// A single damped-spring integration step (semi-implicit/symplectic
// Euler), the standard lightweight way to simulate spring motion in a
// requestAnimationFrame loop without a physics library. Call once per
// frame with the previous state and a target; it returns the next
// position and velocity for that timestep.

/**
 * Steps a damped spring toward `target` by one timestep `dt` (seconds).
 * - stiffness: how strongly the spring pulls toward the target (higher =
 *   faster/snappier).
 * - damping: how strongly motion is resisted (higher = less
 *   oscillation/overshoot; too low relative to stiffness never settles).
 * - mass: inertia of the moving value (higher = slower to respond).
 * Returns { position, velocity } for the next frame.
 */
export function stepSpring({ position, velocity, target, stiffness, damping, mass = 1, dt }) {
  const springForce = -stiffness * (position - target);
  const dampingForce = -damping * velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const nextVelocity = velocity + acceleration * dt;
  const nextPosition = position + nextVelocity * dt;
  return { position: nextPosition, velocity: nextVelocity };
}
