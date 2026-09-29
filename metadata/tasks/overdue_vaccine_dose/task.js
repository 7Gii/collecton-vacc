/**
 * Overdue vaccine dose: from the day before the next vaccination appointment of a child
 * with missing doses, until 7 days after it. Resolved by a vaccination follow-up.
 */

function status(app) {
  return app.utils.childVaccination(app, app.person.id, app.utils.birthdateOf(app.person));
}

export function appliesIf(app) {
  if (!app.person || app.utils.isDeceased(app.person)) return false;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(app.person));
  if (months === null || months >= 60) return false;
  const s = status(app);
  return s.assessed && s.missing.length > 0 && !!s.nextAppointment;
}

export function appointmentDate(app) {
  return status(app).nextAppointment;
}
