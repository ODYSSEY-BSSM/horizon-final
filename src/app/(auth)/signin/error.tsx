'use client';

import { useRouter } from 'next/navigation';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function SignInError({
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
        <Text variant="B1" color={tokens.colors.neutral[500]}>
          로그인 중 문제가 발생했습니다
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
          aria-label="로그인 에러 아이콘"
        >
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
          <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <Text variant="H3" color={tokens.colors.neutral[900]}>
          로그인할 수 없습니다
        </Text>
        <Text variant="B2" color={tokens.colors.neutral[600]}>
          {error.message?.includes('401') ||
          error.message?.includes('이메일') ||
          error.message?.includes('비밀번호')
            ? '이메일 또는 비밀번호가 올바르지 않습니다.'
            : error.message || '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'}
        </Text>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: '8px' }}>
            <summary
              style={{
                cursor: 'pointer',
                color: tokens.colors.neutral[500],
                fontSize: '12px',
              }}
            >
              기술적 세부사항
            </summary>
            <pre
              style={{
                fontSize: '11px',
                color: tokens.colors.neutral[600],
                background: tokens.colors.neutral[100],
                padding: '8px',
                borderRadius: '4px',
                marginTop: '4px',
                textAlign: 'left',
                overflow: 'auto',
                maxWidth: '100%',
              }}
            >
              {error.stack}
            </pre>
          </details>
        )}
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
            다시 로그인
          </Text>
        </button>

        <button
          type="button"
          onClick={() => router.push('/signup')}
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
            회원가입하기
          </Text>
        </button>

        <button
          type="button"
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.neutral[500],
            cursor: 'pointer',
            padding: '8px',
            textDecoration: 'underline',
          }}
        >
          <Text variant="O" color={tokens.colors.neutral[500]}>
            홈으로 돌아가기
          </Text>
        </button>
      </div>
    </div>
  );
}
