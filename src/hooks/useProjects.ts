import { useState, useCallback } from 'react';
import apiClient, { ApiResponse } from '../services/apiClient';
import { Project, PaginationParams, FilterParams } from '../types';
import { useToast } from '../components/ui/Toast';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  fetchProjects: (params?: PaginationParams & FilterParams) => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: number, data: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  getProjectById: (id: number) => Promise<Project | null>;
}

export const useProjects = (): UseProjectsResult => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const { showToast } = useToast();

  const fetchProjects = useCallback(
    async (params?: PaginationParams & FilterParams) => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Project[]> = await apiClient.get('/projects', {
          params,
        });

        if (response.success && response.data) {
          setProjects(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(message);
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const createProject = useCallback(
    async (data: Partial<Project>): Promise<Project | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Project> = await apiClient.post(
          '/projects',
          data
        );

        if (response.success && response.data) {
          showToast('Project created successfully', 'success');
          await fetchProjects();
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast, fetchProjects]
  );

  const updateProject = useCallback(
    async (id: number, data: Partial<Project>): Promise<Project | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Project> = await apiClient.put(
          `/projects/${id}`,
          data
        );

        if (response.success && response.data) {
          showToast('Project updated successfully', 'success');
          setProjects((prev) =>
            prev.map((p) => (p.id === id ? response.data! : p))
          );
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update project';
        setError(message);
        showToast(message, 'error');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const deleteProject = useCallback(
    async (id: number): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.delete(`/projects/${id}`);

        if (response.success) {
          showToast('Project deleted successfully', 'success');
          setProjects((prev) => prev.filter((p) => p.id !== id));
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete project';
        setError(message);
        showToast(message, 'error');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const getProjectById = useCallback(
    async (id: number): Promise<Project | null> => {
      setLoading(true);
      setError(null);

      try {
        const response: ApiResponse<Project> = await apiClient.get(
          `/projects/${id}`
        );

        if (response.success && response.data) {
          return response.data;
        }
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch project';
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
    projects,
    loading,
    error,
    pagination,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
  };
};
