const PREFIX = 'horizon-';

// UTF-8 문자열을 Base64로 인코딩 (한글 지원)
const utf8ToBase64 = (str: string): string => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  const binaryString = Array.from(uint8Array, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};

// Base64를 UTF-8 문자열로 디코딩
const base64ToUtf8 = (base64: string): string => {
  const binaryString = atob(base64);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(uint8Array);
};

export const generateInviteCode = (teamId: string): string => {
  return `${PREFIX}${utf8ToBase64(teamId)}`;
};

export const decodeInviteCode = (inviteCode: string): string | null => {
  if (!inviteCode.startsWith(PREFIX)) {
    return null;
  }
  try {
    const base64 = inviteCode.slice(PREFIX.length);
    const teamId = base64ToUtf8(base64);
    return teamId;
  } catch (_error) {
    return null;
  }
};
