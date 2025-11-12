const PREFIX = 'horizon-';

export const generateInviteCode = (teamId: string): string => {
  return `${PREFIX}${Buffer.from(teamId).toString('base64')}`;
};

export const decodeInviteCode = (inviteCode: string): string | null => {
  if (!inviteCode.startsWith(PREFIX)) {
    return null;
  }
  try {
    const base64 = inviteCode.slice(PREFIX.length);
    const teamId = Buffer.from(base64, 'base64').toString('ascii');
    return teamId;
  } catch (_error) {
    return null;
  }
};
