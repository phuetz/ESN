import React from 'react';
import { 
  ChevronDown, ChevronUp, Download, Filter, 
  SortAsc, SortDesc, X 
} from 'lucide-react';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  type?: string;
  cellRenderer?: (value: any, row: any) => React.ReactNode;
}

interface DataGridProps {
  clients: any[];
  columns: Column[];
  title?: string;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  enableSelection?: boolean;
  enableExport?: boolean;
  enableGrouping?: boolean;
  enableDragToGroup?: boolean;
  pageSize?: number;
  height?: string;
  onRowClick?: (row: any) => void;
  actionButtons?: {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
  }[];
  defaultGroupedColumns?: string[];
}

const DataGridESN: React.FC<DataGridProps> = ({
  clients = [],
  columns,
  title,
  enableFiltering = true,
  enableSorting = true,
  enableSelection = false,
  enableExport = true,
  enableGrouping = false,
  enableDragToGroup = false,
  pageSize = 10,
  height = "500px",
  onRowClick,
  actionButtons = [],
  defaultGroupedColumns = []
}) => {
  return (
    <div className="w-full">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center mb-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        
        <div className="flex items-center gap-2">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Grid table */}
      <div className="border rounded-lg overflow-hidden bg-white" style={{ height }}>
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                    style={{ width: column.width }}
                  >
                    {column.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm"
                    >
                      {column.cellRenderer 
                        ? column.cellRenderer(row[column.field], row)
                        : row[column.field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataGridESN;