import { useState, useEffect, useCallback } from 'react';
import apiClient, { ApiResponse } from '../services/apiClient';
import { Consultant, PaginationParams, FilterParams } from '../types';
import { useToast } from '../components/ui/Toast';

interface UseConsultantsResult {
  consultants: Consultant[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchConsultants: (params?: PaginationParams & FilterParams) => Promise<void>;
  createConsultant: (data: Partial<Consultant>) => Promise<Consultant | null>;
  updateConsultant: (id: number, data: Partial<Consultant>) => Promise<Consultant | null>;
  deleteConsultant: (id: number) => Promise<boolean>;
  getConsultantById: (id: number) => Promise<Consultant | null>;
}

export const useConsultants = (): UseConsultantsResult => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const { showToast } = useToast();

  const fetchConsultants = useCallback(
    async (params?: PaginationParams & FilterParams) => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Consultant[]> = await apiClient.get(
          '/consultants',
          { params }
        );

        if (response.success && response.data) {
          setConsultants(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch consultants';
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const createConsultant = useCallback(
    async (data: Partial<Consultant>): Promise<Consultant | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Consultant> = await apiClient.post(
          '/consultants',
          data
        );

        if (response.success && response.data) {
          showToast('Consultant created successfully', 'success');
          // Refresh the list
          await fetchConsultants();
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create consultant';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast, fetchConsultants]
  );

  const updateConsultant = useCallback(
    async (id: number, data: Partial<Consultant>): Promise<Consultant | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Consultant> = await apiClient.put(
          `/consultants/${id}`,
          data
        );

        if (response.success && response.data) {
          showToast('Consultant updated successfully', 'success');
          // Update the local list
          setConsultants((prev) =>
            prev.map((c) => (c.id === id ? response.data! : c))
          );
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update consultant';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const deleteConsultant = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.delete(`/consultants/${id}`);

        if (response.success) {
          showToast('Consultant deleted successfully', 'success');
          // Remove from local list
          setConsultants((prev) => prev.filter((c) => c.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete consultant';
        setError(message);
        showToast(message, 'error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const getConsultantById = useCallback(
    async (id: number): Promise<Consultant | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Consultant> = await apiClient.get(
          `/consultants/${id}`
        );

        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch consultant';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  return {
    consultants,
    loading,
    error,
    pagination,
    fetchConsultants,
    createConsultant,
    updateConsultant,
    deleteConsultant,
    getConsultantById,
  };
};
