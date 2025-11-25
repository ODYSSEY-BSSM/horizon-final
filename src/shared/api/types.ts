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
  PSYCHIATRY = 'PSYCHIATRY',
  DEPLOYED_CODE = 'DEPLOYED_CODE',
  ASTERISK = 'ASTERISK',
  EXTENSION = 'EXTENSION',
  SCHOOL = 'SCHOOL',
  FUNCTION = 'FUNCTION',
  PUBLIC = 'PUBLIC',
  NETWORK_INTELLIGENCE = 'NETWORK_INTELLIGENCE',
  NETWORK_INTEL_NODE = 'NETWORK_INTEL_NODE',
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
  psychiatry: Icon.PSYCHIATRY,
  deployed_code: Icon.DEPLOYED_CODE,
  asterisk: Icon.ASTERISK,
  extension: Icon.EXTENSION,
  school: Icon.SCHOOL,
  function: Icon.FUNCTION,
  public: Icon.PUBLIC,
  network_intelligence: Icon.NETWORK_INTELLIGENCE,
  network_intel_node: Icon.NETWORK_INTEL_NODE,
};

export enum Subject {
  MATH_AND_AI = 'MATH_AND_AI',
  AI_PROGRAMMING = 'AI_PROGRAMMING',
  SCREEN_IMPLEMENTATION = 'SCREEN_IMPLEMENTATION',
  ADVANCED_SCREEN_IMPLEMENTATION = 'ADVANCED_SCREEN_IMPLEMENTATION',
  APPLICATION_PROGRAMMING = 'APPLICATION_PROGRAMMING',
  WEB_PROGRAMMING = 'WEB_PROGRAMMING',
  WEB_PROGRAMMING_PRACTICE = 'WEB_PROGRAMMING_PRACTICE',
  FRONTEND_BASIC = 'FRONTEND_BASIC',
  SQL = 'SQL',
  APPLICATION_DEV = 'APPLICATION_DEV',
  DATABASE_PROGRAMMING = 'DATABASE_PROGRAMMING',
  JAVA_PROGRAMMING = 'JAVA_PROGRAMMING',
  PROGRAMMING = 'PROGRAMMING',
  NETWORK_PROGRAMMING = 'NETWORK_PROGRAMMING',
  AWS_BASIC = 'AWS_BASIC',
  MICROPROCESSOR = 'MICROPROCESSOR',
  MICROPROCESSOR_CONTROL = 'MICROPROCESSOR_CONTROL',
  EMBEDDED_AUTO_CONTROL = 'EMBEDDED_AUTO_CONTROL',
  STM32 = 'STM32',
  COMPUTER_GRAPHIC = 'COMPUTER_GRAPHIC',
  MOTION_GRAPHIC = 'MOTION_GRAPHIC',
  DESIGN_GENERAL = 'DESIGN_GENERAL',
  ALGORITHM_DESIGN = 'ALGORITHM_DESIGN',
  ALGORITHM_BASIC = 'ALGORITHM_BASIC',
  AI_GENERAL = 'AI_GENERAL',
  BIGDATA_ANALYSIS = 'BIGDATA_ANALYSIS',
  ROBOT_PROGRAMMING = 'ROBOT_PROGRAMMING',
  NETWORK_THEORY = 'NETWORK_THEORY',
  APP_PROGRAMMING = 'APP_PROGRAMMING',
  MOBILE_PROGRAMMING = 'MOBILE_PROGRAMMING',
  BIGDATA_EXCEL = 'BIGDATA_EXCEL',
  PROJECT_PRACTICE = 'PROJECT_PRACTICE',
  SYSTEM_MANAGEMENT = 'SYSTEM_MANAGEMENT',
  JAVA = 'JAVA',
  COMPUTER_STRUCTURE = 'COMPUTER_STRUCTURE',
  DATA_STRUCTURE = 'DATA_STRUCTURE',
  IOT_AND_SENSOR = 'IOT_AND_SENSOR',
  AI_MATH_BASIC = 'AI_MATH_BASIC',
  PROBLEM_SOLVING_BASIC = 'PROBLEM_SOLVING_BASIC',
  ROBOT_SOFTWARE_DEV = 'ROBOT_SOFTWARE_DEV',
  EMBEDDED_SYSTEM = 'EMBEDDED_SYSTEM',
  ELECTRONIC_CIRCUIT = 'ELECTRONIC_CIRCUIT',
  ELECTRONIC_CAD = 'ELECTRONIC_CAD',
  PCB = 'PCB',
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

// ============================================
// WebSocket Message Types
// ============================================

// Team Directory Messages
export interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: unknown[];
}

export type DirectoryDeleteMessage = number; // Deleted directory ID

// Roadmap Node Messages
export interface RoadmapNodeMessage {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: string;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: unknown[];
}

export interface NodeUpdateMessage {
  id: number;
  data: {
    title: string;
    description: string;
    height: number;
    width: number;
    type: NodeType;
    x: number;
    y: number;
    color: Color;
  };
}

export type NodeDeleteMessage = number; // Deleted node ID

// Cursor Messages
export interface CursorSendMessage {
  x: number;
  y: number;
}

export interface CursorReceiveMessage {
  userId: number;
  userName: string;
  x: number;
  y: number;
}

// Section Messages
export interface SectionNode {
  id: number;
  title: string;
  description: string;
  problemCount: number;
  solverProblemCount: number;
}

export interface SectionMessage {
  section: {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    nodes: SectionNode[];
  };
}

export interface SectionUpdateMessage {
  id: number;
  data: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    nodeIds: number[];
  };
}

export type SectionDeleteMessage = number; // Deleted section ID

// Text Messages
export enum TextType {
  NORMAL = 'NORMAL',
}

export interface TextMessage {
  texts: {
    id: number;
    text: string;
    type: TextType;
    roadmapId: number;
    sectionId: number | null;
  };
}

export interface TextUpdateMessage {
  id: number;
  data: {
    text: string;
    type: TextType;
    sectionId: number | null;
  };
}

export type TextDeleteMessage = number; // Deleted text ID

// Roadmap Messages
export interface RoadmapMessage {
  roadmap: {
    id: number;
    title: string;
    description: string;
    color: Color;
    icon: Icon;
    isFavorite: boolean;
    directoryId: number | null;
    teamId: number;
  };
}

export interface RoadmapUpdateMessage {
  roadmap: {
    id: number;
    title: string;
    description: string;
    color: Color;
    icon: Icon;
    isFavorite: boolean;
    directoryId: number | null;
    teamId: number;
  };
}

export type RoadmapDeleteMessage = number; // Deleted roadmap ID
