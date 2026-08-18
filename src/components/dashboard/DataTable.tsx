'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T;
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  pageSize?: number;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  searchable = false,
  searchKeys = [],
  pageSize = 10,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Filter
  const filtered = searchable && search
    ? data.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = String(a[sortKey as keyof T] ?? '');
        const bVal = String(b[sortKey as keyof T] ?? '');
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div>
      {searchable && (
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="form-input"
            style={{ paddingLeft: 34, fontSize: 13 }}
          />
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: col.width, cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && (
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <ChevronUp size={10} color={sortKey === col.key && sortDir === 'asc' ? '#6366f1' : '#334155'} />
                        <ChevronDown size={10} color={sortKey === col.key && sortDir === 'desc' ? '#6366f1' : '#334155'} style={{ marginTop: -2 }} />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px 16px', color: '#475569' }}>
                  No results found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={String(row[rowKey])}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 12, color: '#475569' }}>
            {filtered.length} results · Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    background: page === p ? '#6366f1' : 'rgba(255,255,255,0.06)',
                    color: page === p ? '#fff' : '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
