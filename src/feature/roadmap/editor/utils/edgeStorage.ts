/**
 * Roadmap Editor - Edge Local Storage Utility
 *
 * Edge 정보는 현재 API에서 지원하지 않으므로 로컬 스토리지에 임시 저장합니다.
 * roadmapId별로 분리하여 저장하며, 새로고침 시 복원됩니다.
 *
 * ⚠️ 주의: 로컬 스토리지는 임시 솔루션이며, 향후 백엔드 Edge API가 추가되면 제거될 예정입니다.
 */

import type { Edge } from 'reactflow';

const STORAGE_KEY_PREFIX = 'roadmap-edges-';

/**
 * roadmapId에 대한 localStorage 키 생성
 */
function getStorageKey(roadmapId: number): string {
  return `${STORAGE_KEY_PREFIX}${roadmapId}`;
}

/**
 * Edge 목록을 localStorage에 저장
 * @param roadmapId - 로드맵 ID
 * @param edges - 저장할 Edge 배열
 */
export function saveEdges(roadmapId: number, edges: Edge[]): void {
  if (typeof window === 'undefined') {
    return; // SSR 환경에서는 실행 안 함
  }

  try {
    const key = getStorageKey(roadmapId);
    const serialized = JSON.stringify(edges);
    localStorage.setItem(key, serialized);
  } catch (_error) {
    // localStorage 저장 실패 시 무시 (quota 초과, 권한 없음 등)
  }
}

/**
 * localStorage에서 Edge 목록 불러오기
 * @param roadmapId - 로드맵 ID
 * @returns Edge 배열 (없으면 빈 배열)
 */
export function loadEdges(roadmapId: number): Edge[] {
  if (typeof window === 'undefined') {
    return []; // SSR 환경에서는 빈 배열 반환
  }

  try {
    const key = getStorageKey(roadmapId);
    const serialized = localStorage.getItem(key);

    if (!serialized) {
      return [];
    }

    const edges = JSON.parse(serialized) as Edge[];
    return edges;
  } catch (_error) {
    return [];
  }
}

/**
 * localStorage에서 특정 roadmapId의 Edge 삭제
 * @param roadmapId - 로드맵 ID
 */
export function clearEdges(roadmapId: number): void {
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
 * 모든 roadmap의 Edge를 localStorage에서 삭제
 * (개발/디버깅용)
 */
export function clearAllEdges(): void {
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
