/**
 * Children whose current status is MAM.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  return app.utils.allNutritionStatuses(app).filter(c => c.status === 'mam').length;
}
