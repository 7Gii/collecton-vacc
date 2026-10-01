/**
 * Shared helpers of the Child Vaccination and Nutrition Program, exposed as app.utils
 * to forms, tasks, indicators and summary cards (mobile and console).
 */

export const VACCINATION_FORMS = ['child_vaccination_assessment', 'child_vaccination_followup'];
export const NUTRITION_FORMS = ['child_nutrition_assessment', 'child_nutrition_followup'];

/** Fields of the vaccination forms holding received doses (arrays of dose codes). */
const DOSE_FIELDS = [
  'doses_birth', 'doses_6_weeks', 'doses_10_weeks', 'doses_14_weeks',
  'doses_5_7_months', 'doses_9_months', 'doses_15_18_months',
  'doses_received_since_last_visit',
];

/** National schedule: age in days from which each dose is due. */
export const SCHEDULE = [
  { dose: 'bcg', label: 'BCG', days: 0 },
  { dose: 'opv0', label: 'Polio 0', days: 0 },
  { dose: 'penta1', label: 'Penta 1', days: 42 },
  { dose: 'opv1', label: 'Polio 1', days: 42 },
  { dose: 'pcv1', label: 'PCV 1', days: 42 },
  { dose: 'rota1', label: 'Rota 1', days: 42 },
  { dose: 'penta2', label: 'Penta 2', days: 70 },
  { dose: 'opv2', label: 'Polio 2', days: 70 },
  { dose: 'pcv2', label: 'PCV 2', days: 70 },
  { dose: 'rota2', label: 'Rota 2', days: 70 },
  { dose: 'penta3', label: 'Penta 3', days: 98 },
  { dose: 'opv3', label: 'Polio 3', days: 98 },
  { dose: 'pcv3', label: 'PCV 3', days: 98 },
  { dose: 'rota3', label: 'Rota 3', days: 98 },
  { dose: 'ipv1', label: 'IPV 1', days: 98 },
  { dose: 'malaria1', label: 'Malaria 1', days: 152 },
  { dose: 'malaria2', label: 'Malaria 2', days: 183 },
  { dose: 'malaria3', label: 'Malaria 3', days: 213 },
  { dose: 'mr1', label: 'Measles-Rubella 1', days: 274 },
  { dose: 'yf', label: 'Yellow fever', days: 274 },
  { dose: 'mena', label: 'Meningitis A', days: 274 },
  { dose: 'tcv', label: 'Typhoid conjugate', days: 274 },
  { dose: 'ipv2', label: 'IPV 2', days: 274 },
  { dose: 'mr2', label: 'Measles-Rubella 2', days: 456 },
  { dose: 'malaria4', label: 'Malaria 4', days: 548 },
  { dose: 'dtp_booster', label: 'DTP booster', days: 548 },
];

/** Vaccine families used by the doses bar chart. */
export const VACCINE_FAMILIES = [
  ['BCG', ['bcg']], ['Polio', ['opv0', 'opv1', 'opv2', 'opv3']], ['HepB', ['hepb0']],
  ['Penta', ['penta1', 'penta2', 'penta3']], ['PCV', ['pcv1', 'pcv2', 'pcv3']],
  ['Rota', ['rota1', 'rota2', 'rota3']], ['IPV', ['ipv1', 'ipv2']],
  ['Malaria', ['malaria1', 'malaria2', 'malaria3', 'malaria4']], ['MR', ['mr1', 'mr2']],
  ['YF', ['yf']], ['MenA', ['mena']], ['TCV', ['tcv']], ['DTP booster', ['dtp_booster']],
];

const DAY = 24 * 60 * 60 * 1000;

/** Parsed payload of a report (payloads may arrive as JSON text). */
export function payloadOf(report) {
  const p = report && report.payload;
  if (typeof p === 'string') {
    try { return JSON.parse(p) || {}; } catch (e) { return {}; }
  }
  return p || {};
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value) return value.split(/[\s,]+/);
  return [];
}

function attributesOf(entity) {
  const a = entity && entity.attributes;
  if (typeof a === 'string') {
    try { return JSON.parse(a) || {}; } catch (e) { return {}; }
  }
  return a || {};
}

/** Age in days from a YYYY-MM-DD birth date, or null when unknown. */
export function ageInDays(birthdate, at) {
  if (!birthdate) return null;
  const birth = new Date(String(birthdate).slice(0, 10) + 'T00:00:00');
  if (isNaN(birth.getTime())) return null;
  return Math.floor(((at ? new Date(at) : new Date()).getTime() - birth.getTime()) / DAY);
}

export function ageInMonths(birthdate) {
  const days = ageInDays(birthdate);
  return days === null ? null : Math.floor(days / 30.4375);
}

/** Birth date of a person object ({ attributes }) or person row. */
export function birthdateOf(person) {
  return attributesOf(person).birthdate || null;
}

export function isDeceased(person) {
  const v = attributesOf(person).person_is_deceased;
  return v === true || v === 'true';
}

/** Person row by id through app.find, with parsed attributes. */
export function findPerson(app, id) {
  if (!app.find) return null;
  const rows = app.find('persons', [{ field: 'id', value: id }]) || [];
  return rows[0] ? { ...rows[0], attributes: attributesOf(rows[0]) } : null;
}

/** Reports of the given forms, newest first (optionally for one target). */
function reportsOf(app, forms, targetId) {
  const filter = { form: forms };
  if (targetId) filter.targetId = targetId;
  return (app.getReports(filter) || []).slice().sort((a, b) => b.created_at - a.created_at);
}

/** Set of dose codes recorded for a child across every vaccination report. */
export function receivedDoses(reports) {
  const doses = new Set();
  for (const r of reports) {
    const p = payloadOf(r);
    for (const field of DOSE_FIELDS) asArray(p[field]).forEach(d => doses.add(d));
  }
  return doses;
}

/** Doses due for the age and not recorded, in schedule order. */
export function missingDoses(birthdate, doses) {
  const days = ageInDays(birthdate);
  if (days === null) return [];
  return SCHEDULE.filter(s => s.days <= days && !doses.has(s.dose));
}

/**
 * Vaccination status of a child: { assessed, doses, missing, upToDate, lastVisit, nextAppointment }.
 * `reports` are the vaccination reports of that child, newest first.
 */
export function vaccinationStatus(birthdate, reports) {
  const doses = receivedDoses(reports);
  const missing = missingDoses(birthdate, doses);
  const withAppointment = reports.find(r => payloadOf(r).next_vaccination_appointment);
  return {
    assessed: reports.length > 0,
    doses,
    missing,
    upToDate: reports.length > 0 && missing.length === 0,
    lastVisit: reports[0] ? reports[0].created_at : null,
    nextAppointment: withAppointment ? payloadOf(withAppointment).next_vaccination_appointment : null,
  };
}

/** Vaccination status of one child from an app whose getReports can target it. */
export function childVaccination(app, childId, birthdate) {
  return vaccinationStatus(birthdate, reportsOf(app, VACCINATION_FORMS, childId));
}

/**
 * Current nutrition status of a child from its nutrition reports (newest first):
 * 'sam_complicated' | 'sam' | 'mam' | 'normal' | 'recovered' | 'closed' | null (never screened).
 */
export function nutritionStatus(reports) {
  for (const r of reports) {
    const p = payloadOf(r);
    if (p.followup_outcome === 'recovered') return 'recovered';
    if (p.followup_outcome === 'defaulted' || p.followup_outcome === 'deceased') return 'closed';
    if (p.nutritional_classification) return p.nutritional_classification;
  }
  return null;
}

export function childNutrition(app, childId) {
  const reports = reportsOf(app, NUTRITION_FORMS, childId);
  const withMuac = reports.find(r => payloadOf(r).muac_mm);
  const withWeight = reports.find(r => payloadOf(r).weight_kg);
  const withNext = reports.find(r => payloadOf(r).next_followup_date);
  return {
    reports,
    status: nutritionStatus(reports),
    muac: withMuac ? Number(payloadOf(withMuac).muac_mm) : null,
    weight: withWeight ? Number(payloadOf(withWeight).weight_kg) : null,
    lastVisit: reports[0] ? reports[0].created_at : null,
    nextFollowUp: withNext ? payloadOf(withNext).next_followup_date : null,
  };
}

/** Reports grouped by target, each list newest first. */
export function groupByTarget(reports) {
  const groups = new Map();
  for (const r of reports) {
    if (!groups.has(r.target_id)) groups.set(r.target_id, []);
    groups.get(r.target_id).push(r);
  }
  for (const list of groups.values()) list.sort((a, b) => b.created_at - a.created_at);
  return groups;
}

/** Vaccination status of every assessed child: [{ id, birthdate, status }]. */
export function allVaccinationStatuses(app) {
  const result = [];
  for (const [id, reports] of groupByTarget(app.getReports({ form: VACCINATION_FORMS }) || [])) {
    const person = findPerson(app, id);
    const birthdate = person ? birthdateOf(person) : null;
    result.push({ id, birthdate, status: vaccinationStatus(birthdate, reports) });
  }
  return result;
}

/** Nutrition status of every screened child: [{ id, status }]. */
export function allNutritionStatuses(app) {
  const result = [];
  for (const [id, reports] of groupByTarget(app.getReports({ form: NUTRITION_FORMS }) || [])) {
    result.push({ id, status: nutritionStatus(reports) });
  }
  return result;
}

/** Coverage of one dose among assessed children aged 12 to 23 months. */
export function doseCoverage12to23(app, dose) {
  let numerator = 0;
  let denominator = 0;
  for (const child of allVaccinationStatuses(app)) {
    const days = ageInDays(child.birthdate);
    if (days === null || days < 365 || days >= 730) continue;
    denominator += 1;
    if (child.status.doses.has(dose)) numerator += 1;
  }
  return { numerator, denominator };
}

export function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
}

/** YYYY-MM-DD in local time; date strings are returned as entered. */
export function formatDate(value) {
  if (!value) return null;
  if (typeof value !== 'number') return /^\d{4}-\d{2}-\d{2}/.test(String(value)) ? String(value).slice(0, 10) : null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  const pad = n => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/** Human readable age: "7 months", "2 years 3 months". */
export function formatAge(birthdate) {
  const months = ageInMonths(birthdate);
  if (months === null) return null;
  if (months < 24) return months + ' months';
  const years = Math.floor(months / 12);
  return years + ' years ' + (months % 12) + ' months';
}
