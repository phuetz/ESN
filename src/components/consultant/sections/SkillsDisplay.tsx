import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Skill } from '../types/consultant.types';

interface Props {
  skills: Skill[];
}

const SkillsDisplay: React.FC<Props> = ({ skills }) => (
  <Card className="bg-white">
    <CardHeader className="pb-2">
      <CardTitle className="text-md">Compétences</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-disc list-inside space-y-1">
        {skills.map((skill) => (
          <li key={skill.name} className="flex justify-between text-sm">
            <span>{skill.name}</span>
            <span className="text-gray-500">{skill.level}/5</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default SkillsDisplay;
