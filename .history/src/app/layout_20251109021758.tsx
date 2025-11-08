/*
src/shared/
├── api/          # (유지) API 호출 및 관련 로직
├── store/        # (유지) 전역 상태 관리
├── providers/    # (유지) Context Provider 등
├── types/        # (유지) 공용 타입 정의
│
├── ui/           # UI 관련 코드 그룹
│   ├── components/ # 공용 UI 컴포넌트 (기존 components/ 이동)
│   └── tokens/     # 디자인 토큰 (색상, 폰트, 간격 등)
│
└── utils/        # 유틸리티 함수 및 훅 그룹
    ├── hooks/      # 공용 커스텀 훅 (기존 hooks/ 이동)
    └── methods/    # 순수 함수 유틸리티 (예: formatDate, validators)
*/