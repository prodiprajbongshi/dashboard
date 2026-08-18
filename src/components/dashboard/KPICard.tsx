'use client';

import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Activity, Target, BarChart2, TrendingDown as TrendDown, UserCheck, UserPlus, Clock, Globe, Eye, UserCircle, CreditCard, UserMinus } from 'lucide-react';
import { formatChange, getChangeColor, cn } from '@/lib/utils';
import type { KPIData } from '@/lib/types';

const ICONS: Record<string, React.ElementType> = {
  DollarSign, Users, Activity, Target, BarChart2, TrendingUp, TrendingDown: TrendDown,
  UserCheck, UserPlus, Clock, Globe, Eye, UserCircle, CreditCard, UserMinus,
};

const colorConfig: Record<string, { bg: string; icon: string; glow: string }> = {
  primary: { bg: 'rgba(99,102,241,0.12)', icon: '#6366f1', glow: '0 0 20px rgba(99,102,241,0.2)' },
  success: { bg: 'rgba(16,185,129,0.12)', icon: '#10b981', glow: '0 0 20px rgba(16,185,129,0.2)' },
  warning: { bg: 'rgba(245,158,11,0.12)', icon: '#f59e0b', glow: '0 0 20px rgba(245,158,11,0.2)' },
  danger:  { bg: 'rgba(239,68,68,0.12)',  icon: '#ef4444', glow: '0 0 20px rgba(239,68,68,0.2)' },
  cyan:    { bg: 'rgba(6,182,212,0.12)',  icon: '#06b6d4', glow: '0 0 20px rgba(6,182,212,0.2)' },
};

interface KPICardProps {
  data: KPIData;
}

export default function KPICard({ data }: KPICardProps) {
  const Icon = ICONS[data.icon] ?? BarChart2;
  const colors = colorConfig[data.color] ?? colorConfig.primary;
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const isGoodChange = data.title.toLowerCase().includes('bounce') || data.title.toLowerCase().includes('churn')
    ? data.change < 0
    : data.change >= 0;

  return (
    <div className="glass-card glass-card-lift" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            {data.title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {data.value}
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: colors.glow,
          flexShrink: 0,
        }}>
          <Icon size={20} color={colors.icon} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <TrendIcon
          size={13}
          color={isGoodChange ? '#10b981' : '#ef4444'}
        />
        <span style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: isGoodChange ? '#10b981' : '#ef4444',
        }}>
          {formatChange(data.change)}
        </span>
        <span style={{ fontSize: 12, color: '#475569' }}>{data.changeLabel}</span>
      </div>
    </div>
  );
}
