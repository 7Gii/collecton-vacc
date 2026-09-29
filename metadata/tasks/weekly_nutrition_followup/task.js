/**
 * Weekly nutrition follow-up: 7 days after an assessment classified MAM or SAM, or
 * after a follow-up where the child is still under treatment.
 */

const ONGOING = ['improving', 'no_change'];
const MALNOURISHED = ['mam', 'sam'];

export function appliesIf(app) {
  const p = app.utils.payloadOf(app.report);
  return MALNOURISHED.includes(p.nutritional_classification) || ONGOING.includes(p.followup_outcome);
}

/** Done once a later nutrition follow-up exists. */
export function resolvedIf(app) {
  return (app.getReports({ form: 'child_nutrition_followup' }) || [])
    .some(r => r.created_at > app.report.created_at);
}
