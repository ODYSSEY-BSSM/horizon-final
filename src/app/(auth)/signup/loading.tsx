import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function SignUpLoading() {
  return (
    <SkeletonTheme
      baseColor={tokens.colors.neutral[200]}
      highlightColor={tokens.colors.neutral[100]}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          width: '400px',
        }}
      >
        {/* 헤더 섹션 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <Skeleton circle width={24} height={24} />
          <Skeleton height={24} width={120} />
        </div>

        {/* 브랜딩 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <Text variant="H2" color={tokens.colors.primary[500]}>
            HORIZON
          </Text>
          <Skeleton height={20} width={180} />
        </div>

        {/* 스텝별 폼 - 동적 구조 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* 입력 필드들 */}
          <div>
            <Skeleton height={16} width={80} style={{ marginBottom: '8px' }} />
            <Skeleton height={48} />
          </div>

          {/* 추가 필드 또는 설명 */}
          <div>
            <Skeleton height={14} width={250} style={{ marginBottom: '4px' }} />
            <Skeleton height={14} width={200} />
          </div>

          {/* 액션 버튼들 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '20px',
            }}
          >
            <Skeleton height={48} />
            <Skeleton height={40} />
          </div>
        </div>

        {/* 하단 링크 */}
        <div style={{ textAlign: 'center' }}>
          <Skeleton height={16} width={160} />
        </div>
      </div>
    </SkeletonTheme>
  );
}
