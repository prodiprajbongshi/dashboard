'use client';

import KPICard from '@/components/dashboard/KPICard';
import AreaChartWidget from '@/components/charts/AreaChart';
import BarChartWidget from '@/components/charts/BarChart';
import LineChartWidget from '@/components/charts/LineChart';
import DataTable from '@/components/dashboard/DataTable';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useDateRange } from '@/hooks/useDateRange';
import { revenueKPIs, revenueTimeSeries, revenueByPlan, churnSeries, mockRevenueEntries } from '@/lib/mockData';
import { formatCurrency, formatDate, getStatusColor, getPlanColor } from '@/lib/utils';
import type { RevenueEntry } from '@/lib/types';
import { Download } from 'lucide-react';

export default function RevenuePage() {
  const { range, selectedOption, setOption } = useDateRange('30d');

  const columns = [
    { key: 'customer', label: 'Customer', sortable: true,
      render: (r: RevenueEntry) => <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{r.customer}</span> },
    { key: 'plan', label: 'Plan', sortable: true,
      render: (r: RevenueEntry) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getPlanColor(r.plan)}`}>
          {r.plan}
        </span>
      )},
    { key: 'mrr', label: 'MRR', sortable: true,
      render: (r: RevenueEntry) => <span style={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(r.mrr)}</span> },
    { key: 'status', label: 'Status', sortable: true,
      render: (r: RevenueEntry) => (
        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${getStatusColor(r.status)}`} style={{ textTransform: 'capitalize' }}>
          {r.status}
        </span>
      )},
    { key: 'country', label: 'Country', sortable: true },
    { key: 'startDate', label: 'Since', sortable: true,
      render: (r: RevenueEntry) => <span style={{ color: '#475569' }}>{formatDate(r.startDate)}</span> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className="page-title">Revenue Analytics</h2>
          <p className="page-subtitle">Track MRR, ARR, churn, and plan-level breakdown</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DateRangePicker selected={selectedOption} onChange={setOption} />
          <Button variant="primary" size="sm"><Download size={13} />Export CSV</Button>
        </div>
      </div>

      <div className="kpi-grid stagger" style={{ marginBottom: 24 }}>
        {revenueKPIs.map(k => <KPICard key={k.title} data={k} />)}
      </div>

      <div className="chart-grid-2" style={{ marginBottom: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Revenue vs Prev Period</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{range.label}</div>
            </div>
            <Badge variant="success">+9.3% MoM</Badge>
          </div>
          <AreaChartWidget
            data={revenueTimeSeries}
            primaryLabel="Current"
            secondaryLabel="Previous"
            formatter={(v) => formatCurrency(v, true)}
            height={260}
          />
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Revenue by Plan</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Monthly breakdown</div>
          <BarChartWidget
            data={revenueByPlan}
            bars={[
              { key: 'enterprise', label: 'Enterprise', color: '#6366f1' },
              { key: 'pro',        label: 'Pro',        color: '#06b6d4' },
              { key: 'free',       label: 'Free',       color: '#334155' },
            ]}
            formatter={(v) => formatCurrency(v, true)}
            height={260}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Churn Rate</div>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Monthly churn rate (%) — lower is better</div>
        <LineChartWidget
          data={churnSeries}
          lines={[{ key: 'value', label: 'Churn %', color: '#ef4444' }]}
          formatter={(v) => `${v.toFixed(1)}%`}
          height={200}
        />
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Revenue by Customer</div>
        <DataTable
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          data={mockRevenueEntries as unknown as Record<string, unknown>[]}
          rowKey="id"
          searchable
          searchKeys={['customer', 'plan', 'country'] as never[]}
          pageSize={8}
        />
      </div>
    </div>
  );
}
