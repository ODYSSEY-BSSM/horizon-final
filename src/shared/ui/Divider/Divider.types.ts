import type React from 'react';

export interface HorizontalProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal';
  length?: string;
}

export interface VerticalProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation: 'vertical';
  length?: string;
}

export type DividerProps = HorizontalProps | VerticalProps;

export interface StyledDividerProps {
  length: string;
}
