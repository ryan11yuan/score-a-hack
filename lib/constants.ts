export const SCORE_THRESHOLDS = {
  HIGH: 75,
  MEDIUM: 45,
  LOW: 0,
} as const

export const SCORE_LABELS = {
  HIGH: "High Originality",
  MEDIUM: "Medium Originality",
  LOW: "Low Originality",
} as const

export const SCORE_DESCRIPTIONS = {
  HIGH: "Your idea shows strong uniqueness compared to existing projects",
  MEDIUM: "Your idea has some overlap with existing projects but maintains distinct elements",
  LOW: "Your idea has significant overlap with existing projects",
} as const

export const VALIDATION = {
  IDEA_MIN_LENGTH: 300,
  IDEA_MAX_LENGTH: 1200,
  DEVPOST_URL_PATTERN: /^https:\/\/(www\.)?devpost\.com\/.+/,
} as const

export const COPY = {
  HERO_TITLE: "Discover How Original Your Hackathon Idea Really Is",
  HERO_SUBTITLE:
    "Get instant analysis of your idea's originality with AI-powered insights. Compare against thousands of Devpost projects to understand what makes your hack unique.",
  EMPTY_STATE: "Run an analysis to see how original your idea is.",
  ERROR_GENERIC: "We couldn't fetch enough data. Try again or tweak your input.",
  PRIVACY_NOTE: "Your idea is analyzed privately and never stored permanently.",
} as const
