/**
 * Mock Storage System (Swagger API 기준)
 * localStorage 기반 데이터 영속성 관리
 */

const STORAGE_PREFIX = 'horizon_swagger_';

export class MockStorage {
  private static instance: MockStorage;

  private constructor() {
    this.initializeStorage();
  }

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
    }
    return MockStorage.instance;
  }

  private initializeStorage(): void {
    if (!this.has('initialized')) {
      this.set('initialized', true);
      this.set('lastId', 1);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  has(key: string): boolean {
    return localStorage.getItem(STORAGE_PREFIX + key) !== null;
  }

  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    this.initializeStorage();
  }

  // ID 생성기
  getNextId(): number {
    const currentId = this.get<number>('lastId') || 0;
    const nextId = currentId + 1;
    this.set('lastId', nextId);
    return nextId;
  }

  // Helper: get with default value
  getOrDefault<T>(key: string, defaultValue: T): T {
    return this.get<T>(key) || defaultValue;
  }
}

export const mockStorage = MockStorage.getInstance();
