import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Building2, User, Phone, Mail, ZoomIn, ZoomOut, Calendar,
  Building, Users, Globe, MapPin, Search, Download, ChevronDown,
  Filter, Save, Maximize2, Minimize2, Map, Plus, ArrowRight,
  Trash2, Edit, FileText, MoreHorizontal, Briefcase, Euro, Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import logger from '@/utils/logger';

const ClientDashboard = ({ clients = [], projects = [], contracts = [] }) => {
  const [timeRange, setTimeRange] = useState('year');
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Couleurs pour les graphiques
  const COLORS = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
    '#06B6D4', '#EC4899', '#6366F1', '#84CC16', '#F97316'
  ];
  
  // Calcul des données pour les graphiques
  
  // 1. Répartition des clients par secteur
  const sectorData = React.useMemo(() => {
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return [];
    }
    
    const sectors = {};
    clients.forEach(client => {
      if (!client || !client.sector) return;
      
      if (sectors[client.sector]) {
        sectors[client.sector]++;
      } else {
        sectors[client.sector] = 1;
      }
    });
    
    return Object.entries(sectors).map(([name, value]) => ({
      name,
      value
    }));
  }, [clients]);
  
  // 2. Répartition des clients par statut
  const statusData = React.useMemo(() => {
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return [
        { name: 'Clients actifs', value: 0 },
        { name: 'Prospects', value: 0 },
        { name: 'Clients inactifs', value: 0 }
      ];
    }
    
    const statuses = {
      'actif': { name: 'Clients actifs', value: 0 },
      'prospect': { name: 'Prospects', value: 0 },
      'inactif': { name: 'Clients inactifs', value: 0 }
    };
    
    clients.forEach(client => {
      if (client && client.status && statuses[client.status]) {
        statuses[client.status].value++;
      }
    });
    
    return Object.values(statuses);
  }, [clients]);
  
  // 3. Projets par client (top 5)
  const clientProjectsData = React.useMemo(() => {
    if (!clients || !Array.isArray(clients) || clients.length === 0 || 
        !projects || !Array.isArray(projects) || projects.length === 0) {
      return [];
    }
    
    const clientProjects = {};
    
    clients.forEach(client => {
      if (!client || !client.id) return;
      
      const clientProjectCount = projects.filter(p => p && p.clientId === client.id).length;
      if (clientProjectCount > 0) {
        clientProjects[client.id] = {
          name: client.name,
          value: clientProjectCount
        };
      }
    });
    
    return Object.values(clientProjects)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [clients, projects]);
  
  // 4. Chiffre d'affaires par client (top 5)
  const clientRevenueData = React.useMemo(() => {
    if (!clients || !Array.isArray(clients) || clients.length === 0 || 
        !projects || !Array.isArray(projects) || projects.length === 0) {
      return [];
    }
    
    const clientRevenues = {};
    
    clients.forEach(client => {
      if (!client || !client.id) return;
      
      const clientActiveProjects = projects.filter(p => p && p.clientId === client.id && p.status === 'active');
      const totalRevenue = clientActiveProjects.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      if (totalRevenue > 0) {
        clientRevenues[client.id] = {
          name: client.name || `Client ${client.id}`,
          value: totalRevenue
        };
      }
    });
    
    return Object.values(clientRevenues)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [clients, projects]);
  
  // 5. Répartition des projets par statut
  const projectStatusData = React.useMemo(() => {
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return [
        { name: 'En cours', value: 0 },
        { name: 'Terminés', value: 0 },
        { name: 'Planifiés', value: 0 }
      ];
    }
    
    const statuses = {
      'active': { name: 'En cours', value: 0 },
      'completed': { name: 'Terminés', value: 0 },
      'planned': { name: 'Planifiés', value: 0 }
    };
    
    projects.forEach(project => {
      if (project && project.status && statuses[project.status]) {
        statuses[project.status].value++;
      }
    });
    
    return Object.values(statuses);
  }, [projects]);
  
  // 6. Évolution du nombre de clients dans le temps
  const clientsOverTimeData = React.useMemo(() => {
    if (!clients || !Array.isArray(clients) || clients.length === 0) {
      return [];
    }
    
    const data = {};
    const now = new Date();
    
    // Déterminer l'intervalle en fonction de la plage de temps
    let monthsToShow;
    if (timeRange === 'year') {
      monthsToShow = 12;
    } else if (timeRange === 'quarter') {
      monthsToShow = 3;
    } else {
      monthsToShow = 1;
    }
    
    // Initialiser les périodes
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
      data[month] = { name: month, active: 0, prospect: 0, total: 0 };
    }
    
    // Compter les clients par période
    clients.forEach(client => {
      if (!client || !client.createdAt) return;
      
      try {
        const createdAt = new Date(client.createdAt);
        if (isNaN(createdAt.getTime())) return; // Date invalide
        
        const month = createdAt.toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' });
        
        // Vérifier si le mois est dans notre plage
        if (data[month]) {
          data[month].total++;
          if (client.status === 'actif') {
            data[month].active++;
          } else if (client.status === 'prospect') {
            data[month].prospect++;
          }
        }
      } catch (e) {
        logger.error("Erreur lors du traitement de la date", e, 'ClientDashboard');
      }
    });
    
    return Object.values(data).reverse();
  }, [clients, timeRange]);
  
  // 7. KPIs globaux
  const kpis = React.useMemo(() => {
    const activeClients = Array.isArray(clients) 
      ? clients.filter(c => c && c.status === 'actif').length 
      : 0;
    
    const activeProjects = Array.isArray(projects) 
      ? projects.filter(p => p && p.status === 'active').length 
      : 0;
    
    const totalRevenue = Array.isArray(projects) 
      ? projects
          .filter(p => p && p.status === 'active')
          .reduce((sum, p) => sum + (p.amount || 0), 0)
      : 0;
    
    const avgProjectValue = activeProjects > 0 
      ? Math.round(totalRevenue / activeProjects) 
      : 0;
    
    return {
      activeClients,
      totalClients: Array.isArray(clients) ? clients.length : 0,
      activeProjects,
      totalRevenue,
      avgProjectValue
    };
  }, [clients, projects]);
  
  // Formatage des valeurs pour les tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* En-tête et filtres */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord Clients</h1>
        <div className="flex space-x-2">
          <select 
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="year">Dernière année</option>
            <option value="quarter">Dernier trimestre</option>
            <option value="month">Dernier mois</option>
          </select>
        </div>
      </div>
      
      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clients actifs</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-bold">{kpis.activeClients}</h3>
                  <p className="text-xs text-gray-500">sur {kpis.totalClients}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Briefcase size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Projets en cours</p>
                <h3 className="text-2xl font-bold">{kpis.activeProjects}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Euro size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">CA en cours</p>
                <h3 className="text-2xl font-bold">{formatCurrency(kpis.totalRevenue)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <FileText size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valeur moyenne</p>
                <h3 className="text-2xl font-bold">{formatCurrency(kpis.avgProjectValue)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Première rangée de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Évolution du nombre de clients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Évolution du nombre de clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {clientsOverTimeData.length > 0 ? (
                  <LineChart
                    data={clientsOverTimeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, ""]} />
                    <Legend />
                    <Line name="Total Clients" type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
                    <Line name="Clients Actifs" type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} />
                    <Line name="Prospects" type="monotone" dataKey="prospect" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Chiffre d'affaires par client (Top 5) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Chiffre d'affaires par client (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {clientRevenueData.length > 0 ? (
                  <BarChart
                    data={clientRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tickFormatter={(value) => `${Math.round(value / 1000)}k €`} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip formatter={(value) => [formatCurrency(value), "CA en cours"]} />
                    <Bar dataKey="value" fill="#3B82F6">
                      {clientRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Deuxième rangée de graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Répartition des clients par secteur */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Clients par secteur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {sectorData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                  </PieChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Répartition des clients par statut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Clients par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {statusData.some(item => item.value > 0) ? (
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#10B981" /> {/* Clients actifs */}
                      <Cell fill="#3B82F6" /> {/* Prospects */}
                      <Cell fill="#6B7280" /> {/* Clients inactifs */}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                  </PieChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Répartition des projets par statut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Projets par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {projectStatusData.some(item => item.value > 0) ? (
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#3B82F6" /> {/* En cours */}
                      <Cell fill="#10B981" /> {/* Terminés */}
                      <Cell fill="#F59E0B" /> {/* Planifiés */}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                  </PieChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Aucune donnée disponible
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;