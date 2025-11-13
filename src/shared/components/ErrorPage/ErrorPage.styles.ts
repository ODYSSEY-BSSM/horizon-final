import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: ${tokens.colors.background};
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${tokens.spacing.xlarge};
  width: 520px;
  padding: ${tokens.spacing.xxlarge};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: 8px;
  box-sizing: border-box;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${tokens.spacing.xsmall};
`;

export const Title = styled.h1`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.36px;
  color: ${tokens.colors.neutral[900]};
  text-align: center;
  margin: 0;
`;

export const Description = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[600]};
  text-align: center;
  margin: 0;
  white-space: pre-line;
`;

export const ButtonWrapper = styled.div`
  margin-top: ${tokens.spacing.large};
`;
