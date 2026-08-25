import { format, formatDistanceToNow } from 'date-fns';

// ─── Number Formatting ────────────────────────────────────────────────────────
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── Date Formatting ──────────────────────────────────────────────────────────
export function formatDate(date: Date | string, pattern = 'MMM dd, yyyy'): string {
  return format(typeof date === 'string' ? new Date(date) : date, pattern);
}

export function formatRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

// ─── Change Formatting ────────────────────────────────────────────────────────
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

// ─── Color Utils ──────────────────────────────────────────────────────────────
export function getChangeColor(change: number, invertGood = false): string {
  const isPositive = change >= 0;
  const isGood = invertGood ? !isPositive : isPositive;
  return isGood ? 'text-emerald-400' : 'text-red-400';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'trial': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'churned': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'admin': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    case 'analyst': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'viewer': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

export function getPlanColor(plan: string): string {
  switch (plan) {
    case 'Enterprise': return 'bg-violet-500/20 text-violet-400 border-violet-500/30';
    case 'Pro': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    case 'Free': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}

// ─── Initials ─────────────────────────────────────────────────────────────────
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ─── Class Name Merger ────────────────────────────────────────────────────────
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
