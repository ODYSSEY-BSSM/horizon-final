# Studio 컴포넌트 리팩토링 계획

> 작성일: 2025-11-17
> 상태: 계획 수립 완료

## 1. 현재 문제점

### 1.1 구조적 문제

**studio는 roadmap의 일부인데 독립 피처로 분리되어 있음**

```
현재 구조:
src/feature/studio/           ❌ 독립 피처로 존재
  ├── components/ (18개)
  ├── types/
  ├── constants/
  ├── hooks/ (비어있음)
  └── stores/ (비어있음)
```

**문제점:**
- studio는 React Flow 기반 로드맵 에디터 UI인데 roadmap과 분리됨
- api, hooks, stores 디렉토리가 비어있음 (다른 피처들은 모두 있음)
- 아직 앱 어디에도 사용되지 않음 (신규 컴포넌트)
- roadmap의 데이터/로직에 의존해야 하는데 별도 피처로 존재

**다른 피처 비교:**
- ✅ auth: api + hooks + components
- ✅ roadmap: api + hooks + components
- ✅ folder: api + hooks + components
- ✅ team: api + hooks + components
- ❌ studio: components만 존재

### 1.2 빌드 에러 (타입 불일치)

#### ✅ 수정 완료
1. `ColorTheme` vs `NodeColor` 타입 불일치
2. `tokens.radius.xs/sm/md` → `extraSmall/small/medium`
3. `tokens.spacing.xs/sm/md/lg` → `xxsmall/small/medium/large`
4. `tokens.colors.neutral[50]` → `neutral[100]` (50은 존재하지 않음)
5. `tokens.typography` → `tokens.typos`
6. `fontWeight.semiBold` → `fontWeight.semibold`

#### ❌ 남은 수정 필요
7. `tokens.shadow.sm` → shadow 토큰 확인 필요
   - 위치: HorizonNode/SecondaryNode.tsx:47, StandardNode.tsx, TitleNode.tsx

### 1.3 스타일링 일관성 문제

#### 폰트 하드코딩 (13개 파일)
```typescript
// ❌ 하드코딩
font-family: 'SUIT Variable', sans-serif;
font-weight: 300;

// ✅ tokens 사용
font-family: ${tokens.typos.fontFamily.suit};
font-weight: ${tokens.typos.fontWeight.light};
```

**영향받는 파일:**
- ColorDropdown, EditorTextfield, EditorTextbox, ToolbarList
- EditorDropdown, EditorSidebar (3개소)

#### 색상 하드코딩 (27개소)
```typescript
// ❌ 하드코딩
color: '#2666dc'
border: '1px solid #e3e8ef'

// ✅ tokens 사용
color: ${tokens.colors.primary[500]}
border: 1px solid ${tokens.colors.neutral[200]}
```

**영향받는 파일:**
- ColorDropdown (7개소): 색상 옵션들
- HorizonNode (StandardNode, TitleNode, SecondaryNode)
- HorizonText, HorizonSection
- EditorHeader, EditorSidebar, EditorToast

### 1.4 Shared UI 미사용

**중복 구현 문제:**
- `EditorTextbox` vs `shared/ui/TextField` - 텍스트 입력 컴포넌트 중복
- `EditorTextfield` vs `shared/ui/TextField` - 동일 기능 중복
- `EditorDropdown` vs 기존 드롭다운 패턴 불일치
- 텍스트/아이콘 컴포넌트를 직접 구현 (`shared/ui/Text`, `Icon` 미사용)

**roadmap 피처의 올바른 패턴:**
```typescript
// ✅ roadmap/ColorDropdown
import { Icon, Text } from '@/shared/ui';
import { useDropdown } from '@/shared/hooks/useDropdown';
```

**studio의 잘못된 패턴:**
```typescript
// ❌ studio/ColorDropdown
// styled component로 텍스트/아이콘 직접 구현
const Label = styled.p`...`;
const ArrowIcon = styled.span`...`;
```

### 1.5 중복 컴포넌트

**ColorDropdown 중복:**
- `src/feature/studio/components/ColorDropdown/`
- `src/feature/roadmap/components/ColorDropdown/`

roadmap의 ColorDropdown이 더 올바른 구현:
- ✅ shared/ui 컴포넌트 사용 (Text, Icon)
- ✅ shared/hooks 사용 (useDropdown)
- ✅ 접근성 고려 (ARIA attributes)
- ✅ 타입 정의 명확 (ColorOption)

---

## 2. 개선 계획

### Phase 1: 빌드 에러 수정 ⚡ 긴급

**목표:** 빌드가 통과되도록 타입 에러 수정

**작업:**
1. ✅ ColorTheme → NodeColor 타입 수정
2. ✅ tokens.radius 속성명 수정
3. ✅ tokens.spacing 속성명 수정
4. ✅ tokens.colors.neutral[50] → [100] 수정
5. ✅ tokens.typography → tokens.typos 수정
6. ❌ tokens.shadow 속성 확인 및 수정
   ```bash
   # shadow 토큰 확인
   cat src/shared/tokens/shadow/shadow.ts

   # studio에서 사용하는 shadow 패턴 확인
   grep -r "tokens.shadow" src/feature/studio

   # 올바른 속성으로 수정
   ```

**완료 조건:** `bun run build` 성공

### Phase 2: 스타일링 일관성 개선 🎨

**목표:** 하드코딩 제거, 디자인 토큰 사용

#### 2.1 폰트 하드코딩 제거
```bash
# 모든 'SUIT Variable' 하드코딩을 tokens.typos로 교체
find src/feature/studio -name "*.tsx" -type f \
  -exec sed -i '' "s/font-family: 'SUIT Variable', sans-serif/font-family: \${tokens.typos.fontFamily.suit}/g" {} \;

# font-weight 숫자를 tokens로 교체
# 300 -> light, 400 -> regular, 500 -> medium, 600 -> semibold, 700 -> bold
```

**영향 파일:**
- ColorDropdown.tsx
- EditorTextfield.tsx
- EditorTextbox.tsx
- ToolbarList.tsx
- EditorDropdown.tsx
- EditorSidebar.tsx

#### 2.2 색상 하드코딩 제거

**매핑 테이블:**
```typescript
// 노드 색상
'#2666dc' → tokens.colors.primary[500] (blue)
'#a826dc' → tokens.colors.primary[600] (purple)
'#dc2626' → tokens.colors.error[500] (red)
'#ea580c' → tokens.colors.warning[500] (orange)
'#e6c200' → tokens.colors.warning[400] (yellow)
'#16a34a' → tokens.colors.success[500] (green)

// 중립 색상
'#e3e8ef' → tokens.colors.neutral[200]
'#9aa4b2' → tokens.colors.neutral[400]
'#6b7684' → tokens.colors.neutral[500]
```

**자동화 스크립트:**
```bash
# scripts/fix-studio-colors.sh
find src/feature/studio -name "*.tsx" -exec sed -i '' \
  -e 's/#2666dc/${tokens.colors.primary[500]}/g' \
  -e 's/#e3e8ef/${tokens.colors.neutral[200]}/g' \
  # ... (모든 색상 매핑)
  {} \;
```

### Phase 3: Shared UI 컴포넌트 사용 ♻️

**목표:** 중복 제거, 공용 컴포넌트 활용

#### 3.1 EditorTextbox/Textfield → shared/ui/TextField 교체

**현재:**
```typescript
// EditorTextbox.tsx, EditorTextfield.tsx - 중복 구현
const Container = styled.div`...`;
const Label = styled.p`...`;
const Input = styled.input`...`;
```

**개선:**
```typescript
import { TextField } from '@/shared/ui';

export const EditorTextbox = ({ label, value, onChange }: Props) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      multiline
      rows={3}
    />
  );
};
```

#### 3.2 텍스트/아이콘 컴포넌트 교체

**Before:**
```typescript
const Label = styled.p`
  font-family: 'SUIT Variable', sans-serif;
  font-weight: 300;
  font-size: 14px;
  color: ${tokens.colors.neutral[900]};
`;

const Icon = styled.span`
  font-family: 'Material Symbols Rounded';
  font-size: 20px;
`;
```

**After:**
```typescript
import { Text, Icon } from '@/shared/ui';

<Text variant="B2" color={tokens.colors.neutral[900]}>
  {label}
</Text>

<Icon name="arrow_drop_down" size={20} />
```

#### 3.3 중복 ColorDropdown 제거

**roadmap/ColorDropdown을 재사용:**
```typescript
// ❌ 삭제: studio/components/ColorDropdown

// ✅ studio에서 roadmap의 ColorDropdown import
import { ColorDropdown } from '@/feature/roadmap';
```

**또는 shared/ui로 이동:**
```typescript
// ColorDropdown을 공용으로 만들기
src/shared/ui/ColorDropdown/
  ├── ColorDropdown.tsx
  └── index.ts
```

### Phase 4: 구조 개편 (studio → roadmap/editor) 🏗️

**목표:** 올바른 도메인 위치로 이동

#### 4.1 디렉토리 구조 변경

```
Before:
src/feature/studio/

After:
src/feature/roadmap/
  └── editor/
      ├── components/
      │   ├── nodes/          # HorizonNode, HorizonSection, HorizonText
      │   │   ├── HorizonNode/
      │   │   ├── HorizonSection/
      │   │   └── HorizonText/
      │   ├── toolbar/        # EditorToolbar, ToolbarItem, ToolbarList
      │   │   ├── EditorToolbar/
      │   │   ├── ToolbarItem/
      │   │   └── ToolbarList/
      │   ├── controls/       # 폼 컨트롤 (드롭다운 제거됨, shared/ui 사용)
      │   ├── layout/         # EditorHeader, EditorSidebar
      │   │   ├── EditorHeader/
      │   │   └── EditorSidebar/
      │   └── ui/             # HistoryController, EditorToast
      │       ├── HistoryController/
      │       └── EditorToast/
      ├── types/
      │   ├── node.types.ts
      │   ├── section.types.ts
      │   └── text.types.ts
      ├── constants/
      │   ├── nodeColors.ts
      │   ├── nodeTypes.ts
      │   ├── sectionTypes.ts
      │   └── textTypes.ts
      ├── hooks/              # 에디터 전용 hooks (향후 추가)
      │   └── useEditorState.ts
      └── index.ts            # 에디터 public API
```

#### 4.2 이동 스크립트

```bash
#!/bin/bash
# scripts/migrate-studio-to-editor.sh

# 1. 새 디렉토리 생성
mkdir -p src/feature/roadmap/editor/{components/{nodes,toolbar,controls,layout,ui},types,constants,hooks}

# 2. 컴포넌트 이동 (카테고리별)
# Nodes
mv src/feature/studio/components/HorizonNode src/feature/roadmap/editor/components/nodes/
mv src/feature/studio/components/HorizonSection src/feature/roadmap/editor/components/nodes/
mv src/feature/studio/components/HorizonText src/feature/roadmap/editor/components/nodes/

# Toolbar
mv src/feature/studio/components/EditorToolbar src/feature/roadmap/editor/components/toolbar/
mv src/feature/studio/components/ToolbarItem src/feature/roadmap/editor/components/toolbar/
mv src/feature/studio/components/ToolbarList src/feature/roadmap/editor/components/toolbar/

# Controls - ColorDropdown 제외 (삭제 예정)
# EditorTextbox, EditorTextfield도 제외 (shared/ui/TextField 사용)

# Layout
mv src/feature/studio/components/EditorHeader src/feature/roadmap/editor/components/layout/
mv src/feature/studio/components/EditorSidebar src/feature/roadmap/editor/components/layout/

# UI
mv src/feature/studio/components/HistoryController src/feature/roadmap/editor/components/ui/
mv src/feature/studio/components/EditorToast src/feature/roadmap/editor/components/ui/

# 3. Types & Constants 이동
mv src/feature/studio/types/* src/feature/roadmap/editor/types/
mv src/feature/studio/constants/* src/feature/roadmap/editor/constants/

# 4. Import 경로 업데이트 (자동화)
find src/feature/roadmap/editor -name "*.tsx" -o -name "*.ts" | xargs sed -i '' \
  's|@/feature/studio|@/feature/roadmap/editor|g'

# 5. studio 디렉토리 삭제
rm -rf src/feature/studio
```

#### 4.3 roadmap/index.ts 업데이트

```typescript
// src/feature/roadmap/index.ts

// 기존 exports
export * from './api';
export * from './components';
export * from './hooks';

// 에디터 exports 추가
export * from './editor';
```

#### 4.4 editor/index.ts 생성

```typescript
// src/feature/roadmap/editor/index.ts

// Nodes
export { HorizonNode, TitleNode, StandardNode, SecondaryNode } from './components/nodes/HorizonNode';
export { HorizonSection } from './components/nodes/HorizonSection';
export { HorizonText } from './components/nodes/HorizonText';

// Toolbar
export { EditorToolbar } from './components/toolbar/EditorToolbar';
export { ToolbarItem } from './components/toolbar/ToolbarItem';
export { ToolbarList } from './components/toolbar/ToolbarList';

// Layout
export { EditorHeader } from './components/layout/EditorHeader';
export { EditorSidebar } from './components/layout/EditorSidebar';

// UI
export { HistoryController } from './components/layout/HistoryController';
export { EditorToast } from './components/ui/EditorToast';

// Types
export type * from './types/node.types';
export type * from './types/section.types';
export type * from './types/text.types';

// Constants
export * from './constants/nodeColors';
export * from './constants/nodeTypes';
export * from './constants/sectionTypes';
export * from './constants/textTypes';
```

---

## 3. 작업 순서

### ✅ Completed (2025-11-17)

**Phase 1: Build Fixes**
1. ColorTheme → NodeColor 타입 수정
2. tokens.radius 속성명 수정 (xs/sm/md → extraSmall/small/medium)
3. tokens.spacing 속성명 수정 (xs/sm/md/lg → xxsmall/small/medium/large)
4. tokens.colors.neutral[50] → [100]
5. tokens.typography → tokens.typos
6. fontWeight.semiBold → semibold
7. tokens.shadow.sm → tokens.shadow[0]
8. Duplicate NodeType export 제거

**Styled Component Naming Convention Fix**
- 모든 styled component에 "Styled" prefix 추가 (24개 컴포넌트)
- JSX usage 및 styled composition 모두 수정
- 영향받은 파일: 17개 component 파일

**Phase 2a: Font Hardcoding Removal**
- 'SUIT Variable' 하드코딩 → tokens.typos.fontFamily.suit
- font-weight 숫자 → tokens.typos.fontWeight.{light|regular|medium|semibold|bold}
- 남은 하드코딩: 0개

### 🔄 In Progress
**Phase 2b: Color Hardcoding Removal**

### 📋 TODO
8. 폰트 하드코딩 제거 (13개 파일)
9. 색상 하드코딩 제거 (27개소)
10. EditorTextbox/Textfield → shared/ui/TextField 교체
11. 텍스트/아이콘을 shared/ui 컴포넌트로 교체
12. 중복 ColorDropdown 제거
13. EditorDropdown → shared/ui 또는 roadmap 패턴으로 교체
14. studio → roadmap/editor 이동
15. import 경로 전체 업데이트
16. 최종 빌드 & 린트 검증

---

## 4. 예상 효과

### 4.1 코드 품질
- ✅ 빌드 에러 0개
- ✅ 타입 안정성 100%
- ✅ 디자인 토큰 사용률 100%
- ✅ 중복 코드 제거 (~200 lines)

### 4.2 유지보수성
- ✅ 명확한 도메인 구조 (roadmap/editor)
- ✅ shared 컴포넌트 재사용
- ✅ 일관된 스타일링 패턴
- ✅ roadmap api/hooks와 자연스러운 통합

### 4.3 확장성
- ✅ 에디터 기능 추가 용이 (editor/hooks, editor/stores)
- ✅ React Flow 통합 간소화
- ✅ 다른 피처와 동일한 구조 패턴

---

## 5. 리스크 & 대응

### 5.1 리스크
1. **대규모 파일 이동**: import 경로 누락 가능성
2. **스타일 변경**: 디자인 의도와 다르게 변경될 수 있음
3. **shared/ui 교체**: 기능 불일치 가능성

### 5.2 대응 방안
1. **단계별 진행**: Phase별 독립 실행 및 검증
2. **자동화 스크립트**: sed/find를 활용한 일괄 수정
3. **빌드 검증**: 각 단계 후 `bun run build` 확인
4. **시각적 검증**: Storybook으로 스타일 비교
5. **Git 브랜치**: 각 Phase별 브랜치 생성

---

## 6. 체크리스트

### Phase 1: 빌드 수정
- [x] ColorTheme → NodeColor
- [x] tokens.radius 수정
- [x] tokens.spacing 수정
- [x] tokens.colors.neutral[50] 수정
- [x] tokens.typography → typos
- [x] fontWeight casing
- [ ] tokens.shadow 수정
- [ ] `bun run build` 성공 확인

### Phase 2: 스타일링
- [ ] 폰트 하드코딩 제거
- [ ] 색상 하드코딩 제거
- [ ] 린트 통과 확인

### Phase 3: Shared UI
- [ ] EditorTextbox 삭제, TextField 사용
- [ ] EditorTextfield 삭제, TextField 사용
- [ ] Text/Icon 컴포넌트 교체
- [ ] 중복 ColorDropdown 제거
- [ ] EditorDropdown 개선

### Phase 4: 구조 개편
- [ ] roadmap/editor 디렉토리 생성
- [ ] 컴포넌트 카테고리별 이동
- [ ] types/constants 이동
- [ ] import 경로 업데이트
- [ ] editor/index.ts 생성
- [ ] roadmap/index.ts 업데이트
- [ ] studio 디렉토리 삭제
- [ ] 최종 빌드 & 린트 검증

---

## 7. 참고 자료

### 올바른 패턴 예시
- `src/feature/roadmap/components/ColorDropdown/` - shared UI 사용
- `src/feature/auth/`, `src/feature/team/` - 완전한 피처 구조
- `src/shared/ui/TextField/` - 공용 폼 컴포넌트
- `src/shared/tokens/` - 디자인 토큰 시스템

### 관련 문서
- `/docs/architecture/README.md` - 아키텍처 가이드
- `/docs/CLAUDE.md` - 프로젝트 컨벤션
- `/src/shared/tokens/` - 토큰 정의
