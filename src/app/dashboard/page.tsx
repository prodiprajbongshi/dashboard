'use client';

import { useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import AreaChartWidget from '@/components/charts/AreaChart';
import DonutChart from '@/components/charts/DonutChart';
import DataTable from '@/components/dashboard/DataTable';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useDateRange } from '@/hooks/useDateRange';
import {
  overviewKPIs, revenueTimeSeries, trafficSourcesDonut,
  mockPageViews, mockActivity,
} from '@/lib/mockData';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { PageViewEntry } from '@/lib/types';

export default function OverviewPage() {
  const { range, selectedOption, setOption } = useDateRange('30d');

  const columns = [
    { key: 'page', label: 'Page', sortable: true,
      render: (row: PageViewEntry) => <span style={{ color: '#6366f1', fontWeight: 500 }}>{row.page}</span> },
    { key: 'views', label: 'Views', sortable: true,
      render: (row: PageViewEntry) => formatNumber(row.views) },
    { key: 'uniqueVisitors', label: 'Unique', sortable: true,
      render: (row: PageViewEntry) => formatNumber(row.uniqueVisitors) },
    { key: 'avgDuration', label: 'Avg. Time', sortable: false },
    { key: 'bounceRate', label: 'Bounce Rate', sortable: true,
      render: (row: PageViewEntry) => (
        <span style={{ color: row.bounceRate > 40 ? '#f59e0b' : '#10b981' }}>
          {row.bounceRate}%
        </span>
      )},
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 className="page-title">Business Overview</h2>
          <p className="page-subtitle">Monitor key metrics and performance across your platform</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <DateRangePicker selected={selectedOption} onChange={setOption} />
          <Button variant="secondary" size="sm">
            <RefreshCw size={13} />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Download size={13} />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid stagger" style={{ marginBottom: 24 }}>
        {overviewKPIs.map((kpi) => (
          <KPICard key={kpi.title} data={kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="chart-grid-3" style={{ marginBottom: 20 }}>
        {/* Revenue Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Revenue Trend</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{range.label}</div>
            </div>
            <Badge variant="success">↑ 12.5%</Badge>
          </div>
          <AreaChartWidget
            data={revenueTimeSeries}
            primaryLabel="Revenue"
            secondaryLabel="Prev. Period"
            formatter={(v) => formatCurrency(v, true)}
            height={240}
          />
        </div>

        {/* Traffic Sources */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Traffic Sources</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>By channel · {range.label}</div>
          <DonutChart
            data={trafficSourcesDonut}
            height={220}
            innerRadius={60}
            outerRadius={90}
            centerLabel="Total"
            centerValue="100%"
          />
        </div>
      </div>

      {/* Table + Activity Row */}
      <div className="chart-grid-3" style={{ marginBottom: 20 }}>
        {/* Top Pages Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Top Pages</div>
          <DataTable
            columns={columns as Parameters<typeof DataTable>[0]['columns']}
            data={mockPageViews as unknown as Record<string, unknown>[]}
            rowKey="page"
            pageSize={5}
          />
        </div>

        {/* Activity Feed */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Recent Activity</div>
            <Badge variant="info">{mockActivity.length} events</Badge>
          </div>
          <ActivityFeed items={mockActivity} />
        </div>
      </div>
    </div>
  );
}
