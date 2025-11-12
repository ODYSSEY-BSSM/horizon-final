/**
 * Mock Storage System
 * localStorage 기반 데이터 영속성 관리
 */

const STORAGE_PREFIX = 'horizon_mock_';

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
    // 초기 데이터가 없으면 설정
    if (!this.has('initialized')) {
      this.set('initialized', true);
      this.set('lastUserId', 1);
      this.set('lastRoadmapId', 1);
      this.set('lastNodeId', 1);
      this.set('lastProblemId', 1);
      this.set('lastDirectoryId', 1);
      this.set('lastTeamId', 1);
      this.set('lastApplyId', 1);
      this.set('lastEducationNodeId', 1);
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
  getNextId(type: string): number {
    const key = `last${type}Id`;
    const currentId = this.get<number>(key) || 0;
    const nextId = currentId + 1;
    this.set(key, nextId);
    return nextId;
  }
}

export const mockStorage = MockStorage.getInstance();
