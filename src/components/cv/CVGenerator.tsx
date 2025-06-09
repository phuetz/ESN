import React from 'react';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import CVPreview from './preview/CVPreview';
import TemplateSelector from './templates/TemplateSelector';
import ExportButtons from './export/ExportButtons';
import { useCV } from './hooks/useCV';
import { useCVValidation } from './hooks/useCVValidation';
import { useCVTemplates } from './hooks/useCVTemplates';

const CVGenerator: React.FC = () => {
  const {
    cv,
    setCV,
    updatePersonal,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkill,
    removeSkill,
  } = useCV();

  const validation = useCVValidation(cv);
  const { templates, applyTemplate } = useCVTemplates(setCV);

  return (
    <div className="space-y-4">
      <TemplateSelector onSelect={applyTemplate} />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <PersonalInfoForm defaultValues={cv.personal} onChange={updatePersonal} />
          <ExperienceForm experiences={cv.experiences} onAdd={addExperience} onRemove={removeExperience} />
          <EducationForm education={cv.education} onAdd={addEducation} onRemove={removeEducation} />
          <SkillsForm skills={cv.skills} onAdd={addSkill} onRemove={removeSkill} />
          <ExportButtons cv={cv} disabled={!validation.isValid} />
        </div>
        <CVPreview cv={cv} />
      </div>
    </div>
  );
};

export default React.memo(CVGenerator);
