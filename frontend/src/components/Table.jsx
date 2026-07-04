import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './Form';
const Table = ({
  headers = [],
  data = [],
  loading = false,
  searchPlaceholder = 'Search records...',
  searchKey = '',
  emptyMessage = 'No records found.',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Filter data locally if a searchKey is provided
  const filteredData = data.filter((row) => {
    if (!searchKey || !searchTerm) return true;
    const value = row[searchKey];
    if (!value) return false;
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      {searchKey && (
        <div className="max-w-xs self-start w-full">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            icon={<Search size={16} />}
          />
        </div>
      )}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              {headers.map((h, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-800/60 last:border-0">
                  {headers.map((_, hIdx) => (
                    <td key={hIdx} className="px-6 py-4">
                      <div className="h-4 bg-slate-800/60 rounded animate-pulse w-24"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-12 text-center text-sm text-slate-500 font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition-colors"
                >
                  {headers.map((h, hIdx) => (
                    <td key={hIdx} className="px-6 py-4 text-sm font-medium text-slate-300">
                      {h.render ? h.render(row[h.key], row) : row[h.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Table;
