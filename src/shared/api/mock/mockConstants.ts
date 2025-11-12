/**
 * Mock API Constants
 */

// API 응답 지연 시간 (밀리초)
export const MOCK_DELAYS = {
  FAST: 100, // 조회 (GET)
  NORMAL: 200, // 생성/수정 (POST/PUT/PATCH)
  SLOW: 300, // 복잡한 작업 (로그인, 회원가입)
} as const;

// Helper function for consistent delay
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
