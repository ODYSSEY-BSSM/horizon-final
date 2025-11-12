'use client';

import styled from '@emotion/styled';
import { Handle, type NodeProps, Position } from '@xyflow/react';
import type React from 'react';
import { getProgressColor, NODE_COLORS, type StudioNode as StudioNodeType } from '../../types/node';

const NodeContainer = styled.div<{ $color: string; $selected: boolean }>`
  padding: 12px;
  background: #ffffff;
  color: #333;
  border-radius: 8px;
  min-width: 150px;
  max-width: 250px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$selected &&
    `
    box-shadow: 0 0 0 3px ${props.$color}40, 0 4px 12px rgba(0, 0, 0, 0.15);
  `}
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const NodeTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: #1a202c;
  flex: 1;
`;

const NodeType = styled.span<{ $type: string }>`
  padding: 2px 6px;
  background: ${(props) => {
    switch (props.$type) {
      case 'TOP':
        return '#dbeafe';
      case 'MIDDLE':
        return '#fef3c7';
      case 'BOTTOM':
        return '#dcfce7';
      default:
        return '#f3f4f6';
    }
  }};
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) => {
    switch (props.$type) {
      case 'TOP':
        return '#1e40af';
      case 'MIDDLE':
        return '#92400e';
      case 'BOTTOM':
        return '#166534';
      default:
        return '#4b5563';
    }
  }};
  margin-left: 8px;
`;

const NodeDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 12px;
  line-height: 1.5;
  color: #4a5568;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ $progress: number; $color: string }>`
  width: ${(props) => props.$progress}%;
  height: 100%;
  background: ${(props) => props.$color};
  transition: width 0.3s ease, background 0.3s ease;
`;

const NodeFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
`;

const ProgressText = styled.span<{ $color: string }>`
  font-weight: 600;
  color: ${(props) => props.$color};
`;

const SubjectBadge = styled.span`
  padding: 2px 6px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #4b5563;
`;

const EducationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #92400e;
  margin-top: 4px;
`;

const handleStyle: React.CSSProperties = {
  background: '#fff',
  width: '10px',
  height: '10px',
  border: '2px solid #64748b',
  borderRadius: '50%',
  zIndex: 10,
};

const sourceHandleStyle: React.CSSProperties = {
  ...handleStyle,
  background: '#3b82f6',
  border: '2px solid #2563eb',
};

export const StudioNode: React.FC<NodeProps<StudioNodeType>> = ({ data, selected = false }) => {
  const progressColor = getProgressColor(data.data.progress);
  const nodeColor = NODE_COLORS[data.data.color];

  return (
    <>
      {/* Target handle at the top */}
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={true} />

      <NodeContainer $color={nodeColor} $selected={selected}>
        <NodeHeader>
          <NodeTitle>{data.data.title}</NodeTitle>
          <NodeType $type={data.data.type}>{data.data.type}</NodeType>
        </NodeHeader>

        {data.data.description && <NodeDescription>{data.data.description}</NodeDescription>}

        <ProgressBar>
          <ProgressFill $progress={data.data.progress} $color={progressColor} />
        </ProgressBar>

        <NodeFooter>
          <ProgressText $color={progressColor}>{data.data.progress}%</ProgressText>
          {data.data.subject && <SubjectBadge>{data.data.subject}</SubjectBadge>}
        </NodeFooter>

        {data.data.isEducation && <EducationBadge>📚 교육 콘텐츠</EducationBadge>}
      </NodeContainer>

      {/* Source handle at the bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={sourceHandleStyle}
        isConnectable={true}
      />
    </>
  );
};
