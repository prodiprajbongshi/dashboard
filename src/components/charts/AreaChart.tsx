'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TimeSeriesPoint } from '@/lib/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
  formatter?: (v: number) => string;
}

function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 13, margin: '2px 0', fontWeight: 600 }}>
          <span style={{ color: '#94a3b8', fontWeight: 400 }}>{p.name}: </span>
          {formatter ? formatter(p.value) : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

interface AreaChartProps {
  data: TimeSeriesPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  formatter?: (v: number) => string;
  height?: number;
}

export default function AreaChartWidget({
  data,
  primaryLabel = 'Current',
  secondaryLabel,
  formatter,
  height = 280,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradSecondary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
          width={60}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {secondaryLabel && (
          <Area
            type="monotone"
            dataKey="secondary"
            name={secondaryLabel}
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#gradSecondary)"
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          name={primaryLabel}
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#gradPrimary)"
          dot={false}
          activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
        />
        {secondaryLabel && <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
