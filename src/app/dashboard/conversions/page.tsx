'use client';

import FunnelChart from '@/components/charts/FunnelChart';
import LineChartWidget from '@/components/charts/LineChart';
import DateRangePicker from '@/components/dashboard/DateRangePicker';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useDateRange } from '@/hooks/useDateRange';
import { funnelStages, funnelTrendSeries } from '@/lib/mockData';
import { formatNumber, formatPercent } from '@/lib/utils';
import { Download, ArrowRight } from 'lucide-react';

export default function ConversionsPage() {
  const { range, selectedOption, setOption } = useDateRange('30d');
  const overall = funnelStages[funnelStages.length - 1];

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 className="page-title">Conversion Funnel</h2>
          <p className="page-subtitle">Visualize your visitor-to-customer journey and optimize drop-off points</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DateRangePicker selected={selectedOption} onChange={setOption} />
          <Button variant="primary" size="sm"><Download size={13} />Export</Button>
        </div>
      </div>

      {/* Stage KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {funnelStages.map((stage, i) => (
          <div key={stage.name} className="glass-card glass-card-lift" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Stage {i + 1}
            </div>
            <div style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 6 }}>{stage.name}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>
              {formatNumber(stage.value, true)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '3px 8px',
                borderRadius: 999,
                background: `${stage.color}22`,
                border: `1px solid ${stage.color}44`,
                fontSize: 12,
                fontWeight: 700,
                color: stage.color,
              }}>
                {formatPercent(stage.percentage)}
              </div>
              <span style={{ fontSize: 11, color: '#475569' }}>of visits</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid-2" style={{ marginBottom: 20 }}>
        {/* Funnel */}
        <div className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Conversion Funnel</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{range.label}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#475569' }}>Overall rate</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
                {formatPercent(overall.percentage)}
              </div>
            </div>
          </div>
          <FunnelChart stages={funnelStages} />
        </div>

        {/* Funnel Trend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Conversion Rate Trends</div>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Monthly rates by stage (%)</div>
          <LineChartWidget
            data={funnelTrendSeries}
            lines={[
              { key: 'value',     label: 'Visit → Paid',    color: '#10b981' },
              { key: 'secondary', label: 'Visit → Trial',   color: '#6366f1' },
              { key: 'tertiary',  label: 'Visit → Signup',  color: '#06b6d4', dashed: true },
            ]}
            formatter={(v) => `${v.toFixed(1)}%`}
            height={300}
          />
        </div>
      </div>

      {/* Stage Breakdown Table */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 20 }}>Stage Breakdown</div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Users</th>
                <th>Conversion Rate</th>
                <th>Drop-Off</th>
                <th>Progress</th>
                <th>Next Stage</th>
              </tr>
            </thead>
            <tbody>
              {funnelStages.map((stage, i) => (
                <tr key={stage.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${stage.color}22`, border: `1.5px solid ${stage.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: stage.color }}>
                        {i + 1}
                      </div>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{stage.name}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{formatNumber(stage.value)}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: stage.color }}>{formatPercent(stage.percentage)}</span>
                  </td>
                  <td>
                    {stage.dropOff > 0
                      ? <span style={{ color: '#ef4444', fontWeight: 600 }}>-{formatPercent(stage.dropOff)}</span>
                      : <span style={{ color: '#475569' }}>—</span>}
                  </td>
                  <td style={{ width: 160 }}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${stage.percentage}%`, height: '100%', background: stage.color, borderRadius: 999 }} />
                    </div>
                  </td>
                  <td>
                    {i < funnelStages.length - 1 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12 }}>
                        <ArrowRight size={12} />
                        {funnelStages[i + 1].name}
                      </div>
                    ) : (
                      <Badge variant="success">✓ Converted</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
