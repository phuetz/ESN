import React, { useState } from 'react';
import { 
  Building2, User, Phone, Mail, X, ZoomIn, ZoomOut,
  Building, Users, Globe, MapPin, Search, Download,
  Filter, Save, Maximize2, Minimize2, Map, Plus,
  Trash2, Edit, Calendar, FileText, MoreHorizontal,
  BarChart2, ListFilter, UserPlus, Euro, ChevronDown,
  PieChart, UserX, Clock, CheckCircle, Briefcase,
  TrendingUp, DollarSign, AlertTriangle, AlertCircle,
  Bell, Target
} from 'lucide-react';
import DataGridESN from '@/components/ui/DataGridESN';
import ClientDashboard from './ClientDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
  
const ClientManagement = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "TechSolutions SA",
      type: "enterprise",
      sector: "Finance & Assurance",
      contactName: "Jean Dupont",
      contactEmail: "j.dupont@techsolutions.fr",
      contactPhone: "+33 1 23 45 67 89",
      website: "www.techsolutions.fr",
      address: "25 Avenue des Champs-Élysées",
      city: "Paris",
      postalCode: "75008",
      country: "France",
      notes: "Client important avec plusieurs projets stratégiques.",
      status: "actif",
      createdAt: "2022-06-15T10:00:00Z"
    },
    {
      id: 2,
      name: "Mairie de Lyon",
      type: "public_sector",
      sector: "Administration",
      contactName: "Marie Lambert",
      contactEmail: "m.lambert@mairie-lyon.fr",
      contactPhone: "+33 4 72 10 30 30",
      website: "www.lyon.fr",
      address: "Place de la Comédie",
      city: "Lyon",
      postalCode: "69001",
      country: "France",
      notes: "Projet de modernisation des services numériques.",
      status: "actif",
      createdAt: "2023-02-20T14:30:00Z"
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      clientId: 1,
      name: "Refonte SI",
      status: "active",
      amount: 250000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      consultantCount: 5
    },
    {
      id: 2,
      clientId: 2,
      name: "Migration Cloud",
      status: "active",
      amount: 180000,
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      consultantCount: 3
    }
  ]);

  const [contracts, setContracts] = useState([
    {
      id: 1,
      clientId: 1,
      name: "Contrat maintenance",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      amount: 120000
    }
  ]);

  const columns = [
    { 
      field: 'name', 
      headerName: 'Nom du client', 
      width: 200,
      cellRenderer: (value, row) => {
        let icon;
        if (row.type === 'enterprise') {
          icon = <Building2 size={16} className="text-blue-500" />;
        } else if (row.type === 'public_sector') {
          icon = <Building size={16} className="text-purple-500" />;
        } else if (row.type === 'startup') {
          icon = <Building size={16} className="text-emerald-500" />;
        }
        
        return (
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{value}</span>
          </div>
        );
      }
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      cellRenderer: (value) => {
        let label, colorClass;
        
        switch(value) {
          case 'enterprise':
            label = 'Entreprise';
            colorClass = 'bg-blue-50 text-blue-700';
            break;
          case 'public_sector':
            label = 'Secteur Public';
            colorClass = 'bg-purple-50 text-purple-700';
            break;
          case 'startup':
            label = 'Startup';
            colorClass = 'bg-emerald-50 text-emerald-700';
            break;
          default:
            label = value;
            colorClass = 'bg-gray-50 text-gray-700';
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {label}
          </span>
        );
      }
    },
    { field: 'sector', headerName: 'Secteur', width: 150 },
    { field: 'contactName', headerName: 'Contact', width: 150 },
    { field: 'contactEmail', headerName: 'Email', width: 200 },
    { field: 'contactPhone', headerName: 'Téléphone', width: 140 },
    { 
      field: 'city', 
      headerName: 'Localisation', 
      width: 150,
      cellRenderer: (value, row) => {
        if (!value) return '';
        return `${value}${row.postalCode ? ` (${row.postalCode})` : ''}`;
      }
    },
    { 
      field: 'status', 
      headerName: 'Statut', 
      width: 120,
      cellRenderer: (value) => {
        let colorClass;
        let label;
        
        switch(value) {
          case 'actif':
            colorClass = 'bg-green-100 text-green-800';
            label = 'Client actif';
            break;
          case 'prospect':
            colorClass = 'bg-blue-100 text-blue-800';
            label = 'Prospect';
            break;
          case 'inactif':
            colorClass = 'bg-gray-100 text-gray-800';
            label = 'Client inactif';
            break;
          default:
            colorClass = 'bg-gray-100 text-gray-800';
            label = value;
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {label}
          </span>
        );
      }
    }
  ];

  const actionButtons = [
    {
      icon: <Plus size={18} />,
      onClick: () => console.log('Add client'),
      title: "Ajouter un client"
    }
  ];

  const handleViewClient = (client) => {
    console.log('View client:', client);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Gestion des Clients</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListFilter size={16} />
            <span>Liste</span>
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`px-3 py-2 rounded flex items-center gap-1 ${
              viewMode === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BarChart2 size={16} />
            <span>Tableau de bord</span>
          </button>
        </div>
      </div>

      {viewMode === 'dashboard' ? (
        <ClientDashboard 
          clients={clients}
          projects={projects}
          contracts={contracts}
        />
      ) : (
        <DataGridESN 
          data={clients}
          columns={columns}
          title="Liste des clients"
          enableFiltering={true}
          enableSorting={true}
          enableSelection={true}
          enableExport={true}
          enableGrouping={true}
          enableDragToGroup={true}
          pageSize={10}
          height="calc(100vh - 200px)"
          onRowClick={handleViewClient}
          actionButtons={actionButtons}
        />
      )}
    </div>
  );
};

export default ClientManagement;