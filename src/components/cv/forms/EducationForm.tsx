import React, { useState } from 'react';
import type { Education } from '../types/CV.types';

interface Props {
  onAdd: (edu: Education) => void;
  onRemove: (id: string) => void;
  education: Education[];
}

const EducationForm: React.FC<Props> = ({ onAdd, onRemove, education }) => {
  const [edu, setEdu] = useState<Omit<Education, 'id'>>({
    degree: '',
    school: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const add = () => {
    onAdd({ id: Date.now().toString(), ...edu });
    setEdu({ degree: '', school: '', startDate: '', endDate: '', description: '' });
  };

  return (
    <div className="space-y-2">
      <input
        value={edu.degree}
        onChange={(e) => setEdu({ ...edu, degree: e.target.value })}
        placeholder="Diplôme"
        className="border p-2 rounded w-full"
      />
      <input
        value={edu.school}
        onChange={(e) => setEdu({ ...edu, school: e.target.value })}
        placeholder="Établissement"
        className="border p-2 rounded w-full"
      />
      <input
        value={edu.startDate}
        onChange={(e) => setEdu({ ...edu, startDate: e.target.value })}
        placeholder="Date début"
        className="border p-2 rounded w-full"
      />
      <input
        value={edu.endDate}
        onChange={(e) => setEdu({ ...edu, endDate: e.target.value })}
        placeholder="Date fin"
        className="border p-2 rounded w-full"
      />
      <textarea
        value={edu.description}
        onChange={(e) => setEdu({ ...edu, description: e.target.value })}
        placeholder="Description"
        className="border p-2 rounded w-full"
      />
      <button type="button" onClick={add} className="px-2 py-1 bg-blue-600 text-white rounded">
        Ajouter formation
      </button>

      <ul className="list-disc pl-4">
        {education.map((e) => (
          <li key={e.id} className="flex justify-between">
            <span>{e.degree} - {e.school}</span>
            <button type="button" onClick={() => onRemove(e.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(EducationForm);
