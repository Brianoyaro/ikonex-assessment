export const GENDERS = ['MALE', 'FEMALE'];

export const STUDENT_STATUSES = ['ACTIVE', 'INACTIVE'];

export const ASSESSMENT_TYPES = ['CAT_1', 'CAT_2', 'MID_TERM', 'END_TERM'];

export const TERMS = ['TERM_ONE', 'TERM_TWO', 'TERM_THREE'];

export const GRADES = {
  A: { min: 80, max: 100, description: 'Excellent' },
  B: { min: 70, max: 79, description: 'Very Good' },
  C: { min: 60, max: 69, description: 'Good' },
  D: { min: 50, max: 59, description: 'Satisfactory' },
  E: { min: 40, max: 49, description: 'Poor' },
  F: { min: 0, max: 39, description: 'Fail' },
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};
