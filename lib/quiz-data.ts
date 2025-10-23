// Quiz data with questions, answers, puzzle pieces, and hints
export interface Quiz {
  id: string
  quizNumber: number
  question: string
  options: string[]
  correctAnswer: number
  puzzleImageUrl: string
  hint: string
  nextQrLocation: string
  unlockPassword: string // Password to unlock this quiz
}

// Generate a simple hash for quiz IDs
function generateHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 12)
}

// Quiz data - 9 quizzes with questions, answers, puzzle pieces, and hints
export const quizzes: Quiz[] = [
  {
    id: generateHash("quiz-1-orientation-2025"),
    quizNumber: 1,
    question: "What year was our college founded?",
    options: ["1995", "2000", "1985", "2005"],
    correctAnswer: 2,
    puzzleImageUrl: "/puzzle-piece-1-of-9.jpg",
    hint: "Find the statue near the main entrance",
    nextQrLocation: "Main Entrance Statue",
    unlockPassword: "", // First quiz is always unlocked
  },
  {
    id: generateHash("quiz-2-orientation-2025"),
    quizNumber: 2,
    question: "How many buildings are in the main campus?",
    options: ["12", "15", "18", "20"],
    correctAnswer: 1,
    puzzleImageUrl: "/puzzle-piece-2-of-9.jpg",
    hint: "Check the library information desk",
    nextQrLocation: "Library Information Desk",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-3-orientation-2025"),
    quizNumber: 3,
    question: "What is the name of our college magazine?",
    options: ["Campus Voice", "The Chronicle", "Student Times", "College Pulse"],
    correctAnswer: 0,
    puzzleImageUrl: "/puzzle-piece-3-of-9.jpg",
    hint: "Visit the student center bulletin board",
    nextQrLocation: "Student Center Bulletin Board",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-4-orientation-2025"),
    quizNumber: 4,
    question: "In which year did the college get accreditation?",
    options: ["2010", "2012", "2015", "2018"],
    correctAnswer: 2,
    puzzleImageUrl: "/puzzle-piece-4-of-9.jpg",
    hint: "Look near the principal's office",
    nextQrLocation: "Principal's Office Area",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-5-orientation-2025"),
    quizNumber: 5,
    question: "What is the college's motto?",
    options: ["Excellence in Education", "Knowledge is Power", "Unity and Progress", "Wisdom and Virtue"],
    correctAnswer: 2,
    puzzleImageUrl: "/puzzle-piece-5-of-9.jpg",
    hint: "Check the main auditorium entrance",
    nextQrLocation: "Main Auditorium Entrance",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-6-orientation-2025"),
    quizNumber: 6,
    question: "How many sports facilities does the college have?",
    options: ["5", "7", "9", "11"],
    correctAnswer: 1,
    puzzleImageUrl: "/puzzle-piece-6-of-9.jpg",
    hint: "Visit the sports complex office",
    nextQrLocation: "Sports Complex Office",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-7-orientation-2025"),
    quizNumber: 7,
    question: "What is the capacity of the main auditorium?",
    options: ["500", "750", "1000", "1250"],
    correctAnswer: 2,
    puzzleImageUrl: "/puzzle-piece-7-of-9.jpg",
    hint: "Check the cafeteria notice board",
    nextQrLocation: "Cafeteria Notice Board",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-8-orientation-2025"),
    quizNumber: 8,
    question: "How many clubs are active in the college?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 2,
    puzzleImageUrl: "/puzzle-piece-8-of-9.jpg",
    hint: "Visit the student activities office",
    nextQrLocation: "Student Activities Office",
    unlockPassword: "nishant",
  },
  {
    id: generateHash("quiz-9-orientation-2025"),
    quizNumber: 9,
    question: "What is the name of the college's annual fest?",
    options: ["Techfest", "Culturefest", "Innovate", "Spectrum"],
    correctAnswer: 3,
    puzzleImageUrl: "/puzzle-piece-9-of-9.jpg",
    hint: "Return to the orientation hall with all pieces",
    nextQrLocation: "Orientation Hall",
    unlockPassword: "nishant",
  },
]

// Get quiz by ID
export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id)
}

// Get all quiz links
export function getAllQuizLinks(): { quizNumber: number; id: string; link: string }[] {
  return quizzes.map((quiz) => ({
    quizNumber: quiz.quizNumber,
    id: quiz.id,
    link: `/quiz/${quiz.id}`,
  }))
}
