'use client';

import styled from '@emotion/styled';
import { tokens } from '@/shared/tokens';
import { ToolbarItem } from '../ToolbarItem';

export interface EditorToolbarProps {
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
  onNodeTypeSelect?: (nodeType: string) => void;
  onTextTypeSelect?: (textType: string) => void;
  onAiActionSelect?: (action: string) => void;
}

export const EditorToolbar = ({
  selectedTool = 'selector',
  onToolSelect,
  onNodeTypeSelect,
  onTextTypeSelect,
  onAiActionSelect,
}: EditorToolbarProps) => {
  return (
    <StyledContainer>
      <StyledToolbarWrapper>
        <ToolbarItem
          type="selector"
          icon="arrow_selector_tool"
          isSelected={selectedTool === 'selector'}
          onSelect={() => onToolSelect?.('selector')}
        />

        <ToolbarItem
          type="node"
          icon="add_box"
          hasDropdown
          dropdownOptions={[
            { icon: 'page_header', text: '제목 노드', value: 'title' },
            { icon: 'add_box', text: '기본 노드', value: 'standard' },
            { icon: 'page_footer', text: '하위 노드', value: 'secondary' },
          ]}
          isSelected={selectedTool === 'node'}
          onSelect={() => onToolSelect?.('node')}
          onDropdownSelect={onNodeTypeSelect}
        />

        <ToolbarItem
          type="section"
          icon="pageless"
          isSelected={selectedTool === 'section'}
          onSelect={() => onToolSelect?.('section')}
        />

        <ToolbarItem
          type="text"
          icon="text_increase"
          hasDropdown
          dropdownOptions={[
            { icon: 'text_increase', text: '제목 텍스트', value: 'title-text' },
            { icon: 'text_decrease', text: '본문 텍스트', value: 'paragraph-text' },
          ]}
          isSelected={selectedTool === 'text'}
          onSelect={() => onToolSelect?.('text')}
          onDropdownSelect={onTextTypeSelect}
        />

        <ToolbarItem
          type="ai"
          icon="wand_shine"
          hasDropdown
          dropdownOptions={[
            { icon: 'wand_shine', text: '로드맵 생성', value: 'generate' },
            { icon: 'model_training', text: '선택항목 수정', value: 'edit-selection' },
          ]}
          isSelected={selectedTool === 'ai'}
          onSelect={() => onToolSelect?.('ai')}
          onDropdownSelect={onAiActionSelect}
        />
      </StyledToolbarWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  background-color: ${tokens.colors.white};
  border: 1px solid ${tokens.colors.neutral[200]};
  border-radius: ${tokens.radius.medium};
  transform: translateX(-50%);
`;

const StyledToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  overflow: clip;
  border-radius: inherit;
`;
