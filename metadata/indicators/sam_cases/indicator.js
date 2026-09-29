/**
 * Children whose current status is SAM.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  return app.utils.allNutritionStatuses(app).filter(c => c.status === 'sam' || c.status === 'sam_complicated').length;
}
