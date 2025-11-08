import type { PropsWithChildren } from 'react';
import './globals.css';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
