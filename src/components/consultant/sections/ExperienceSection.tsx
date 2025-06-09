import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Experience } from '../types/consultant.types';

interface Props {
  experiences: Experience[];
}

const ExperienceSection: React.FC<Props> = ({ experiences }) => (
  <Card className="bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-md">Expériences</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {experiences.map((exp, idx) => (
          <li key={idx} className="border p-2 rounded">
            <p className="font-semibold">
              {exp.role} - {exp.company}
            </p>
            <p className="text-sm text-gray-500">
              {exp.startDate} - {exp.endDate ?? 'Aujourd\'hui'}
            </p>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default ExperienceSection;
