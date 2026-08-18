'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import type { DateRangeOption } from '@/lib/types';

const OPTIONS: { value: DateRangeOption; label: string }[] = [
  { value: '7d',  label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y',  label: 'Last 12 months' },
];

interface DateRangePickerProps {
  selected: DateRangeOption;
  onChange: (v: DateRangeOption) => void;
}

export default function DateRangePicker({ selected, onChange }: DateRangePickerProps) {
  const current = OPTIONS.find(o => o.value === selected);

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        fontSize: 13,
        color: '#94a3b8',
      }}>
        <Calendar size={13} />
        <span>{current?.label ?? 'Select range'}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            id={`date-range-${opt.value}`}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '7px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 600,
              transition: 'all 0.15s',
              background: selected === opt.value ? '#6366f1' : 'rgba(255,255,255,0.05)',
              color: selected === opt.value ? '#fff' : '#64748b',
              boxShadow: selected === opt.value ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {opt.value === '1y' ? '1Y' : opt.value.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
