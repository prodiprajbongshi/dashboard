import { format, subDays, subMonths } from 'date-fns';
import type {
  TimeSeriesPoint,
  DonutDataPoint,
  BarDataPoint,
  FunnelStage,
  Notification,
  TeamMember,
  RevenueEntry,
  PageViewEntry,
  ReferrerEntry,
  UserEntry,
  ActivityItem,
  KPIData,
} from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

const NAMES = [
  'Aria Chen','Marcus Rivera','Sophie Kim','Liam Johnson','Priya Patel',
  'Noah Williams','Elena Vasquez','James Thompson','Mia Anderson','Oliver Davis',
  'Chloe Martinez','Ethan Brown','Isabella Lee','Lucas White','Ava Harris',
  'Mason Clark','Grace Lewis','Aiden Walker','Zoe Allen','Logan Young',
];

const COUNTRIES = ['United States','United Kingdom','Germany','France','Canada','Australia','India','Japan','Brazil','Netherlands'];
const COMPANIES = ['TechCorp','Nexus Labs','Orbit Systems','Quantum Flow','Stellar IO','Nova Analytics','Pulse Media','Apex Cloud','Synth AI','Vertex Pro'];

// ─── KPI Cards ────────────────────────────────────────────────────────────────
export const overviewKPIs: KPIData[] = [
  { title: 'Total Revenue',      value: '$284,390',  change: 12.5, changeLabel: 'vs last month', icon: 'DollarSign', trend: 'up',      color: 'success' },
  { title: 'Active Users',       value: '47,382',    change: 8.2,  changeLabel: 'vs last month', icon: 'Users',      trend: 'up',      color: 'primary' },
  { title: 'Sessions',           value: '1.24M',     change: -3.1, changeLabel: 'vs last month', icon: 'Activity',   trend: 'down',    color: 'cyan' },
  { title: 'Bounce Rate',        value: '32.8%',     change: -2.4, changeLabel: 'vs last month', icon: 'TrendingDown', trend: 'up',   color: 'warning' },
  { title: 'Conversions',        value: '3,847',     change: 15.7, changeLabel: 'vs last month', icon: 'Target',     trend: 'up',      color: 'success' },
  { title: 'MRR',                value: '$24,193',   change: 9.3,  changeLabel: 'vs last month', icon: 'BarChart2',  trend: 'up',      color: 'primary' },
];

export const revenueKPIs: KPIData[] = [
  { title: 'MRR',          value: '$24,193',   change: 9.3,  changeLabel: 'vs last month', icon: 'TrendingUp', trend: 'up',   color: 'success' },
  { title: 'ARR',          value: '$290,316',  change: 9.3,  changeLabel: 'vs last year',  icon: 'DollarSign', trend: 'up',   color: 'primary' },
  { title: 'Churn Rate',   value: '2.4%',      change: -0.3, changeLabel: 'vs last month', icon: 'UserMinus',  trend: 'up',   color: 'warning' },
  { title: 'Avg. Revenue Per User', value: '$48.20', change: 4.1, changeLabel: 'vs last month', icon: 'CreditCard', trend: 'up', color: 'cyan' },
];

export const userKPIs: KPIData[] = [
  { title: 'Daily Active Users',   value: '8,429',  change: 5.2,  changeLabel: 'vs yesterday', icon: 'UserCheck', trend: 'up',   color: 'success' },
  { title: 'Monthly Active Users', value: '47,382', change: 8.2,  changeLabel: 'vs last month', icon: 'Users',    trend: 'up',   color: 'primary' },
  { title: 'New Signups',          value: '1,284',  change: 12.1, changeLabel: 'vs last month', icon: 'UserPlus', trend: 'up',   color: 'cyan' },
  { title: 'Avg. Session Length',  value: '4m 32s', change: 3.4,  changeLabel: 'vs last month', icon: 'Clock',    trend: 'up',   color: 'warning' },
];

export const trafficKPIs: KPIData[] = [
  { title: 'Total Sessions',    value: '1.24M',    change: -3.1, changeLabel: 'vs last month', icon: 'Globe',       trend: 'down',   color: 'primary' },
  { title: 'Pageviews',         value: '4.87M',    change: 2.8,  changeLabel: 'vs last month', icon: 'Eye',         trend: 'up',     color: 'cyan' },
  { title: 'Avg. Duration',     value: '3m 14s',   change: 1.2,  changeLabel: 'vs last month', icon: 'Clock',       trend: 'up',     color: 'success' },
  { title: 'Unique Visitors',   value: '892,417',  change: 6.4,  changeLabel: 'vs last month', icon: 'UserCircle',  trend: 'up',     color: 'warning' },
];

// ─── Time Series ──────────────────────────────────────────────────────────────
function generateTimeSeries(days: number, baseValue: number, variance: number): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  let current = baseValue;
  let secondary = baseValue * 0.6;
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    current = Math.max(0, current + randomBetween(-variance, variance));
    secondary = Math.max(0, secondary + randomBetween(-variance * 0.7, variance * 0.7));
    data.push({
      date: format(date, 'MMM dd'),
      value: current,
      secondary,
    });
  }
  return data;
}

export const revenueTimeSeries: TimeSeriesPoint[] = generateTimeSeries(29, 22000, 1200);
export const sessionTimeSeries: TimeSeriesPoint[] = generateTimeSeries(29, 38000, 3000);
export const userGrowthSeries: TimeSeriesPoint[] = generateTimeSeries(29, 45000, 800);
export const churnSeries: TimeSeriesPoint[] = Array.from({ length: 12 }, (_, i) => ({
  date: format(subMonths(new Date(), 11 - i), 'MMM yy'),
  value: randomFloat(1.8, 3.5),
}));

// ─── Revenue by Month ─────────────────────────────────────────────────────────
export const revenueByPlan: BarDataPoint[] = Array.from({ length: 6 }, (_, i) => ({
  label: format(subMonths(new Date(), 5 - i), 'MMM'),
  free: randomBetween(800, 1500),
  pro: randomBetween(8000, 15000),
  enterprise: randomBetween(5000, 12000),
}));

// ─── Traffic Sources Donut ────────────────────────────────────────────────────
export const trafficSourcesDonut: DonutDataPoint[] = [
  { name: 'Organic Search', value: 38.4, color: '#6366f1' },
  { name: 'Direct',         value: 24.7, color: '#06b6d4' },
  { name: 'Social Media',   value: 18.2, color: '#8b5cf6' },
  { name: 'Referral',       value: 12.1, color: '#10b981' },
  { name: 'Email',          value: 6.6,  color: '#f59e0b' },
];

export const deviceBreakdownDonut: DonutDataPoint[] = [
  { name: 'Desktop', value: 52.3, color: '#6366f1' },
  { name: 'Mobile',  value: 38.9, color: '#06b6d4' },
  { name: 'Tablet',  value: 8.8,  color: '#8b5cf6' },
];

export const userGeoDonut: DonutDataPoint[] = [
  { name: 'North America', value: 34.2, color: '#6366f1' },
  { name: 'Europe',        value: 28.7, color: '#06b6d4' },
  { name: 'Asia Pacific',  value: 22.4, color: '#8b5cf6' },
  { name: 'Latin America', value: 9.1,  color: '#10b981' },
  { name: 'Other',         value: 5.6,  color: '#f59e0b' },
];

// ─── Traffic by Channel ───────────────────────────────────────────────────────
export const trafficByChannel: BarDataPoint[] = Array.from({ length: 6 }, (_, i) => ({
  label: format(subMonths(new Date(), 5 - i), 'MMM'),
  organic: randomBetween(12000, 18000),
  direct: randomBetween(7000, 12000),
  social: randomBetween(4000, 8000),
  email: randomBetween(2000, 5000),
}));

// ─── Conversion Funnel ────────────────────────────────────────────────────────
export const funnelStages: FunnelStage[] = [
  { name: 'Website Visits', value: 248340, percentage: 100,  dropOff: 0,    color: '#6366f1' },
  { name: 'Sign Up',        value: 42817,  percentage: 17.2, dropOff: 82.8, color: '#8b5cf6' },
  { name: 'Trial Started',  value: 18293,  percentage: 7.4,  dropOff: 57.3, color: '#06b6d4' },
  { name: 'Paid Customer',  value: 3847,   percentage: 1.5,  dropOff: 79.0, color: '#10b981' },
];

export const funnelTrendSeries: TimeSeriesPoint[] = Array.from({ length: 12 }, (_, i) => ({
  date: format(subMonths(new Date(), 11 - i), 'MMM'),
  value: randomFloat(1.1, 2.1),
  secondary: randomFloat(5.8, 9.4),
  tertiary: randomFloat(14.0, 20.0),
}));

// ─── Notifications ────────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: '1', type: 'billing',  title: 'Invoice Generated',       message: 'Your monthly invoice for $24,193 has been generated and is ready to view.', timestamp: subDays(new Date(), 0), read: false },
  { id: '2', type: 'alert',    title: 'Server CPU Spike',         message: 'CPU usage exceeded 90% on us-east-1 cluster for 5 minutes.', timestamp: new Date(Date.now() - 3600000), read: false },
  { id: '3', type: 'team',     title: 'New Team Member',          message: 'Priya Patel has accepted your invitation and joined the team.', timestamp: subDays(new Date(), 1), read: false },
  { id: '4', type: 'system',   title: 'Scheduled Maintenance',    message: 'System maintenance is scheduled for Sunday 2am–4am UTC.', timestamp: subDays(new Date(), 1), read: true },
  { id: '5', type: 'billing',  title: 'Payment Successful',       message: 'Payment of $24,193 was processed successfully. Receipt sent to billing@yourcompany.com.', timestamp: subDays(new Date(), 2), read: true },
  { id: '6', type: 'alert',    title: 'Anomaly Detected',         message: 'Unusual login activity from IP 203.0.113.42. Account temporarily restricted.', timestamp: subDays(new Date(), 2), read: true },
  { id: '7', type: 'team',     title: 'Role Updated',             message: 'Marcus Rivera\'s role has been changed from Analyst to Admin.', timestamp: subDays(new Date(), 3), read: true },
  { id: '8', type: 'system',   title: 'New Feature Release',      message: 'Conversion Funnel analytics v2.0 is now live. Check the Conversions page.', timestamp: subDays(new Date(), 4), read: true },
  { id: '9', type: 'billing',  title: 'Upcoming Renewal',         message: 'Your Enterprise plan renews in 7 days on Aug 25, 2026. $290,316/year.', timestamp: subDays(new Date(), 5), read: true },
  { id: '10', type: 'team',    title: 'Comment Mention',          message: 'Aria Chen mentioned you in a comment on the Q3 revenue report.', timestamp: subDays(new Date(), 6), read: true },
];

// ─── Team Members ─────────────────────────────────────────────────────────────
export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Aria Chen',      email: 'aria.chen@cloudmetrics.io',     role: 'admin',   status: 'active',   joinedAt: subMonths(new Date(), 18), lastActive: new Date(), sessionsThisMonth: 142 },
  { id: '2', name: 'Marcus Rivera',  email: 'marcus.r@cloudmetrics.io',      role: 'admin',   status: 'active',   joinedAt: subMonths(new Date(), 14), lastActive: subDays(new Date(), 1), sessionsThisMonth: 98 },
  { id: '3', name: 'Sophie Kim',     email: 'sophie.kim@cloudmetrics.io',    role: 'analyst', status: 'active',   joinedAt: subMonths(new Date(), 10), lastActive: subDays(new Date(), 0), sessionsThisMonth: 87 },
  { id: '4', name: 'Liam Johnson',   email: 'l.johnson@cloudmetrics.io',     role: 'analyst', status: 'active',   joinedAt: subMonths(new Date(), 8),  lastActive: subDays(new Date(), 2), sessionsThisMonth: 64 },
  { id: '5', name: 'Priya Patel',    email: 'priya.p@cloudmetrics.io',       role: 'viewer',  status: 'pending',  joinedAt: subMonths(new Date(), 0),  lastActive: subDays(new Date(), 0), sessionsThisMonth: 3 },
  { id: '6', name: 'Noah Williams',  email: 'noah.w@cloudmetrics.io',        role: 'analyst', status: 'active',   joinedAt: subMonths(new Date(), 12), lastActive: subDays(new Date(), 3), sessionsThisMonth: 71 },
  { id: '7', name: 'Elena Vasquez',  email: 'elena.v@cloudmetrics.io',       role: 'viewer',  status: 'inactive', joinedAt: subMonths(new Date(), 6),  lastActive: subDays(new Date(), 14), sessionsThisMonth: 12 },
  { id: '8', name: 'James Thompson', email: 'james.t@cloudmetrics.io',       role: 'viewer',  status: 'active',   joinedAt: subMonths(new Date(), 5),  lastActive: subDays(new Date(), 1), sessionsThisMonth: 34 },
];

// ─── Revenue Entries ──────────────────────────────────────────────────────────
export const mockRevenueEntries: RevenueEntry[] = Array.from({ length: 20 }, (_, i) => {
  const plans: Array<'Free' | 'Pro' | 'Enterprise'> = ['Free', 'Pro', 'Enterprise'];
  const statuses: Array<'active' | 'churned' | 'trial'> = ['active', 'active', 'active', 'trial', 'churned'];
  const plan = plans[i % 3];
  return {
    id: `rev-${i + 1}`,
    customer: COMPANIES[i % COMPANIES.length],
    plan,
    mrr: plan === 'Free' ? 0 : plan === 'Pro' ? randomBetween(49, 99) : randomBetween(499, 999),
    status: statuses[i % statuses.length],
    startDate: format(subMonths(new Date(), randomBetween(1, 24)), 'yyyy-MM-dd'),
    country: COUNTRIES[i % COUNTRIES.length],
  };
});

// ─── Page Views ───────────────────────────────────────────────────────────────
export const mockPageViews: PageViewEntry[] = [
  { page: '/dashboard',       views: 48291, uniqueVisitors: 32847, avgDuration: '3m 42s', bounceRate: 18.4 },
  { page: '/pricing',         views: 31847, uniqueVisitors: 28291, avgDuration: '2m 15s', bounceRate: 42.1 },
  { page: '/features',        views: 24193, uniqueVisitors: 19847, avgDuration: '4m 01s', bounceRate: 31.2 },
  { page: '/blog',            views: 18294, uniqueVisitors: 15823, avgDuration: '5m 28s', bounceRate: 22.7 },
  { page: '/docs',            views: 14827, uniqueVisitors: 12394, avgDuration: '7m 14s', bounceRate: 12.3 },
  { page: '/integrations',    views: 11293, uniqueVisitors: 9847,  avgDuration: '2m 48s', bounceRate: 38.4 },
  { page: '/login',           views: 9847,  uniqueVisitors: 9284,  avgDuration: '0m 48s', bounceRate: 8.2 },
  { page: '/signup',          views: 8291,  uniqueVisitors: 7894,  avgDuration: '1m 32s', bounceRate: 14.6 },
];

// ─── Referrers ────────────────────────────────────────────────────────────────
export const mockReferrers: ReferrerEntry[] = [
  { source: 'google.com',         sessions: 184293, percentage: 38.4, change: 12.3 },
  { source: 'Direct',             sessions: 118471, percentage: 24.7, change: -2.1 },
  { source: 'twitter.com',        sessions: 87293,  percentage: 18.2, change: 8.7 },
  { source: 'github.com',         sessions: 58129,  percentage: 12.1, change: 24.1 },
  { source: 'linkedin.com',       sessions: 31847,  percentage: 6.6,  change: 15.3 },
];

// ─── Users ────────────────────────────────────────────────────────────────────
export const mockUsers: UserEntry[] = NAMES.slice(0, 15).map((name, i) => {
  const plans: Array<'Free' | 'Pro' | 'Enterprise'> = ['Free', 'Pro', 'Enterprise'];
  const statuses: Array<'active' | 'inactive' | 'trial'> = ['active', 'active', 'trial', 'inactive', 'active'];
  return {
    id: `usr-${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    plan: plans[i % 3],
    country: COUNTRIES[i % COUNTRIES.length],
    signedUp: format(subMonths(new Date(), randomBetween(1, 24)), 'yyyy-MM-dd'),
    status: statuses[i % statuses.length],
    sessions: randomBetween(5, 200),
  };
});

// ─── Activity Feed ────────────────────────────────────────────────────────────
export const mockActivity: ActivityItem[] = [
  { id: '1', user: 'Aria Chen',      action: 'exported',  target: 'Q3 Revenue Report',        timestamp: new Date(Date.now() - 300000) },
  { id: '2', user: 'Marcus Rivera',  action: 'invited',   target: 'priya.patel@example.com',  timestamp: new Date(Date.now() - 900000) },
  { id: '3', user: 'Sophie Kim',     action: 'created',   target: 'Custom Funnel: Enterprise', timestamp: new Date(Date.now() - 1800000) },
  { id: '4', user: 'System',         action: 'generated', target: 'Monthly Invoice #INV-0842', timestamp: new Date(Date.now() - 3600000) },
  { id: '5', user: 'Liam Johnson',   action: 'updated',   target: 'Dashboard date range',     timestamp: new Date(Date.now() - 7200000) },
  { id: '6', user: 'Noah Williams',  action: 'viewed',    target: 'Traffic Analytics',        timestamp: new Date(Date.now() - 14400000) },
  { id: '7', user: 'Aria Chen',      action: 'connected', target: 'Slack Integration',        timestamp: subDays(new Date(), 1) },
  { id: '8', user: 'System',         action: 'detected',  target: 'Anomalous login activity', timestamp: subDays(new Date(), 1) },
];
