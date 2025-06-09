import React, { useState } from 'react';
import type { Experience } from '../types/CV.types';

interface Props {
  onAdd: (exp: Experience) => void;
  onRemove: (id: string) => void;
  experiences: Experience[];
}

const ExperienceForm: React.FC<Props> = ({ onAdd, onRemove, experiences }) => {
  const [exp, setExp] = useState<Omit<Experience, 'id'>>({
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const add = () => {
    onAdd({ id: Date.now().toString(), ...exp });
    setExp({ role: '', company: '', startDate: '', endDate: '', description: '' });
  };

  return (
    <div className="space-y-2">
      <input
        value={exp.role}
        onChange={(e) => setExp({ ...exp, role: e.target.value })}
        placeholder="Poste"
        className="border p-2 rounded w-full"
      />
      <input
        value={exp.company}
        onChange={(e) => setExp({ ...exp, company: e.target.value })}
        placeholder="Entreprise"
        className="border p-2 rounded w-full"
      />
      <input
        value={exp.startDate}
        onChange={(e) => setExp({ ...exp, startDate: e.target.value })}
        placeholder="Date début"
        className="border p-2 rounded w-full"
      />
      <input
        value={exp.endDate}
        onChange={(e) => setExp({ ...exp, endDate: e.target.value })}
        placeholder="Date fin"
        className="border p-2 rounded w-full"
      />
      <textarea
        value={exp.description}
        onChange={(e) => setExp({ ...exp, description: e.target.value })}
        placeholder="Description"
        className="border p-2 rounded w-full"
      />
      <button type="button" onClick={add} className="px-2 py-1 bg-blue-600 text-white rounded">
        Ajouter expérience
      </button>

      <ul className="list-disc pl-4">
        {experiences.map((e) => (
          <li key={e.id} className="flex justify-between">
            <span>{e.role} - {e.company}</span>
            <button type="button" onClick={() => onRemove(e.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(ExperienceForm);
