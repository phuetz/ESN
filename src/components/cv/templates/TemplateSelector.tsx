import React from 'react';
import { templates } from '../hooks/useCVTemplates';

interface Props {
  onSelect: (id: string) => void;
}

const TemplateSelector: React.FC<Props> = ({ onSelect }) => (
  <div className="flex gap-2">
    {templates.map((t) => (
      <button
        key={t.id}
        type="button"
        onClick={() => onSelect(t.id)}
        className="px-2 py-1 border rounded"
      >
        {t.name}
      </button>
    ))}
  </div>
);

export default React.memo(TemplateSelector);
