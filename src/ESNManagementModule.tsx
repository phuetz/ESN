import React, { useState } from 'react';
import { 
  Building2, Briefcase, User, ArrowRight, LayoutDashboard, 
  Users, LineChart, Settings, LogOut, UserX, Calendar, 
  Target, Euro, Bell
} from 'lucide-react';

// Démonstration simple de l'application de gestion d'ESN avec navigation
const ESNManagementModule = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // Simuler des données pour la démonstration
  const dashboardData = {
    clientCount: 152,
    activeProjects: 43,
    consultantsCount: 87,
    consultantsOnBench: 12,
    monthlyRevenue: 765000
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 border-b border-blue-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 size={24} />
            <span>ESN Manager Pro</span>
          </h1>
          <p className="text-blue-300 text-sm mt-1">Gestion complète d'ESN</p>
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveModule('dashboard')}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeModule === 'dashboard' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>Tableau de bord</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModule('clients')}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeModule === 'clients' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <Building2 size={20} />
                <span>Clients</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModule('business')}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeModule === 'business' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <Briefcase size={20} />
                <span>Métier ESN</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModule('consultants')}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeModule === 'consultants' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <Users size={20} />
                <span>Consultants</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModule('reports')}
                className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                  activeModule === 'reports' 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-200 hover:bg-blue-800/50'
                }`}
              >
                <LineChart size={20} />
                <span>Rapports</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button className="w-full flex items-center gap-3 p-3 text-blue-200 hover:bg-blue-800/50 rounded-md transition-colors">
            <Settings size={20} />
            <span>Paramètres</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-blue-200 hover:bg-blue-800/50 rounded-md transition-colors">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {activeModule === 'dashboard' && 'Tableau de bord principal'}
            {activeModule === 'clients' && 'Gestion des clients'}
            {activeModule === 'business' && 'Gestion métier ESN'}
            {activeModule === 'consultants' && 'Gestion des consultants'}
            {activeModule === 'reports' && 'Rapports et analyses'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              <Bell size={20} className="text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                AD
              </div>
              <div>
                <p className="text-sm font-medium">Alexandre Dupont</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Dashboard content demo */}
        <main className="flex-grow p-6 overflow-auto">
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Clients</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardData.clientCount}</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <ArrowRight size={12} className="text-green-500" /> 
                    <span className="text-gray-500">8 nouveaux ce mois-ci</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Projets actifs</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardData.activeProjects}</h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Briefcase size={20} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <ArrowRight size={12} className="text-green-500" /> 
                    <span className="text-gray-500">5 nouveaux projets démarrés</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Consultants</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardData.consultantsCount}</h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users size={20} className="text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <ArrowRight size={12} className="text-green-500" /> 
                    <span className="text-gray-500">3 recrutements récents</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Intercontrats</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardData.consultantsOnBench}</h3>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <UserX size={20} className="text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="text-orange-500">13,8% de l'effectif</span>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">CA mensuel</p>
                      <h3 className="text-2xl font-bold mt-1">{dashboardData.monthlyRevenue.toLocaleString()} €</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Euro size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <ArrowRight size={12} className="text-green-500" /> 
                    <span className="text-green-500">+8,2% vs mois précédent</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold">Évolution du chiffre d'affaires</h3>
                    <select className="text-sm border rounded p-1">
                      <option>12 derniers mois</option>
                      <option>Cette année</option>
                      <option>Année précédente</option>
                    </select>
                  </div>
                  
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Graphique d'évolution du CA ici</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold">Clients par secteur</h3>
                  </div>
                  
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">Graphique de répartition ici</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold">Derniers clients ajoutés</h3>
                    <button className="text-blue-600 text-sm">Voir tous</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">TechVision SA</p>
                          <p className="text-xs text-gray-500">Secteur technologique</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Nouveau</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Mairie de Bordeaux</p>
                          <p className="text-xs text-gray-500">Secteur public</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Nouveau</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">DataFlow Inc.</p>
                          <p className="text-xs text-gray-500">Services SaaS</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Nouveau</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-semibold">Alertes récentes</h3>
                    <button className="text-blue-600 text-sm">Voir toutes</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-red-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <UserX size={18} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Intercontrat &gt; 30 jours</p>
                          <p className="text-xs text-gray-500">Martin Dubois - 42 jours</p>
                        </div>
                      </div>
                      <button className="px-2 py-1 border text-xs rounded hover:bg-gray-100">Action</button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-yellow-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Calendar size={18} className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">Fin de projet prochaine</p>
                          <p className="text-xs text-gray-500">Projet Refonte SI - 14 jours</p>
                        </div>
                      </div>
                      <button className="px-2 py-1 border text-xs rounded hover:bg-gray-100">Action</button>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-blue-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Opportunité à fort potentiel</p>
                          <p className="text-xs text-gray-500">AssurTech - 350k€ (85%)</p>
                        </div>
                      </div>
                      <button className="px-2 py-1 border text-xs rounded hover:bg-gray-100">Voir</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Message pour les autres modules */}
          {(activeModule === 'clients' || 
            activeModule === 'business' || 
            activeModule === 'consultants' || 
            activeModule === 'reports') && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="p-4 rounded-full bg-blue-100 mb-4">
                {activeModule === 'clients' && <Building2 size={32} className="text-blue-600" />}
                {activeModule === 'business' && <Briefcase size={32} className="text-blue-600" />}
                {activeModule === 'consultants' && <Users size={32} className="text-blue-600" />}
                {activeModule === 'reports' && <LineChart size={32} className="text-blue-600" />}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Module de 
                {activeModule === 'clients' && ' gestion des clients'}
                {activeModule === 'business' && ' gestion métier ESN'}
                {activeModule === 'consultants' && ' gestion des consultants'}
                {activeModule === 'reports' && ' rapports et analyses'}
              </h3>
              <p className="text-gray-500 max-w-md text-center">
                Ceci est une démonstration de l'interface. Les modules complets ont été implémentés 
                dans les artefacts correspondants.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ESNManagementModule;

export { ESNManagementModule }