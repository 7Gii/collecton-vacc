/**
 * Child Vaccination workflow (children 0 to 59 months).
 * Shared schedule and status helpers live in utils/index.js (app.utils).
 */

const MAX_AGE_MONTHS = 60;

function child(app) {
  return app.person || null;
}

function reportsOfChild(app) {
  const forms = app.utils.VACCINATION_FORMS;
  return (app.getReports({ form: forms }) || []).slice().sort((a, b) => b.created_at - a.created_at);
}

/** Menu entry: children under 60 months, alive. */
export function isEligible(app) {
  const person = child(app);
  if (!person || app.utils.isDeceased(person)) return false;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  return months !== null && months >= 0 && months < MAX_AGE_MONTHS;
}

/** Closes the follow-up when the child is 60 months or older, deceased or moved out. */
export function shouldClose(app) {
  const person = child(app);
  if (!person) return false;
  if (app.utils.isDeceased(person)) return true;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  if (months !== null && months >= MAX_AGE_MONTHS) return true;
  const last = app.submission ? app.utils.payloadOf(app.submission) : {};
  return last.reason_child_not_seen === 'moved_out' || last.reason_child_not_seen === 'deceased';
}

/** Every dose due for the age is recorded as received. */
export function isUpToDate(app) {
  const person = child(app);
  if (!person) return false;
  const status = app.utils.vaccinationStatus(app.utils.birthdateOf(person), reportsOfChild(app));
  return status.missing.length === 0;
}

/** Catch-up completed, as confirmed on the follow-up form or by the recorded doses. */
export function isCaughtUp(app) {
  const last = app.submission ? app.utils.payloadOf(app.submission) : {};
  if (last.child_seen === true && last.all_missed_doses_caught_up === true) return true;
  return isUpToDate(app);
}
