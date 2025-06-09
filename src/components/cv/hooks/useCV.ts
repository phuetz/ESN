import { useState, useCallback } from 'react';
import type { CVData, PersonalInfo, Experience, Education } from '../types/CV.types';

const defaultCV: CVData = {
  personal: { firstName: '', lastName: '', title: '', email: '', phone: '' },
  experiences: [],
  education: [],
  skills: [],
  summary: '',
  template: 'simple',
};

export const useCV = (initial: CVData = defaultCV) => {
  const [cv, setCV] = useState<CVData>(initial);

  const updatePersonal = useCallback((info: Partial<PersonalInfo>) => {
    setCV((prev) => ({ ...prev, personal: { ...prev.personal, ...info } }));
  }, []);

  const addExperience = useCallback((exp: Experience) => {
    setCV((prev) => ({ ...prev, experiences: [...prev.experiences, exp] }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, experiences: prev.experiences.filter((e) => e.id !== id) }));
  }, []);

  const addEducation = useCallback((edu: Education) => {
    setCV((prev) => ({ ...prev, education: [...prev.education, edu] }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCV((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, []);

  const addSkill = useCallback((skill: string) => {
    setCV((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
  }, []);

  const removeSkill = useCallback((index: number) => {
    setCV((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  }, []);

  const setTemplate = useCallback((template: string) => {
    setCV((prev) => ({ ...prev, template }));
  }, []);

  return {
    cv,
    setCV,
    updatePersonal,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
    setTemplate,
  };
};
