import { useMemo } from 'react';
import { z } from 'zod';
import type {
  PersonalInfo,
  ProfessionalInfo,
  ContactInfo,
  Skill,
} from '../types/consultant.types';

const personalInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().min(1),
});

const professionalInfoSchema = z.object({
  title: z.string().min(1),
  level: z.string().min(1),
  experienceYears: z.number().int().nonnegative(),
});

const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export const useFormValidation = (
  personal: PersonalInfo,
  professional: ProfessionalInfo,
  contact: ContactInfo,
  skills: Skill[],
) => {
  return useMemo(() => {
    const personalValid = personalInfoSchema.safeParse(personal).success;
    const professionalValid = professionalInfoSchema.safeParse(professional).success;
    const contactValid = contactInfoSchema.safeParse(contact).success;
    const skillsValid = skills.length > 0;

    return {
      personalValid,
      professionalValid,
      contactValid,
      skillsValid,
      isValid: personalValid && professionalValid && contactValid && skillsValid,
    };
  }, [personal, professional, contact, skills]);
};
