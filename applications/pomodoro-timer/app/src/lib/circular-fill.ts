const BISECTION_ITERATIONS = 40;

/**
 * Area fraction of a unit circle (r = 1) filled from the bottom up to a given
 * height fraction (0 = empty, 1 = full diameter), via the standard circular
 * segment area formula. This is scale-invariant under independent x/y
 * scaling, so it holds for the tomato's ellipse-ish body too.
 */
function areaFractionForHeightFraction(heightFraction: number): number {
  const h = 2 * heightFraction;
  const term1 = Math.acos(1 - h);
  const term2 = (1 - h) * Math.sqrt(h * (2 - h));
  return (term1 - term2) / Math.PI;
}

/**
 * Inverts the circular segment area formula: given the area fraction we want
 * filled (i.e. elapsed-time fraction), returns the height fraction the fill
 * rect needs to reach. Without this, a round body filled by raw height
 * fraction looks fully filled well before time actually runs out, because
 * area near the equator grows faster than area near the poles.
 */
export function heightFractionForAreaFraction(areaFraction: number): number {
  const target = Math.min(1, Math.max(0, areaFraction));
  let low = 0;
  let high = 1;
  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const mid = (low + high) / 2;
    if (areaFractionForHeightFraction(mid) < target) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}
