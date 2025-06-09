import React, { useState, useCallback } from 'react';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ProfessionalInfoForm from './forms/ProfessionalInfoForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import ContactSection from './sections/ContactSection';
import SkillsDisplay from './sections/SkillsDisplay';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import ConsultantCard from './ui/ConsultantCard';
import { useConsultantForm } from './hooks/useConsultantForm';
import { useConsultantData } from './hooks/useConsultantData';
import { useFormValidation } from './hooks/useFormValidation';

const ConsultantProfile: React.FC = () => {
  const {
    consultant,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateContactInfo,
    addSkill,
  } = useConsultantForm();
  const { addConsultant } = useConsultantData();
  const [step, setStep] = useState<'form' | 'summary'>('form');

  const validation = useFormValidation(
    {
      firstName: consultant.firstName,
      lastName: consultant.lastName,
      birthDate: consultant.birthDate,
    },
    {
      title: consultant.title,
      level: consultant.level,
      experienceYears: consultant.experienceYears,
    },
    consultant.contact,
    consultant.skills,
  );

  const save = useCallback(() => {
    if (validation.isValid) {
      addConsultant({ ...consultant, id: Date.now().toString() });
      setStep('summary');
    }
  }, [validation.isValid, consultant, addConsultant]);

  if (step === 'summary') {
    return (
      <div className="space-y-4">
        <ConsultantCard consultant={consultant} />
        <ContactSection contact={consultant.contact} />
        <SkillsDisplay skills={consultant.skills} />
        <ExperienceSection experiences={consultant.experiences} />
        <ProjectsSection projects={consultant.projects} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PersonalInfoForm defaultValues={consultant} onSubmit={updatePersonalInfo} />
      <ProfessionalInfoForm
        defaultValues={consultant}
        onSubmit={updateProfessionalInfo}
      />
      <SkillsForm defaultValues={{ name: '', level: 1 }} onAdd={addSkill} />
      <ContactForm defaultValues={consultant.contact} onSubmit={updateContactInfo} />
      <button
        onClick={save}
        disabled={!validation.isValid}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Sauvegarder
      </button>
    </div>
  );
};

export default ConsultantProfile;
