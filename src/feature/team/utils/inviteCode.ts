const DEFAULT_INVITE_CODE = '1Q2W3E4R';

export const generateInviteCode = (teamId: string, fallback = DEFAULT_INVITE_CODE): string => {
  const normalized = teamId.replace(/[^0-9A-Za-z]/g, '').toUpperCase();

  if (normalized.length >= 8) {
    return normalized.slice(0, 8);
  }

  return `${normalized}${fallback}`.slice(0, 8);
};
