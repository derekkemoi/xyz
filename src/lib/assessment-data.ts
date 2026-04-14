import type { OnboardingAssessment } from "../types/assessment"

export const ONBOARDING_ASSESSMENT: OnboardingAssessment = {
  id: "onboarding-v1",
  name: "AI Training Skills Assessment",
  description: "Test your ability to handle AI training tasks",
  passPercentage: 60,
  estimatedDurationMinutes: 3,
  questions: [
    {
      id: "q1",
      type: "multiple_choice",
      prompt: "Which sentence is correct?",
      options: [
        "He go to school every day",
        "He goes to school every day",
        "He going to school every day",
        "He gone to school every day",
      ],
      correctIndex: 1,
    },
    {
      id: "q2",
      type: "pattern",
      prompt: "What comes next in the sequence?\n5, 10, 15, 20, ?",
      options: ["22", "25", "30", "35"],
      correctIndex: 1,
    },
    {
      id: "q3",
      type: "multiple_choice",
      prompt: "Which word is a verb?",
      options: ["Quickly", "Run", "Blue", "Happy"],
      correctIndex: 1,
    },
    {
      id: "q4",
      type: "classification",
      prompt: 'Classify this sentence:\n"Can you help me fix this problem?"',
      options: ["Statement", "Question", "Command", "Opinion"],
      correctIndex: 1,
    },
    {
      id: "q5",
      type: "multiple_choice",
      prompt: "If you have 3 apples and you eat 1, how many are left?",
      options: ["1", "2", "3", "4"],
      correctIndex: 1,
    },
  ],
}

export const MOCK_ASSESSMENTS_CACHE = {
  completedAt: new Date().toISOString(),
  score: 5,
  totalQuestions: 5,
  passed: true,
  assessmentId: ONBOARDING_ASSESSMENT.id,
  answers: {
    q1: 1,
    q2: 1,
    q3: 1,
    q4: 1,
    q5: 1,
  },
}
