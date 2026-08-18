'use client';

import { useState, useMemo } from 'react';
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import type { DateRange, DateRangeOption } from '@/lib/types';

function buildRange(option: DateRangeOption): DateRange {
  const now = new Date();
  switch (option) {
    case '7d':
      return { from: startOfDay(subDays(now, 6)), to: endOfDay(now), label: 'Last 7 days' };
    case '30d':
      return { from: startOfDay(subDays(now, 29)), to: endOfDay(now), label: 'Last 30 days' };
    case '90d':
      return { from: startOfDay(subDays(now, 89)), to: endOfDay(now), label: 'Last 90 days' };
    case '1y':
      return { from: startOfDay(subYears(now, 1)), to: endOfDay(now), label: 'Last 12 months' };
    default:
      return { from: startOfDay(subMonths(now, 1)), to: endOfDay(now), label: 'Last 30 days' };
  }
}

export function useDateRange(defaultOption: DateRangeOption = '30d') {
  const [selectedOption, setSelectedOption] = useState<DateRangeOption>(defaultOption);
  const [customRange, setCustomRange] = useState<DateRange | null>(null);

  const range = useMemo<DateRange>(() => {
    if (selectedOption === 'custom' && customRange) return customRange;
    return buildRange(selectedOption);
  }, [selectedOption, customRange]);

  return {
    range,
    selectedOption,
    setOption: setSelectedOption,
    setCustomRange,
  };
}
