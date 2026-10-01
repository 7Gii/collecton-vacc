/**
 * Logic file for the 'child_nutrition_assessment' form.
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

// Add menu entry: screening of a child who is not under treatment for acute
// malnutrition (a child under treatment continues with the follow-up form).
export function showForm(app) {
  try {
    if (!eligibleChild(app)) return false;
    const status = app.utils.childNutrition(app, app.person.id).status;
    return !UNDER_TREATMENT.includes(status);
  } catch (error) {
    return false;
  }
}
