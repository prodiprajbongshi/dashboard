'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Users, Globe, GitBranch,
  Bell, Settings, ChevronLeft, ChevronRight, UserCog,
  Zap, Menu, X, Shield,
} from 'lucide-react';
import { useRole } from '@/hooks/useRole';
import { mockNotifications } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    section: 'Analytics',
    items: [
      { href: '/dashboard',              label: 'Overview',        icon: LayoutDashboard, roles: ['admin','analyst','viewer'] },
      { href: '/dashboard/revenue',      label: 'Revenue',         icon: TrendingUp,      roles: ['admin','analyst'] },
      { href: '/dashboard/users',        label: 'Users',           icon: Users,           roles: ['admin','analyst'] },
      { href: '/dashboard/traffic',      label: 'Traffic',         icon: Globe,           roles: ['admin','analyst','viewer'] },
      { href: '/dashboard/conversions',  label: 'Conversions',     icon: GitBranch,       roles: ['admin','analyst'] },
    ],
  },
  {
    section: 'Workspace',
    items: [
      { href: '/dashboard/notifications', label: 'Notifications',  icon: Bell,    roles: ['admin','analyst','viewer'] },
      { href: '/dashboard/team',          label: 'Team',           icon: UserCog, roles: ['admin'] },
      { href: '/dashboard/settings',      label: 'Settings',       icon: Settings, roles: ['admin'] },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, can } = useRole();
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(180deg, #0d1424 0%, #0a0f1e 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 16px' : '20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 66,
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
        }}>
          <Zap size={17} color="#fff" fill="#fff" />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>CloudMetrics</div>
            <div style={{ fontSize: 10.5, color: '#475569', letterSpacing: '0.04em', fontWeight: 500 }}>ANALYTICS PLATFORM</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter(item =>
            item.roles.includes(currentUser.role)
          );
          if (!visibleItems.length) return null;

          return (
            <div key={section.section} style={{ marginBottom: 20 }}>
              {!collapsed && (
                <div style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#334155',
                  padding: '0 8px',
                  marginBottom: 6,
                }}>
                  {section.section}
                </div>
              )}
              {visibleItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const isNotif = item.href === '/dashboard/notifications';

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn('sidebar-item', active && 'active')}
                    style={{ marginBottom: 2, justifyContent: collapsed ? 'center' : undefined }}
                    title={collapsed ? item.label : undefined}
                  >
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <Icon size={17} />
                      {isNotif && unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount}</span>
                      )}
                    </div>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{
        padding: '14px 10px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 10px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          cursor: 'default',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}>
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                <Shield size={10} />
                <span style={{ textTransform: 'capitalize' }}>{currentUser.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#334155',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
        onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        style={{
          width: collapsed ? 64 : 228,
          flexShrink: 0,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          display: 'none',
        }}
        className="lg-sidebar"
      >
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={onMobileClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 40, backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{
            position: 'fixed', left: 0, top: 0, bottom: 0,
            width: 240, zIndex: 50,
            animation: 'slideInLeft 0.25s ease',
          }}>
            {sidebarContent}
          </div>
        </>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { display: block !important; }
        }
      `}</style>
    </>
  );
}
