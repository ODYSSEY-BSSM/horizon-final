import { css } from '@emotion/react';

export const flex = {
  column: css`
    display: flex;
    flex-direction: column;
  `,

  columnCenter: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,

  columnStart: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  `,

  center: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  rowCenter: css`
    display: flex;
    align-items: center;
  `,

  spaceBetween: css`
    display: flex;
    justify-content: space-between;
  `,

  gap: (size: number) => css`
    gap: ${size}px;
  `,
};
