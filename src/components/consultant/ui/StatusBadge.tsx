import React from 'react';
import { memo } from 'react';

interface StatusBadgeProps {
  status: 'active' | 'bench' | 'inactive';
}

const statusClasses: Record<StatusBadgeProps['status'], string> = {
  active: 'bg-green-100 text-green-800',
  bench: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`text-xs px-2 py-1 rounded ${statusClasses[status]}`}>{status}</span>
);

export default memo(StatusBadge);
