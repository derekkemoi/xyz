import type { Task, TaskCategory } from "../types/tasks"

export const TASK_CATEGORIES_LIST: TaskCategory[] = [
  {
    id: "text-annotation",
    name: "Text Annotation",
    icon: "LuPen",
    description: "Label and annotate text data for NLP models",
    taskCount: 24,
    avgReward: 5.5,
  },
  {
    id: "data-categorization",
    name: "Data Categorization",
    icon: "LuTag",
    description: "Categorize data into predefined categories",
    taskCount: 18,
    avgReward: 4.2,
  },
  {
    id: "pattern-recognition",
    name: "Pattern Recognition",
    icon: "LuGrid",
    description: "Identify patterns in visual and text data",
    taskCount: 15,
    avgReward: 6.0,
  },
  {
    id: "sentiment-analysis",
    name: "Sentiment Analysis",
    icon: "LuSmile",
    description: "Determine sentiment and emotions in text",
    taskCount: 21,
    avgReward: 4.8,
  },
  {
    id: "survey-validation",
    name: "Survey Validation",
    icon: "LuClipboardList",
    description: "Validate and verify survey responses",
    taskCount: 12,
    avgReward: 3.5,
  },
  {
    id: "image-labeling",
    name: "Image Labeling",
    icon: "LuImage",
    description: "Label objects and features in images",
    taskCount: 19,
    avgReward: 5.8,
  },
  {
    id: "content-classification",
    name: "Content Classification",
    icon: "LuFilter",
    description: "Classify content by type, theme, or category",
    taskCount: 16,
    avgReward: 4.5,
  },
  {
    id: "translation-review",
    name: "Translation Review",
    icon: "LuLanguages",
    description: "Review and validate machine translations",
    taskCount: 14,
    avgReward: 6.2,
  },
  {
    id: "audio-transcription",
    name: "Audio Transcription",
    icon: "LuHeadphones",
    description: "Transcribe and validate audio content",
    taskCount: 10,
    avgReward: 7.0,
  },
  {
    id: "research-data",
    name: "Research Data",
    icon: "LuDatabase",
    description: "Collect and validate research data",
    taskCount: 13,
    avgReward: 5.2,
  },
]

export const SAMPLE_TASKS: Task[] = [
  {
    id: "task-001",
    categoryId: "text-annotation",
    categoryName: "Text Annotation",
    categoryIcon: "LuPen",
    description: "Annotate product reviews for sentiment and features",
    difficulty: "easy",
    totalQuestions: 8,
    estimatedTimeMinutes: 5,
    totalReward: 4.8,
    topics: [
      {
        topicId: "topic-1",
        topicName: "Positive Reviews",
        questions: [
          {
            id: "q1",
            amount: 0.6,
            question: {
              question:
                "Mark the main sentiment feature in: 'Amazing quality and fast delivery!'",
              answerIndex: 0,
              answers: ["Positive: Quality & Speed", "Negative: Price", "Neutral: Color"],
            },
          },
          {
            id: "q2",
            amount: 0.6,
            question: {
              question: "Identify the feature mentioned: 'The battery lasts all day'",
              answerIndex: 0,
              answers: ["Battery Life", "Design", "Price"],
            },
          },
        ],
      },
      {
        topicId: "topic-2",
        topicName: "Negative Reviews",
        questions: [
          {
            id: "q3",
            amount: 0.6,
            question: {
              question: "What is the main complaint in: 'Screen brightness is too low'",
              answerIndex: 0,
              answers: ["Display Issue", "Performance", "Software"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "task-002",
    categoryId: "sentiment-analysis",
    categoryName: "Sentiment Analysis",
    categoryIcon: "LuSmile",
    description: "Analyze customer feedback sentiment",
    difficulty: "easy",
    totalQuestions: 6,
    estimatedTimeMinutes: 4,
    totalReward: 3.6,
    topics: [
      {
        topicId: "topic-1",
        topicName: "Customer Feedback",
        questions: [
          {
            id: "q1",
            amount: 0.6,
            question: {
              question: 'Sentiment of "The app crashes frequently" is:',
              answerIndex: 1,
              answers: ["Positive", "Negative", "Neutral"],
            },
          },
          {
            id: "q2",
            amount: 0.6,
            question: {
              question: 'Sentiment of "It works okay, nothing special" is:',
              answerIndex: 2,
              answers: ["Positive", "Negative", "Neutral"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "task-003",
    categoryId: "data-categorization",
    categoryName: "Data Categorization",
    categoryIcon: "LuTag",
    description: "Categorize e-commerce products",
    difficulty: "medium",
    totalQuestions: 10,
    estimatedTimeMinutes: 6,
    totalReward: 5.5,
    topics: [
      {
        topicId: "topic-1",
        topicName: "Product Categories",
        questions: [
          {
            id: "q1",
            amount: 0.55,
            question: {
              question: "Categorize 'Samsung 55-inch TV':",
              answerIndex: 0,
              answers: ["Electronics", "Home Decor", "Furniture"],
            },
          },
        ],
      },
    ],
  },
]
