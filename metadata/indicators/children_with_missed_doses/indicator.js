/**
 * Number of assessed children with at least one overdue dose.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  return app.utils.allVaccinationStatuses(app).filter(c => {
    const months = app.utils.ageInMonths(c.birthdate);
    return months !== null && months < 60 && c.status.missing.length > 0;
  }).length;
}
