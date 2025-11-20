import type { Metadata } from 'next';
import { EmotionProvider, QueryProvider } from '@/shared/providers';
import { Toaster } from '@/shared/ui/Toast';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';

export const metadata: Metadata = {
  title: 'Horizon',
  description: 'Horizon Application',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <EmotionProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster />
        </EmotionProvider>
      </body>
    </html>
  );
}
