'use client';

import { useRouter } from 'next/navigation';
import { tokens } from '@/shared/tokens';
import { Button, Icon } from '@/shared/ui';
import {
  ButtonWrapper,
  Description,
  ErrorContainer,
  ErrorContent,
  IconWrapper,
  Title,
} from './ErrorPage.styles';
import type { ErrorPageProps } from './ErrorPage.types';

/**
 * 공통 에러 페이지 컴포넌트
 * 피그마 디자인: Layout/Error Pages
 */
export const ErrorPage = ({
  icon = 'close',
  title,
  description,
  buttonText = '돌아가기',
  onButtonClick,
}: ErrorPageProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.back();
    }
  };

  return (
    <ErrorContainer>
      <ErrorContent>
        <IconWrapper>
          <Icon name={icon} variant="XL" color={tokens.colors.neutral[900]} decorative />
        </IconWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ButtonWrapper>
          <Button variant="contained" size="medium" onClick={handleClick}>
            {buttonText}
          </Button>
        </ButtonWrapper>
      </ErrorContent>
    </ErrorContainer>
  );
};
