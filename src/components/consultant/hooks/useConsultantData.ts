import { useState, useCallback } from 'react';
import type { Consultant } from '../types/consultant.types';

export const useConsultantData = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);

  const addConsultant = useCallback((consultant: Consultant) => {
    setConsultants((prev) => [...prev, consultant]);
  }, []);

  const updateConsultant = useCallback((updated: Consultant) => {
    setConsultants((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const removeConsultant = useCallback((id: string) => {
    setConsultants((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    consultants,
    addConsultant,
    updateConsultant,
    removeConsultant,
  };
};
