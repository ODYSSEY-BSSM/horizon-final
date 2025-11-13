# WebSocket API 사용 가이드

이 문서는 Horizon 프로젝트의 WebSocket API 사용법을 설명합니다.

## 목차

- [기본 설정](#기본-설정)
- [팀 디렉토리 구독](#팀-디렉토리-구독)
- [로드맵 노드 구독](#로드맵-노드-구독)
- [커서 위치 공유](#커서-위치-공유)
- [타입 정의](#타입-정의)

---

## 기본 설정

### 환경 변수

`.env` 또는 `.env.local`에 WebSocket URL 설정:

```env
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8080
# HTTPS를 사용하는 경우
NEXT_PUBLIC_WS_BASE_URL=wss://your-domain.com
```

### WebSocket 연결

STOMP WebSocket 클라이언트는 자동으로 JWT 토큰을 포함하여 연결합니다:

```typescript
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

function MyComponent() {
  const { isConnected, connect, disconnect } = useStompWebSocket({
    autoConnect: true, // 자동 연결
    onConnect: () => console.log('WebSocket 연결됨'),
    onDisconnect: () => console.log('WebSocket 연결 끊김'),
    onError: (error) => console.error('WebSocket 오류:', error),
  });

  return <div>연결 상태: {isConnected ? '연결됨' : '연결 안됨'}</div>;
}
```

---

## 팀 디렉토리 구독

팀의 디렉토리 변경사항(생성, 수정, 삭제)을 실시간으로 받습니다.

### 사용 예시

```typescript
import { useTeamDirectoryWebSocket } from '@/feature/team';

function TeamDirectoryComponent({ teamId }: { teamId: number }) {
  const { isConnected, isSubscribed } = useTeamDirectoryWebSocket({
    teamId,
    autoSubscribe: true,
    onCreated: (directory) => {
      console.log('디렉토리 생성:', directory);
      // UI 업데이트 로직
    },
    onUpdated: (directory) => {
      console.log('디렉토리 수정:', directory);
      // UI 업데이트 로직
    },
    onDeleted: (directoryId) => {
      console.log('디렉토리 삭제:', directoryId);
      // UI 업데이트 로직
    },
  });

  return (
    <div>
      <p>WebSocket: {isConnected ? '연결됨' : '연결 안됨'}</p>
      <p>구독 상태: {isSubscribed ? '구독 중' : '구독 안됨'}</p>
    </div>
  );
}
```

### 구독 토픽

- `/topic/directory/team/{teamId}/created` - 디렉토리 생성
- `/topic/directory/team/{teamId}/updated` - 디렉토리 수정
- `/topic/directory/team/{teamId}/deleted` - 디렉토리 삭제

### 메시지 타입

```typescript
// 생성/수정 메시지
interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: unknown[];
}

// 삭제 메시지
type DeleteMessage = number; // 삭제된 디렉토리 ID
```

---

## 로드맵 노드 구독

특정 로드맵의 노드 변경사항(생성, 수정, 삭제)을 실시간으로 받습니다.

### 사용 예시

```typescript
import { useRoadmapNodesWebSocket } from '@/feature/roadmap';
import type { NodeUpdateMessage, RoadmapNodeMessage } from '@/shared/api';

function RoadmapCanvas({ roadmapId }: { roadmapId: number }) {
  const [nodes, setNodes] = useState<Map<number, RoadmapNodeMessage>>(new Map());

  const { isConnected, isSubscribed, subscribeNodeUpdate, unsubscribeNodeUpdate, sendNodeUpdate } =
    useRoadmapNodesWebSocket({
      roadmapId,
      autoSubscribe: true,
      onCreated: (node) => {
        console.log('노드 생성:', node);
        setNodes((prev) => new Map(prev).set(node.id, node));
      },
      onDeleted: (nodeId) => {
        console.log('노드 삭제:', nodeId);
        setNodes((prev) => {
          const next = new Map(prev);
          next.delete(nodeId);
          return next;
        });
      },
    });

  // 특정 노드의 수정 사항 구독
  useEffect(() => {
    if (!isConnected) return;

    const nodeId = 123;
    subscribeNodeUpdate(nodeId, (updates) => {
      console.log('노드 수정:', nodeId, updates);
      // 노드 업데이트 로직
    });

    return () => {
      unsubscribeNodeUpdate(nodeId);
    };
  }, [isConnected, subscribeNodeUpdate, unsubscribeNodeUpdate]);

  // 노드 수정사항 전송
  const handleNodeUpdate = (nodeId: number, updates: NodeUpdateMessage) => {
    sendNodeUpdate(nodeId, updates);
  };

  return (
    <div>
      <p>노드 개수: {nodes.size}</p>
      {/* 노드 렌더링 로직 */}
    </div>
  );
}
```

### 구독 토픽

- `/topic/node/roadmap/{roadmapId}/created` - 노드 생성
- `/topic/node/roadmap/{roadmapId}/deleted` - 노드 삭제
- `/topic/roadmap/{roadmapId}/nodes/{nodeId}` - 노드 수정 (구독)

### 전송 경로

- `/app/roadmap/{roadmapId}/nodes/{nodeId}` - 노드 수정 (전송)

### 메시지 타입

```typescript
// 노드 생성 메시지
interface RoadmapNodeMessage {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';
  x: number;
  y: number;
  category: string;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: unknown[];
}

// 노드 수정 메시지
interface NodeUpdateMessage {
  title: string;
  description: string;
  height: number;
  width: number;
  type: 'TOP' | 'MIDDLE' | 'BOTTOM';
  x: number;
  y: number;
  category: string;
  parentNodeId: number | null;
}

// 노드 삭제 메시지
type DeleteMessage = number; // 삭제된 노드 ID
```

---

## 커서 위치 공유

다른 사용자의 커서 위치를 실시간으로 공유합니다.

### 사용 예시

```typescript
import { useCursorWebSocket } from '@/feature/roadmap';
import type { CursorReceiveMessage } from '@/shared/api';

function RoadmapCanvas({ roadmapId }: { roadmapId: number }) {
  const { isConnected, otherCursors, sendCursorPosition, removeCursor } = useCursorWebSocket({
    roadmapId,
    autoSubscribe: true,
    onCursorMove: (cursor) => {
      console.log('커서 이동:', cursor);
    },
  });

  // 마우스 이동 시 커서 위치 전송
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isConnected) return;

    sendCursorPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 사용자가 떠났을 때 커서 제거
  const handleUserLeave = (userId: number) => {
    removeCursor(userId);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* 다른 사용자의 커서 렌더링 */}
      {otherCursors.map((cursor) => (
        <div
          key={cursor.userId}
          style={{
            position: 'absolute',
            left: cursor.x,
            top: cursor.y,
            pointerEvents: 'none',
          }}
        >
          <div>👆</div>
          <span>{cursor.userName}</span>
        </div>
      ))}
    </div>
  );
}
```

### 구독 토픽

- `/topic/roadmap/{roadmapId}/cursor` - 커서 위치 수신

### 전송 경로

- `/app/roadmap/{roadmapId}/cursor` - 커서 위치 전송

### 메시지 타입

```typescript
// 커서 전송 메시지
interface CursorSendMessage {
  x: number;
  y: number;
}

// 커서 수신 메시지
interface CursorReceiveMessage {
  userId: number;
  userName: string;
  x: number;
  y: number;
}
```

---

## 타입 정의

모든 WebSocket 메시지 타입은 `@/shared/api`에서 import할 수 있습니다:

```typescript
import type {
  // 팀 디렉토리
  TeamDirectoryMessage,
  DeleteMessage,

  // 로드맵 노드
  RoadmapNodeMessage,
  NodeUpdateMessage,

  // 커서
  CursorSendMessage,
  CursorReceiveMessage,
} from '@/shared/api';
```

---

## 주의사항

1. **인증**: WebSocket 연결 시 자동으로 JWT 토큰이 `Authorization` 헤더에 포함됩니다.
2. **자동 재연결**: 연결이 끊어지면 자동으로 재연결을 시도합니다 (최대 5회).
3. **권한**: 각 구독 토픽은 해당 팀/로드맵의 멤버만 접근할 수 있습니다.
4. **Legacy WebSocket**: `useWebSocket` hook은 deprecated되었습니다. 항상 `useStompWebSocket`과 feature별 hooks를 사용하세요.

---

## 예시 프로젝트

전체 예시는 다음 컴포넌트를 참고하세요:

- `src/feature/team/hooks/useTeamDirectoryWebSocket.ts`
- `src/feature/roadmap/hooks/useRoadmapNodesWebSocket.ts`
- `src/feature/roadmap/hooks/useCursorWebSocket.ts`

---

## 문제 해결

### WebSocket이 연결되지 않아요

1. 환경 변수 확인: `NEXT_PUBLIC_WS_BASE_URL`이 올바르게 설정되어 있는지 확인
2. 토큰 확인: 로그인 상태인지 확인
3. 서버 확인: WebSocket 서버가 실행 중인지 확인

### 메시지를 받지 못해요

1. 구독 상태 확인: `isSubscribed`가 `true`인지 확인
2. 권한 확인: 해당 팀/로드맵의 멤버인지 확인
3. 콜백 함수 확인: `on*` 콜백이 올바르게 설정되어 있는지 확인

### 연결이 자주 끊겨요

1. 네트워크 상태 확인
2. 서버 로그 확인
3. 토큰 만료 여부 확인 (자동 갱신됨)
