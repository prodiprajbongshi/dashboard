'use client';

import Avatar from '@/components/ui/Avatar';
import { formatRelative } from '@/lib/utils';
import type { ActivityItem } from '@/lib/types';

interface ActivityFeedProps {
  items: ActivityItem[];
}

const ACTION_COLORS: Record<string, string> = {
  exported:  '#6366f1',
  invited:   '#10b981',
  created:   '#06b6d4',
  generated: '#f59e0b',
  updated:   '#8b5cf6',
  viewed:    '#64748b',
  connected: '#10b981',
  detected:  '#ef4444',
};

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: 12,
            padding: '12px 0',
            borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Avatar name={item.user} size="sm" />
            {i < items.length - 1 && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '100%',
                width: 1,
                height: 12,
                background: 'rgba(255,255,255,0.06)',
                transform: 'translateX(-50%)',
                marginTop: 2,
              }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.4 }}>
              <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{item.user}</span>
              {' '}
              <span style={{
                color: ACTION_COLORS[item.action] ?? '#94a3b8',
                fontWeight: 500,
              }}>
                {item.action}
              </span>
              {' '}
              <span style={{ color: '#94a3b8' }}>{item.target}</span>
            </div>
            <div style={{ fontSize: 11.5, color: '#475569', marginTop: 3 }}>
              {formatRelative(item.timestamp)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
