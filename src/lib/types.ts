// ─── Role Types ─────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

// ─── Date Range ──────────────────────────────────────────────────────────────
export type DateRangeOption = '7d' | '30d' | '90d' | '1y' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

// ─── KPI ─────────────────────────────────────────────────────────────────────
export interface KPIData {
  title: string;
  value: string;
  change: number; // percentage change
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'primary' | 'success' | 'warning' | 'danger' | 'cyan';
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
export interface TimeSeriesPoint {
  date: string;
  value: number;
  secondary?: number;
  tertiary?: number;
}

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface BarDataPoint {
  label: string;
  free?: number;
  pro?: number;
  enterprise?: number;
  desktop?: number;
  mobile?: number;
  tablet?: number;
  direct?: number;
  organic?: number;
  referral?: number;
  social?: number;
  email?: number;
  [key: string]: string | number | undefined;
}

// ─── Funnel ───────────────────────────────────────────────────────────────────
export interface FunnelStage {
  name: string;
  value: number;
  percentage: number;
  dropOff: number;
  color: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────
export type NotificationType = 'system' | 'billing' | 'team' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export type MemberStatus = 'active' | 'inactive' | 'pending';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: MemberStatus;
  avatar?: string;
  joinedAt: Date;
  lastActive: Date;
  sessionsThisMonth: number;
}

// ─── Revenue ──────────────────────────────────────────────────────────────────
export interface RevenueEntry {
  id: string;
  customer: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  mrr: number;
  status: 'active' | 'churned' | 'trial';
  startDate: Date;
  country: string;
}

// ─── Traffic ──────────────────────────────────────────────────────────────────
export interface PageViewEntry {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgDuration: string;
  bounceRate: number;
}

export interface ReferrerEntry {
  source: string;
  sessions: number;
  percentage: number;
  change: number;
}

// ─── User Table ───────────────────────────────────────────────────────────────
export interface UserEntry {
  id: string;
  name: string;
  email: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  country: string;
  signedUp: Date;
  status: 'active' | 'inactive' | 'trial';
  sessions: number;
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  avatar?: string;
}
