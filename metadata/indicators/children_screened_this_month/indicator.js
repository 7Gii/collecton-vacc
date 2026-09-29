/**
 * Distinct children screened this month.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  const reports = app.getReports({ form: 'child_nutrition_assessment', from: app.utils.startOfMonth() }) || [];
  return new Set(reports.map(r => r.target_id)).size;
}
