import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '../types/consultant.types';

interface Props {
  projects: Project[];
}

const ProjectsSection: React.FC<Props> = ({ projects }) => (
  <Card className="bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-md">Projets</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {projects.map((project, idx) => (
          <li key={idx} className="border p-2 rounded">
            <p className="font-semibold">{project.name}</p>
            <p className="text-sm text-gray-500">{project.description}</p>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default ProjectsSection;
