import React, { useState } from 'react';

interface Props {
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (index: number) => void;
}

const SkillsForm: React.FC<Props> = ({ skills, onAdd, onRemove }) => {
  const [skill, setSkill] = useState('');

  const add = () => {
    if (skill.trim()) {
      onAdd(skill.trim());
      setSkill('');
    }
  };

  return (
    <div className="space-y-2">
      <input
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Compétence"
        className="border p-2 rounded w-full"
      />
      <button type="button" onClick={add} className="px-2 py-1 bg-blue-600 text-white rounded">
        Ajouter compétence
      </button>
      <ul className="list-disc pl-4">
        {skills.map((s, i) => (
          <li key={i} className="flex justify-between">
            <span>{s}</span>
            <button type="button" onClick={() => onRemove(i)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(SkillsForm);
