import { useState, useCallback, useEffect } from 'react';
import type { Client } from '../types/client.types';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (e) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const addClient = useCallback(async (client: Client) => {
    const res = await fetch('http://localhost:3001/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    const created = await res.json();
    setClients((prev) => [...prev, created]);
  }, []);

  const updateClient = useCallback(async (updated: Client) => {
    const res = await fetch(`http://localhost:3001/api/clients/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setClients((prev) => prev.map((c) => (c.id === data.id ? data : c)));
  }, []);

  const removeClient = useCallback(async (id: string) => {
    await fetch(`http://localhost:3001/api/clients/${id}`, { method: 'DELETE' });
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    removeClient,
  };
};
