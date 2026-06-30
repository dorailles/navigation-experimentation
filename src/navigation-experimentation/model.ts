// New Quizzes builder content, mapped from the real "Introduction to Biology — Quiz 1"
// in Canvas (course 479163, assignment 718792). 4 questions, 20 points.

export type QuestionType =
  | 'Multiple Choice'
  | 'True or False'
  | 'Fill in the Blank'
  | 'Essay'
  | 'Categorization'
  | 'File Upload'
  | 'Formula'
  | 'Hot Spot'
  | 'Matching'
  | 'Multiple Answer'
  | 'Numeric'
  | 'Ordering'
  | 'Stimulus'
  | 'Text Block'

export type Question = {
  id: string
  type: QuestionType
  points: number
  prompt: string
  choices?: string[]
  correct?: number // index into choices, or 0/1 for true/false
  blank?: string // answer token for Fill in the Blank
}

// The 14 item types shown in the "Insert Content" picker, in the builder's two-column order.
export const ITEM_TYPES: { left: QuestionType; right: QuestionType }[] = [
  { left: 'Categorization', right: 'Essay' },
  { left: 'File Upload', right: 'Fill in the Blank' },
  { left: 'Formula', right: 'Hot Spot' },
  { left: 'Matching', right: 'Multiple Answer' },
  { left: 'Multiple Choice', right: 'Numeric' },
  { left: 'Ordering', right: 'True or False' },
  { left: 'Stimulus', right: 'Text Block' },
]

// Default points per type when a new item is inserted.
export const DEFAULT_POINTS: Record<QuestionType, number> = {
  'Multiple Choice': 1,
  'True or False': 1,
  'Fill in the Blank': 1,
  Essay: 1,
  Categorization: 1,
  'File Upload': 1,
  Formula: 1,
  'Hot Spot': 1,
  Matching: 1,
  'Multiple Answer': 1,
  Numeric: 1,
  Ordering: 1,
  Stimulus: 0,
  'Text Block': 0,
}

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'Multiple Choice',
    points: 5,
    prompt: 'Which organelle is known as the powerhouse of the cell?',
    choices: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
    correct: 2,
  },
  {
    id: 'q2',
    type: 'True or False',
    points: 3,
    prompt: 'DNA is made up of four nucleotide bases.',
    choices: ['True', 'False'],
    correct: 0,
  },
  {
    id: 'q3',
    type: 'Fill in the Blank',
    points: 4,
    prompt: 'The process by which plants convert sunlight into energy is called',
    blank: 'Photosynthesis',
  },
  {
    id: 'q4',
    type: 'Essay',
    points: 8,
    prompt: 'In your own words, describe what happens during mitosis. Include at least two key stages.',
  },
]

// ── Schedule tab (AGAMS Settings design) ──
export type ToggleItem = { label: string; info?: boolean; indent?: number }

export const QUIZ_TYPE_OPTIONS = ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey']
export const ASSIGNMENT_GROUP_OPTIONS = ['Assignment', 'Quizzes', 'Exams', 'Surveys']
export const SCORING_TYPE_OPTIONS = ['Points', 'Percentage']

// Quiz-Specific Settings card
export const QUIZ_SPECIFIC_TOGGLES: ToggleItem[] = [
  { label: 'Filter IP addresses', info: true },
  { label: 'Time limit' },
  { label: 'Notify users content has changed' },
]

// Preset card — collapsible sections
export const SCORING_TOGGLES: ToggleItem[] = [
  { label: 'Allow multiple attempts' },
  { label: "Don't count towards final grade" },
  { label: "Don't display in gradebook" },
  { label: 'Sync to SIS', info: true },
  { label: 'Hide names while grading', info: true },
]
export const RESTRICT_TOGGLES: ToggleItem[] = [
  { label: 'Require student access code', info: true },
  { label: 'Block document uploads', info: true },
  { label: 'Detect multiple sessions', info: true },
]
export const DISPLAY_TOGGLES: ToggleItem[] = [
  { label: 'Shuffle questions' },
  { label: 'Shuffle answers' },
  { label: 'One question at a time', info: true },
]
// Release Results — nested groups
export const RELEASE_FINAL_SCORES: ToggleItem[] = [
  { label: 'Show points awarded', info: true },
  { label: 'Show points possible', info: true },
]
export const RELEASE_RESULTS: ToggleItem[] = [
  { label: 'Show questions', info: true, indent: 0 },
  { label: 'Show responses', info: true, indent: 1 },
  { label: 'Correct/incorrect', info: true, indent: 2 },
  { label: 'Correct answer', info: true, indent: 2 },
  { label: 'Answer feedback', info: true, indent: 2 },
]
export const RELEASE_FEEDBACK: ToggleItem[] = [{ label: 'Show general feedback', info: true }]

// ── Summary tab (read-only overview) ──
// Settings summary, laid out in the three columns the design uses.
export const SUMMARY_COLUMNS: { label: string; value: string }[][] = [
  [
    { label: 'Quiz type', value: 'Graded' },
    { label: 'Time limit', value: 'Off' },
    { label: 'One Question at a time', value: 'Off' },
  ],
  [
    { label: 'Points', value: '0' },
    { label: 'Shuffle answer', value: 'Off' },
  ],
  [
    { label: 'Assignment group', value: 'Assignment' },
    { label: 'Multiple Attempts', value: 'Off' },
  ],
]

export type AssignRow = {
  group: string
  available: string
  due: string
  until: string
  showResults: string
  hideResults: string
}

export const SUMMARY_ASSIGN: AssignRow[] = [
  { group: 'Group 1', available: 'March 1, 2024', due: 'March 8, 2024', until: 'March 12, 2024', showResults: 'March 14, 2024', hideResults: 'March 15, 2024' },
  { group: 'Group 2', available: 'March 16, 2024', due: 'March 20, 2024', until: 'March 24, 2024', showResults: 'March 28, 2024', hideResults: 'March 31, 2024' },
  { group: 'Group 3', available: 'April 1, 2024', due: 'April 7, 2024', until: 'April 13, 2024', showResults: 'April 19, 2024', hideResults: 'April 25, 2024' },
  { group: 'group 4', available: 'April 26, 2024', due: 'May 2, 2024', until: 'May 8, 2024', showResults: 'May 14, 2024', hideResults: 'May 20, 2024' },
]

export type StudentRow = {
  id: string
  name: string
  initials: string
  attempts: string
  score: string
  time: string
  log: boolean
  accommodations: string
}

export const STUDENTS: StudentRow[] = [
  { id: 's1', name: 'Robert Horvath', initials: 'RH', attempts: '—', score: '—', time: '—', log: false, accommodations: 'Time: +2 hr 0 min' },
  { id: 's2', name: 'Andras Student', initials: 'AS', attempts: 'Attempt 1 / 1', score: '20%', time: '00:40', log: true, accommodations: 'None' },
  { id: 's3', name: 'Balazs Student', initials: 'BS', attempts: 'Attempt 1 / 1', score: '25%', time: '00:38', log: true, accommodations: 'None' },
  { id: 's4', name: 'Cason Student', initials: 'CS', attempts: '—', score: '—', time: '—', log: false, accommodations: 'Time: +2 hr 0 min' },
  { id: 's5', name: 'Dmitry Student', initials: 'DS', attempts: '—', score: '—', time: '—', log: false, accommodations: 'Time: +30 min' },
  { id: 's6', name: 'Gergely Student', initials: 'GS', attempts: '—', score: '—', time: '—', log: false, accommodations: 'Time: +1 hr 0 min' },
  { id: 's7', name: 'Karoly Student', initials: 'KS', attempts: '—', score: '—', time: '—', log: false, accommodations: 'None' },
  { id: 's8', name: 'Marton Student', initials: 'MS', attempts: '—', score: '—', time: '—', log: false, accommodations: 'None' },
]

export type ReportCard = {
  title: string
  action: 'Export CSV' | 'View Report'
  link: string
}

export const REPORTS: ReportCard[] = [
  { title: 'Quiz and Item Analysis', action: 'Export CSV', link: 'Generate Report' },
  { title: 'Outcomes Analysis', action: 'View Report', link: '' },
  { title: 'Student Analysis', action: 'Export CSV', link: 'Generate Report' },
]

export const INITIAL_EXPORTS: string[] = [
  'Quiz Export from May 28, 2026 12:51:11 PM',
  'Quiz Export from May 18, 2026 2:59:06 PM',
]

// ── Quizzes index ──
// The course-level list of quizzes, the first screen before entering the builder.
// 'biology-1' is the canonical quiz mapped in INITIAL_QUESTIONS; the rest are
// realistic siblings in the same Biology course.
export type QuizGroup = 'Assignment quizzes' | 'Practice quizzes'

export type QuizListItem = {
  id: string
  title: string
  group: QuizGroup
  due: string
  points: number
  questions: number
  published: boolean
}

export const QUIZ_INDEX: QuizListItem[] = [
  { id: 'biology-1', title: 'Introduction to Biology — Quiz 1', group: 'Assignment quizzes', due: 'Mar 17', points: 20, questions: 4, published: true },
  { id: 'cell-structure', title: 'Cell Structure and Function', group: 'Assignment quizzes', due: 'Mar 24', points: 30, questions: 12, published: true },
  { id: 'genetics', title: 'Genetics and Heredity', group: 'Assignment quizzes', due: 'Apr 7', points: 25, questions: 10, published: false },
  { id: 'midterm', title: 'Midterm Exam', group: 'Assignment quizzes', due: 'Apr 21', points: 100, questions: 40, published: false },
  { id: 'photosynthesis', title: 'Photosynthesis Practice', group: 'Practice quizzes', due: 'No due date', points: 0, questions: 8, published: true },
  { id: 'vocab-ch3', title: 'Vocabulary Check: Chapter 3', group: 'Practice quizzes', due: 'No due date', points: 0, questions: 15, published: true },
]

export const QUIZ_GROUPS: QuizGroup[] = ['Assignment quizzes', 'Practice quizzes']

// Course-level (second-layer) navigation shown on the quizzes index, in Canvas order.
export const COURSE_NAV: string[] = [
  'Home',
  'Announcements',
  'Assignments',
  'Discussions',
  'Grades',
  'People',
  'Pages',
  'Syllabus',
  'Outcomes',
  'Quizzes',
  'Modules',
  'Conferences',
  'Collaborations',
  'Settings',
]

export const ACTIVE_COURSE_NAV = 'Quizzes'
