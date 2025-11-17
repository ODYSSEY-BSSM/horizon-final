'use client';

import type { NodeProps } from 'reactflow';
import type { HorizonNodeData } from '../../types/node.types';
import { SecondaryNode } from './SecondaryNode';
import { StandardNode } from './StandardNode';
import { TitleNode } from './TitleNode';

/**
 * HorizonNode - 통합 노드 컴포넌트
 * React Flow의 커스텀 노드로 사용되며, type에 따라 적절한 하위 컴포넌트를 렌더링합니다.
 */
export const HorizonNode = ({ data }: NodeProps<HorizonNodeData>) => {
  switch (data.type) {
    case 'title':
      return <TitleNode data={data} />;
    case 'standard':
      return <StandardNode data={data} />;
    case 'secondary':
      return <SecondaryNode data={data} />;
    default:
      return null;
  }
};
