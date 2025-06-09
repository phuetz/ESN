import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Filter, SlidersHorizontal, Download, Plus, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

interface Column {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  type?: 'string' | 'number' | 'date';
  multiValue?: boolean;
  disableGrouping?: boolean;
  disableFiltering?: boolean;
  disableSorting?: boolean;
  editable?: boolean;
  cellRenderer?: (value: any, row: any) => React.ReactNode;
}

interface DataGridProps {
  data: any[];
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
  onSelectionChange?: (selectedItems: any[]) => void;
  onCellEdit?: (rowId: string | number, field: string, value: any) => void;
  actionButtons?: {
    icon: React.ReactNode;
    onClick: () => void;
    title: string;
  }[];
  defaultGroupedColumns?: string[];
}

const DataGridESN: React.FC<DataGridProps> = ({
  data = [],
  columns = [],
  title = "Tableau de données",
  enableFiltering = true,
  enableSorting = true,
  enableExport = true,
  enableSelection = true,
  enableGrouping = false,
  enableDragToGroup = false,
  pageSize = 10,
  height = "600px",
  onRowClick = null,
  onSelectionChange = null,
  onCellEdit = null,
  actionButtons = [],
  defaultGroupedColumns = []
}) => {
  // États
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState(data);
  const [displayedData, setDisplayedData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' | 'none' }>({ 
    key: null, 
    direction: 'none' 
  });
  const [filters, setFilters] = useState<Record<string, { value: any; operator: string }>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [groupByColumns, setGroupByColumns] = useState<string[]>(defaultGroupedColumns || []);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [allGroupsExpanded, setAllGroupsExpanded] = useState(true);
  const [draggingColumn, setDraggingColumn] = useState<{ field: string; headerName: string } | null>(null);
  const [groupZoneHighlighted, setGroupZoneHighlighted] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.field));

  const tableRef = useRef<HTMLDivElement>(null);

  // Mise à jour des données lorsque les props changent
  useEffect(() => {
    setTableData(data);
    setFilteredData(data);
  }, [data]);

  // Gestion du tri
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | 'none' = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = 'none';
      }
    }
    
    setSortConfig({ key, direction });
    
    if (direction === 'none') {
      setFilteredData([...tableData]);
      return;
    }
    
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] === null || a[key] === undefined) return direction === 'asc' ? -1 : 1;
      if (b[key] === null || b[key] === undefined) return direction === 'asc' ? 1 : -1;
      
      if (typeof a[key] === 'string') {
        return direction === 'asc' 
          ? a[key].localeCompare(b[key], 'fr', { sensitivity: 'base' })
          : b[key].localeCompare(a[key], 'fr', { sensitivity: 'base' });
      }
      
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });
    
    setFilteredData(sortedData);
  };

  // Gestion des filtres
  const handleFilterChange = (key: string, value: string, operator = 'contains') => {
    const newFilters = { ...filters };
    
    if (value && value.trim() !== '') {
      newFilters[key] = { value: value.trim(), operator };
    } else {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    applyFilters(tableData, newFilters);
    setCurrentPage(1);
  };

  // Application des filtres
  const applyFilters = (data: any[], currentFilters = filters) => {
    if (Object.keys(currentFilters).length === 0) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(row => {
      return Object.entries(currentFilters).every(([key, filterConfig]) => {
        const { value, operator } = filterConfig;
        if (!value) return true;
        
        const cellValue = row[key];
        if (cellValue === null || cellValue === undefined) return false;
        
        switch (operator) {
          case 'contains':
            return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          case 'equals':
            return String(cellValue).toLowerCase() === String(value).toLowerCase();
          case 'startsWith':
            return String(cellValue).toLowerCase().startsWith(String(value).toLowerCase());
          default:
            return true;
        }
      });
    });
    
    setFilteredData(filtered);
  };

  // Gestion de la sélection
  const toggleRowSelection = (rowId: string | number) => {
    const newSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter(id => id !== rowId)
      : [...selectedRows, rowId];
    
    setSelectedRows(newSelectedRows);
    
    if (onSelectionChange) {
      const selectedItems = tableData.filter(row => newSelectedRows.includes(row.id));
      onSelectionChange(selectedItems);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = columns.map(col => col.headerName).join(',');
    const rows = filteredData.map(row => {
      return columns.map(col => {
        const value = row[col.field] || '';
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
    }).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mise à jour des données affichées selon la pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedData(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* En-tête avec titre et actions */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        
        <div className="flex gap-2">
          {enableFiltering && (
            <button 
              className="p-2 rounded hover:bg-gray-200 text-gray-600"
              onClick={() => setFilters({})}
              title="Réinitialiser les filtres"
            >
              <Filter size={18} className={Object.keys(filters).length > 0 ? "text-blue-500" : ""} />
            </button>
          )}
          
          {enableExport && (
            <button 
              className="p-2 rounded hover:bg-gray-200 text-gray-600"
              onClick={exportToCSV}
              title="Exporter en CSV"
            >
              <Download size={18} />
            </button>
          )}
          
          {actionButtons.map((button, index) => (
            <button
              key={index}
              className="p-2 rounded hover:bg-gray-200 text-gray-600"
              onClick={button.onClick}
              title={button.title}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div 
        ref={tableRef}
        className="overflow-auto"
        style={{ height }}
      >
        <table className="w-full border-collapse table-auto">
          <thead className="bg-gray-50">
            <tr>
              {enableSelection && (
                <th className="p-3 border-b">
                  <input 
                    type="checkbox"
                    checked={selectedRows.length === displayedData.length && displayedData.length > 0}
                    onChange={() => {
                      const allIds = displayedData.map(row => row.id);
                      if (selectedRows.length === displayedData.length) {
                        setSelectedRows([]);
                        if (onSelectionChange) onSelectionChange([]);
                      } else {
                        setSelectedRows(allIds);
                        if (onSelectionChange) onSelectionChange(displayedData);
                      }
                    }}
                    className="w-4 h-4"
                  />
                </th>
              )}
              
              {columns.filter(column => visibleColumns.includes(column.field)).map((column) => (
                <th 
                  key={column.field}
                  className="p-3 text-left border-b font-semibold text-gray-700"
                  style={{ width: columnWidths[column.field] || column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.headerName}</span>
                    
                    <div className="flex items-center ml-auto">
                      {enableSorting && !column.disableSorting && (
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={() => handleSort(column.field)}
                        >
                          {sortConfig.key === column.field ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <SlidersHorizontal size={14} className="text-gray-400" />
                          )}
                        </button>
                      )}
                      
                      {enableFiltering && !column.disableFiltering && (
                        <button
                          className="p-1 rounded hover:bg-gray-200"
                          onClick={() => setOpenFilterColumn(openFilterColumn === column.field ? null : column.field)}
                        >
                          <Filter 
                            size={14} 
                            className={filters[column.field] ? "text-blue-500" : "text-gray-400"} 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {openFilterColumn === column.field && (
                    <div className="absolute mt-1 bg-white border rounded shadow-lg p-2 z-20">
                      <input
                        type="text"
                        placeholder={`Filtrer ${column.headerName.toLowerCase()}...`}
                        value={filters[column.field]?.value || ''}
                        onChange={(e) => handleFilterChange(column.field, e.target.value)}
                        className="w-full p-2 border rounded"
                        autoFocus
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {displayedData.map((row) => (
              <tr 
                key={row.id}
                className={`border-b hover:bg-gray-50 ${
                  selectedRows.includes(row.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {enableSelection && (
                  <td className="p-3">
                    <input 
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4"
                    />
                  </td>
                )}
                
                {columns.filter(column => visibleColumns.includes(column.field)).map((column) => (
                  <td 
                    key={`${row.id}-${column.field}`}
                    className="p-3"
                  >
                    {column.cellRenderer ? column.cellRenderer(row[column.field], row) : row[column.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center bg-gray-50">
        <div className="text-sm text-gray-600">
          Affichage de {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} à {Math.min(currentPage * pageSize, filteredData.length)} sur {filteredData.length} éléments
        </div>
        
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Précédent
          </button>
          
          {Array.from({ length: Math.ceil(filteredData.length / pageSize) }, (_, i) => i + 1)
            .filter(page => {
              const maxPages = 5;
              const totalPages = Math.ceil(filteredData.length / pageSize);
              
              if (totalPages <= maxPages) return true;
              if (page === 1 || page === totalPages) return true;
              if (page >= currentPage - 1 && page <= currentPage + 1) return true;
              
              return false;
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-3 py-1">...</span>
                )}
                <button
                  className={`px-3 py-1 rounded border ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          
          <button
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
            disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGridESN;