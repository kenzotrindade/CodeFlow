// #################################
// ### Shared Types
// #################################

export enum promptForm {
  progressive = "progressive",
  capstone = "capstone",
}

export const REGEX = {
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  USERNAME: /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,18}[a-zA-Z0-9]$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

export type LevelRule = {
  EASY: string;
  MEDIUM: string;
  HARD: string;
  EXPERT: string;
};

export type LevelGuideLine = {
  [key: string]: LevelRule | undefined;
  general: LevelRule;
};

export type UpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
};

export type Article = {
  title: string;
  description: string;
  url: string;
  cover_image?: string;
  social_image?: string;
  tags?: string;
  reading_time_minutes?: number;
  published_at?: string;
  user?: {
    name: string;
    profile_image_90: string;
  };
};

export type Language = {
  id: string;
  name: string;
  slug: string;
};

export const VALIDATION_MESSAGE = {
  PASSWORD:
    "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  USERNAME:
    "Username must be between 3 and 20 characters and follow standard naming conventions.",
  EMAIL: "Please enter a valid email address.",
};
