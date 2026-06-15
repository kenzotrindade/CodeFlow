import { Language as PrismaLanguage, Difficulty } from "@prisma/client";

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
  general: LevelRule;
  [key: string]: LevelRule | undefined;
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

export type Language = PrismaLanguage;

export const VALIDATION_MESSAGE = {
  PASSWORD:
    "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  USERNAME:
    "Username must be between 3 and 20 characters and follow standard naming conventions.",
  EMAIL: "Please enter a valid email address.",
};

// ### AI Response Types

export interface AIValidationResponse {
  passed: boolean;
  score: number;
  critiques_techniques: string[];
  hint?: string;
  learning_path: {
    title: string;
    url?: string;
    description: string;
  }[];
  points_forts: string[];
  feedback: string;
}

export interface AIGenerationResponse {
  lumina_message: string;
  recommend_capstone?: boolean;
  title: string;
  statement: string;
  expectedOutput: string | object;
  notion: string;
  isCapstone?: boolean;
}
