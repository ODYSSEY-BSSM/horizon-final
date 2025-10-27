import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function SignInLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
          width: '400px',
        }}
      >
        {/* 헤더 섹션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'flex-start',
          }}
        >
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Skeleton height={20} width={200} />
        </div>

        {/* 폼 섹션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* 이메일 필드 */}
          <div>
            <Skeleton height={16} width={60} style={{ marginBottom: '8px' }} />
            <Skeleton height={48} />
          </div>

          {/* 비밀번호 필드 */}
          <div>
            <Skeleton height={16} width={80} style={{ marginBottom: '8px' }} />
            <Skeleton height={48} />
          </div>
        </div>

        {/* 액션 섹션 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* 로그인 버튼 */}
          <Skeleton height={48} />

          {/* 구분선 */}
          <div style={{ padding: '20px 0' }}>
            <Skeleton height={1} />
          </div>

          {/* Google 로그인 버튼 */}
          <Skeleton height={48} />

          {/* 회원가입 링크 */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Skeleton height={16} width={150} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
