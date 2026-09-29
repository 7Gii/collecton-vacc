/**
 * Urgent referral: check within 24 hours that a child with complicated SAM, a danger
 * sign or a worsening condition reached the stabilization center.
 */

export function appliesIf(app) {
  const p = app.utils.payloadOf(app.report);
  const signs = Array.isArray(p.danger_signs) ? p.danger_signs.filter(s => s !== 'none') : [];
  return p.nutritional_classification === 'sam_complicated'
    || p.nutrition_action_taken === 'urgent_referral'
    || p.followup_outcome === 'worsening_referred'
    || signs.length > 0;
}

/** Done once a later nutrition follow-up exists. */
export function resolvedIf(app) {
  return (app.getReports({ form: 'child_nutrition_followup' }) || [])
    .some(r => r.created_at > app.report.created_at);
}
