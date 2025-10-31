import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 344px;
  height: 136px;
  padding: 0 ${tokens.spacing.xlarge};
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[100]};
  border-radius: ${tokens.radius.large};
  box-sizing: border-box;
  box-shadow: ${tokens.shadow[0]};
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 92px;
  flex: 1;
  min-width: 0;
`;

export const LabelSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xxsmall};
  min-width: 0;
  max-width: 100%;
`;

export const Label = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[16]};
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: ${tokens.typos.lineHeight[24]};
  color: ${tokens.colors.neutral[500]};
  margin: 0;
  white-space: nowrap;
`;

export const Count = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[32]};
  font-weight: ${tokens.typos.fontWeight.heavy};
  line-height: ${tokens.typos.lineHeight[44]};
  letter-spacing: -0.64px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
`;

export const SchoolName = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[24]};
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: ${tokens.typos.lineHeight[34]};
  letter-spacing: -0.36px;
  color: ${tokens.colors.neutral[800]};
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 224px;
`;

export const SubInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.xxsmall};
`;

export const SubIcon = styled.span<{ $error?: boolean }>`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 16px;
  line-height: 1;
  color: ${({ $error }) => ($error ? tokens.colors.error[200] : tokens.colors.neutral[500])};
  font-variation-settings: 'FILL' ${tokens.icons.fill[1]}, 'GRAD' ${tokens.icons.grade[0]};
`;

export const SubText = styled.div`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: ${tokens.typos.fontSize[14]};
  font-weight: ${tokens.typos.fontWeight.light};
  line-height: ${tokens.typos.lineHeight[22]};
  color: ${tokens.colors.neutral[500]};
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: ${tokens.radius.medium};
  flex-shrink: 0;
  position: relative;
`;

export const CardIcon = styled.span`
  font-family: ${tokens.typos.fontFamily.icon.join(', ')};
  font-size: 32px;
  line-height: 1;
  color: ${tokens.colors.primary[500]};
  font-variation-settings: 'FILL' ${tokens.icons.fill[1]}, 'GRAD' ${tokens.icons.grade[0]},
    'opsz' ${tokens.icons.opticalSize[40]};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
