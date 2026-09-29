/**
 * Doses recorded this month on vaccination follow-ups, grouped by vaccine.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  return true;
}

export function calculateValue(app) {
  const reports = app.getReports({ form: 'child_vaccination_followup', from: app.utils.startOfMonth() }) || [];
  const counts = new Map();
  for (const r of reports) {
    const doses = app.utils.payloadOf(r).doses_received_since_last_visit;
    for (const dose of Array.isArray(doses) ? doses : []) counts.set(dose, (counts.get(dose) || 0) + 1);
  }
  return app.utils.VACCINE_FAMILIES.map(([label, doses]) => ({
    label,
    value: doses.reduce((sum, d) => sum + (counts.get(d) || 0), 0),
  }));
}
