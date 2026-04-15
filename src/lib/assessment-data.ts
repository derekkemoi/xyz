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
        "I am going home",
        "I going home",
        "I goes home",
        "I gone home",
      ],
      correctIndex: 0,
    },
    {
      id: "q2",
      type: "pattern",
      prompt: "What comes next in the sequence?\n1, 2, 3, 4, ?",
      options: ["3", "4", "5", "6"],
      correctIndex: 2,
    },
    {
      id: "q3",
      type: "multiple_choice",
      prompt: "Which word is a color?",
      options: ["Run", "Blue", "Eat", "Jump"],
      correctIndex: 1,
    },
    {
      id: "q4",
      type: "classification",
      prompt: 'Classify this sentence:\n"Where are you going?"',
      options: ["Statement", "Question", "Command", "Answer"],
      correctIndex: 1,
    },
    {
      id: "q5",
      type: "multiple_choice",
      prompt: "If you have 2 mangoes and get 1 more, how many do you have?",
      options: ["1", "2", "3", "4"],
      correctIndex: 2,
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
    q1: 0,
    q2: 2,
    q3: 1,
    q4: 1,
    q5: 2,
  },
}