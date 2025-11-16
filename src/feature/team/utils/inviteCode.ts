const PREFIX = 'horizon-';

export const generateInviteCode = (teamId: string): string => {
  // 브라우저 환경에서는 btoa 사용
  return `${PREFIX}${btoa(teamId)}`;
};

export const decodeInviteCode = (inviteCode: string): string | null => {
  if (!inviteCode.startsWith(PREFIX)) {
    return null;
  }
  try {
    const base64 = inviteCode.slice(PREFIX.length);
    // 브라우저 환경에서는 atob 사용
    const teamId = atob(base64);
    return teamId;
  } catch (_error) {
    return null;
  }
};
