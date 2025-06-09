import React from 'react';
import type { Skill } from '../types/consultant.types';

interface Props {
  skills: Skill[];
}

const SkillsDisplay: React.FC<Props> = ({ skills }) => (
  <ul className="list-disc list-inside space-y-1">
    {skills.map((skill) => (
      <li key={skill.name} className="flex justify-between">
        <span>{skill.name}</span>
        <span className="text-sm text-gray-500">{skill.level}/5</span>
      </li>
    ))}
  </ul>
);

export default SkillsDisplay;
