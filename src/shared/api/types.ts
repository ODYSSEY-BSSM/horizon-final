// ===================================
// API Response Types
// ===================================
export interface ApiResponse<T = unknown> {
  code: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}

// ===================================
// Common Enums (from HTML API spec)
// ===================================

// Roadmap & Node Colors
export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  ORANGE = 'ORANGE',
  GREEN = 'GREEN',
  PURPLE = 'PURPLE',
  YELLOW = 'YELLOW',
  PINK = 'PINK',
}

// Color Hex Mapping (from API response)
export const ColorHexMap: Record<string, string> = {
  DC2626: 'RED',
  EA580C: 'ORANGE',
  '3B82F6': 'BLUE',
  '22C55E': 'GREEN',
  A855F7: 'PURPLE',
  EAB308: 'YELLOW',
  EC4899: 'PINK',
};

// Roadmap & Node Icons
export enum Icon {
  DATABASE = 'DATABASE',
  HTML = 'HTML',
  CODE = 'CODE',
  BOOK = 'BOOK',
  STAR = 'STAR',
  HEART = 'HEART',
  FOLDER = 'FOLDER',
  DOCUMENT = 'DOCUMENT',
}

// Icon Lowercase Mapping (from API response)
export const IconMap: Record<string, Icon> = {
  database: Icon.DATABASE,
  html: Icon.HTML,
  code: Icon.CODE,
  book: Icon.BOOK,
  star: Icon.STAR,
  heart: Icon.HEART,
  folder: Icon.FOLDER,
  document: Icon.DOCUMENT,
};

// Education Subject Types
export enum Subject {
  AI_GENERAL = 'AI_GENERAL', // 인공지능 일반
  AI_MATHEMATICS = 'AI_MATHEMATICS',
  AI_PROGRAMMING = 'AI_PROGRAMMING',
  DATA_STRUCTURES = 'DATA_STRUCTURES',
  ALGORITHMS = 'ALGORITHMS',
  WEB_PROGRAMMING = 'WEB_PROGRAMMING',
  DATABASE = 'DATABASE',
  SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',
}

// Node Types
export enum NodeType {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

// Problem Status
export enum ProblemStatus {
  UNRESOLVED = 'UNRESOLVED',
  RESOLVED = 'RESOLVED',
}

// Team Apply Status
export enum ApplyStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// User Role
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
