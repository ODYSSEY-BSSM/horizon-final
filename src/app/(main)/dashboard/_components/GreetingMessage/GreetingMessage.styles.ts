import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  background-color: ${tokens.colors.white};
`;

export const DateText = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[18]};
  font-weight: ${tokens.typos.fontWeight.semibold};
  line-height: ${tokens.typos.lineHeight[26]};
  color: ${tokens.colors.neutral[600]};
  margin: 0;
`;

export const GreetingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.small};
`;

export const Prompt = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.36px;
  color: ${tokens.colors.black};
  margin: 0;
  white-space: nowrap;
`;

export const GreetingText = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.36px;
  color: ${tokens.colors.black};
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const UserName = styled.span`
  margin: 0;
`;

export const GreetingSuffix = styled.span`
  margin: 0;
`;
