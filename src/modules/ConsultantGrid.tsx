import React, { useState } from 'react';
import DataGridESN from '@/components/ui/DataGridESN';
import {
  Building2, User, Phone, Mail, X, ZoomIn, ZoomOut,
  Filter, Save, Maximize2, Minimize2, Map, Plus,
  Star, Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import logger from '@/utils/logger';

interface Consultant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  status: 'available' | 'mission' | 'leave';
  currentClient?: string;
  missionEndDate?: string;
  skills: string[];
  rating: number;
}

const ConsultantGrid: React.FC = () => {
  const [consultants] = useState<Consultant[]>([
    {
      id: 1,
      firstName: "Thomas",
      lastName: "Martin",
      email: "t.martin@company.com",
      phone: "+33 6 12 34 56 78",
      specialization: "Développeur Full Stack",
      experience: 5,
      status: "mission",
      currentClient: "TechSolutions SA",
      missionEndDate: "2024-06-30",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      rating: 4.5
    },
    {
      id: 2,
      firstName: "Sophie",
      lastName: "Dubois",
      email: "s.dubois@company.com",
      phone: "+33 6 23 45 67 89",
      specialization: "DevOps Engineer",
      experience: 3,
      status: "available",
      skills: ["Docker", "Kubernetes", "Jenkins", "AWS"],
      rating: 4.2
    }
  ]);

  const columns = [
    {
      field: 'fullName',
      headerName: 'Consultant',
      width: 250,
      cellRenderer: (_, row: Consultant) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{`${row.firstName} ${row.lastName}`}</div>
            <div className="text-sm text-gray-500">{row.specialization}</div>
          </div>
        </div>
      )
    },
    {
      field: 'contact',
      headerName: 'Contact',
      width: 300,
      cellRenderer: (_, row: Consultant) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-gray-400" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 200,
      cellRenderer: (value: Consultant['status'], row: Consultant) => (
        <div className="space-y-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'available' ? 'bg-green-100 text-green-800' :
            value === 'mission' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {value === 'available' ? 'Disponible' :
             value === 'mission' ? 'En mission' :
             'En congé'}
          </span>
          {row.currentClient && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Building2 size={14} />
              <span>{row.currentClient}</span>
            </div>
          )}
          {row.missionEndDate && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Jusqu'au {new Date(row.missionEndDate).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      )
    },
    {
      field: 'skills',
      headerName: 'Compétences',
      width: 300,
      cellRenderer: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )
    },
    {
      field: 'rating',
      headerName: 'Évaluation',
      width: 150,
      cellRenderer: (value: number) => (
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="font-medium">{value.toFixed(1)}</span>
        </div>
      )
    }
  ];

  const actionButtons = [
    {
      icon: <Plus size={18} />,
      onClick: () => logger.debug('Add consultant action triggered', {}, 'ConsultantGrid'),
      title: "Ajouter un consultant"
    },
    {
      icon: <Edit size={18} />,
      onClick: () => logger.debug('Edit consultant action triggered', {}, 'ConsultantGrid'),
      title: "Modifier"
    },
    {
      icon: <Trash2 size={18} />,
      onClick: () => logger.debug('Delete consultant action triggered', {}, 'ConsultantGrid'),
      title: "Supprimer"
    }
  ];

  const handleRowClick = (row: Consultant) => {
    logger.debug('Selected consultant', { consultant: row }, 'ConsultantGrid');
  };

  const handleSelectionChange = (selectedItems: Consultant[]) => {
    logger.debug('Selection changed', { count: selectedItems.length }, 'ConsultantGrid');
  };

  return (
    <div className="h-full p-4">
      <DataGridESN
        data={consultants}
        columns={columns}
        title="Gestion des Consultants"
        enableFiltering={true}
        enableSorting={true}
        enableSelection={true}
        enableExport={true}
        enableGrouping={true}
        enableDragToGroup={true}
        pageSize={10}
        height="calc(100vh - 240px)"
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        actionButtons={actionButtons}
        defaultGroupedColumns={['disponibilite']}
      />
    </div>
  );
};

export default ConsultantGrid;