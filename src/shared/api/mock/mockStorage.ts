const STORAGE_PREFIX = 'horizon_swagger_';

export class MockStorage {
  private static instance: MockStorage;
  private memoryStorage: Map<string, string> = new Map();

  private constructor() {
    this.initializeStorage();
  }

  static getInstance(): MockStorage {
    if (!MockStorage.instance) {
      MockStorage.instance = new MockStorage();
    }
    return MockStorage.instance;
  }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private initializeStorage(): void {
    if (!this.has('initialized')) {
      this.set('initialized', true);
      this.set('lastId', 1);
    }
  }

  get<T>(key: string): T | null {
    try {
      const fullKey = STORAGE_PREFIX + key;
      const item = this.isClient()
        ? localStorage.getItem(fullKey)
        : this.memoryStorage.get(fullKey) || null;
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      const fullKey = STORAGE_PREFIX + key;
      const serialized = JSON.stringify(value);
      if (this.isClient()) {
        localStorage.setItem(fullKey, serialized);
      } else {
        this.memoryStorage.set(fullKey, serialized);
      }
    } catch (_error) {
      // ignore error
    }
  }

  has(key: string): boolean {
    const fullKey = STORAGE_PREFIX + key;
    if (this.isClient()) {
      return localStorage.getItem(fullKey) !== null;
    }
    return this.memoryStorage.has(fullKey);
  }

  remove(key: string): void {
    const fullKey = STORAGE_PREFIX + key;
    if (this.isClient()) {
      localStorage.removeItem(fullKey);
    } else {
      this.memoryStorage.delete(fullKey);
    }
  }

  clear(): void {
    if (this.isClient()) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      this.memoryStorage.clear();
    }
    this.initializeStorage();
  }

  getNextId(): number {
    const currentId = this.get<number>('lastId') || 0;
    const nextId = currentId + 1;
    this.set('lastId', nextId);
    return nextId;
  }

  getOrDefault<T>(key: string, defaultValue: T): T {
    return this.get<T>(key) || defaultValue;
  }
}

export const mockStorage = MockStorage.getInstance();
