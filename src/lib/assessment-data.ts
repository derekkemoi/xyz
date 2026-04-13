import type { OnboardingAssessment } from "../types/assessment"

export const ONBOARDING_ASSESSMENT: OnboardingAssessment = {
  id: "onboarding-v1",
  name: "AI Training Skills Assessment",
  description: "Test your ability to handle AI training tasks",
  passPercentage: 60,
  estimatedDurationMinutes: 5,
  questions: [
    {
      id: "q1",
      type: "multiple_choice",
      prompt:
        "Which of the following best describes the role of data annotation in AI training?",
      options: [
        "Labeling data to teach AI models the correct answers",
        "Writing code for AI algorithms",
        "Designing database structures",
        "Managing server infrastructure",
      ],
      correctIndex: 0,
    },
    {
      id: "q2",
      type: "arrange_words",
      prompt: "Arrange these words to form a correct sentence about AI:",
      sequence: ["AI", "models", "require", "training", "large", "datasets"],
      correctAnswer: "AI models require large training datasets",
    },
    {
      id: "q3",
      type: "classification",
      prompt: 'Classify this text as "Positive", "Negative", or "Neutral":\n"This product works great and I love using it!"',
      options: ["Positive", "Negative", "Neutral"],
      correctIndex: 0,
    },
    {
      id: "q4",
      type: "pattern",
      prompt: "What comes next in this sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "40", "48"],
      correctIndex: 1,
    },
    {
      id: "q5",
      type: "sentiment",
      prompt: 'What is the sentiment of this review:\n"The service was average, nothing special but acceptable."',
      options: ["Very Negative", "Negative", "Neutral", "Positive", "Very Positive"],
      correctIndex: 2,
    },
  ],
}

export const MOCK_ASSESSMENTS_CACHE = {
  completedAt: new Date().toISOString(),
  score: 100,
  totalQuestions: 5,
  passed: true,
  assessmentId: ONBOARDING_ASSESSMENT.id,
  answers: {
    q1: 0,
    q2: "AI models require large training datasets",
    q3: 0,
    q4: 1,
    q5: 2,
  },
}
