'use client';

import { useRouter } from 'next/navigation';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '400px',
        textAlign: 'center',
      }}
    >
      {/* 브랜딩 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Text variant="H2" color={tokens.colors.primary[500]}>
          HORIZON
        </Text>
      </div>

      {/* 에러 아이콘 */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: tokens.colors.error[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.colors.error[200]}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="에러 아이콘"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <Text variant="H3" color={tokens.colors.neutral[900]}>
          페이지를 로드할 수 없습니다
        </Text>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
        </Text>
      </div>

      {/* 액션 버튼들 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
        }}
      >
        <button
          type="button"
          onClick={reset}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: tokens.colors.primary[500],
            color: tokens.colors.white,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary[600];
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary[500];
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary[600];
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary[500];
          }}
        >
          <Text variant="ST" color={tokens.colors.white}>
            다시 시도
          </Text>
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: 'transparent',
            color: tokens.colors.neutral[700],
            border: `1px solid ${tokens.colors.neutral[300]}`,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.neutral[100];
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.neutral[100];
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Text variant="ST" color={tokens.colors.neutral[700]}>
            홈으로 돌아가기
          </Text>
        </button>
      </div>
    </div>
  );
}
