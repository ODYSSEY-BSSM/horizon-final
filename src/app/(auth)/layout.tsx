import { tokens } from '@/core/tokens';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: tokens.colors.background,
      }}
    >
      <div
        style={{
          width: '720px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: tokens.colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: tokens.shadow[0],
        }}
      >
        {children}
      </div>
    </div>
  );
}
