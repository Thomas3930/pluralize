/**
 * Pluralize — handles irregular english plurals.
 *
 * The rules below encode common English pluralization patterns,
 * including irregular nouns (child→children, mouse→mice, etc.)
 * and uncountable nouns (sheep, deer, fish, etc.).
 *
 * Single global decision: pluralization is case-sensitive but case-preserving —
 * `Person` pluralizes to `People`, `person` to `people`.
 */

// Irregular singular → plural forms, encoded once, lowercased.
const IRREGULAR = new Map([
  ['child', 'children'],
  ['person', 'people'],
  ['man', 'men'],
  ['woman', 'women'],
  ['mouse', 'mice'],
  ['goose', 'geese'],
  ['foot', 'feet'],
  ['tooth', 'teeth'],
  ['ox', 'oxen'],
  ['leaf', 'leaves'],
  ['life', 'lives'],
  ['knife', 'knives'],
  ['wife', 'wives'],
  ['half', 'halves'],
  ['loaf', 'loaves'],
  ['calf', 'calves'],
  ['elf', 'elves'],
  ['thief', 'thieves'],
  ['wolf', 'wolves'],
  ['shelf', 'shelves'],
  ['quiz', 'quizzes'],
  ['datum', 'data'],
  ['medium', 'media'],
  ['criterion', 'criteria'],
  ['phenomenon', 'phenomena'],
  ['analysis', 'analyses'],
  ['basis', 'bases'],
  ['crisis', 'crises'],
  ['thesis', 'theses'],
  ['diagnosis', 'diagnoses'],
  ['oasis', 'oases'],
  ['parenthesis', 'parentheses'],
  ['fungus', 'fungi'],
  ['cactus', 'cacti'],
  ['nucleus', 'nuclei'],
  ['syllabus', 'syllabi'],
  ['radius', 'radii'],
  ['alumnus', 'alumni'],
  ['focus', 'foci'],
  ['stimulus', 'stimuli'],
  ['die', 'dice'],
  ['matrix', 'matrices'],
  ['index', 'indices'],
  ['appendix', 'appendices'],
  ['vertex', 'vertices'],
  ['vortex', 'vortices'],
  ['louse', 'lice'],
  ['mongoose', 'mongooses'], // mongoose is regular despite ending in -oose
]);

// Uncountable nouns stay the same in singular and plural.
const UNCOUNTABLE = new Set([
  'sheep', 'deer', 'fish', 'moose', 'swine', 'buffalo', 'series', 'species',
  'aircraft', 'spacecraft', 'hovercraft', 'watercraft', 'information',
  'equipment', 'news', 'rice', 'money', 'jeans', 'scissors', 'pants',
  'trousers', 'glasses', 'tongs', 'pliers', 'pliers', 'shorts', 'tweezers',
  'species', 'bison', 'salmon', 'trout', 'pike', 'cod', 'offspring',
  'kin', 'cattle', 'vermin', ' artillery', 'corps', 'chassis', 'means',
  'graffiti',
]);

/**
 * Detect whether a word is already in plural form.
 */
export function isPlural(word) {
  const lower = String(word).toLowerCase();
  if (UNCOUNTABLE.has(lower)) return true;
  for (const [singular, plural] of IRREGULAR) {
    if (plural === lower) return true;
  }
  if (lower.endsWith('ies') && lower.length > 3) {
    // e.g. categories, capabilities
    return true;
  }
  if (lower.endsWith('ves') && lower.length > 3) {
    return true;
  }
  if (lower.endsWith('ses') || lower.endsWith('xes') || lower.endsWith('zes') || lower.endsWith('ches') || lower.endsWith('shes')) {
    return true;
  }
  if (lower.endsWith('s') && !lower.endsWith('ss')) {
    return true;
  }
  return false;
}

/**
 * Detect whether a word is in singular form.
 */
export function isSingular(word) {
  return !isPlural(word);
}

/**
 * Convert a noun to its plural form. Handles irregular nouns, uncountable nouns,
 * and common regular pluralization rules.
 *
 * Case preservation is a deliberate decision: callers passing capitalized singulars
 * (proper nouns like `Person` in `Person[]` type listings) get back a sensible plural.
 */
export function toPlural(word) {
  const w = String(word);
  if (!w) return w;
  const lower = w.toLowerCase();
  if (UNCOUNTABLE.has(lower)) return w;
  if (IRREGULAR.has(lower)) {
    const plural = IRREGULAR.get(lower);
    return matchCase(w, plural);
  }
  if (lower.endsWith('y')) {
    const stem = w.slice(0, -1);
    const preceding = lower.charAt(lower.length - 2);
    if (isVowel(preceding)) {
      return w + (isUpperCase(w.charAt(w.length - 1)) ? 'S' : 's');
    }
    return stem + (isUpperCase(w.charAt(w.length - 1)) ? 'IES' : 'ies');
  }
  if (lower.endsWith('s') || lower.endsWith('x') || lower.endsWith('z') || lower.endsWith('ch') || lower.endsWith('sh')) {
    return w + (isUpperCase(w.charAt(w.length - 1)) ? 'ES' : 'es');
  }
  if (lower.endsWith('f') || lower.endsWith('fe')) {
    // Rule: leaf→leaves already in IRREGULAR; remaining -f/-fe fall back to +ves for common cases.
    if (lower.endsWith('fe')) {
      const stem = w.slice(0, -2);
      return stem + (isUpperCase(w.charAt(w.length - 1)) ? 'VES' : 'ves');
    }
    const stem = w.slice(0, -1);
    return stem + (isUpperCase(w.charAt(w.length - 1)) ? 'VES' : 'ves');
  }
  return w + (isUpperCase(w.charAt(w.length - 1)) ? 'S' : 's');
}

/**
 * Convert a plural noun back to its singular form where a deterministic rule applies.
 */
export function toSingular(word) {
  const w = String(word);
  if (!w) return w;
  const lower = w.toLowerCase();
  if (UNCOUNTABLE.has(lower)) return w;
  for (const [singular, plural] of IRREGULAR) {
    if (plural === lower) {
      return matchCase(w, singular);
    }
  }
  if (lower.endsWith('ies') && lower.length > 3) {
    const stem = w.slice(0, -3);
    return stem + (isUpperCase(w.charAt(w.length - 1)) ? 'Y' : 'y');
  }
  if (lower.endsWith('ves') && lower.length > 3) {
    const stem = w.slice(0, -3);
    return stem + (isUpperCase(w.charAt(w.length - 1)) ? 'FE' : 'fe');
  }
  if (lower.endsWith('ses') || lower.endsWith('xes') || lower.endsWith('zes') || lower.endsWith('ches') || lower.endsWith('shes')) {
    return w.slice(0, -2);
  }
  if (lower.endsWith('s') && !lower.endsWith('ss')) {
    return w.slice(0, -1);
  }
  return w;
}

/**
 * Convenience entry point: pluralize a singular noun.
 */
export function pluralize(word) {
  return toPlural(word);
}

function isVowel(ch) {
  return ch === 'a' || ch === 'e' || ch === 'i' || ch === 'o' || ch === 'u' ||
    ch === 'A' || ch === 'E' || ch === 'I' || ch === 'O' || ch === 'U';
}

function isUpperCase(ch) {
  return ch >= 'A' && ch <= 'Z';
}

/**
 * Match the case pattern of the source word to the target word.
 * Handles all-uppercase, all-lowercase, and Title Case.
 */
function matchCase(source, target) {
  if (source === source.toUpperCase()) {
    return target.toUpperCase();
  }
  if (source === source.toLowerCase()) {
    return target.toLowerCase();
  }
  // Title case: capitalize first letter, lowercase rest
  if (source.charAt(0) >= 'A' && source.charAt(0) <= 'Z') {
    return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
  }
  return target;
}
