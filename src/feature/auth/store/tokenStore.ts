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
