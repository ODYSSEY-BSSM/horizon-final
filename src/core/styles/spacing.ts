import { css } from '@emotion/react';

export const spacing = {
  mt: (size: number) => css`
    margin-top: ${size}px;
  `,

  mb: (size: number) => css`
    margin-bottom: ${size}px;
  `,

  ml: (size: number) => css`
    margin-left: ${size}px;
  `,

  mr: (size: number) => css`
    margin-right: ${size}px;
  `,

  pt: (size: number) => css`
    padding-top: ${size}px;
  `,

  pb: (size: number) => css`
    padding-bottom: ${size}px;
  `,

  pl: (size: number) => css`
    padding-left: ${size}px;
  `,

  pr: (size: number) => css`
    padding-right: ${size}px;
  `,
};
