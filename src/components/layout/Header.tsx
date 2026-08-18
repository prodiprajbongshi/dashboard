'use client';

import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { mockNotifications } from '@/lib/mockData';
import type { UserRole } from '@/lib/types';
import Avatar from '@/components/ui/Avatar';
import { useState } from 'react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':              'Overview',
  '/dashboard/revenue':      'Revenue Analytics',
  '/dashboard/users':        'User Analytics',
  '/dashboard/traffic':      'Traffic Analytics',
  '/dashboard/conversions':  'Conversion Funnel',
  '/dashboard/notifications':'Notifications',
  '/dashboard/team':         'Team Management',
  '/dashboard/settings':     'Settings',
};

const ROLES: UserRole[] = ['admin', 'analyst', 'viewer'];

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { currentUser, setRole } = useRole();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const title = PAGE_TITLES[pathname] ?? 'Dashboard';
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <header style={{
      height: 66,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      background: 'rgba(6,11,24,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: 6,
        }}
        className="mobile-menu-btn"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        <div style={{ fontSize: 11.5, color: '#334155', marginTop: 1 }}>
          CloudMetrics Analytics Platform
        </div>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative',
        display: 'none',
      }} className="header-search">
        <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#334155', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search anything..."
          style={{
            width: 220,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '8px 12px 8px 30px',
            fontSize: 13,
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
          }}
        />
      </div>

      {/* Notifications */}
      <button
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748b',
          transition: 'all 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="notif-badge">{unread}</span>
        )}
      </button>

      {/* Role Switcher + User */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowRoleMenu(v => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 10px 6px 6px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          <Avatar name={currentUser.name} size="sm" />
          <div style={{ textAlign: 'left', display: 'none' }} className="user-info">
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'capitalize' }}>{currentUser.role}</div>
          </div>
          <ChevronDown size={13} color="#475569" />
        </button>
        {showRoleMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: '#131d30',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            overflow: 'hidden',
            zIndex: 100,
            minWidth: 200,
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Demo: Switch Role
            </div>
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => { setRole(role); setShowRoleMenu(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  background: currentUser.role === role ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = currentUser.role === role ? 'rgba(99,102,241,0.12)' : 'transparent'}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: role === 'admin' ? '#6366f1' : role === 'analyst' ? '#06b6d4' : '#64748b',
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>{role}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    {role === 'admin' ? 'Full access' : role === 'analyst' ? 'Read + Export' : 'Read only'}
                  </div>
                </div>
                {currentUser.role === role && (
                  <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .header-search { display: block !important; }
          .user-info { display: block !important; }
        }
      `}</style>
    </header>
  );
}
