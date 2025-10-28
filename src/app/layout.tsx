import type { Metadata } from 'next';
import QueryProvider from '@/core/providers/QueryProvider';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = {
  title: 'Horizon',
  description: 'Horizon Application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
