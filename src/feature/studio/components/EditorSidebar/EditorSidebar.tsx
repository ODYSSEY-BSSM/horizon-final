'use client';

import styled from '@emotion/styled';
import {
  ColorDropdown,
  type DropdownOption,
  EditorDropdown,
  EditorTextbox,
  EditorTextfield,
} from '@/feature/studio';
import { tokens } from '@/shared/tokens';
import { Button } from '@/shared/ui';

export type NodeType =
  | 'title'
  | 'standard'
  | 'secondary'
  | 'section'
  | 'titleText'
  | 'paragraphText';

export interface EditorSidebarProps {
  nodeType: NodeType;
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
  isSchoolNode = false,
  onSchoolNodeToggle,
}: EditorSidebarProps) => {
  const renderHeader = () => {
    switch (nodeType) {
      case 'title':
        return (
          <Header>
            <HeaderTitle>Title Node</HeaderTitle>
            <HeaderSubtitle>제목 노드</HeaderSubtitle>
          </Header>
        );
      case 'standard':
        return (
          <Header>
            {isSchoolNode && <SchoolIcon className="material-symbols-rounded">school</SchoolIcon>}
            <HeaderTitle>{isSchoolNode ? 'Standard School Node' : 'Standard Node'}</HeaderTitle>
            <HeaderSubtitle>{isSchoolNode ? '기본 학교 노드' : '기본 노드'}</HeaderSubtitle>
          </Header>
        );
      case 'secondary':
        return (
          <Header>
            {isSchoolNode && <SchoolIcon className="material-symbols-rounded">school</SchoolIcon>}
            <HeaderTitle>{isSchoolNode ? 'Secondary School Node' : 'Secondary Node'}</HeaderTitle>
            <HeaderSubtitle>{isSchoolNode ? '세부 학교 노드' : '세부 노드'}</HeaderSubtitle>
          </Header>
        );
      case 'section':
        return (
          <Header>
            <HeaderTitle>Section</HeaderTitle>
            <HeaderSubtitle>섹션</HeaderSubtitle>
          </Header>
        );
      case 'titleText':
        return (
          <Header>
            <HeaderTitle>Title Text</HeaderTitle>
            <HeaderSubtitle>제목 텍스트</HeaderSubtitle>
          </Header>
        );
      case 'paragraphText':
        return (
          <Header>
            <HeaderTitle>Paragraph Text</HeaderTitle>
            <HeaderSubtitle>본문 텍스트</HeaderSubtitle>
          </Header>
        );
    }
  };

  const renderContent = () => {
    if (nodeType === 'section') {
      return (
        <Section>
          <SectionTitle>스타일</SectionTitle>
          <DimensionRow>
            <EditorTextbox label="W" value="240px" />
            <EditorTextbox label="H" value="158px" />
          </DimensionRow>
        </Section>
      );
    }

    if (nodeType === 'titleText' || nodeType === 'paragraphText') {
      return (
        <Section>
          <SectionTitle>속성</SectionTitle>
          <FormGroup>
            <EditorDropdown label="타입" options={TEXT_TYPE_OPTIONS} selectedValue={nodeType} />
            <EditorTextfield
              label="텍스트"
              value={nodeType === 'titleText' ? 'Smooth Criminal' : 'The first Paragraph'}
            />
          </FormGroup>
        </Section>
      );
    }

    // Title, Standard, Secondary nodes
    const showSchoolToggle = nodeType === 'standard' || nodeType === 'secondary';
    const defaultName =
      nodeType === 'title'
        ? 'Title Node'
        : nodeType === 'standard'
          ? 'Standard Node'
          : 'Secondary Node';
    const selectedTypeValue = nodeType;

    return (
      <>
        <Section>
          <SectionTitle>노드 정보</SectionTitle>
          <FormGroup $disabled={isSchoolNode}>
            <EditorDropdown
              label="타입"
              options={NODE_TYPE_OPTIONS}
              selectedValue={selectedTypeValue}
            />
            <EditorTextbox label="이름" value={defaultName} />
            {nodeType !== 'title' && (
              <EditorTextfield label="학습 내용" value="노드의 학습 내용을 작성해주세요." />
            )}
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>스타일</SectionTitle>
          <ColorDropdown selectedColor="blue" />
        </Section>

        {showSchoolToggle && (
          <BottomButtonContainer>
            <Button variant="outlined" size="medium" onClick={onSchoolNodeToggle}>
              {isSchoolNode ? '기본 노드로 전환' : '학교 노드로 전환'}
            </Button>
          </BottomButtonContainer>
        )}
      </>
    );
  };

  return (
    <Container>
      {renderHeader()}
      {renderContent()}
    </Container>
  );
};

const Container = styled.div`
  width: 280px;
  height: 748px;
  background-color: ${tokens.colors.white};
  border-left: 1px solid ${tokens.colors.neutral[200]};
  position: relative;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const HeaderTitle = styled.h2`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeaderSubtitle = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  line-height: 22px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const SchoolIcon = styled.span`
  font-size: 24px;
  color: #2666dc;
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  margin-right: 4px;
`;

const Section = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${tokens.colors.neutral[200]};
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h3`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${tokens.colors.neutral[900]};
  margin: 0;
`;

const FormGroup = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${(props) => (props.$disabled ? 0.4 : 1)};
  pointer-events: ${(props) => (props.$disabled ? 'none' : 'auto')};
`;

const DimensionRow = styled.div`
  display: flex;
  gap: 8px;
  width: 240px;

  > * {
    flex: 1;
  }
`;

const BottomButtonContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
