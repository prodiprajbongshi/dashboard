'use client';

import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineConfig {
  key: 'value' | 'secondary' | 'tertiary';
  label: string;
  color: string;
  dashed?: boolean;
}

interface LineChartProps {
  data: TimeSeriesPoint[];
  lines: LineConfig[];
  formatter?: (v: number) => string;
  height?: number;
}

export default function LineChartWidget({ data, lines, formatter, height = 280 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#475569', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatter}
          width={55}
        />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color}
            strokeWidth={2.5}
            dot={false}
            strokeDasharray={line.dashed ? '6 3' : undefined}
            activeDot={{ r: 5, fill: line.color, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
