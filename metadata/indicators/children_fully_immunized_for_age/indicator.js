/**
 * Percentage of assessed children up to date for their age.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  const children = app.utils.allVaccinationStatuses(app).filter(c => {
    const months = app.utils.ageInMonths(c.birthdate);
    return months !== null && months < 60;
  });
  return { numerator: children.filter(c => c.status.upToDate).length, denominator: children.length };
}
