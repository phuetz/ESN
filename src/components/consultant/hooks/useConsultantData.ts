import { useState, useCallback, useEffect } from 'react';
import type { Consultant } from '../types/consultant.types';

export const useConsultantData = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3001/api/consultants');
      const data = await res.json();
      setConsultants(data);
    } catch (e) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultants();
  }, [fetchConsultants]);

  const addConsultant = useCallback(async (consultant: Consultant) => {
    const res = await fetch('http://localhost:3001/api/consultants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultant),
    });
    const created = await res.json();
    setConsultants((prev) => [...prev, created]);
  }, []);

  const updateConsultant = useCallback(async (updated: Consultant) => {
    const res = await fetch(`http://localhost:3001/api/consultants/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setConsultants((prev) => prev.map((c) => (c.id === data.id ? data : c)));
  }, []);

  const removeConsultant = useCallback(async (id: string) => {
    await fetch(`http://localhost:3001/api/consultants/${id}`, { method: 'DELETE' });
    setConsultants((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    consultants,
    loading,
    error,
    fetchConsultants,
    addConsultant,
    updateConsultant,
    removeConsultant,
  };
};
