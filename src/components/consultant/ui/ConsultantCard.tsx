import React, { memo } from 'react';
import { User } from 'lucide-react';
import type { Consultant } from '../types/consultant.types';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import { Card } from '@/components/ui/card';

interface ConsultantCardProps {
  consultant: Consultant;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, onEdit, onDelete }) => {
  return (
    <Card className="bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
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
    </Card>
  );
};

export default memo(ConsultantCard);
