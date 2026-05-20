import React from 'react';

interface TableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
  }>;
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  striped?: boolean;
}

export function Table<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar',
  striped = true,
}: TableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-700 ${alignClass[col.align || 'left']}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-8 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`${striped && idx % 2 === 0 ? 'bg-slate-50' : ''} hover:bg-slate-50 transition-colors cursor-pointer`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-8 py-4 text-slate-900 font-medium ${alignClass[col.align || 'left']}`}
                  >
                    {col.render ? col.render(row[col.key as keyof T], row) : String(row[col.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
