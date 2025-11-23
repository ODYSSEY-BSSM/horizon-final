/**
 * Roadmap Editor - Node Local Storage Utility
 *
 * 노드 정보를 localStorage에 임시 저장합니다.
 * 30초마다 자동 저장되며, 새로고침 시 복원됩니다.
 *
 * ⚠️ 주의: 로컬 스토리지는 임시 저장용이며, 서버 저장은 수동으로만 수행됩니다.
 */

import type { Node } from 'reactflow';

const STORAGE_KEY_PREFIX = 'roadmap-nodes-';

/**
 * roadmapId에 대한 localStorage 키 생성
 */
function getStorageKey(roadmapId: number): string {
  return `${STORAGE_KEY_PREFIX}${roadmapId}`;
}

/**
 * Node 목록을 localStorage에 저장
 * @param roadmapId - 로드맵 ID
 * @param nodes - 저장할 Node 배열
 */
export function saveNodes(roadmapId: number, nodes: Node[]): void {
  if (typeof window === 'undefined') {
    return; // SSR 환경에서는 실행 안 함
  }

  try {
    const key = getStorageKey(roadmapId);
    const serialized = JSON.stringify(nodes);
    localStorage.setItem(key, serialized);
  } catch (_error) {
    // localStorage 저장 실패 시 무시 (quota 초과, 권한 없음 등)
  }
}

/**
 * localStorage에서 Node 목록 불러오기
 * @param roadmapId - 로드맵 ID
 * @returns Node 배열 (없으면 null)
 */
export function loadNodes(roadmapId: number): Node[] | null {
  if (typeof window === 'undefined') {
    return null; // SSR 환경에서는 null 반환
  }

  try {
    const key = getStorageKey(roadmapId);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return null;
    }

    const nodes = JSON.parse(serialized) as Node[];
    return nodes;
  } catch (_error) {
    return null;
  }
}

/**
 * localStorage에서 특정 roadmapId의 Node 삭제
 * @param roadmapId - 로드맵 ID
 */
export function clearNodes(roadmapId: number): void {
  if (typeof window === 'undefined') {
    return; // SSR 환경에서는 실행 안 함
  }

  try {
    const key = getStorageKey(roadmapId);
    localStorage.removeItem(key);
  } catch (_error) {
    // localStorage 삭제 실패 시 무시 (권한 없음 등)
  }
}

/**
 * 모든 roadmap의 Node를 localStorage에서 삭제
 * (개발/디버깅용)
 */
export function clearAllNodes(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (_error) {
    // localStorage 삭제 실패 시 무시 (권한 없음 등)
  }
}

/**
 * 마지막 저장 시간 기록
 */
export function saveLastSaveTime(roadmapId: number): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}last-save-${roadmapId}`;
    localStorage.setItem(key, Date.now().toString());
  } catch (_error) {
    // 실패 시 무시
  }
}

/**
 * 마지막 저장 시간 가져오기
 */
export function getLastSaveTime(roadmapId: number): number | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}last-save-${roadmapId}`;
    const time = localStorage.getItem(key);
    return time ? Number.parseInt(time, 10) : null;
  } catch (_error) {
    return null;
  }
}
