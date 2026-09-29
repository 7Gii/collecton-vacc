/**
 * Recovered cases among closed malnutrition cases.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  const closed = app.utils.allNutritionStatuses(app).filter(c => c.status === 'recovered' || c.status === 'closed');
  return { numerator: closed.filter(c => c.status === 'recovered').length, denominator: closed.length };
}
