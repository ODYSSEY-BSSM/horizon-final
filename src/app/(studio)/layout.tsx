import type React from 'react';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-screen overflow-hidden">{children}</div>;
}
