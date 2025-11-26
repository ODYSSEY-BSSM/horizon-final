# WebSocket API 명세서

> STOMP over WebSocket을 사용한 실시간 통신 API 문서

## 목차

- [기본 정보](#기본-정보)
- [연결 및 인증](#연결-및-인증)
- [API 목록](#api-목록)
  - [1. 팀 디렉토리](#1-팀-디렉토리)
  - [2. 로드맵 노드](#2-로드맵-노드)
  - [3. 커서 공유](#3-커서-공유)
  - [4. 섹션 (Section)](#4-섹션-section)
  - [5. 텍스트 (Text)](#5-텍스트-text)
  - [6. 로드맵](#6-로드맵)
- [프론트엔드 구현 가이드](#프론트엔드-구현-가이드)
- [에러 처리](#에러-처리)
- [TypeScript 타입 정의](#typescript-타입-정의)

---

## 기본 정보

| 항목 | 값 |
|------|-----|
| **프로토콜** | STOMP over WebSocket |
| **엔드포인트 (HTTP)** | `ws://localhost:8080/ws` |
| **엔드포인트 (HTTPS)** | `wss://localhost:8080/ws` |
| **인증** | JWT Bearer Token (Connect Header) |
| **메시지 브로커** | Simple Broker (`/topic`) |
| **애플리케이션 Prefix** | `/app` |

### 토픽 구조

```
/topic/{resource}/{scope}/{id}/{action}
```

- **resource**: 리소스 타입 (directory, node, section, text, roadmap)
- **scope**: 범위 (team, roadmap)
- **id**: 리소스 ID
- **action**: 동작 (created, updated, deleted)

---

## 연결 및 인증

### 왜 직접 인증이 필요한가?

WebSocket은 HTTP 프로토콜과 달리 브라우저가 자동으로 쿠키에 토큰을 담아 전송하지 않습니다. 따라서 연결 시점에 직접 Authorization 헤더로 JWT 토큰을 전송해야 합니다.

### 연결 설정

```typescript
import { Client } from '@stomp/stompjs';

const headers = {
  'Authorization': `Bearer ${accessToken}`
};

const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',  // HTTPS 환경: 'wss://...'
  connectHeaders: headers,
  reconnectDelay: 3000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
});

client.onConnect = (frame) => {
  console.log('Connected:', frame);
  // 연결 성공 후 구독 시작
};

client.onStompError = (frame) => {
  console.error('STOMP Error:', frame.body);
};

client.activate();
```

### 인증 요구사항

- JWT 토큰은 `Connect` 시점에 `Authorization` 헤더로 전송
- 토큰 파싱 실패 시 연결 거부
- 토큰 만료 시 재연결 필요

### 프로젝트 내 구현체 사용

```typescript
import { getStompClient } from '@/shared/api/stompWebSocket';
import { tokenStore } from '@/shared/api/tokenStore';

// 토큰이 설정된 상태에서
const client = getStompClient();
client.connect();

// 연결 상태 확인
if (client.getIsConnected()) {
  // 구독 및 메시지 전송
}
```

---

## API 목록

### 1. 팀 디렉토리

팀의 디렉토리 변경사항을 실시간으로 수신합니다.

#### 구독 토픽

| 동작 | 토픽 |
|------|------|
| 생성 | `/topic/directory/team/{teamId}/created` |
| 수정 | `/topic/directory/team/{teamId}/updated` |
| 삭제 | `/topic/directory/team/{teamId}/deleted` |

#### 권한

- 해당 팀의 멤버만 구독 가능

#### 메시지 형식

**생성/수정 응답:**

```json
{
  "id": 2,
  "name": "디렉터리",
  "teamId": 1,
  "roadmaps": []
}
```

**삭제 응답:**

```json
1
```

> 삭제된 디렉토리 ID (number)

#### 프론트엔드 Hook

```typescript
import { useTeamDirectoryWebSocket } from '@/feature/team';

useTeamDirectoryWebSocket({
  teamId: 1,
  onCreated: (directory) => console.log('Created:', directory),
  onUpdated: (directory) => console.log('Updated:', directory),
  onDeleted: (directoryId) => console.log('Deleted:', directoryId),
});
```

---

### 2. 로드맵 노드

특정 로드맵의 노드 변경사항을 실시간으로 수신합니다.

#### 구독 토픽

| 동작 | 토픽 |
|------|------|
| 생성 | `/topic/node/roadmap/{roadmapId}/created` |
| 수정 | `/topic/node/roadmap/{roadmapId}/updated` |
| 삭제 | `/topic/node/roadmap/{roadmapId}/deleted` |

#### 전송 경로 (수정 시)

```
/app/node/{nodeId}/roadmap/{roadmapId}/updated
```

#### 권한

- 현재는 **팀 로드맵에서만** 메시지 발송

#### 메시지 형식

**생성 응답:**

```json
{
  "id": 1,
  "title": "제목",
  "description": "노드 설명",
  "height": 100,
  "width": 100,
  "type": "TOP",
  "x": 100,
  "y": 100,
  "category": "develop",
  "roadmapId": 1,
  "parentNodeId": null,
  "childNode": []
}
```

**수정 요청/응답:**

```json
{
  "id": 1,
  "data": {
    "title": "수정된 노드",
    "description": "설명",
    "height": 100,
    "width": 200,
    "type": "NORMAL",
    "x": 150,
    "y": 250,
    "color": "BLUE"
  }
}
```

**삭제 응답:**

```json
1
```

> 삭제된 노드 ID (number)

#### Node Type

| 값 | 설명 |
|-----|------|
| `TOP` | 최상위 노드 |
| `MIDDLE` | 중간 노드 |
| `BOTTOM` | 최하위 노드 |
| `NORMAL` | 일반 노드 |

#### 프론트엔드 Hook

```typescript
import { useRoadmapNodesWebSocket } from '@/feature/roadmap';

useRoadmapNodesWebSocket({
  roadmapId: 1,
  onCreated: (node) => console.log('Created:', node),
  onUpdated: (update) => console.log('Updated:', update),
  onDeleted: (nodeId) => console.log('Deleted:', nodeId),
});
```

---

### 3. 커서 공유

다른 사용자의 커서 위치를 실시간으로 브로드캐스팅합니다.

#### 전송 경로

```
/app/roadmap/{roadmapId}/cursor
```

#### 구독 토픽

```
/topic/roadmap/{roadmapId}/cursor
```

#### 권한

- 같은 로드맵을 구독한 사용자만 수신

#### 메시지 형식

**전송 요청:**

```json
{
  "x": 178.0,
  "y": 250.0
}
```

**수신 응답:**

```json
{
  "userId": 1,
  "userName": "황성민",
  "x": 178,
  "y": 250
}
```

#### 프론트엔드 Hook

```typescript
import { useCursorWebSocket } from '@/feature/roadmap';

const { sendCursorPosition } = useCursorWebSocket({
  roadmapId: 1,
  onCursorMove: (cursor) => {
    // 다른 사용자 커서 위치 업데이트
    updateRemoteCursor(cursor.userId, cursor.x, cursor.y, cursor.userName);
  },
  onCursorLeave: (userId) => {
    // 사용자 커서 제거
    removeRemoteCursor(userId);
  },
});

// 내 커서 위치 전송 (throttle 권장)
sendCursorPosition(x, y);
```

---

### 4. 섹션 (Section)

로드맵 내 섹션의 변경사항을 실시간으로 수신합니다.

#### 구독 토픽

| 동작 | 토픽 |
|------|------|
| 생성 | `/topic/section/roadmap/{roadmapId}/created` |
| 수정 | `/topic/section/roadmap/{roadmapId}/updated` |
| 삭제 | `/topic/section/roadmap/{roadmapId}/deleted` |

#### 전송 경로 (수정 시)

```
/app/section/{sectionId}/roadmap/{roadmapId}/updated
```

#### 메시지 형식

**생성 응답:**

```json
{
  "section": {
    "id": 1,
    "name": "새로운 섹션",
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 400,
    "nodes": [
      {
        "id": 123,
        "title": "포함된 노드",
        "description": "노드 설명",
        "problemCount": 5,
        "solverProblemCount": 3
      }
    ]
  }
}
```

**수정 요청/응답:**

```json
{
  "id": 456,
  "data": {
    "name": "수정된 섹션",
    "x": 100,
    "y": 200,
    "width": 300,
    "height": 400,
    "nodeIds": [123, 124]
  }
}
```

**삭제 응답:**

```json
1
```

> 삭제된 섹션 ID (number)

#### 프론트엔드 Hook

```typescript
import { useSectionWebSocket } from '@/feature/roadmap';

const { sendSectionUpdate } = useSectionWebSocket({
  roadmapId: 1,
  onCreated: (section) => console.log('Created:', section),
  onUpdated: (update) => console.log('Updated:', update),
  onDeleted: (sectionId) => console.log('Deleted:', sectionId),
});

// 섹션 수정 전송
sendSectionUpdate(sectionId, {
  name: '수정된 섹션',
  x: 100,
  y: 200,
  width: 300,
  height: 400,
  nodeIds: [123, 124],
});
```

---

### 5. 텍스트 (Text)

로드맵 내 텍스트 요소의 변경사항을 실시간으로 수신합니다.

#### 구독 토픽

| 동작 | 토픽 |
|------|------|
| 생성 | `/topic/text/roadmap/{roadmapId}/created` |
| 수정 | `/topic/text/roadmap/{roadmapId}/updated` |
| 삭제 | `/topic/text/roadmap/{roadmapId}/deleted` |

#### 전송 경로 (수정 시)

```
/app/text/{textId}/roadmap/{roadmapId}/updated
```

#### 메시지 형식

**생성 응답:**

```json
{
  "texts": {
    "id": 123,
    "text": "새로운 텍스트",
    "type": "NORMAL",
    "roadmapId": 1,
    "sectionId": 456
  }
}
```

**수정 요청/응답:**

```json
{
  "id": 123,
  "data": {
    "text": "수정된 텍스트",
    "type": "NORMAL",
    "sectionId": 456
  }
}
```

**삭제 응답:**

```json
123
```

> 삭제된 텍스트 ID (number)

#### 프론트엔드 Hook

```typescript
import { useTextWebSocket } from '@/feature/roadmap';

const { sendTextUpdate } = useTextWebSocket({
  roadmapId: 1,
  onCreated: (text) => console.log('Created:', text),
  onUpdated: (update) => console.log('Updated:', update),
  onDeleted: (textId) => console.log('Deleted:', textId),
});

// 텍스트 수정 전송
sendTextUpdate(textId, {
  text: '수정된 텍스트',
  type: 'NORMAL',
  sectionId: 456,
});
```

---

### 6. 로드맵

팀 내 로드맵의 변경사항을 실시간으로 수신합니다.

#### 구독 토픽

| 동작 | 토픽 |
|------|------|
| 생성 | `/topic/roadmap/team/{teamId}/created` |
| 수정 | `/topic/roadmap/team/{teamId}/updated` |
| 삭제 | `/topic/roadmap/team/{teamId}/deleted` |

#### 메시지 형식

**생성 응답:**

```json
{
  "roadmap": {
    "id": 123,
    "title": "새로운 팀 로드맵",
    "description": "설명",
    "color": "BLUE",
    "icon": "STAR",
    "isFavorite": false,
    "directoryId": 456,
    "teamId": 789
  }
}
```

**수정 응답:**

```json
{
  "roadmap": {
    "id": 123,
    "title": "수정된 팀 로드맵",
    "description": "수정된 설명",
    "color": "RED",
    "icon": "HEART",
    "isFavorite": true,
    "directoryId": 456,
    "teamId": 789
  }
}
```

**삭제 응답:**

```json
123
```

> 삭제된 로드맵 ID (number)

#### 프론트엔드 Hook

```typescript
import { useTeamRoadmapWebSocket } from '@/feature/team';

useTeamRoadmapWebSocket({
  teamId: 1,
  onCreated: (roadmap) => console.log('Created:', roadmap),
  onUpdated: (roadmap) => console.log('Updated:', roadmap),
  onDeleted: (roadmapId) => console.log('Deleted:', roadmapId),
});
```

---

## 프론트엔드 구현 가이드

### STOMP 클라이언트 싱글톤

프로젝트에서는 `StompWebSocketClient` 클래스를 싱글톤으로 관리합니다.

**위치**: `src/shared/api/stompWebSocket.ts`

```typescript
import { getStompClient, destroyStompClient } from '@/shared/api/stompWebSocket';

// 클라이언트 획득 (없으면 생성)
const client = getStompClient();

// 연결
client.connect();

// 구독
client.subscribe('/topic/example', (data) => {
  console.log('Received:', data);
});

// 메시지 전송
client.send('/app/example', { key: 'value' });

// 구독 해제
client.unsubscribe('/topic/example');

// 연결 종료 및 인스턴스 제거
destroyStompClient();
```

### useStompWebSocket Hook

**위치**: `src/shared/hooks/useStompWebSocket.ts`

```typescript
import { useStompWebSocket } from '@/shared/hooks/useStompWebSocket';

function MyComponent() {
  const { isConnected, subscribe, unsubscribe, send } = useStompWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    subscribe('/topic/example', handleMessage);

    return () => {
      unsubscribe('/topic/example');
    };
  }, [isConnected]);

  return <div>Connected: {isConnected ? 'Yes' : 'No'}</div>;
}
```

### 이벤트 리스너

```typescript
const client = getStompClient();

// 연결 이벤트
client.addEventListener('connect', () => {
  console.log('WebSocket connected');
});

// 연결 해제 이벤트
client.addEventListener('disconnect', () => {
  console.log('WebSocket disconnected');
});

// 에러 이벤트
client.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

// 리스너 제거
client.removeEventListener('connect', handler);
```

### 자동 재연결

`StompWebSocketClient`는 연결이 끊어지면 자동으로 재연결을 시도합니다.

| 설정 | 기본값 |
|------|--------|
| 재연결 딜레이 | 3000ms |
| 최대 재연결 시도 | 5회 |
| Heartbeat (incoming) | 10000ms |
| Heartbeat (outgoing) | 10000ms |

---

## 에러 처리

### 인증 실패

- 토큰이 없거나 만료된 경우 연결이 거부됩니다.
- `tokenStore`에서 토큰을 갱신한 후 재연결해야 합니다.

```typescript
client.addEventListener('error', (error) => {
  if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
    // 토큰 갱신 후 재연결
    await refreshToken();
    client.connect();
  }
});
```

### 구독 전 연결 확인

연결되지 않은 상태에서 `subscribe()`를 호출하면 에러가 발생합니다.

```typescript
if (!client.getIsConnected()) {
  throw new Error('Not connected to STOMP server');
}
```

### 메시지 파싱 에러

잘못된 JSON 형식의 메시지를 받으면 `error` 이벤트가 발생합니다.

```typescript
client.addEventListener('error', ({ destination, error }) => {
  console.error(`Parse error on ${destination}:`, error);
});
```

---

## TypeScript 타입 정의

**위치**: `src/shared/api/stompTypes.ts`

### 팀 디렉토리

```typescript
interface TeamDirectoryMessage {
  id: number;
  name: string;
  teamId: number;
  roadmaps: unknown[];
}
```

### 로드맵 노드

```typescript
type NodeType = 'TOP' | 'MIDDLE' | 'BOTTOM';
type NodeCategory = 'develop' | string;

interface RoadmapNodeMessage {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  roadmapId: number;
  parentNodeId: number | null;
  childNode: unknown[];
  color?: string;
}

interface NodeUpdateMessage {
  title: string;
  description: string;
  height: number;
  width: number;
  type: NodeType;
  x: number;
  y: number;
  category: NodeCategory;
  parentNodeId: number | null;
}
```

### 커서

```typescript
interface CursorSendMessage {
  x: number;
  y: number;
}

interface CursorReceiveMessage {
  userId: number;
  userName: string;
  x: number;
  y: number;
}
```

### 섹션

```typescript
interface SectionMessage {
  section: {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    nodes: Array<{
      id: number;
      title: string;
      description: string;
      problemCount: number;
      solverProblemCount: number;
    }>;
  };
}

interface SectionUpdateMessage {
  id: number;
  data: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    nodeIds: number[];
  };
}

type SectionDeleteMessage = number;
```

### 텍스트

```typescript
interface TextMessage {
  texts: {
    id: number;
    text: string;
    type: string;
    roadmapId: number;
    sectionId: number;
  };
}

interface TextUpdateMessage {
  id: number;
  data: {
    text: string;
    type: string;
    sectionId: number;
  };
}

type TextDeleteMessage = number;
```

### 로드맵

```typescript
interface RoadmapMessage {
  roadmap: {
    id: number;
    title: string;
    description: string;
    color: string;
    icon: string;
    isFavorite: boolean;
    directoryId: number;
    teamId: number;
  };
}

interface RoadmapUpdateMessage {
  roadmap: {
    id: number;
    title: string;
    description: string;
    color: string;
    icon: string;
    isFavorite: boolean;
    directoryId: number;
    teamId: number;
  };
}

type RoadmapDeleteMessage = number;
```

### 삭제 메시지 공통

```typescript
type DeleteMessage = number;
```

---

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8080

# Production (HTTPS)
NEXT_PUBLIC_WS_BASE_URL=wss://api.yourdomain.com
```

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `src/shared/api/stompWebSocket.ts` | STOMP 클라이언트 구현체 |
| `src/shared/api/stompTypes.ts` | WebSocket 메시지 타입 정의 |
| `src/shared/hooks/useStompWebSocket.ts` | STOMP 연결 관리 Hook |
| `src/feature/roadmap/hooks/useCursorWebSocket.ts` | 커서 공유 Hook |
| `src/feature/roadmap/hooks/useRoadmapNodesWebSocket.ts` | 노드 동기화 Hook |
| `src/feature/roadmap/hooks/useSectionWebSocket.ts` | 섹션 동기화 Hook |
| `src/feature/roadmap/hooks/useTextWebSocket.ts` | 텍스트 동기화 Hook |
| `src/feature/team/hooks/useTeamDirectoryWebSocket.ts` | 팀 디렉토리 Hook |
| `src/feature/team/hooks/useTeamRoadmapWebSocket.ts` | 팀 로드맵 Hook |
