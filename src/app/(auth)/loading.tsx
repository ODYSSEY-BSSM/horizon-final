import { ClipLoader } from 'react-spinners';
import Text from '@/components/common/Text/Text';
import { tokens } from '@/core/tokens';

export default function AuthLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        width: '400px',
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
          잠시만 기다려주세요...
        </Text>
      </div>

      {/* React Spinners */}
      <ClipLoader
        color={tokens.colors.primary[500]}
        size={40}
        loading={true}
        cssOverride={{
          display: 'block',
        }}
      />

      {/* 설명 텍스트 */}
      <Text variant="O" color={tokens.colors.neutral[400]}>
        페이지를 준비하고 있습니다
      </Text>
    </div>
  );
}
