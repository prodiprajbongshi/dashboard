'use client';

import { formatNumber, formatPercent } from '@/lib/utils';
import type { FunnelStage } from '@/lib/types';

interface FunnelChartProps {
  stages: FunnelStage[];
}

export default function FunnelChart({ stages }: FunnelChartProps) {
  const maxWidth = 100;
  const minWidth = 28;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {stages.map((stage, i) => {
        const width = minWidth + (maxWidth - minWidth) * (stage.percentage / 100);
        return (
          <div key={stage.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: stage.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{stage.name}</span>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{formatNumber(stage.value)}</span>
                    <span style={{ fontSize: 12, color: stage.color, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>{formatPercent(stage.percentage)}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                  <div
                    className="funnel-bar"
                    style={{
                      height: '100%',
                      width: `${width}%`,
                      background: `linear-gradient(90deg, ${stage.color}cc, ${stage.color})`,
                      borderRadius: 999,
                      boxShadow: `0 0 10px ${stage.color}60`,
                    }}
                  />
                </div>
              </div>
            </div>
            {i < stages.length - 1 && stage.dropOff > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 40, paddingBottom: 4 }}>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', marginLeft: 13 }} />
                <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>
                  ↓ {stage.dropOff.toFixed(1)}% dropped off
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
