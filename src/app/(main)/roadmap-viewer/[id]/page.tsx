'use client';

import { useParams, useRouter } from 'next/navigation';
import { RoadmapViewer } from '@/feature/roadmap/viewer';

// 예제 데이터 - 실제로는 API에서 가져와야 합니다
const EXAMPLE_NODES = [
  {
    id: '1',
    type: 'titleNode',
    position: { x: 400, y: 50 },
    data: {
      label: 'JavaScript',
      color: 'blue',
    },
  },
  {
    id: '2',
    type: 'standardNode',
    position: { x: 400, y: 200 },
    data: {
      title: '기본적인 문법',
      description: 'JavaScript에서 기본적으로 사용되는 문법을 학습합니다.',
      color: 'blue',
      progress: 50,
      isSchoolNode: false,
    },
  },
  {
    id: '3',
    type: 'secondaryNode',
    position: { x: 100, y: 150 },
    data: {
      title: 'map, filter',
      color: 'blue',
      quizCurrent: 4,
      quizTotal: 4,
      isSchoolNode: false,
    },
  },
  {
    id: '4',
    type: 'secondaryNode',
    position: { x: 100, y: 250 },
    data: {
      title: '구조 분해 할당',
      color: 'blue',
      quizCurrent: 4,
      quizTotal: 4,
      isSchoolNode: false,
    },
  },
  {
    id: '5',
    type: 'secondaryNode',
    position: { x: 100, y: 350 },
    data: {
      title: 'spread, rest',
      color: 'blue',
      quizCurrent: 0,
      quizTotal: 4,
      isSchoolNode: false,
    },
  },
  {
    id: '6',
    type: 'secondaryNode',
    position: { x: 700, y: 250 },
    data: {
      title: '삼항 연산자 (?)',
      color: 'blue',
      quizCurrent: 0,
      quizTotal: 4,
      isSchoolNode: false,
    },
  },
  {
    id: '7',
    type: 'secondaryNode',
    position: { x: 700, y: 350 },
    data: {
      title: '&&',
      color: 'blue',
      quizCurrent: 0,
      quizTotal: 4,
      isSchoolNode: false,
    },
  },
  {
    id: '8',
    type: 'standardNode',
    position: { x: 400, y: 450 },
    data: {
      title: '객체',
      description: '객체의 정의와 활용을 학습합니다.',
      color: 'blue',
      progress: 0,
      isSchoolNode: false,
    },
  },
  {
    id: '9',
    type: 'standardNode',
    position: { x: 400, y: 600 },
    data: {
      title: '동기/비동기',
      description: '동기/비동기의 특성을 이해하고 활용합니다.',
      color: 'blue',
      progress: 0,
      isSchoolNode: false,
    },
  },
];

const EXAMPLE_EDGES = [
  // Title node to main node
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'horizonEdge',
  },
  // Main node to secondary nodes (left side)
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'horizonEdge',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'horizonEdge',
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    sourceHandle: 'left',
    targetHandle: 'right',
    type: 'horizonEdge',
  },
  // Main node to secondary nodes (right side)
  {
    id: 'e2-6',
    source: '2',
    target: '6',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'horizonEdge',
  },
  {
    id: 'e2-7',
    source: '2',
    target: '7',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'horizonEdge',
  },
  // Main node to next main node
  {
    id: 'e2-8',
    source: '2',
    target: '8',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'horizonEdge',
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    type: 'horizonEdge',
  },
];

export default function RoadmapViewerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roadmapId = params.id;

  const handleEditClick = () => {
    router.push(`/roadmap-editor/${roadmapId}`);
  };

  return (
    <RoadmapViewer
      roadmapId={roadmapId}
      roadmapTitle="Roadmap1"
      nodes={EXAMPLE_NODES}
      edges={EXAMPLE_EDGES}
      onEditClick={handleEditClick}
      showEditButton={true}
    />
  );
}
