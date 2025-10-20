import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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
import DataGridESN from './DataGridESN.tsx';
import ClientDashboard from './ClientDashboard.tsx';
import { ESNBusinessDashboard } from './ESNBusinessDashboard.tsx';
import ConsultantDashboard from './ConsultantDashboard';
import JobCreation from './JobCreation';
import ConsultantCalendar from './ConsultantCalendar';
import CVGenerator from '@/components/cv/CVGenerator';
import JobSearchModule from './JobSearchModule';
import CompteRenduActivite from './CompteRenduActivite';

// Composant principal de gestion de l'ESN
const ESNManagementModule = () => {
  const [activeModule, setActiveModule] = useState("clients");

  // Rendu du module actif
  const renderActiveModule = () => {
    switch (activeModule) {
      case "consultants":
        return <ConsultantDashboard />;
      case "job-creation":
        return <JobCreation />;
      case "calendar":
        return <ConsultantCalendar />;
      case "clients":
        return <ClientManagement />;
      case "business":
        return <ESNBusinessDashboard />; // Utilisation du nom corrigé
      case "cv":
        return <CVGenerator />;
      case "jobs":
        return <JobSearchModule />;
      case "cra":
        return <CompteRenduActivite />;
      default:
        return <ClientManagement />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation principale */}
      <div className="flex border-b bg-white px-4 py-2">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "clients" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("clients")}
          >
            <Building2 size={20} />
            <span>Clients</span>
          </button>
          
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "business" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("business")}
          >
            <Briefcase size={20} />
            <span>Métier ESN</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "consultants" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("consultants")}
          >
            <Users size={20} />
            <span>Consultants</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "job-creation" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("job-creation")}
          >
            <Plus size={20} />
            <span>Créer une offre</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "calendar" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("calendar")}
          >
            <Calendar size={20} />
            <span>Calendrier</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "cv" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("cv")}
          >
            <User size={20} />
            <span>Générateur CV</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "jobs" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("jobs")}
          >
            <Briefcase size={20} />
            <span>Job Board</span>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 font-medium rounded-md ${
              activeModule === "cra" 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveModule("cra")}
          >
            <FileText size={20} />
            <span>CRA</span>
          </button>
        </div>
      </div>
      
      {/* Contenu du module actif */}
      <div className="flex-grow relative">
        {renderActiveModule()}
      </div>
    </div>
  );
};

// Composant Modal pour l'ajout/édition de clients
const ClientModal = ({ isOpen, onClose, client = null, onSave }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    type: 'enterprise', // enterprise, public_sector, startup
    sector: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    notes: '',
    status: 'actif', // actif, prospect, inactif
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        id: client.id || Math.floor(Math.random() * 10000),
      });
    } else {
      setFormData({
        id: Math.floor(Math.random() * 10000),
        name: '',
        type: 'enterprise',
        sector: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France',
        notes: '',
        status: 'actif',
        createdAt: new Date().toISOString(),
      });
    }
  }, [client, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {client ? 'Modifier le client' : 'Ajouter un nouveau client'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du client *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type de client</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="enterprise">Entreprise</option>
                    <option value="public_sector">Secteur Public</option>
                    <option value="startup">Startup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Secteur d'activité</label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="actif">Client actif</option>
                    <option value="prospect">Prospect</option>
                    <option value="inactif">Client inactif</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contact principal</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom du contact"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Site web</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="www.exemple.fr"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ville</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code postal</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pays</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {client ? 'Mettre à jour' : 'Ajouter le client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Composant de détails du client
const ClientDetailsPanel = ({ client, onClose, onEdit, onDelete, projects = [], contracts = [] }) => {
  if (!client) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'enterprise': return <Building2 size={24} className="text-blue-500" />;
      case 'public_sector': return <Building size={24} className="text-purple-500" />;
      case 'startup': return <Building size={24} className="text-emerald-500" />;
      default: return <Building2 size={24} className="text-blue-500" />;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'actif': return 'Client actif';
      case 'prospect': return 'Prospect';
      case 'inactif': return 'Client inactif';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculer le CA total des projets en cours
  const caProjects = projects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Calculer le nombre de consultants actuellement en mission chez ce client
  const activeConsultants = projects
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.consultantCount || 0), 0);

  return (
    <Card className="w-96 h-full overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Détails du client</CardTitle>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(client)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(client.id)}
            className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-3 mb-4">
          {getTypeIcon(client.type)}
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            {client.sector && (
              <p className="text-sm text-gray-600">{client.sector}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
            {getStatusLabel(client.status)}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Client depuis {formatDate(client.createdAt)}
          </p>
        </div>

        {/* KPIs du client */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Calendar size={16} />
              <span className="text-sm font-medium">Projets actifs</span>
            </div>
            <p className="text-lg font-semibold">{projects.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <Euro size={16} />
              <span className="text-sm font-medium">CA en cours</span>
            </div>
            <p className="text-lg font-semibold">{caProjects.toLocaleString()} €</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <User size={16} />
              <span className="text-sm font-medium">Consultants</span>
            </div>
            <p className="text-lg font-semibold">{activeConsultants}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700 mb-1">
              <FileText size={16} />
              <span className="text-sm font-medium">Contrats</span>
            </div>
            <p className="text-lg font-semibold">{contracts.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {(client.contactName || client.contactEmail || client.contactPhone) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User size={16} /> Contact principal
              </h4>
              {client.contactName && (
                <p className="text-sm text-gray-600 pl-6">{client.contactName}</p>
              )}
              {client.contactEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                  <Mail size={14} />
                  <a href={`mailto:${client.contactEmail}`} className="hover:text-blue-500">
                    {client.contactEmail}
                  </a>
                </div>
              )}
              {client.contactPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                  <Phone size={14} />
                  <a href={`tel:${client.contactPhone}`} className="hover:text-blue-500">
                    {client.contactPhone}
                  </a>
                </div>
              )}
            </div>
          )}

          {client.website && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe size={16} /> Site web
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 pl-6">
                <a href={`https://${client.website}`} target="_blank" className="hover:text-blue-500">
                  {client.website}
                </a>
              </div>
            </div>
          )}

          {(client.address || client.city || client.postalCode) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin size={16} /> Adresse
              </h4>
              <div className="text-sm text-gray-600 pl-6 space-y-1">
                {client.address && <p>{client.address}</p>}
                {(client.postalCode || client.city) && (
                  <p>{[client.postalCode, client.city].filter(Boolean).join(' ')}</p>
                )}
                {client.country && <p>{client.country}</p>}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={16} /> Projets ({projects.length})
              </h4>
              <div className="space-y-3 pl-6 mt-2">
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-sm">{project.name}</h5>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'En cours'}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'completed' ? 'Terminé' : 
                         project.status === 'active' ? 'En cours' : 'Planifié'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-600 mt-2">{project.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserPlus size={12} />
                        <span>{project.consultantCount || 0} consultant(s)</span>
                      </div>
                      <div className="text-xs font-medium">
                        {project.amount ? `${project.amount.toLocaleString()} €` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contracts.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText size={16} /> Contrats ({contracts.length})
              </h4>
              <div className="space-y-3 pl-6 mt-2">
                {contracts.map(contract => (
                  <div 
                    key={contract.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-sm">{contract.name}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        contract.status === 'active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {contract.status === 'active' ? 'Actif' : 
                         contract.status === 'expired' ? 'Expiré' : 'En attente'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </div>
                    {contract.amount && (
                      <div className="text-xs font-medium mt-1">
                        Montant: {contract.amount.toLocaleString()} €
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {client.notes && (
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText size={16} /> Notes
              </h4>
              <p className="text-sm text-gray-600 pl-6 whitespace-pre-line">{client.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Composant principal de gestion des clients
const ClientManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Gestionnaires d'événements
  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = (clientData) => {
    if (clientData.id && clients.some(c => c.id === clientData.id)) {
      // Mise à jour d'un client existant
      setClients(clients.map(c => c.id === clientData.id ? clientData : c));
    } else {
      // Ajout d'un nouveau client
      setClients([...clients, clientData]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      setClients(clients.filter(c => c.id !== clientId));
      setSelectedClient(null);
    }
  };

  const handleViewClient = (row) => {
    const client = clients.find(c => c.id === row.id);
    if (client) {
      
      
      setSelectedClient(client);
    }
  };

  // Données d'exemple pour les clients
  // Configuration des colonnes de la grille
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
    },
    { 
      field: 'projects', 
      headerName: 'Projets', 
      width: 100,
      cellRenderer: (_, row) => {
        const clientProjects = projects.filter(p => p.clientId === row.id);
        const activeProjects = clientProjects.filter(p => p.status === 'active');
        
        if (clientProjects.length === 0) return '—';
        
        return (
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-blue-500" />
            <span>{activeProjects.length}/{clientProjects.length}</span>
          </div>
        );
      }
    },
    { 
      field: 'revenue', 
      headerName: 'CA en cours', 
      width: 120,
      type: 'number',
      cellRenderer: (_, row) => {
        const clientProjects = projects.filter(p => p.clientId === row.id && p.status === 'active');
        const totalRevenue = clientProjects.reduce((sum, p) => sum + (p.amount || 0), 0);
        
        if (totalRevenue === 0) return '—';
        
        return (
          <span className="font-medium text-green-600">
            {totalRevenue.toLocaleString()} €
          </span>
        );
      }
    },
    { 
      field: 'createdAt', 
      headerName: 'Client depuis', 
      width: 120,
      cellRenderer: (value) => {
        if (!value) return '';
        const date = new Date(value);
        return date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    }
  ];

  // Boutons d'action pour la grille
  const actionButtons = [
    {
      icon: <Plus size={18} />,
      onClick: handleAddClient,
      title: "Ajouter un client"
    }
  ];

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
    },
    {
      id: 3,
      name: "DataFlow",
      type: "startup",
      sector: "SaaS",
      contactName: "Sophie Martin",
      contactEmail: "sophie@dataflow.io",
      contactPhone: "+33 6 12 34 56 78",
      website: "www.dataflow.io",
      address: "45 Rue des Startups",
      city: "Bordeaux",
      postalCode: "33000",
      country: "France",
      notes: "Startup en forte croissance dans le domaine de l'analyse de données.",
      status: "prospect",
      createdAt: "2023-11-05T09:15:00Z"
    },
    {
      id: 4,
      name: "AssurTech International",
      type: "enterprise",
      sector: "Assurance",
      contactName: "Pierre Leclerc",
      contactEmail: "p.leclerc@assurtech.com",
      contactPhone: "+33 1 45 67 89 10",
      website: "www.assurtech.com",
      address: "8 Boulevard Haussmann",
      city: "Paris",
      postalCode: "75009",
      country: "France",
      notes: "Client multinational avec des besoins en transformation digitale.",
      status: "actif",
      createdAt: "2022-03-10T08:45:00Z"
    },
    {
      id: 5,
      name: "HôpitalPlus",
      type: "public_sector",
      sector: "Santé",
      contactName: "Isabelle Moreau",
      contactEmail: "i.moreau@hopitalplus.fr",
      contactPhone: "+33 3 45 67 89 12",
      website: "www.hopitalplus.fr",
      address: "15 Rue de la Santé",
      city: "Lille",
      postalCode: "59000",
      country: "France",
      notes: "Projet d'évolution du système d'information sanitaire.",
      status: "actif",
      createdAt: "2023-05-18T11:20:00Z"
    },
    {
      id: 6,
      name: "EduTech",
      type: "startup",
      sector: "Éducation",
      contactName: "Thomas Dubois",
      contactEmail: "thomas@edutech.fr",
      contactPhone: "+33 6 78 91 23 45",
      website: "www.edutech.fr",
      address: "23 Rue de l'Innovation",
      city: "Montpellier",
      postalCode: "34000",
      country: "France",
      notes: "Jeune startup spécialisée dans les solutions éducatives numériques.",
      status: "prospect",
      createdAt: "2024-01-15T14:10:00Z"
    },
    {
      id: 7,
      name: "BanqueDigitale",
      type: "enterprise",
      sector: "Finance",
      contactName: "Émilie Petit",
      contactEmail: "e.petit@banquedigitale.fr",
      contactPhone: "+33 1 56 78 90 12",
      website: "www.banquedigitale.fr",
      address: "12 Rue de la Banque",
      city: "Paris",
      postalCode: "75002",
      country: "France",
      notes: "Banque en ligne innovante en pleine expansion.",
      status: "actif",
      createdAt: "2023-09-01T08:00:00Z"
    }
  ]);

  return (
    <div className="flex h-full">
      <div className="flex-grow">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle>Gestion des Clients</CardTitle>
            
            <div className="flex items-center gap-3">
              {/* Boutons pour basculer entre les vues */}
              <div className="flex border rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 flex items-center gap-1 ${
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                  }`}
                >
                  <ListFilter size={16} />
                  <span className="text-sm">Liste</span>
                </button>
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-3 py-2 flex items-center gap-1 ${
                    viewMode === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                  }`}
                >
                  <BarChart2 size={16} />
                  <span className="text-sm">Tableau de bord</span>
                </button>
              </div>
              
              <button
                onClick={handleAddClient}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Ajouter un client</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            {viewMode === 'grid' ? (
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
                height="calc(100vh - 240px)"
                onRowClick={handleViewClient}
                actionButtons={actionButtons}
                defaultGroupedColumns={[]}
              />
            ) : (
              <ClientDashboard 
                clients={clients}
                projects={[]}
                contracts={[]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {selectedClient && viewMode === 'grid' && (
        <ClientDetailsPanel 
          client={selectedClient}
          projects={[]}
          contracts={[]}
          onClose={() => setSelectedClient(null)}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default ESNManagementModule;