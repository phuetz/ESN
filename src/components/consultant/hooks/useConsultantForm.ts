import { useState, useCallback } from 'react';
import type {
  Consultant,
  PersonalInfo,
  ProfessionalInfo,
  ContactInfo,
  Skill,
  Experience,
  Project,
} from '../types/consultant.types';

export interface UseConsultantFormReturn {
  consultant: Consultant;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateProfessionalInfo: (info: Partial<ProfessionalInfo>) => void;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (index: number) => void;
  addExperience: (exp: Experience) => void;
  addProject: (project: Project) => void;
}

const defaultConsultant: Consultant = {
  id: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  title: '',
  level: '',
  experienceYears: 0,
  skills: [],
  contact: { email: '', phone: '', address: '' },
  experiences: [],
  projects: [],
  status: 'active',
};

export const useConsultantForm = (
  initial: Consultant = defaultConsultant,
): UseConsultantFormReturn => {
  const [consultant, setConsultant] = useState<Consultant>(initial);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setConsultant((prev) => ({ ...prev, ...info }));
  }, []);

  const updateProfessionalInfo = useCallback(
    (info: Partial<ProfessionalInfo>) => {
      setConsultant((prev) => ({ ...prev, ...info }));
    },
    [],
  );

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setConsultant((prev) => ({ ...prev, contact: { ...prev.contact, ...info } }));
  }, []);

  const addSkill = useCallback((skill: Skill) => {
    setConsultant((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setConsultant((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  }, []);

  const addExperience = useCallback((exp: Experience) => {
    setConsultant((prev) => ({ ...prev, experiences: [...prev.experiences, exp] }));
  }, []);

  const addProject = useCallback((project: Project) => {
    setConsultant((prev) => ({ ...prev, projects: [...prev.projects, project] }));
  }, []);

  return {
    consultant,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateContactInfo,
    addSkill,
    removeSkill,
    addExperience,
    addProject,
  };
};
