import React from 'react';
import type { Project } from '../types/consultant.types';

interface Props {
  projects: Project[];
}

const ProjectsSection: React.FC<Props> = ({ projects }) => (
  <ul className="space-y-2">
    {projects.map((project, idx) => (
      <li key={idx} className="border p-2 rounded">
        <p className="font-semibold">{project.name}</p>
        <p className="text-sm text-gray-500">{project.description}</p>
      </li>
    ))}
  </ul>
);

export default ProjectsSection;
