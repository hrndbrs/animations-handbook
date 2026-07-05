// utils/easing.js
// Named easing curves plus a from-scratch cubic-bezier evaluator. The
// evaluator uses Newton-Raphson iteration to solve for the bezier parameter
// t that produces a given x (time progress), then evaluates y (eased
// progress) at that t — the same approach browsers use internally for
// CSS's cubic-bezier() timing function.

export function linear(t) {
  return t;
}

export function easeInCubic(t) {
  return t * t * t;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Builds an easing function from the same four control points CSS's
 * cubic-bezier(x1, y1, x2, y2) takes. The bezier's two endpoints are fixed
 * at (0,0) and (1,1); x1/y1 and x2/y2 place the two control points.
 *
 * Returns a function that maps a time progress x (0..1) to an eased
 * progress y (0..1).
 */
export function cubicBezier(x1, y1, x2, y2) {
  function a(aa1, aa2) {
    return 1.0 - 3.0 * aa2 + 3.0 * aa1;
  }
  function b(aa1, aa2) {
    return 3.0 * aa2 - 6.0 * aa1;
  }
  function c(aa1) {
    return 3.0 * aa1;
  }

  function calcBezier(t, aa1, aa2) {
    return ((a(aa1, aa2) * t + b(aa1, aa2)) * t + c(aa1)) * t;
  }

  function getSlope(t, aa1, aa2) {
    return 3.0 * a(aa1, aa2) * t * t + 2.0 * b(aa1, aa2) * t + c(aa1);
  }

  function getTForX(x) {
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const currentX = calcBezier(t, x1, x2) - x;
      const currentSlope = getSlope(t, x1, x2);
      if (Math.abs(currentSlope) < 1e-6) {
        break;
      }
      t -= currentX / currentSlope;
    }
    return t;
  }

  return function bezierEasing(x) {
    if (x1 === y1 && x2 === y2) {
      return x;
    }
    return calcBezier(getTForX(x), y1, y2);
  };
}
