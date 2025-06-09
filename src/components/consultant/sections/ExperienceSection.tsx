import React from 'react';
import type { Experience } from '../types/consultant.types';

interface Props {
  experiences: Experience[];
}

const ExperienceSection: React.FC<Props> = ({ experiences }) => (
  <ul className="space-y-2">
    {experiences.map((exp, idx) => (
      <li key={idx} className="border p-2 rounded">
        <p className="font-semibold">{exp.role} - {exp.company}</p>
        <p className="text-sm text-gray-500">
          {exp.startDate} - {exp.endDate ?? 'Aujourd\'hui'}
        </p>
      </li>
    ))}
  </ul>
);

export default ExperienceSection;
