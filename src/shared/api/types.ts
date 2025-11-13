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

export enum Color {
  RED = 'RED',
  ORANGE = 'ORANGE',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  PURPLE = 'PURPLE',
}

export const ColorHexMap: Record<string, string> = {
  DC2626: 'RED',
  EA580C: 'ORANGE',
  EAB308: 'YELLOW',
  '22C55E': 'GREEN',
  '3B82F6': 'BLUE',
  A855F7: 'PURPLE',
};

export enum Icon {
  LANGUAGE = 'LANGUAGE',
  CODE = 'CODE',
  SHIELD = 'SHIELD',
  DATABASE = 'DATABASE',
  HOST = 'HOST',
  HTML = 'HTML',
  CSS = 'CSS',
  JAVASCRIPT = 'JAVASCRIPT',
  REACT = 'REACT',
  VUE = 'VUE',
  ANGULAR = 'ANGULAR',
  NODE = 'NODE',
  PYTHON = 'PYTHON',
  JAVA = 'JAVA',
  CPP = 'CPP',
  GO = 'GO',
}

export const IconMap: Record<string, Icon> = {
  language: Icon.LANGUAGE,
  code: Icon.CODE,
  shield: Icon.SHIELD,
  database: Icon.DATABASE,
  host: Icon.HOST,
  html: Icon.HTML,
  css: Icon.CSS,
  javascript: Icon.JAVASCRIPT,
  react: Icon.REACT,
  vue: Icon.VUE,
  angular: Icon.ANGULAR,
  node: Icon.NODE,
  python: Icon.PYTHON,
  java: Icon.JAVA,
  cpp: Icon.CPP,
  go: Icon.GO,
};

export enum Subject {
  AI_GENERAL = 'AI_GENERAL',
  AI_MATHEMATICS = 'AI_MATHEMATICS',
  AI_PROGRAMMING = 'AI_PROGRAMMING',
  DATA_STRUCTURES = 'DATA_STRUCTURES',
  ALGORITHMS = 'ALGORITHMS',
  WEB_PROGRAMMING = 'WEB_PROGRAMMING',
  DATABASE = 'DATABASE',
  SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',
}

export enum NodeType {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

export enum ProblemStatus {
  UNRESOLVED = 'UNRESOLVED',
  RESOLVED = 'RESOLVED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
