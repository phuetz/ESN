import { useCallback } from 'react';
import type { CVData } from '../types/CV.types';

export const templates = [
  { id: 'simple', name: 'Simple' },
  { id: 'modern', name: 'Modern' },
];

export const useCVTemplates = (setCV: (cv: CVData) => void) => {
  const applyTemplate = useCallback(
    (id: string) => {
      if (id === 'modern') {
        setCV({
          personal: {
            firstName: 'John',
            lastName: 'Doe',
            title: 'Developer',
            email: 'john@doe.com',
            phone: '123456789',
          },
          experiences: [],
          education: [],
          skills: ['React', 'TypeScript'],
          summary: 'Experienced developer',
          template: 'modern',
        });
      } else {
        setCV((prev) => ({ ...prev, template: id }));
      }
    },
    [setCV],
  );

  return { templates, applyTemplate };
};
