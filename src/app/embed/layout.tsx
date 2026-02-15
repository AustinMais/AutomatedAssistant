'use client';

import { useEffect } from 'react';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.style.background = 'transparent';
    document.body.style.background = 'transparent';
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  return (
    <div className="min-h-screen min-w-full" style={{ background: 'transparent' }}>
      {children}
    </div>
  );
}
