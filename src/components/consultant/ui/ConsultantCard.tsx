import React from 'react';
import { memo } from 'react';
import { User } from 'lucide-react';
import type { Consultant } from '../types/consultant.types';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

interface ConsultantCardProps {
  consultant: Consultant;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, onEdit, onDelete }) => {
  return (
    <div className="border rounded p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <User className="text-blue-500" />
        <div>
          <p className="font-semibold">
            {consultant.firstName} {consultant.lastName}
          </p>
          <p className="text-sm text-gray-500">{consultant.title}</p>
        </div>
        <StatusBadge status={consultant.status} />
      </div>
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default memo(ConsultantCard);
