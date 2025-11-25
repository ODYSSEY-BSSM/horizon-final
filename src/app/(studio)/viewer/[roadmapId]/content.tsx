'use client';

import { useRouter } from 'next/navigation';
import { ReactFlowProvider } from 'reactflow';
import { useNodes } from '@/feature/roadmap/editor/api/nodeApi';
import { loadEdges } from '@/feature/roadmap/editor/utils/edgeStorage';
import { apiNodesToReactFlow } from '@/feature/roadmap/editor/utils/nodeConverter';
import { RoadmapViewer } from '@/feature/roadmap/viewer';

interface ViewerContentProps {
  roadmapId: number;
}

export function ViewerContent({ roadmapId }: ViewerContentProps) {
  const router = useRouter();

  // Editor와 같은 API 사용
  const { data: apiNodes, isLoading, error } = useNodes(roadmapId);

  // API 노드를 ReactFlow 노드로 변환
  const nodes = apiNodes ? apiNodesToReactFlow(apiNodes) : [];

  // localStorage에서 엣지 불러오기 (Editor와 공유)
  const edges = loadEdges(roadmapId);

  const handleEditClick = () => {
    // Editor로 이동
    router.push(`/viewer/${roadmapId}`);
  };

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
      >
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '16px',
        }}
      >
        <div>에러 발생: {error.message}</div>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  if (!apiNodes || apiNodes.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '16px',
        }}
      >
        <div>노드가 없습니다</div>
        <button
          type="button"
          onClick={handleEditClick}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          편집하기
        </button>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <RoadmapViewer
        roadmapId={roadmapId.toString()}
        roadmapTitle={`Roadmap ${roadmapId}`}
        nodes={nodes}
        edges={edges}
        onEditClick={handleEditClick}
        showEditButton={true}
      />
    </ReactFlowProvider>
  );
}
