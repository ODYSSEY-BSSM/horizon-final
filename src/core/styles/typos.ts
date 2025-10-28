import { css } from '@emotion/react';

interface SuitOptions {
  letterSpacing?: number;
  lineHeight?: number;
}

/**
 * SUIT Variable 폰트 스타일 유틸리티
 * @param fontSize - 필수: 폰트 크기 (px)
 * @param fontWeight - 필수: 폰트 굵기 (100-900)
 * @param options - 선택: letterSpacing, lineHeight
 * 예시 사용법: ${suit(16, 400, { letterSpacing: 0, lineHeight: 24 })}
 */
export const suit = (fontSize: number, fontWeight: number, options?: SuitOptions) => css`
  font-family: 'SUIT Variable', sans-serif;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  ${options?.letterSpacing !== undefined ? `letter-spacing: ${options.letterSpacing}px;` : ''}
  ${options?.lineHeight !== undefined ? `line-height: ${options.lineHeight}px;` : ''}
`;

interface IconOptions {
  opticalSize?: number;
  filled?: boolean;
}

/**
 * Material Symbols Rounded 아이콘 스타일 유틸리티
 * @param fontSize - 필수: 아이콘 크기 (px)
 * @param options - 선택: opticalSize, filled
 * 예시 사용법: ${icon(24, { opticalSize: 24, filled: true })}
 */
export const icon = (fontSize: number, options?: IconOptions) => {
  const variations: string[] = [];

  if (options?.opticalSize !== undefined) {
    variations.push(`'opsz' ${options.opticalSize}`);
  }

  if (options?.filled) {
    variations.push(`'FILL' 1`);
  }

  return css`
    font-family: 'Material Symbols Rounded';
    font-size: ${fontSize}px;
    font-weight: normal;
    font-style: normal;
    ${variations.length > 0 ? `font-variation-settings: ${variations.join(', ')};` : ''}
  `;
};
