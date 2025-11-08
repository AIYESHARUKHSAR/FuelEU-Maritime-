export function computePercentDiff(comparison: number, baseline: number) {
  return ((comparison / baseline) - 1) * 100;
}
export function isCompliant(ghgIntensity: number, target: number) {
  return ghgIntensity <= target;
}
