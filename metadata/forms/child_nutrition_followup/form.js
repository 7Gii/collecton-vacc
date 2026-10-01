/**
 * Logic file for the 'child_nutrition_followup' form.
 * Export functions here and reference them by name in 'form.json'.
 * @param {object} app - The application execution context.
 */

const MIN_AGE_MONTHS = 6;
const MAX_AGE_MONTHS = 60;
const UNDER_TREATMENT = ['mam', 'sam', 'sam_complicated'];

// Living child person aged 6 to 59 months; never an org unit.
function eligibleChild(app) {
  const person = app.person;
  if (!person || person.personType !== 'child') return false;
  if (app.utils.isDeceased(person)) return false;
  const months = app.utils.ageInMonths(app.utils.birthdateOf(person));
  return months !== null && months >= MIN_AGE_MONTHS && months < MAX_AGE_MONTHS;
}

// Add menu entry: child under treatment for MAM or SAM. Also opened by the
// 'weekly_nutrition_followup' and 'urgent_referral_complicated_sam' tasks.
export function showForm(app) {
  try {
    if (!eligibleChild(app)) return false;
    const status = app.utils.childNutrition(app, app.person.id).status;
    return UNDER_TREATMENT.includes(status);
  } catch (error) {
    return false;
  }
}
