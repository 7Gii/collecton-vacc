/**
 * Micro-indicator on each child row: vaccination status.
 * Shared helpers: utils/index.js (app.utils).
 */

export function showIndicator(app) {
  const item = app.selectedItem;
  return !!item && item.isPerson !== false && !!app.utils.birthdateOf(item);
}

export function calculateValue(app) {
  const item = app.selectedItem;
  const status = app.utils.childVaccination(app, item.id, app.utils.birthdateOf(item));
  if (!status.assessed) return null;
  return status.missing.length === 0
    ? { icon: 'ind-immunized', color: 'green' }
    : { icon: 'ind-missed-doses', color: 'red' };
}
