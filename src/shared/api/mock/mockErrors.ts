export const MOCK_ERRORS = {
  AUTH_REQUIRED: '로그인이 필요합니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  INVALID_VERIFICATION_CODE: '인증 코드가 일치하지 않습니다.',
  INVALID_REFRESH_TOKEN: '유효하지 않은 리프레시 토큰입니다.',

  ROADMAP_NOT_FOUND: '로드맵을 찾을 수 없습니다.',
  NO_ROADMAPS: '로드맵이 없습니다.',

  NODE_NOT_FOUND: '노드를 찾을 수 없습니다.',

  PROBLEM_NOT_FOUND: '문제를 찾을 수 없습니다.',

  DIRECTORY_NOT_FOUND: '디렉토리를 찾을 수 없습니다.',
  TEAM_DIRECTORY_NOT_FOUND: '팀 디렉토리를 찾을 수 없습니다.',

  TEAM_NOT_FOUND: '팀을 찾을 수 없습니다.',
  INVALID_INVITE_CODE: '유효하지 않은 초대 코드입니다.',
  ALREADY_TEAM_MEMBER: '이미 팀에 가입되어 있습니다.',
  LEADER_CANNOT_LEAVE: '팀장은 팀을 탈퇴할 수 없습니다. 팀을 삭제하거나 팀장을 위임하세요.',
  ONLY_LEADER_CAN_REMOVE: '팀장만 멤버를 제거할 수 있습니다.',
  LEADER_CANNOT_REMOVE_SELF: '팀장은 자신을 제거할 수 없습니다.',

  SCHOOL_NOT_FOUND: '학교를 찾을 수 없습니다.',
  INVALID_SCHOOL_CODE: '유효하지 않은 학교 코드입니다.',
  SCHOOL_ALREADY_CONNECTED: '이미 학교가 연동되어 있습니다.',
  NO_SCHOOL_CONNECTED: '연동된 학교가 없습니다.',
  SCHOOL_CONNECTION_REQUIRED: '학교 연동이 필요합니다.',
  EDUCATION_NODE_NOT_FOUND: '교육과정 노드를 찾을 수 없습니다.',
} as const;
