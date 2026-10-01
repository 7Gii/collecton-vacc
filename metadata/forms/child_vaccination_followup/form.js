/**
 * Logic file for the 'child_vaccination_followup' form.
 * Export functions here and reference them by name in 'form.json'.
 * @param {object} app - The application execution context.
 */

const MAX_AGE_MONTHS = 60;

// Living child person under 60 months; never an org unit.
function eligibleChild(app) {
  const person = app.person;
  if (!person || person.personType !== 'child') return false;
  if (app.utils.isDeceased(person)) return false;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  return months !== null && months >= 0 && months < MAX_AGE_MONTHS;
}

// Add menu entry: assessed child with doses still missing (catch-up in progress).
// Also opened by the 'overdue_vaccine_dose' task.
export function showForm(app) {
  try {
    if (!eligibleChild(app)) return false;
    const status = app.utils.childVaccination(app, app.person.id, app.utils.birthdateOf(app.person));
    return status.assessed && status.missing.length > 0;
  } catch (error) {
    return false;
  }
}
