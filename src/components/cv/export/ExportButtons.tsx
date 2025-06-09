import React from 'react';
import type { CVData } from '../types/CV.types';

interface Props {
  cv: CVData;
  disabled?: boolean;
}

const ExportButtons: React.FC<Props> = ({ disabled }) => {
  const print = () => {
    window.print();
  };

  return (
    <div className="flex gap-2 mt-2">
      <button type="button" onClick={print} disabled={disabled} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">
        Imprimer
      </button>
    </div>
  );
};

export default React.memo(ExportButtons);
