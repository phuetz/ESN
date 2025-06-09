import { useMemo } from 'react';
import { z } from 'zod';
import type { CVData } from '../types/CV.types';

const personalSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

export const useCVValidation = (cv: CVData) =>
  useMemo(() => {
    const personalValid = personalSchema.safeParse(cv.personal).success;
    const skillsValid = cv.skills.length > 0;
    return {
      personalValid,
      skillsValid,
      isValid: personalValid && skillsValid,
    };
  }, [cv]);
