'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { tokens } from '@/shared/tokens';
import { Button, Divider, Text } from '@/shared/ui';

export type RoadmapHeaderMode = 'editor' | 'viewer';
export type EditorState = 'editing' | 'saved' | 'saving';

export interface RoadmapHeaderProps {
  mode: RoadmapHeaderMode;
  roadmapTitle?: string;
  roadmapId?: string;

  // Editor mode props
  editorState?: EditorState;
  onTempSave?: () => void;
  onSave?: () => void;
  /** 뷰어로 이동하기 전에 호출됨 (저장 등) - Promise 완료 후 이동 */
  onBeforeViewerNavigate?: () => Promise<void>;

  // Viewer mode props
  onEditClick?: () => void;
  showEditButton?: boolean;

  // Common props
  fixed?: boolean;
}

export const RoadmapHeader = ({
  mode,
  roadmapTitle = 'Roadmap1',
  roadmapId,
  editorState = 'editing',
  onTempSave,
  onSave,
  onBeforeViewerNavigate,
  onEditClick,
  showEditButton = true,
  fixed = false,
}: RoadmapHeaderProps) => {
  const router = useRouter();
  const isEditor = mode === 'editor';
  const isSaving = editorState === 'saving';
  const isSaved = editorState === 'saved';

  const handleLogoClick = async () => {
    if (isEditor && roadmapId) {
      // 뷰어로 이동 전 저장 콜백이 있으면 실행
      if (onBeforeViewerNavigate) {
        try {
          await onBeforeViewerNavigate();
        } catch {
          // 저장 실패해도 이동은 진행 (사용자가 선택할 수 있도록)
        }
      }
      router.push(`/viewer/${roadmapId}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <StyledContainer fixed={fixed}>
      <StyledLeftSection>
        <StyledLogoButton type="button" onClick={handleLogoClick}>
          <Image src="/logo.svg" alt="Horizon Logo" width={40} height={40} priority />
        </StyledLogoButton>
        <StyledTitleSection>
          <Text variant="H3" color={tokens.colors.neutral[900]} as="h1">
            {isEditor ? 'Roadmap Editor' : 'Roadmap Viewer'}
          </Text>
          <Divider orientation="vertical" length="24px" />
          <Text
            variant="H3"
            color={tokens.colors.neutral[500]}
            as="h2"
            ellipsis
            style={{ flex: 1, minWidth: 0 }}
          >
            {roadmapTitle}
          </Text>
          {isEditor && isSaved && (
            <Text
              variant="H3"
              color={tokens.colors.neutral[500]}
              as="span"
              style={{ fontSize: '18px', lineHeight: '26px' }}
            >
              (저장됨)
            </Text>
          )}
        </StyledTitleSection>
      </StyledLeftSection>

      <StyledRightSection>
        {isEditor ? (
          <>
            <Button
              size="medium"
              variant="outlined"
              iconName={isSaving ? 'autorenew' : 'save'}
              iconPosition="left"
              onClick={onTempSave}
              disabled={isSaving}
            >
              {isSaving ? '저장중' : '임시저장'}
            </Button>
            <Button
              size="medium"
              variant="contained"
              iconName="save"
              iconPosition="left"
              onClick={onSave}
              disabled={isSaving}
            >
              저장하기
            </Button>
          </>
        ) : (
          showEditButton && (
            <Button
              size="medium"
              variant="contained"
              iconName="edit"
              iconPosition="left"
              onClick={onEditClick}
            >
              수정하기
            </Button>
          )
        )}
      </StyledRightSection>
    </StyledContainer>
  );
};

const StyledContainer = styled.header<{ fixed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 12px 20px;
  background-color: ${tokens.colors.white};
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  box-sizing: border-box;

  ${({ fixed }) =>
    fixed &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  `}
`;

const StyledLeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
`;

const StyledLogoButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: ${tokens.radius.small};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tokens.colors.neutral[100]};
  }
`;

const StyledTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.large};
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StyledRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.gap.large};
  flex-shrink: 0;
`;
