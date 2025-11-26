'use client';

import { notFound } from 'next/navigation';
import { ReactFlowProvider } from 'reactflow';
import { RoadmapViewer } from '@/feature/roadmap/viewer';

// 프로덕션 환경에서는 테스트 페이지 숨김
if (process.env.NODE_ENV === 'production') {
  notFound();
}

// 하드코딩된 테스트 데이터
const TEST_NODES = [
  {
    id: '1',
    type: 'horizonNode',
    position: { x: 400, y: 50 },
    data: {
      type: 'title',
      label: 'Test JavaScript',
      color: 'blue',
    },
  },
  {
    id: '2',
    type: 'horizonNode',
    position: { x: 400, y: 200 },
    data: {
      type: 'standard',
      title: '기본 문법',
      description: '테스트용 노드입니다',
      color: 'blue',
      progress: 50,
    },
  },
  {
    id: '3',
    type: 'horizonNode',
    position: { x: 100, y: 200 },
    data: {
      type: 'secondary',
      title: 'map, filter',
      color: 'blue',
      quizCurrent: 2,
      quizTotal: 4,
    },
  },
];

const TEST_EDGES = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'horizonEdge',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'horizonEdge',
  },
];

export default function ViewerTestPage() {
  return (
    <ReactFlowProvider>
      <RoadmapViewer
        roadmapId="test"
        roadmapTitle="Test Roadmap"
        nodes={TEST_NODES}
        edges={TEST_EDGES}
        onEditClick={() => alert('편집 버튼 클릭')}
        showEditButton={true}
      />
    </ReactFlowProvider>
  );
}
