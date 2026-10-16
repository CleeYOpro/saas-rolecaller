export type Grade = { readonly className: string; readonly grade: string };

const PRIMARY: readonly Grade[] = [
  { className: 'Class 1', grade: '1' },
  { className: 'Class 2', grade: '2' },
  { className: 'Class 3', grade: '3' },
  { className: 'Class 4', grade: '4' },
  { className: 'Class 5', grade: '5' },
  { className: 'Class 6', grade: '6' },
];

const KG: Grade = { className: 'KG', grade: 'KG' };
const LKG: Grade = { className: 'LKG', grade: 'LKG' };
const UKG: Grade = { className: 'UKG', grade: 'UKG' };

// Fixed yearly progressions. `grade` is the matching value used in students.grade. Students in
// the last class graduate into graduated_students, grouped by year. Most schools start at KG;
// schools with LKG and UKG classes (e.g. Davgoda CDC) go LKG → UKG → Class 1. A grade can be
// split into lettered sections ("Class 1A", "Class 1B") that share its place on the ladder.
export const GRADE_LADDER: readonly Grade[] = [KG, ...PRIMARY];
export const LKG_UKG_LADDER: readonly Grade[] = [LKG, UKG, ...PRIMARY];

// Every grade class across both ladders, in display order
const ALL_GRADES: readonly Grade[] = [LKG, UKG, KG, ...PRIMARY];
export const GRADE_CLASS_NAMES = ALL_GRADES.map((g) => g.className);

export const TEACHER_CLASS_NAME = 'TEACHERS ATTENDANCE';

export function isTeacherClass(name: string): boolean {
  return name.trim().toUpperCase() === TEACHER_CLASS_NAME;
}

// Which ladder grade a class is ("Class 1B" → Class 1, section "B"), or index -1 if it isn't one
function matchGrade(name: string, ladder: readonly Grade[]): { index: number; section: string } {
  const normalized = name.trim().toLowerCase();
  const index = ladder.findIndex((g) => {
    const base = g.className.toLowerCase();
    return normalized === base || (normalized.startsWith(base) && /^\s*[a-z]$/.test(normalized.slice(base.length)));
  });
  const section = index >= 0 ? normalized.slice(ladder[index].className.length).trim().toUpperCase() : '';
  return { index, section };
}

// Position of a class (or one of its sections) in a ladder, or -1 for anything that isn't a grade on it
export function gradeIndex(name: string, ladder: readonly Grade[] = GRADE_LADDER): number {
  return matchGrade(name, ladder).index;
}

// The ladder a school follows, decided by its classes: LKG → UKG if it has either, KG otherwise
export function ladderFor(classNames: string[]): readonly Grade[] {
  const hasLkgOrUkg = classNames.some((name) => gradeIndex(name, [LKG, UKG]) >= 0);
  return hasLkgOrUkg ? LKG_UKG_LADDER : GRADE_LADDER;
}

// Standard spelling of a grade class name from either ladder, keeping any section, or null if it isn't a grade
export function standardClassName(name: string): string | null {
  const { index, section } = matchGrade(name, ALL_GRADES);
  return index >= 0 ? ALL_GRADES[index].className + section : null;
}

// Grades in ladder order, then any other classes alphabetically, then the teachers class
export function sortClasses<T extends { name: string }>(classes: T[]): T[] {
  const rank = (name: string) => {
    const i = gradeIndex(name, ALL_GRADES);
    if (i >= 0) return i;
    return isTeacherClass(name) ? ALL_GRADES.length + 1 : ALL_GRADES.length;
  };
  return [...classes].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}
