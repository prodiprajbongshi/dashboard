'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header onMobileMenuOpen={() => setMobileOpen(true)} />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            background: 'var(--bg-base)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
