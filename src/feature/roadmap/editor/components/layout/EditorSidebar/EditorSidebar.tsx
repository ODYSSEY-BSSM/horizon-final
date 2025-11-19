'use client';

import styled from '@emotion/styled';
import { ColorDropdown } from '@/feature/roadmap';
import {
  type DropdownOption,
  EditorDropdown,
  EditorTextbox,
  EditorTextfield,
} from '@/feature/roadmap/editor';
import { tokens } from '@/shared/tokens';
import { Button, Icon } from '@/shared/ui';

export type EditorNodeType =
  | 'title'
  | 'standard'
  | 'secondary'
  | 'section'
  | 'titleText'
  | 'paragraphText';

export interface EditorSidebarProps {
  nodeType: EditorNodeType;
  nodeData?: any; // 선택된 노드의 데이터
  onNodeUpdate?: (field: string, value: any) => void; // 노드 데이터 업데이트 콜백
  isSchoolNode?: boolean;
  onSchoolNodeToggle?: () => void;
}

const NODE_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'title', label: '제목 노드' },
  { value: 'standard', label: '기본 노드' },
  { value: 'secondary', label: '세부 노드' },
];

const TEXT_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'titleText', label: '제목 텍스트' },
  { value: 'paragraphText', label: '본문 텍스트' },
];

export const EditorSidebar = ({
  nodeType,
  nodeData,
  onNodeUpdate,
  isSchoolNode = false,
  onSchoolNodeToggle,
}: EditorSidebarProps) => {
  const renderHeader = () => {
    switch (nodeType) {
      case 'title':
        return (
          <StyledHeader>
            <StyledHeaderTitle>Title Node</StyledHeaderTitle>
            <StyledHeaderSubtitle>제목 노드</StyledHeaderSubtitle>
          </StyledHeader>
        );
      case 'standard':
        return (
          <StyledHeader>
            {isSchoolNode ? (
              <>
                <StyledHeaderTitleRow>
                  <Icon name="school" size={24} color="#2666dc" filled />
                  <StyledHeaderTitle>Standard School Node</StyledHeaderTitle>
                </StyledHeaderTitleRow>
                <StyledHeaderSubtitle>기본 학교 노드</StyledHeaderSubtitle>
              </>
            ) : (
              <>
                <StyledHeaderTitle>Standard Node</StyledHeaderTitle>
                <StyledHeaderSubtitle>기본 노드</StyledHeaderSubtitle>
              </>
            )}
          </StyledHeader>
        );
      case 'secondary':
        return (
          <StyledHeader>
            {isSchoolNode ? (
              <>
                <StyledHeaderTitleRow>
                  <Icon name="school" size={24} color="#2666dc" filled />
                  <StyledHeaderTitle>Secondary School Node</StyledHeaderTitle>
                </StyledHeaderTitleRow>
                <StyledHeaderSubtitle>세부 학교 노드</StyledHeaderSubtitle>
              </>
            ) : (
              <>
                <StyledHeaderTitle>Secondary Node</StyledHeaderTitle>
                <StyledHeaderSubtitle>세부 노드</StyledHeaderSubtitle>
              </>
            )}
          </StyledHeader>
        );
      case 'section':
        return (
          <StyledHeader>
            <StyledHeaderTitle>Section</StyledHeaderTitle>
            <StyledHeaderSubtitle>섹션</StyledHeaderSubtitle>
          </StyledHeader>
        );
      case 'titleText':
        return (
          <StyledHeader>
            <StyledHeaderTitle>Title Text</StyledHeaderTitle>
            <StyledHeaderSubtitle>제목 텍스트</StyledHeaderSubtitle>
          </StyledHeader>
        );
      case 'paragraphText':
        return (
          <StyledHeader>
            <StyledHeaderTitle>Paragraph Text</StyledHeaderTitle>
            <StyledHeaderSubtitle>본문 텍스트</StyledHeaderSubtitle>
          </StyledHeader>
        );
    }
  };

  const renderContent = () => {
    if (nodeType === 'section') {
      return (
        <StyledSection>
          <StyledSectionTitle>스타일</StyledSectionTitle>
          <StyledDimensionRow>
            <EditorTextbox label="W" value="240px" />
            <EditorTextbox label="H" value="158px" />
          </StyledDimensionRow>
        </StyledSection>
      );
    }

    if (nodeType === 'titleText' || nodeType === 'paragraphText') {
      return (
        <StyledSection>
          <StyledSectionTitle>속성</StyledSectionTitle>
          <StyledFormGroup>
            <EditorDropdown label="타입" options={TEXT_TYPE_OPTIONS} selectedValue={nodeType} />
            <EditorTextfield
              label="텍스트"
              value={nodeData?.text || ''}
              onChange={(value) => onNodeUpdate?.('text', value)}
            />
          </StyledFormGroup>
        </StyledSection>
      );
    }

    // Title, Standard, Secondary nodes
    const showSchoolToggle = nodeType === 'standard' || nodeType === 'secondary';
    const selectedTypeValue = nodeType;

    return (
      <>
        <StyledSection>
          <StyledSectionTitle>노드 정보</StyledSectionTitle>
          <StyledFormGroup $disabled={isSchoolNode}>
            <EditorDropdown
              label="타입"
              options={NODE_TYPE_OPTIONS}
              selectedValue={selectedTypeValue}
            />
            <EditorTextbox
              label="이름"
              value={nodeData?.label || nodeData?.title || ''}
              onChange={(value) => {
                const field = nodeType === 'title' ? 'label' : 'title';
                onNodeUpdate?.(field, value);
              }}
            />
            {nodeType !== 'title' && (
              <EditorTextfield
                label="학습 내용"
                value={nodeData?.description || ''}
                onChange={(value) => onNodeUpdate?.('description', value)}
              />
            )}
          </StyledFormGroup>
        </StyledSection>

        <StyledSection>
          <StyledSectionTitle>스타일</StyledSectionTitle>
          <ColorDropdown
            value={nodeData?.color || 'blue'}
            onChange={(value) => onNodeUpdate?.('color', value)}
          />
        </StyledSection>

        {showSchoolToggle && (
          <StyledBottomButtonContainer>
            <Button variant="outlined" size="medium" onClick={onSchoolNodeToggle}>
              {isSchoolNode ? '기본 노드로 전환' : '학교 노드로 전환'}
            </Button>
          </StyledBottomButtonContainer>
        )}
      </>
    );
  };

  return (
    <StyledContainer>
      {renderHeader()}
      {renderContent()}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 280px;
  height: 100%;
  background-color: ${tokens.colors.white};
  border-left: 1px solid ${tokens.colors.neutral[200]};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: visible;
`;

const StyledHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
`;

const StyledHeaderTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

const StyledHeaderTitle = styled.h2`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.semibold};
  font-size: 18px;
  line-height: 26px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledHeaderSubtitle = styled.p`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.light};
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
`;

const StyledSectionTitle = styled.h3`
  font-family: ${tokens.typos.fontFamily.suit};
  font-weight: ${tokens.typos.fontWeight.regular};
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const StyledFormGroup = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${(props) => (props.$disabled ? 0.4 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
`;

const StyledDimensionRow = styled.div`
  display: flex;
  gap: 8px;
  width: 240px;

  > * {
    flex: 1;
  }
`;

const StyledBottomButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 280px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
