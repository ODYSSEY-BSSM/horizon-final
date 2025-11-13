import Cookies from 'js-cookie';

class TokenStore {
  private accessToken: string | null = null;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  getAccessToken(): string | null {
    if (!this.accessToken && typeof window !== 'undefined') {
      this.accessToken = Cookies.get(this.ACCESS_TOKEN_KEY) || null;
    }
    return this.accessToken;
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;

    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      Cookies.set(this.ACCESS_TOKEN_KEY, token, { expires: 7 });
    } else {
      Cookies.remove(this.ACCESS_TOKEN_KEY);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return Cookies.get(this.REFRESH_TOKEN_KEY) || null;
  }

  setRefreshToken(token: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (token) {
      Cookies.set(this.REFRESH_TOKEN_KEY, token, { expires: 7 });
    } else {
      Cookies.remove(this.REFRESH_TOKEN_KEY);
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
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }
}

export const tokenStore = new TokenStore();
