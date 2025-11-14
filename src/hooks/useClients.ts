import { useState, useCallback } from 'react';
import apiClient, { ApiResponse } from '../services/apiClient';
import { Client, PaginationParams, FilterParams } from '../types';
import { useToast } from '../components/ui/Toast';

interface UseClientsResult {
  clients: Client[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchClients: (params?: PaginationParams & FilterParams) => Promise<void>;
  createClient: (data: Partial<Client>) => Promise<Client | null>;
  updateClient: (id: number, data: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: number) => Promise<boolean>;
  getClientById: (id: number) => Promise<Client | null>;
}

export const useClients = (): UseClientsResult => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const { showToast } = useToast();

  const fetchClients = useCallback(
    async (params?: PaginationParams & FilterParams) => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Client[]> = await apiClient.get('/clients', {
          params,
        });

        if (response.success && response.data) {
          setClients(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch clients';
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const createClient = useCallback(
    async (data: Partial<Client>): Promise<Client | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Client> = await apiClient.post(
          '/clients',
          data
        );

        if (response.success && response.data) {
          showToast('Client created successfully', 'success');
          await fetchClients();
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create client';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast, fetchClients]
  );

  const updateClient = useCallback(
    async (id: number, data: Partial<Client>): Promise<Client | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Client> = await apiClient.put(
          `/clients/${id}`,
          data
        );

        if (response.success && response.data) {
          showToast('Client updated successfully', 'success');
          setClients((prev) =>
            prev.map((c) => (c.id === id ? response.data! : c))
          );
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update client';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const deleteClient = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.delete(`/clients/${id}`);

        if (response.success) {
          showToast('Client deleted successfully', 'success');
          setClients((prev) => prev.filter((c) => c.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete client';
        setError(message);
        showToast(message, 'error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const getClientById = useCallback(
    async (id: number): Promise<Client | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Client> = await apiClient.get(
          `/clients/${id}`
        );

        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch client';
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
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
  };
};
