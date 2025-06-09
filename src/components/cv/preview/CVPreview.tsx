import React from 'react';
import type { CVData } from '../types/CV.types';

interface Props {
  cv: CVData;
}

const CVPreview: React.FC<Props> = ({ cv }) => (
  <div className="border rounded p-4" data-testid="cv-preview">
    <h2 className="text-xl font-semibold">
      {cv.personal.firstName} {cv.personal.lastName}
    </h2>
    <p>{cv.personal.title}</p>
    <p>{cv.personal.email}</p>
    <p>{cv.personal.phone}</p>
    <h3 className="font-medium mt-2">Compétences</h3>
    <ul className="list-disc pl-4">
      {cv.skills.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ul>
  </div>
);

export default React.memo(CVPreview);
