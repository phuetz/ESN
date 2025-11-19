import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Users, Euro, TrendingUp, AlertTriangle,
  BarChart2, PieChart, Calendar, ListFilter, Plus
} from 'lucide-react';
import DataGridESN from '@/components/ui/DataGridESN';
import logger from '@/utils/logger';

export const ESNBusinessDashboard: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'dashboard' | 'grid'>('dashboard');

  // Sample data - in a real app, this would come from your backend
  const businessMetrics = {
    consultants: 87,
    monthlyRevenue: 765000,
    activeProjects: 43,
    consultantsOnBench: 12
  };

  const businessData = [
    {
      id: 1,
      consultant: "Jean Dupont",
      client: "TechSolutions SA",
      project: "Refonte SI",
      tjm: 650,
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      status: "active"
    },
    {
      id: 2,
      consultant: "Marie Martin",
      client: "AssurTech",
      project: "Migration Cloud",
      tjm: 750,
      startDate: "2024-02-01",
      endDate: "2024-08-01",
      status: "active"
    }
  ];

  const columns = [
    {
      field: 'consultant',
      headerName: 'Consultant',
      width: 200
    },
    {
      field: 'client',
      headerName: 'Client',
      width: 200
    },
    {
      field: 'project',
      headerName: 'Projet',
      width: 200
    },
    {
      field: 'tjm',
      headerName: 'TJM',
      width: 120,
      type: 'number',
      cellRenderer: (value) => `${value} €`
    },
    {
      field: 'startDate',
      headerName: 'Début',
      width: 120,
      cellRenderer: (value) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      field: 'endDate',
      headerName: 'Fin',
      width: 120,
      cellRenderer: (value) => new Date(value).toLocaleDateString('fr-FR')
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      cellRenderer: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value === 'active' ? 'En cours' : 'Terminé'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion Métier ESN</h2>
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

      {viewMode === 'grid' ? (
        <DataGridESN
          data={businessData}
          columns={columns}
          title="Activité Métier"
          enableFiltering={true}
          enableSorting={true}
          enableSelection={true}
          enableExport={true}
          pageSize={10}
          height="calc(100vh - 240px)"
          actionButtons={[
            {
              icon: <Plus size={18} />,
              onClick: () => logger.debug('Add business entry action triggered', {}, 'ESNBusinessDashboard'),
              title: "Ajouter une entrée"
            }
          ]}
        />
      ) : (
        <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Consultants</p>
                <h3 className="text-2xl font-bold mt-1">{businessMetrics.consultants}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">CA Mensuel</p>
                <h3 className="text-2xl font-bold mt-1">{businessMetrics.monthlyRevenue.toLocaleString()} €</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Projets actifs</p>
                <h3 className="text-2xl font-bold mt-1">{businessMetrics.activeProjects}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Intercontrats</p>
                <h3 className="text-2xl font-bold mt-1">{businessMetrics.consultantsOnBench}</h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution du CA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart2 size={32} className="text-gray-400" />
              <p className="ml-2 text-gray-500">Graphique à venir</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <PieChart size={32} className="text-gray-400" />
              <p className="ml-2 text-gray-500">Graphique à venir</p>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
};