'use client';

import { useMemo, useState } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  rowKey: keyof T | string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortKey as keyof T];
      const bValue = b[sortKey as keyof T];

      if (aValue === bValue) {
        return 0;
      }

      if (aValue === undefined || aValue === null) {
        return 1;
      }

      if (bValue === undefined || bValue === null) {
        return -1;
      }

      if (
        typeof aValue === 'number' &&
        typeof bValue === 'number'
      ) {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      const aString = String(aValue);
      const bString = String(bValue);

      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, sortKey, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / pageSize)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedData = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * pageSize;

    return sortedData.slice(
      start,
      start + pageSize
    );
  }, [
    sortedData,
    safeCurrentPage,
    pageSize,
  ]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) {
      return;
    }

    const key = column.key;

    if (sortKey === key) {
      setSortDirection((previous) =>
        previous === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }

    setCurrentPage(1);
  };

  const getRowKey = (
    row: T,
    index: number
  ): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }

    const value = row[rowKey];

    if (
      value !== undefined &&
      value !== null
    ) {
      return String(value);
    }

    return index;
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          borderRadius: 10,
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 500,
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted =
                  sortKey === column.key;

                return (
                  <th
                    key={String(column.key)}
                    onClick={() =>
                      handleSort(column)
                    }
                    style={{
                      padding: '12px 14px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom:
                        '1px solid rgba(255,255,255,0.06)',
                      cursor: column.sortable
                        ? 'pointer'
                        : 'default',
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {column.label}

                      {column.sortable && (
                        <span
                          style={{
                            fontSize: 10,
                            opacity: isSorted
                              ? 1
                              : 0.35,
                          }}
                        >
                          {isSorted
                            ? sortDirection ===
                              'asc'
                              ? '▲'
                              : '▼'
                            : '↕'}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(
                (row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    style={{
                      borderBottom:
                        '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        style={{
                          padding: '14px',
                          fontSize: 13,
                          color: '#cbd5e1',
                          verticalAlign:
                            'middle',
                        }}
                      >
                        {column.render
                          ? column.render(row)
                          : String(
                              row[
                                column.key as keyof T
                              ] ?? ''
                            )}
                      </td>
                    ))}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: 30,
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: 13,
                  }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedData.length > pageSize && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: '#64748b',
            }}
          >
            Showing{' '}
            {Math.min(
              (safeCurrentPage - 1) *
                pageSize +
                1,
              sortedData.length
            )}{' '}
            -{' '}
            {Math.min(
              safeCurrentPage * pageSize,
              sortedData.length
            )}{' '}
            of {sortedData.length}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={safeCurrentPage === 1}
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.03)',
                color:
                  safeCurrentPage === 1
                    ? '#475569'
                    : '#cbd5e1',
                cursor:
                  safeCurrentPage === 1
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Previous
            </button>

            <span
              style={{
                fontSize: 12,
                color: '#94a3b8',
                padding: '0 6px',
              }}
            >
              {safeCurrentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
                )
              }
              disabled={
                safeCurrentPage === totalPages
              }
              style={{
                padding: '6px 10px',
                borderRadius: 6,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.03)',
                color:
                  safeCurrentPage === totalPages
                    ? '#475569'
                    : '#cbd5e1',
                cursor:
                  safeCurrentPage === totalPages
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}