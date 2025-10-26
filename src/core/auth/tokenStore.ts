/**
 * 토큰 관리 Store
 *
 * 보안 개선:
 * - accessToken: 메모리에만 저장 (XSS 공격 시에도 페이지 새로고침으로 제거됨)
 * - refreshToken: sessionStorage에 저장 (localStorage보다 안전, 탭 닫으면 삭제)
 *
 * TODO: 향후 백엔드에서 httpOnly 쿠키 방식으로 변경 예정
 */

class TokenStore {
  private accessToken: string | null = null;
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearTokens(): void {
    this.setAccessToken(null);
    this.setRefreshToken(null);
  }

  hasTokens(): boolean {
    return !!this.accessToken && !!this.getRefreshToken();
  }
}

export const tokenStore = new TokenStore();
