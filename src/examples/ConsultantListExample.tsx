import React, { useEffect, useState } from 'react';
import { useConsultants } from '../hooks/useConsultants';
import { useConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { TableSkeleton } from '../components/ui/Skeleton';
import { Consultant } from '../types';
import { formatDate, formatCurrency } from '../utils/format';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

/**
 * Example component demonstrating how to use the useConsultants hook
 * with pagination, search, and CRUD operations
 */
export const ConsultantListExample: React.FC = () => {
  const {
    consultants,
    loading,
    pagination,
    fetchConsultants,
    createConsultant,
    updateConsultant,
    deleteConsultant,
  } = useConsultants();

  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Fetch consultants on mount and when filters change
  useEffect(() => {
    fetchConsultants({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
    });
  }, [currentPage, searchQuery, statusFilter, fetchConsultants]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (consultant: Consultant) => {
    const confirmed = await confirm(
      'Delete Consultant',
      `Are you sure you want to delete ${consultant.firstName} ${consultant.lastName}?`,
      { variant: 'danger', confirmText: 'Delete' }
    );

    if (confirmed) {
      await deleteConsultant(consultant.id);
    }
  };

  const handleEdit = async (consultant: Consultant) => {
    // Example: Update consultant status
    await updateConsultant(consultant.id, {
      ...consultant,
      status: consultant.status === 'active' ? 'bench' : 'active',
    });
  };

  return (
    <div className="p-6">
      <ConfirmDialog />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consultants</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Example: Create new consultant
            createConsultant({
              firstName: 'New',
              lastName: 'Consultant',
              role: 'Developer',
              status: 'active',
              experience: 0,
            });
          }}
        >
          <Plus size={20} />
          Add Consultant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search consultants..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="bench">Bench</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daily Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                        {consultant.firstName[0]}
                        {consultant.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {consultant.firstName} {consultant.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{consultant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consultant.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        consultant.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : consultant.status === 'bench'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {consultant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultant.experience} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultant.dailyRate ? formatCurrency(consultant.dailyRate) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(consultant)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(consultant)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {consultants.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No consultants found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultantListExample;
