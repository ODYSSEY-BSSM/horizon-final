import styled from '@emotion/styled';
import { tokens } from '@/core/tokens';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyledContainer>
      <StyledCard>{children}</StyledCard>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: ${tokens.colors.background};
`;

const StyledCard = styled.div`
  width: 720px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${tokens.colors.white};
  align-items: center;
  justify-content: center;
  box-shadow: ${tokens.shadow[0]};
`;
