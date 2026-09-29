/**
 * Summary cards of the 'child' person type (details view).
 * app.person is the child; app.getReports() is scoped to that child.
 * Shared helpers: utils/index.js (app.utils).
 */

const NUTRITION_LABELS = {
  sam_complicated: 'SAM with complication',
  sam: 'SAM',
  mam: 'MAM',
  normal: 'Normal',
  recovered: 'Recovered',
  closed: 'Case closed',
};

function birthdate(app) {
  return app.utils.birthdateOf(app.person);
}

function vaccination(app) {
  return app.utils.childVaccination(app, app.person.id, birthdate(app));
}

function nutrition(app) {
  return app.utils.childNutrition(app, app.person.id);
}

export function age(app) {
  return app.utils.formatAge(birthdate(app));
}

export function vaccinationStatusLabel(app) {
  const s = vaccination(app);
  if (!s.assessed) return 'Not assessed';
  return s.missing.length === 0 ? 'Up to date' : 'Doses overdue';
}

export function dosesReceived(app) {
  const s = vaccination(app);
  return s.assessed ? s.doses.size : null;
}

export function overdueDoses(app) {
  const s = vaccination(app);
  if (!s.assessed || s.missing.length === 0) return null;
  return s.missing.map(d => d.label).join(', ');
}

export function nextAppointment(app) {
  return app.utils.formatDate(vaccination(app).nextAppointment);
}

export function lastVaccinationVisit(app) {
  return app.utils.formatDate(vaccination(app).lastVisit);
}

export function hasNutritionData(app) {
  return nutrition(app).reports.length > 0;
}

export function nutritionStatusLabel(app) {
  const status = nutrition(app).status;
  return status ? NUTRITION_LABELS[status] || status : null;
}

export function lastMuac(app) {
  return nutrition(app).muac;
}

export function lastWeight(app) {
  return nutrition(app).weight;
}

export function nextFollowUp(app) {
  const n = nutrition(app);
  return n.status === 'mam' || n.status === 'sam' || n.status === 'sam_complicated'
    ? app.utils.formatDate(n.nextFollowUp)
    : null;
}

export function lastNutritionVisit(app) {
  return app.utils.formatDate(nutrition(app).lastVisit);
}
