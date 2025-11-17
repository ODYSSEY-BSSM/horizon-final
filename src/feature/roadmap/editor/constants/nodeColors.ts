import type { NodeColor } from '../types/node.types';

/**
 * 노드 색상 테마 정의
 * Figma 디자인에서 추출한 6가지 색상 팔레트
 */

export interface ColorTheme {
  primary: string; // 메인 색상 (타이틀 노드 배경, 아이콘)
  background: string; // 배경 색상 (표준/세컨더리 노드)
  border: string; // 테두리 색상
  progressBar: string; // 진행률 바 색상
  progressBackground: string; // 진행률 바 배경
}

export const NODE_COLORS: Record<NodeColor, ColorTheme> = {
  blue: {
    primary: '#2666dc',
    background: '#ffffff',
    border: '#2666dc',
    progressBar: '#2666dc',
    progressBackground: '#e8f0fe',
  },
  red: {
    primary: '#dc2626',
    background: '#ffffff',
    border: '#dc2626',
    progressBar: '#dc2626',
    progressBackground: '#fee2e2',
  },
  yellow: {
    primary: '#eab308',
    background: '#ffffff',
    border: '#eab308',
    progressBar: '#eab308',
    progressBackground: '#fef9c3',
  },
  purple: {
    primary: '#9333ea',
    background: '#ffffff',
    border: '#9333ea',
    progressBar: '#9333ea',
    progressBackground: '#f3e8ff',
  },
  orange: {
    primary: '#ea580c',
    background: '#ffffff',
    border: '#ea580c',
    progressBar: '#ea580c',
    progressBackground: '#ffedd5',
  },
  green: {
    primary: '#16a34a',
    background: '#ffffff',
    border: '#16a34a',
    progressBar: '#16a34a',
    progressBackground: '#dcfce7',
  },
};

/**
 * 색상 테마 가져오기
 */
export const getNodeColor = (color: NodeColor): ColorTheme => {
  return NODE_COLORS[color];
};
