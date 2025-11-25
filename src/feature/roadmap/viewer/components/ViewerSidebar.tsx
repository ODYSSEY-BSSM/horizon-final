'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { Button, Icon } from '@/shared/ui';

export type ViewerNodeType = 'standard' | 'secondary';

interface ChildNode {
  id: string;
  name: string;
  progress: number;
  totalQuiz: number;
}

interface NextNode {
  id: string;
  name: string;
  progress: number;
}

interface QuizProgress {
  current: number;
  total: number;
  allSolved: boolean;
}

export interface ViewerSidebarProps {
  nodeName: string;
  nodeDescription: string;
  nodeType: ViewerNodeType;
  childNodes?: ChildNode[];
  nextNodes?: NextNode[];
  quizProgress?: QuizProgress;
  overallProgress?: number;
  onQuizClick?: () => void;
  onChildNodeClick?: (nodeId: string) => void;
  onNextNodeClick?: (nodeId: string) => void;
  onClose?: () => void;
}

export const ViewerSidebar = ({
  nodeName,
  nodeDescription,
  nodeType,
  childNodes = [],
  nextNodes = [],
  quizProgress,
  overallProgress,
  onQuizClick,
  onChildNodeClick,
  onNextNodeClick,
  onClose,
}: ViewerSidebarProps) => {
  const hasChildren = childNodes.length > 0;
  const hasNext = nextNodes.length > 0;
  const showQuizSection = nodeType === 'secondary';

  return (
    <StyledSidebar>
      {/* 노드 정보 헤더 */}
      <StyledHeader>
        <StyledHeaderContent>
          <StyledNodeName>{nodeName}</StyledNodeName>
          <StyledNodeDescription>{nodeDescription}</StyledNodeDescription>
        </StyledHeaderContent>
        <StyledCloseButton onClick={onClose} type="button" aria-label="닫기">
          <Icon name="close" size={24} color={tokens.colors.neutral[600]} />
        </StyledCloseButton>
      </StyledHeader>

      {/* 하위 노드 섹션 (standard 노드만) */}
      {nodeType === 'standard' && (
        <StyledSection>
          <StyledSectionTitle>하위 노드</StyledSectionTitle>
          {hasChildren ? (
            <>
              <StyledNodeList>
                {childNodes.map((child) => (
                  <StyledNodeItem
                    key={child.id}
                    onClick={() => onChildNodeClick?.(child.id)}
                    $clickable={!!onChildNodeClick}
                  >
                    <StyledNodeItemName>{child.name}</StyledNodeItemName>
                    <StyledNodeItemProgress>
                      {child.progress}/{child.totalQuiz}
                    </StyledNodeItemProgress>
                  </StyledNodeItem>
                ))}
              </StyledNodeList>

              {/* 진행도 바 */}
              {overallProgress !== undefined && (
                <StyledProgressContainer>
                  <StyledProgressRow>
                    <StyledProgressLabel>진행도</StyledProgressLabel>
                    <StyledProgressValue>{overallProgress}%</StyledProgressValue>
                  </StyledProgressRow>
                  <StyledProgressBar>
                    <StyledProgressFill $progress={overallProgress} />
                  </StyledProgressBar>
                </StyledProgressContainer>
              )}
            </>
          ) : (
            <StyledEmptyMessage>하위 노드가 없습니다.</StyledEmptyMessage>
          )}
        </StyledSection>
      )}

      {/* 다음 노드 섹션 */}
      <StyledSection>
        <StyledSectionTitle>다음 노드</StyledSectionTitle>
        {hasNext ? (
          <StyledNodeList>
            {nextNodes.map((next) => (
              <StyledNodeItem
                key={next.id}
                onClick={() => onNextNodeClick?.(next.id)}
                $clickable={!!onNextNodeClick}
              >
                <StyledNodeItemName>{next.name}</StyledNodeItemName>
                <StyledNodeItemProgress>{next.progress}%</StyledNodeItemProgress>
              </StyledNodeItem>
            ))}
          </StyledNodeList>
        ) : (
          <StyledEmptyMessage>다음 노드가 없습니다.</StyledEmptyMessage>
        )}
      </StyledSection>

      {/* 확인 문제 섹션 (secondary 노드만) */}
      {showQuizSection && quizProgress && (
        <StyledQuizSection>
          <StyledSectionTitle>
            확인 문제 진행도: {quizProgress.current}/{quizProgress.total}
          </StyledSectionTitle>
          <StyledFullWidthButton
            variant={quizProgress.allSolved ? 'outlined' : 'contained'}
            size="large"
            onClick={onQuizClick}
          >
            {quizProgress.allSolved ? '문제 다시 풀기' : '확인 문제 풀기'}
          </StyledFullWidthButton>
        </StyledQuizSection>
      )}
    </StyledSidebar>
  );
};

// Styled Components

const StyledSidebar = styled.aside`
  position: fixed;
  top: 64px;
  right: 0;
  width: 400px;
  height: calc(100vh - 64px);
  background-color: ${tokens.colors.white};
  border-left: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 50;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${tokens.spacing.medium};
  padding: ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  flex: 1;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: ${tokens.radius.small};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }

  &:active {
    background-color: ${tokens.colors.neutral[200]};
  }
`;

const StyledNodeName = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 24px;
  font-weight: ${tokens.typos.fontWeight.extrabold};
  line-height: 34px;
  letter-spacing: -0.36px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledNodeDescription = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 16px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: ${tokens.spacing.large};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
`;

const StyledQuizSection = styled(StyledSection)`
  border-bottom: none;
`;

const StyledSectionTitle = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 20px;
  font-weight: ${tokens.typos.fontWeight.bold};
  line-height: 28px;
  letter-spacing: -0.2px;
  color: ${tokens.colors.black};
  margin: 0;
`;

const StyledNodeList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.small};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledNodeItem = styled.li<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 16px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  transition: background-color 0.2s ease;
  padding: ${tokens.spacing.xsmall} 0;

  ${(props) =>
    props.$clickable &&
    `
    &:hover {
      opacity: 0.8;
    }
  `}
`;

const StyledNodeItemName = styled.span`
  color: ${tokens.colors.neutral[900]};
`;

const StyledNodeItemProgress = styled.span`
  color: ${tokens.colors.neutral[600]};
`;

const StyledEmptyMessage = styled.p`
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 16px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  color: ${tokens.colors.neutral[600]};
  margin: 0;
`;

const StyledProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const StyledProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${tokens.typos.fontFamily.suit.join(', ')};
  font-size: 16px;
  font-weight: ${tokens.typos.fontWeight.regular};
  line-height: 24px;
  margin-bottom: ${tokens.spacing.xsmall};
`;

const StyledProgressLabel = styled.span`
  color: ${tokens.colors.neutral[600]};
`;

const StyledProgressValue = styled.span`
  color: ${tokens.colors.neutral[600]};
`;

const StyledProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${tokens.colors.primary[100]};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const StyledProgressFill = styled.div<{ $progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${(props) => props.$progress}%;
  background-color: #2666dc;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const StyledFullWidthButton = styled(Button)`
  width: 100%;
`;
