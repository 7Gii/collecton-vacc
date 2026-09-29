/**
 * Micro-indicator on each child row: nutrition status.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  const item = app.selectedItem;
  return !!item && item.isPerson !== false && !!app.utils.birthdateOf(item);
}

export function calculateValue(app) {
  const status = app.utils.childNutrition(app, app.selectedItem.id).status;
  if (status === 'sam' || status === 'sam_complicated') return { icon: 'ind-sam', color: 'red' };
  if (status === 'mam') return { icon: 'ind-mam', color: 'amber' };
  if (status === 'normal' || status === 'recovered') return { icon: 'sec-decision', color: 'green' };
  return null;
}
