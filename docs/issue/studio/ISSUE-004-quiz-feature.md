# ISSUE-004: 퀴즈 기능 미구현

## 개요
| 항목 | 내용 |
|------|------|
| **심각도** | 🟡 Major |
| **영향 범위** | Viewer |
| **관련 파일** | `src/feature/roadmap/viewer/RoadmapViewer.tsx`, `ViewerSidebar.tsx` |
| **상태** | Open |

## 문제 설명

RoadmapViewer의 사이드바에 "확인 문제 풀기" 버튼이 있지만, 클릭 핸들러가 구현되어 있지 않습니다. 퀴즈 기능은 학습 로드맵의 핵심 기능 중 하나로, 사용자가 학습 내용을 확인하고 진행률을 측정하는 데 필수적입니다.

## 현재 구현 상태

### RoadmapViewer.tsx
**위치**: `RoadmapViewer.tsx:101-103`

```typescript
const handleQuizClick = useCallback(() => {
  // TODO: 퀴즈 모달 또는 페이지로 이동
}, []);
```

**문제점**:
- 핸들러 함수가 빈 상태로 TODO 주석만 있음
- 버튼 클릭 시 아무 반응 없음

### ViewerSidebar에서의 사용
**위치**: `ViewerSidebar.tsx`

```typescript
<Button onClick={onQuizClick}>
  확인 문제 풀기
</Button>
```

**문제점**:
- UI는 구현되어 있지만 기능이 없음
- 사용자 혼란 유발

## 문제점

### 1. 학습 기능 미완성
- 로드맵 학습 후 이해도 확인 불가
- 학습 완료 여부 검증 불가

### 2. 진행률 추적 불가
- 사용자의 학습 진행 상황 측정 불가
- 개인화된 학습 경험 제공 불가

### 3. 사용자 경험 저하
- 버튼이 있지만 작동하지 않아 혼란
- 기대한 기능의 부재로 신뢰도 하락

## 퀴즈 기능 요구사항 (제안)

### 기본 기능
1. **퀴즈 문제 표시**
   - 노드별 관련 퀴즈 문제
   - 객관식, 주관식, O/X 등 다양한 유형

2. **답안 제출 및 채점**
   - 실시간 정답 확인
   - 오답 시 해설 제공

3. **진행률 저장**
   - 퀴즈 완료 상태 저장
   - 점수 및 시도 횟수 기록

### 고급 기능
1. **적응형 학습**
   - 틀린 문제 재출제
   - 난이도 조절

2. **학습 통계**
   - 노드별 정답률
   - 학습 시간 추적

## 해결 방안

### 1. 퀴즈 데이터 구조

```typescript
// src/feature/roadmap/viewer/types/quiz.types.ts
interface Quiz {
  id: number;
  nodeId: number;
  roadmapId: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: QuizOption[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizOption {
  id: number;
  text: string;
}

interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  answer: string | number;
  isCorrect: boolean;
  attemptedAt: string;
}

interface QuizProgress {
  roadmapId: number;
  userId: number;
  totalQuizzes: number;
  completedQuizzes: number;
  correctAnswers: number;
  progressPercentage: number;
}
```

### 2. API 엔드포인트 (필요)

```
# 퀴즈 조회
GET    /roadmap/{roadmapId}/quizzes              # 로드맵의 모든 퀴즈
GET    /roadmap/{roadmapId}/nodes/{nodeId}/quizzes  # 특정 노드의 퀴즈

# 퀴즈 관리 (Editor용)
POST   /roadmap/{roadmapId}/quizzes              # 퀴즈 생성
PUT    /roadmap/{roadmapId}/quizzes/{quizId}     # 퀴즈 수정
DELETE /roadmap/{roadmapId}/quizzes/{quizId}     # 퀴즈 삭제

# 퀴즈 시도
POST   /roadmap/{roadmapId}/quizzes/{quizId}/attempt  # 답안 제출
GET    /roadmap/{roadmapId}/quiz-progress        # 진행률 조회
```

### 3. 퀴즈 모달 컴포넌트

```typescript
// src/feature/roadmap/viewer/components/QuizModal/QuizModal.tsx
interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: number;
  roadmapId: number;
}

export function QuizModal({ isOpen, onClose, nodeId, roadmapId }: QuizModalProps) {
  const { data: quizzes, isLoading } = useQuizzes(roadmapId, nodeId);
  const submitAnswer = useSubmitQuizAnswer();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnswer || !quizzes) return;

    const result = await submitAnswer.mutateAsync({
      quizId: quizzes[currentQuizIndex].id,
      answer: selectedAnswer,
    });

    setShowResult(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="확인 문제">
      {isLoading ? (
        <LoadingSpinner />
      ) : quizzes && quizzes.length > 0 ? (
        <QuizContent>
          <QuizQuestion quiz={quizzes[currentQuizIndex]} />
          <QuizOptions
            options={quizzes[currentQuizIndex].options}
            selectedAnswer={selectedAnswer}
            onSelect={setSelectedAnswer}
            disabled={showResult}
          />
          {showResult && (
            <QuizResult
              isCorrect={/* ... */}
              explanation={quizzes[currentQuizIndex].explanation}
            />
          )}
          <QuizActions>
            {!showResult ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswer}>
                제출하기
              </Button>
            ) : (
              <Button onClick={() => {
                setShowResult(false);
                setSelectedAnswer(null);
                setCurrentQuizIndex(prev => prev + 1);
              }}>
                다음 문제
              </Button>
            )}
          </QuizActions>
        </QuizContent>
      ) : (
        <EmptyState message="등록된 퀴즈가 없습니다." />
      )}
    </Modal>
  );
}
```

### 4. 핸들러 구현

```typescript
// RoadmapViewer.tsx
const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

const handleQuizClick = useCallback(() => {
  if (!selectedNodeId) {
    // 노드 선택 안 된 경우 전체 퀴즈 모드
    setIsQuizModalOpen(true);
    return;
  }
  // 선택된 노드의 퀴즈 표시
  setIsQuizModalOpen(true);
}, [selectedNodeId]);

// JSX
<QuizModal
  isOpen={isQuizModalOpen}
  onClose={() => setIsQuizModalOpen(false)}
  nodeId={selectedNodeId}
  roadmapId={roadmapId}
/>
```

### 5. TanStack Query 훅

```typescript
// src/feature/roadmap/viewer/hooks/useQuizzes.ts
export function useQuizzes(roadmapId: number, nodeId?: number) {
  return useQuery({
    queryKey: ['quizzes', roadmapId, nodeId],
    queryFn: () => nodeId
      ? getNodeQuizzes(roadmapId, nodeId)
      : getRoadmapQuizzes(roadmapId),
    enabled: !!roadmapId,
  });
}

export function useSubmitQuizAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, answer }: { quizId: number; answer: string }) =>
      submitQuizAttempt(quizId, answer),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizProgress'] });
    },
  });
}

export function useQuizProgress(roadmapId: number) {
  return useQuery({
    queryKey: ['quizProgress', roadmapId],
    queryFn: () => getQuizProgress(roadmapId),
    enabled: !!roadmapId,
  });
}
```

## 구현 순서

### Phase 1: 기본 퀴즈 기능
1. 백엔드 퀴즈 API 확인/구현
2. 프론트엔드 API 클라이언트 구현
3. QuizModal 컴포넌트 개발
4. handleQuizClick 핸들러 연동

### Phase 2: 진행률 추적
1. 퀴즈 진행률 API 연동
2. ViewerSidebar에 진행률 표시
3. 노드별 퀴즈 완료 상태 시각화

### Phase 3: 고급 기능
1. 퀴즈 결과 상세 통계
2. 오답 노트 기능
3. 재시도 기능

## UI 디자인 고려사항

### 퀴즈 모달
- 깔끔하고 집중할 수 있는 디자인
- 진행 상황 표시 (예: 1/5)
- 명확한 선택지 UI
- 정답/오답 피드백 애니메이션

### 사이드바 통합
- 퀴즈 진행률 프로그레스 바
- 미완료 퀴즈 개수 배지
- 노드별 퀴즈 상태 아이콘

## 예상 작업량

| 작업 | 예상 시간 |
|------|----------|
| API 클라이언트 구현 | 4시간 |
| QuizModal 컴포넌트 | 8시간 |
| 진행률 UI | 4시간 |
| 핸들러 연동 | 2시간 |
| 테스트 및 디버깅 | 4시간 |

## 참고

- [RoadmapViewer.tsx](../../../src/feature/roadmap/viewer/RoadmapViewer.tsx)
- [ViewerSidebar.tsx](../../../src/feature/roadmap/viewer/components/layout/ViewerSidebar/ViewerSidebar.tsx)
- 디자인 참고: Duolingo, Khan Academy 퀴즈 UI
