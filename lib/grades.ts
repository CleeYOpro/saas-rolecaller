// Fixed yearly progression shared by every school. `grade` is the matching value used in
// students.grade. Students in the last class graduate into graduated_students, grouped by year.
export const GRADE_LADDER = [
  { className: 'KG', grade: 'KG' },
  { className: 'Class 1', grade: '1' },
  { className: 'Class 2', grade: '2' },
  { className: 'Class 3', grade: '3' },
  { className: 'Class 4', grade: '4' },
  { className: 'Class 5', grade: '5' },
  { className: 'Class 6', grade: '6' },
] as const;

export const TEACHER_CLASS_NAME = 'TEACHERS ATTENDANCE';

export function isTeacherClass(name: string): boolean {
  return name.trim().toUpperCase() === TEACHER_CLASS_NAME;
}

// Position of a class in GRADE_LADDER, or -1 for anything that isn't a grade
export function gradeIndex(name: string): number {
  const normalized = name.trim().toLowerCase();
  return GRADE_LADDER.findIndex((g) => g.className.toLowerCase() === normalized);
}

// Grades in ladder order, then any other classes alphabetically, then the teachers class
export function sortClasses<T extends { name: string }>(classes: T[]): T[] {
  const rank = (name: string) => {
    const i = gradeIndex(name);
    if (i >= 0) return i;
    return isTeacherClass(name) ? GRADE_LADDER.length + 1 : GRADE_LADDER.length;
  };
  return [...classes].sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}
