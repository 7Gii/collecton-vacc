/**
 * Penta 3 coverage among assessed children aged 12 to 23 months.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  return app.utils.doseCoverage12to23(app, 'penta3');
}
