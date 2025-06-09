import React from 'react';
import { 
  Building2, Briefcase, LayoutDashboard, 
  Users, LineChart, Settings, LogOut, Bell,
  Search, Filter, Download, ChevronDown,
  User, FileText, AlertCircle
} from 'lucide-react';
import ESNManagementModule from './modules/ESNManagementModule';

function App() {
  const [activeModule, setActiveModule] = React.useState('dashboard');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotifications, setShowNotifications] = React.useState(false);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Consultant en intercontrat depuis 30 jours',
      time: '2h'
    },
    {
      id: 2,
      type: 'info',
      message: 'Nouvelle mission disponible chez TechVision',
      time: '4h'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Fin de mission dans 7 jours pour 3 consultants',
      time: '1j'
    }
  ];

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
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Filtres">
                <Filter size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Exporter">
                <Download size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                <Bell size={20} className="text-gray-600" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {notification.type === 'warning' && (
                              <AlertCircle size={20} className="text-orange-500" />
                            )}
                            {notification.type === 'info' && (
                              <FileText size={20} className="text-blue-500" />
                            )}
                            {notification.type === 'alert' && (
                              <AlertCircle size={20} className="text-red-500" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">Il y a {notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                AD
              </div>
              <button className="group relative text-left">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">Alexandre Dupont</p>
                    <p className="text-xs text-gray-500">Administrateur</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Administrateur</p>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    Mon profil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                    <Settings size={16} className="text-gray-500" />
                    Paramètres
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-grow overflow-hidden">
          <ESNManagementModule />
        </main>
      </div>
    </div>
  );
};

export default App;