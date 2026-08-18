'use client';

import { useState } from 'react';
import { Bell, CreditCard, Users, AlertTriangle, Settings2, CheckCheck, Trash2, X } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { mockNotifications } from '@/lib/mockData';
import { formatRelative } from '@/lib/utils';
import type { Notification, NotificationType } from '@/lib/types';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; label: string; badge: 'info' | 'success' | 'danger' | 'warning' }> = {
  system:  { icon: Settings2,     color: '#6366f1', label: 'System',  badge: 'info' },
  billing: { icon: CreditCard,    color: '#10b981', label: 'Billing', badge: 'success' },
  team:    { icon: Users,         color: '#06b6d4', label: 'Team',    badge: 'info' },
  alert:   { icon: AlertTriangle, color: '#ef4444', label: 'Alert',   badge: 'danger' },
};

type FilterType = 'all' | NotificationType;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  const FILTERS: { value: FilterType; label: string }[] = [
    { value: 'all',     label: 'All' },
    { value: 'system',  label: 'System' },
    { value: 'billing', label: 'Billing' },
    { value: 'team',    label: 'Team' },
    { value: 'alert',   label: 'Alerts' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                padding: '2px 8px',
                background: '#ef4444',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}>
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="page-subtitle">Stay updated on system events, billing, and team activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck size={13} />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              background: filter === f.value ? '#6366f1' : 'rgba(255,255,255,0.05)',
              color: filter === f.value ? '#fff' : '#64748b',
              transition: 'all 0.15s',
              boxShadow: filter === f.value ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {f.label}
            {f.value !== 'all' && (
              <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.8 }}>
                ({notifications.filter(n => f.value === 'all' ? true : n.type === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Bell size={36} color="#334155" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: '#475569', marginBottom: 4 }}>No notifications</div>
            <div style={{ fontSize: 13, color: '#334155' }}>You're all caught up!</div>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const config = TYPE_CONFIG[notif.type];
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '18px 22px',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: notif.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                  transition: 'background 0.15s',
                  cursor: notif.read ? 'default' : 'pointer',
                  position: 'relative',
                }}
                onClick={() => !notif.read && markRead(notif.id)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(99,102,241,0.05)'}
              >
                {/* Unread indicator */}
                {!notif.read && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: '#6366f1',
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  background: `${config.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid ${config.color}30`,
                }}>
                  <Icon size={17} color={config.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: notif.read ? 500 : 700, color: notif.read ? '#94a3b8' : '#f1f5f9' }}>
                        {notif.title}
                      </span>
                      <Badge variant={config.badge} size="sm">{config.label}</Badge>
                      {!notif.read && (
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                      )}
                    </div>
                    <span style={{ fontSize: 11.5, color: '#334155', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {formatRelative(notif.timestamp)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {notif.message}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#334155', padding: 4, borderRadius: 6,
                    transition: 'color 0.15s',
                    flexShrink: 0, alignSelf: 'flex-start',
                  }}
                  title="Dismiss"
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#334155'}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
