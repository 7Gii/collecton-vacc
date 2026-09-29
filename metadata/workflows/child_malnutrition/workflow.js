/**
 * Child Malnutrition workflow (community management of acute malnutrition,
 * children 6 to 59 months). Status helpers live in utils/index.js (app.utils).
 */

const MIN_AGE_MONTHS = 6;
const MAX_AGE_MONTHS = 60;
const MALNOURISHED = ['mam', 'sam', 'sam_complicated'];

function child(app) {
  return app.person || null;
}

function lastPayload(app) {
  return app.submission ? app.utils.payloadOf(app.submission) : {};
}

/** Menu entry: children 6 to 59 months, alive. */
export function isEligible(app) {
  const person = child(app);
  if (!person || app.utils.isDeceased(person)) return false;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  return months !== null && months >= MIN_AGE_MONTHS && months < MAX_AGE_MONTHS;
}

/** Closes the case: 60 months or older, deceased, moved out or defaulted. */
export function shouldClose(app) {
  const person = child(app);
  if (!person) return false;
  if (app.utils.isDeceased(person)) return true;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  if (months !== null && months >= MAX_AGE_MONTHS) return true;
  const last = lastPayload(app);
  return last.followup_outcome === 'defaulted'
    || last.followup_outcome === 'deceased'
    || last.reason_child_not_seen === 'moved_out'
    || last.reason_child_not_seen === 'deceased';
}

/** MAM or SAM: classification, MUAC under 125 mm or bilateral oedema. */
export function isMalnourished(app) {
  const p = lastPayload(app);
  if (MALNOURISHED.includes(p.nutritional_classification)) return true;
  const muac = Number(p.muac_mm);
  if (p.muac_mm && muac < 125) return true;
  return !!p.bilateral_pitting_oedema && p.bilateral_pitting_oedema !== 'none';
}

/** Recovered: outcome recorded on the follow-up form. */
export function isRecovered(app) {
  return lastPayload(app).followup_outcome === 'recovered';
}
