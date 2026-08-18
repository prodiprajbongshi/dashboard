'use client';

import KPICard from '@/components/dashboard/KPICard';
import AreaChartWidget from '@/components/charts/AreaChart';
import BarChartWidget from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import DataTable from '@/components/dashboard/DataTable';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { useDateRange } from '@/hooks/useDateRange';
import { userKPIs, userGrowthSeries, userGeoDonut, mockUsers } from '@/lib/mockData';
import { formatDate, getStatusColor, getPlanColor, formatNumber } from '@/lib/utils';
import type { UserEntry } from '@/lib/types';
import { Download } from 'lucide-react';

// New vs Returning mock data
const newVsReturning = userGrowthSeries.slice(-7).map(d => ({
  label: d.date,
  new: Math.floor(d.value * 0.3),
  returning: Math.floor(d.value * 0.7),
}));

export default function UsersPage() {
  const { range, selectedOption, setOption } = useDateRange('30d');

  const columns = [
    { key: 'name', label: 'User', sortable: true,
      render: (r: UserEntry) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={r.name} size="sm" />
          <div>
            <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 13.5 }}>{r.name}</div>
            <div style={{ fontSize: 11.5, color: '#475569' }}>{r.email}</div>
          </div>
        </div>
      )},
    { key: 'plan', label: 'Plan', sortable: true,
      render: (r: UserEntry) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getPlanColor(r.plan)}`}>
          {r.plan}
        </span>
      )},
    { key: 'country', label: 'Country', sortable: true },
    { key: 'sessions', label: 'Sessions', sortable: true,
      render: (r: UserEntry) => <span style={{ fontWeight: 600, color: '#6366f1' }}>{r.sessions}</span> },
    { key: 'status', label: 'Status', sortable: true,
      render: (r: UserEntry) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusColor(r.status)}`} style={{ textTransform: 'capitalize' }}>
          {r.status}
        </span>
      )},
    { key: 'signedUp', label: 'Joined', sortable: true,
      render: (r: UserEntry) => <span style={{ color: '#475569' }}>{formatDate(r.signedUp)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className="page-title">User Analytics</h2>
          <p className="page-subtitle">DAU, MAU, growth trends, and user demographics</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DateRangePicker selected={selectedOption} onChange={setOption} />
          <Button variant="primary" size="sm"><Download size={13} />Export</Button>
        </div>
      </div>

      <div className="kpi-grid stagger" style={{ marginBottom: 24 }}>
        {userKPIs.map(k => <KPICard key={k.title} data={k} />)}
      </div>

      <div className="chart-grid-2" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>User Growth</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>MAU over time · {range.label}</div>
          <AreaChartWidget
            data={userGrowthSeries}
            primaryLabel="Active Users"
            formatter={(v) => formatNumber(v, true)}
            height={240}
          />
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>New vs Returning</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Last 7 days</div>
          <BarChartWidget
            data={newVsReturning}
            bars={[
              { key: 'new',       label: 'New',       color: '#6366f1' },
              { key: 'returning', label: 'Returning',  color: '#06b6d4' },
            ]}
            formatter={(v) => formatNumber(v, true)}
            height={240}
          />
        </div>
      </div>

      <div className="chart-grid-3" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>
            Users
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 400, marginLeft: 8 }}>({mockUsers.length} total)</span>
          </div>
          <DataTable
            columns={columns as Parameters<typeof DataTable>[0]['columns']}
            data={mockUsers as unknown as Record<string, unknown>[]}
            rowKey="id"
            searchable
            searchKeys={['name', 'email', 'country'] as never[]}
            pageSize={6}
          />
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Geography</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Users by region</div>
          <DonutChart
            data={userGeoDonut}
            height={240}
            innerRadius={60}
            outerRadius={90}
          />
        </div>
      </div>
    </div>
  );
}
