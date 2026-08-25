'use client';

import KPICard from '@/components/dashboard/KPICard';
import AreaChartWidget from '@/components/charts/AreaChart';
import BarChartWidget from '@/components/charts/BarChart';
import DonutChart from '@/components/charts/DonutChart';
import DataTable from '@/components/dashboard/DataTable';
import type { DataTableProps } from '@/components/dashboard/DataTable';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import Button from '@/components/ui/Button';

import { useDateRange } from '@/hooks/useDateRange';

import {
  trafficKPIs,
  sessionTimeSeries,
  deviceBreakdownDonut,
  trafficByChannel,
  mockPageViews,
  mockReferrers,
} from '@/lib/mockData';

import {
  formatNumber,
  formatPercent,
} from '@/lib/utils';

import type {
  PageViewEntry,
  ReferrerEntry,
} from '@/lib/types';

import {
  TrendingUp,
  TrendingDown,
  Download,
} from 'lucide-react';

export default function TrafficPage() {
  const {
    range,
    selectedOption,
    setOption,
  } = useDateRange('30d');

  const pageColumns: DataTableProps<PageViewEntry>['columns'] = [
    {
      key: 'page',
      label: 'Page',
      sortable: true,

      render: (r: PageViewEntry) => (
        <span
          style={{
            color: '#6366f1',
            fontWeight: 500,
          }}
        >
          {r.page}
        </span>
      ),
    },

    {
      key: 'views',
      label: 'Pageviews',
      sortable: true,

      render: (r: PageViewEntry) =>
        formatNumber(r.views),
    },

    {
      key: 'uniqueVisitors',
      label: 'Unique',
      sortable: true,

      render: (r: PageViewEntry) =>
        formatNumber(r.uniqueVisitors),
    },

    {
      key: 'avgDuration',
      label: 'Duration',
      sortable: true,

      render: (r: PageViewEntry) =>
        r.avgDuration,
    },

    {
      key: 'bounceRate',
      label: 'Bounce %',
      sortable: true,

      render: (r: PageViewEntry) => (
        <span
          style={{
            color:
              r.bounceRate > 40
                ? '#f59e0b'
                : '#10b981',

            fontWeight: 600,
          }}
        >
          {r.bounceRate}%
        </span>
      ),
    },
  ];

  const refColumns: DataTableProps<ReferrerEntry>['columns'] = [
    {
      key: 'source',
      label: 'Source',
      sortable: true,

      render: (r: ReferrerEntry) => (
        <span
          style={{
            fontWeight: 600,
            color: '#e2e8f0',
          }}
        >
          {r.source}
        </span>
      ),
    },

    {
      key: 'sessions',
      label: 'Sessions',
      sortable: true,

      render: (r: ReferrerEntry) =>
        formatNumber(r.sessions),
    },

    {
      key: 'percentage',
      label: 'Share',
      sortable: true,

      render: (r: ReferrerEntry) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 60,
              height: 6,
              background:
                'rgba(255,255,255,0.06)',
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: `${r.percentage}%`,
                height: '100%',
                background: '#6366f1',
                borderRadius: 999,
              }}
            />
          </div>

          <span>
            {formatPercent(r.percentage)}
          </span>
        </div>
      ),
    },

    {
      key: 'change',
      label: '∆ Change',
      sortable: true,

      render: (r: ReferrerEntry) => (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color:
              r.change >= 0
                ? '#10b981'
                : '#ef4444',
            fontWeight: 600,
          }}
        >
          {r.change >= 0 ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}

          {r.change >= 0 ? '+' : ''}
          {r.change}%
        </span>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h2 className="page-title">
            Traffic Analytics
          </h2>

          <p className="page-subtitle">
            Sessions, pageviews, device breakdown,
            and top referrers
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <DateRangePicker
            selected={selectedOption}
            onChange={setOption}
          />

          <Button
            variant="primary"
            size="sm"
          >
            <Download size={13} />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        className="kpi-grid stagger"
        style={{
          marginBottom: 24,
        }}
      >
        {trafficKPIs.map((k) => (
          <KPICard
            key={k.title}
            data={k}
          />
        ))}
      </div>

      {/* Charts */}
      <div
        className="chart-grid-2"
        style={{
          marginBottom: 20,
        }}
      >
        {/* Sessions */}
        <div
          className="glass-card"
          style={{
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 4,
            }}
          >
            Sessions Over Time
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#475569',
              marginBottom: 20,
            }}
          >
            {range.label}
          </div>

          <AreaChartWidget
            data={sessionTimeSeries}
            primaryLabel="Sessions"
            secondaryLabel="Prev. Period"
            formatter={(v) =>
              formatNumber(v, true)
            }
            height={240}
          />
        </div>

        {/* Traffic Channel */}
        <div
          className="glass-card"
          style={{
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 4,
            }}
          >
            Traffic by Channel
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#475569',
              marginBottom: 20,
            }}
          >
            Monthly breakdown
          </div>

          <BarChartWidget
            data={trafficByChannel}
            bars={[
              {
                key: 'organic',
                label: 'Organic',
                color: '#6366f1',
              },
              {
                key: 'direct',
                label: 'Direct',
                color: '#06b6d4',
              },
              {
                key: 'social',
                label: 'Social',
                color: '#8b5cf6',
              },
              {
                key: 'email',
                label: 'Email',
                color: '#10b981',
              },
            ]}
            formatter={(v) =>
              formatNumber(v, true)
            }
            height={240}
          />
        </div>
      </div>

      {/* Referrers + Device */}
      <div
        className="chart-grid-3"
        style={{
          marginBottom: 20,
        }}
      >
        {/* Top Referrers */}
        <div
          className="glass-card"
          style={{
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 20,
            }}
          >
            Top Referrers
          </div>

          <DataTable<ReferrerEntry>
            columns={refColumns}
            data={mockReferrers}
            rowKey="source"
            pageSize={5}
          />
        </div>

        {/* Device Breakdown */}
        <div
          className="glass-card"
          style={{
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 4,
            }}
          >
            Device Breakdown
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#475569',
              marginBottom: 20,
            }}
          >
            Desktop / Mobile / Tablet
          </div>

          <DonutChart
            data={deviceBreakdownDonut}
            height={240}
            innerRadius={65}
            outerRadius={95}
          />
        </div>
      </div>

      {/* Top Pages */}
      <div
        className="glass-card"
        style={{
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 20,
          }}
        >
          Top Pages
        </div>

        <DataTable<PageViewEntry>
          columns={pageColumns}
          data={mockPageViews}
          rowKey="page"
          pageSize={8}
        />
      </div>
    </div>
  );
}