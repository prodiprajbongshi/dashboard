'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { DonutDataPoint } from '@/lib/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DonutDataPoint }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>{item.name}</p>
      <p style={{ color: item.color, fontSize: 15, fontWeight: 700 }}>{item.value.toFixed(1)}%</p>
    </div>
  );
}

interface DonutChartProps {
  data: DonutDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
  centerValue?: string;
}

export default function DonutChart({
  data,
  height = 280,
  innerRadius = 75,
  outerRadius = 110,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: outerRadius * 2 + 20, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.4))', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && centerValue && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{centerValue}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{centerLabel}</div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div style={{ flex: 1, minWidth: 140 }}>
        {data.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
              padding: '6px 10px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0,
              boxShadow: `0 0 8px ${item.color}80`,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: '#cbd5e1', fontWeight: 500 }}>{item.name}</div>
            </div>
            <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 700 }}>{item.value.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
