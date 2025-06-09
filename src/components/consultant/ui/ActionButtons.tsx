import React, { memo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button
      aria-label="edit"
      onClick={onEdit}
      className="p-1 rounded hover:bg-gray-100"
    >
      <Edit3 size={16} />
    </button>
    <button
      aria-label="delete"
      onClick={onDelete}
      className="p-1 rounded hover:bg-gray-100"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

export default memo(ActionButtons);
