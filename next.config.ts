import type { NextConfig } from 'next';

// 프로덕션 환경에서는 환경 변수가 필수
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('프로덕션 환경에서 NEXT_PUBLIC_API_BASE_URL은 필수입니다.');
  }
  if (!process.env.NEXT_PUBLIC_WS_BASE_URL) {
    throw new Error('프로덕션 환경에서 NEXT_PUBLIC_WS_BASE_URL은 필수입니다.');
  }
}

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'} ${process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8080'}`,
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
