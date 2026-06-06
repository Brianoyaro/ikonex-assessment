import React from 'react';

const Table = ({ headers, rows, actions, columns, data, onEdit, onDelete }) => {
  // Support both formats: simple (headers/rows) and complex (columns/data)
  const headersList = headers || (columns?.map(col => col.label) || []);
  const rowsData = rows || data || [];
  
  const renderCell = (row, key) => {
    const value = row[key];
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {headersList.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {typeof header === 'string' ? header : header.label}
              </th>
            ))}
            {(actions || onEdit || onDelete) && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rowsData.length === 0 ? (
            <tr>
              <td
                colSpan={headersList.length + (actions || onEdit || onDelete ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            rowsData.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {columns ? (
                  columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderCell(row, col.key)}
                    </td>
                  ))
                ) : (
                  Array.isArray(row) ? (
                    row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cell}
                      </td>
                    ))
                  ) : (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {JSON.stringify(row)}
                    </td>
                  )
                )}
                {(actions || onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {actions ? actions(row, rowIdx) : (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
