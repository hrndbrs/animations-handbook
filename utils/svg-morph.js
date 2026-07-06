// utils/svg-morph.js
// A minimal point-array morphing helper. Real SVG path morphing without a
// library requires two paths built from the same number of points in the
// same order -- this function linearly interpolates each matching pair of
// points and returns a ready-to-use `d` attribute string built only from
// straight line segments (M/L commands). It intentionally does not
// attempt to interpolate curves, arcs, or paths with differing point
// counts -- callers are responsible for supplying compatible point sets.

/**
 * Interpolates between two arrays of [x, y] points and returns the
 * resulting shape as an SVG path `d` string (closed with Z).
 * t = 0 returns pointsA's shape, t = 1 returns pointsB's shape.
 */
export function interpolatePath(pointsA, pointsB, t) {
  if (pointsA.length !== pointsB.length) {
    throw new Error('interpolatePath: pointsA and pointsB must have the same number of points');
  }

  const interpolated = pointsA.map(([xA, yA], i) => {
    const [xB, yB] = pointsB[i];
    return [xA + (xB - xA) * t, yA + (yB - yA) * t];
  });

  return pointsToPath(interpolated);
}

function pointsToPath(points) {
  const commands = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  return `${commands.join(' ')} Z`;
}
