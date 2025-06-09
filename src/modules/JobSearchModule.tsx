import React, { useState, useEffect, useCallback } from 'react';

// Import des icônes via lucide-react (supportée dans l'environnement)
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Award,
  X,
  Check,
  Upload
} from 'lucide-react';

const JobSearchModule = () => {
  // --------------------------------------------------
  // ÉTATS LOCAUX (STATES)
  // --------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [contractTypes, setContractTypes] = useState([]);
  const [remoteOption, setRemoteOption] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('date');
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showComparePanel, setShowComparePanel] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [notification, setNotification] = useState(null);

  // --------------------------------------------------
  // CHARGEMENT DES OFFRES (SIMULATION)
  // --------------------------------------------------
  useEffect(() => {
    /**
     * @function fetchJobs
     * @description Simule la récupération des offres depuis une API.
     */
    const fetchJobs = () => {
      const demoJobs = [
        {
          identifiantOffre: '1001',
          titrePoste: 'Développeur Full Stack JavaScript',
          nomEntreprise: 'TechInnovate',
          typesContratSelectionnes: ['CDI'],
          localisation: {
            ville: 'Paris',
            departement: '75',
            region: 'Île-de-France',
            pays: 'France',
          },
          optionTeletravail: 'hybride',
          joursTeletravail: 3,
          salaireMin: 45000,
          salaireMax: 60000,
          salaireDevise: '€',
          salairePeriode: 'Annuel',
          description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe dynamique.',
          responsabilites: [
            'Développement de nouvelles fonctionnalités',
            'Maintenance et amélioration des applications existantes'
          ],
          competences: ['React', 'Node.js', 'MongoDB', 'Express'],
          avantages: ['Tickets restaurant', 'Mutuelle', 'Formation continue'],
          datePublication: new Date('2025-03-20'),
          vues: 145,
          candidatures: 12
        },
        {
          identifiantOffre: '1002',
          titrePoste: 'Chef de Projet Digital',
          nomEntreprise: 'AgenceWeb+',
          typesContratSelectionnes: ['CDD'],
          localisation: {
            ville: 'Lyon',
            departement: '69',
            region: 'Auvergne-Rhône-Alpes',
            pays: 'France',
          },
          optionTeletravail: 'sur-site',
          joursTeletravail: 0,
          salaireMin: 40000,
          salaireMax: 50000,
          salaireDevise: '€',
          salairePeriode: 'Annuel',
          description: 'AgenceWeb+ recherche un Chef de Projet Digital expérimenté.',
          responsabilites: [
            'Gestion de projets web et mobiles',
            'Relation client'
          ],
          competences: ['Gestion de projet', 'Méthodes agiles', 'Suite Adobe'],
          avantages: ['RTT', 'Prime de performance'],
          datePublication: new Date('2025-03-25'),
          vues: 98,
          candidatures: 5
        },
        {
          identifiantOffre: '1003',
          titrePoste: 'Data Scientist',
          nomEntreprise: 'DataInsight',
          typesContratSelectionnes: ['CDI'],
          localisation: {
            ville: 'Toulouse',
            departement: '31',
            region: 'Occitanie',
            pays: 'France',
          },
          optionTeletravail: 'full-remote',
          joursTeletravail: 5,
          salaireMin: 55000,
          salaireMax: 70000,
          salaireDevise: '€',
          salairePeriode: 'Annuel',
          description: 'Rejoignez notre équipe de data scientists pour des missions passionnantes.',
          responsabilites: [
            'Analyse de données',
            'Création de modèles prédictifs'
          ],
          competences: ['Python', 'R', 'Machine Learning', 'SQL'],
          avantages: ['Horaires flexibles', 'Budget formation'],
          datePublication: new Date('2025-04-01'),
          vues: 210,
          candidatures: 18
        }
      ];

      setJobs(demoJobs);
      setFilteredJobs(demoJobs);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  // --------------------------------------------------
  // FONCTION DE FILTRAGE ET DE TRI
  // --------------------------------------------------
  /**
   * @function applyFilters
   * @description Applique les filtres et le tri sur la liste des offres.
   */
  const applyFilters = useCallback(() => {
    setLoading(true);

    setTimeout(() => {
      let results = [...jobs];

      // Filtre sur le mot-clé
      if (searchTerm) {
        results = results.filter(job =>
          job.titrePoste.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.competences.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Filtre sur la localisation
      if (location) {
        results = results.filter(job =>
          job.localisation.ville.toLowerCase().includes(location.toLowerCase()) ||
          job.localisation.departement.toLowerCase().includes(location.toLowerCase()) ||
          job.localisation.region.toLowerCase().includes(location.toLowerCase()) ||
          job.localisation.pays.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filtre sur les types de contrat
      if (contractTypes.length > 0) {
        results = results.filter(job =>
          job.typesContratSelectionnes.some(type => contractTypes.includes(type))
        );
      }

      // Filtre sur l'option de télétravail
      if (remoteOption) {
        results = results.filter(job => job.optionTeletravail === remoteOption);
      }

      // Salaire min
      const min = parseInt(salaryMin, 10);
      if (!isNaN(min)) {
        results = results.filter(job => job.salaireMin >= min);
      }

      // Salaire max
      const max = parseInt(salaryMax, 10);
      if (!isNaN(max)) {
        results = results.filter(job => job.salaireMax <= max);
      }

      // Tri
      if (sortOption === 'date') {
        results.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
      } else if (sortOption === 'salary') {
        results.sort((a, b) => b.salaireMax - a.salaireMax);
      }

      setFilteredJobs(results);
      setLoading(false);
    }, 300);
  }, [searchTerm, location, contractTypes, remoteOption, salaryMin, salaryMax, sortOption, jobs]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // --------------------------------------------------
  // MÉTHODES D'ACTION
  // --------------------------------------------------
  /**
   * @function handleJobSelect
   * @description Sélectionne une offre d'emploi pour afficher ses détails.
   * @param {object} job - L'offre sélectionnée
   */
  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  /**
   * @function formatSalary
   * @description Formate l'affichage du salaire.
   */
  const formatSalary = (min, max, devise, periode) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ${devise} ${periode}`;
  };

  /**
   * @function formatDate
   * @description Formate la date en français.
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  /**
   * @function toggleSaveJob
   * @description Ajoute ou retire une offre des favoris.
   */
  const toggleSaveJob = (jobId, event) => {
    event.stopPropagation();
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
  };
  
  /**
   * @function toggleSelectJob
   * @description Ajoute ou retire une offre de la sélection (panier).
   */
  const toggleSelectJob = (jobId, event) => {
    event.stopPropagation();
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  /**
   * @function hasApplied
   * @description Vérifie si on a déjà postulé à une offre.
   */
  const hasApplied = (idOffre) => {
    return applications.some(app => app.idOffre === idOffre);
  };

  /**
   * @function handleApply
   * @description Affiche la fenêtre modale de candidature.
   */
  const handleApply = () => {
    setShowApplicationModal(true);
  };

  /**
   * @function closeApplicationModal
   * @description Ferme la fenêtre modale de candidature.
   */
  const closeApplicationModal = () => {
    setShowApplicationModal(false);
  };

  /**
   * @function handleApplicationSubmit
   * @description Traite la soumission du formulaire de candidature.
   */
  const handleApplicationSubmit = (applicationData) => {
    setApplications([...applications, applicationData]);

    const updatedJobs = jobs.map(job => {
      if (job.identifiantOffre === applicationData.idOffre) {
        return {
          ...job,
          candidatures: job.candidatures + 1
        };
      }
      return job;
    });

    setJobs(updatedJobs);

    if (selectedJob && selectedJob.identifiantOffre === applicationData.idOffre) {
      const refreshed = updatedJobs.find(job => job.identifiantOffre === selectedJob.identifiantOffre);
      setSelectedJob(refreshed);
    }

    setNotification({
      message: "Votre candidature a été envoyée avec succès !",
      type: "success"
    });
  };

  /**
   * @function closeNotification
   * @description Ferme la notification.
   */
  const closeNotification = () => {
    setNotification(null);
  };
  
  /**
   * @function applyToSelectedJobs
   * @description Postuler à toutes les offres sélectionnées
   */
  const applyToSelectedJobs = () => {
    // Simuler l'envoi de candidatures multiples
    const newApplications = selectedJobs.map(jobId => ({
      idOffre: jobId,
      candidature: {
        nomComplet: "John Doe",
        email: "user@example.com",
        telephone: "+33 6 12 34 56 78",
        lettreMotivation: "Candidature automatique via le panier d'offres",
        cvTelecharge: true,
        conditionsAcceptees: true
      },
      horodatage: new Date()
    }));
    
    setApplications([...applications, ...newApplications]);
    
    // Mettre à jour les compteurs de candidatures
    const updatedJobs = jobs.map(job => {
      if (selectedJobs.includes(job.identifiantOffre)) {
        return {
          ...job,
          candidatures: job.candidatures + 1
        };
      }
      return job;
    });
    
    setJobs(updatedJobs);
    setFilteredJobs(updatedJobs);
    
    // Sauvegarder les jobs appliqués pour l'écran de confirmation
    const jobsApplied = jobs.filter(job => selectedJobs.includes(job.identifiantOffre));
    setAppliedJobs(jobsApplied);
    
    // Afficher la confirmation
    setShowSuccessModal(true);
    
    // Réinitialiser la sélection
    setSelectedJobs([]);
    setShowComparePanel(false);
  };

  // --------------------------------------------------
  // COMPOSANT ENFANT : MODALE DE CANDIDATURE
  // --------------------------------------------------
  const ApplicationModal = () => {
    const [formData, setFormData] = useState({
      nomComplet: '',
      email: '',
      telephone: '',
      lettreMotivation: '',
      cvTelecharge: false,
      conditionsAcceptees: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.nomComplet.trim()) newErrors.nomComplet = "Nom complet requis";
      if (!formData.email.trim()) {
        newErrors.email = "Email requis";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
      if (!formData.telephone.trim()) newErrors.telephone = "Téléphone requis";
      if (!formData.cvTelecharge) newErrors.cvTelecharge = "CV requis";
      if (!formData.conditionsAcceptees) newErrors.conditionsAcceptees = "Vous devez accepter les conditions";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (validateForm()) {
        setSubmitting(true);
                  setTimeout(() => {
          handleApplicationSubmit({
            idOffre: selectedJob.identifiantOffre,
            candidature: formData,
            horodatage: new Date(),
          });
          setSubmitting(false);
          closeApplicationModal();
        }, 1000);
      }
    };

    const handleFileUpload = () => {
      setFormData({
        ...formData,
        cvTelecharge: true,
      });
    };

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-bold">
              Postuler - {selectedJob.titrePoste}
            </h2>
            <button
              aria-label="Fermer la fenêtre de candidature"
              onClick={closeApplicationModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Votre nom complet"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre.email@exemple.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lettre de motivation</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md h-32 resize-none"
                  placeholder="Présentez-vous et expliquez pourquoi ce poste vous intéresse..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CV *</label>
                <div
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 ${
                    formData.resumeUploaded ? 'border-green-500 bg-green-50' : errors.resumeUploaded ? 'border-red-300' : 'border-gray-300'
                  }`}
                  onClick={handleFileUpload}
                >
                  {formData.resumeUploaded ? (
                    <div className="flex items-center justify-center text-green-600">
                      <Check color="#16A34A" size={24} className="mr-2" />
                      <span>CV téléchargé avec succès</span>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload color="#6B7280" size={24} className="mx-auto mb-2" />
                      <p>Cliquez pour télécharger votre CV</p>
                      <p className="text-xs mt-1">Formats acceptés: PDF, DOCX (max 5MB)</p>
                    </div>
                  )}
                </div>
                {errors.resumeUploaded && (
                  <p className="text-red-500 text-xs mt-1">{errors.resumeUploaded}</p>
                )}
              </div>

              <div className="flex items-start mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className={`mt-1 ${errors.agreedToTerms ? 'border-red-500' : ''}`}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  J'accepte que mes données soient traitées
                  conformément à la politique de confidentialité *
                </label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-xs">{errors.agreedToTerms}</p>
              )}

              <div className="border-t pt-4 mt-6">
                <p className="text-xs text-gray-500 mb-4">
                  Les champs marqués d'un * sont obligatoires
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeApplicationModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      'Soumettre ma candidature'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // COMPOSANT ENFANT : NOTIFICATION
  // --------------------------------------------------
  const Notification = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        closeNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div
        className={`fixed bottom-4 right-4 max-w-md p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50 ${
          notification.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
          notification.type === 'error' ? 'bg-red-100 border-l-4 border-red-500' :
          'bg-blue-100 border-l-4 border-blue-500'
        }`}
      >
        {notification.type === 'success' && <Check className="text-green-500" size={20} />}
        {notification.type === 'error' && <X className="text-red-500" size={20} />}
        <p className="flex-1">{notification.message}</p>
        <button
          onClick={closeNotification}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // --------------------------------------------------
  // COMPOSANT ENFANT : PANIER D'OFFRES
  // --------------------------------------------------
  const JobCart = () => {
    if (selectedJobs.length === 0) return null;
    
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-blue-500 text-white rounded-lg shadow-lg px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="font-medium">{selectedJobs.length} offre{selectedJobs.length > 1 ? 's' : ''} sélectionnée{selectedJobs.length > 1 ? 's' : ''}</span>
          </div>
          
          <div className="h-6 border-l border-blue-300 mx-1"></div>
          
          <button 
            className="flex items-center gap-1 hover:underline"
            onClick={() => setShowComparePanel(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 22H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4"></path>
              <path d="M21 22h-4"></path>
              <path d="M21 10h-4"></path>
              <path d="M7 10h10v4H7z"></path>
              <path d="M7 2h10v4H7z"></path>
              <path d="M7 18h10v4H7z"></path>
            </svg>
            <span>
              {selectedJobs.length}/{jobs.length}
            </span>
          </button>
        </div>
      </div>
    );
  };
  
  // --------------------------------------------------
  // COMPOSANT ENFANT : PANNEAU DE COMPARAISON
  // --------------------------------------------------
  const ComparePanel = () => {
    if (!showComparePanel) return null;
    
    const selectedJobsData = jobs.filter(job => selectedJobs.includes(job.identifiantOffre));
    
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Offres sélectionnées</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {selectedJobs.length} sélectionnée{selectedJobs.length > 1 ? 's' : ''}
              </span>
            </h2>
            <button
              onClick={() => setShowComparePanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4">
            {selectedJobsData.map(job => (
              <div 
                key={job.identifiantOffre}
                className="mb-4 p-3 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.titrePoste}</h3>
                    <p className="text-gray-600">{job.nomEntreprise}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{job.localisation.ville}, {job.localisation.pays}</span>
                    </div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {Math.floor(40 + Math.random() * 30)}% Match
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                    {job.typesContratSelectionnes.join(', ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    job.optionTeletravail === 'full-remote' ? 'bg-green-100 text-green-800' :
                    job.optionTeletravail === 'hybride' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.optionTeletravail === 'full-remote' ? 'Télétravail' :
                     job.optionTeletravail === 'hybride' ? 'Télétravail' : 'Sur site'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t flex justify-between">
            <button
              onClick={() => {
                setSelectedJobs([]);
                setShowComparePanel(false);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Effacer la sélection
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowComparePanel(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={applyToSelectedJobs}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
                Postuler aux offres sélectionnées
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // --------------------------------------------------
  // COMPOSANT ENFANT : MODAL DE SUCCÈS D'APPLICATION
  // --------------------------------------------------
  const SuccessModal = () => {
    if (!showSuccessModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Check size={24} color="green" />
              </div>
              <h2 className="text-xl font-bold">Candidatures envoyées avec succès !</h2>
            </div>
            
            <p className="mb-4 text-gray-600">Un email de confirmation a été envoyé à user@example.com</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Postes concernés</h3>
              {appliedJobs.map(job => (
                <div key={job.identifiantOffre} className="mb-2 p-3 border rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{job.titrePoste}</h4>
                      <p className="text-sm text-gray-600">{job.nomEntreprise}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {Math.floor(40 + Math.random() * 30)}% Match
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                      {job.typesContratSelectionnes[0]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      job.optionTeletravail === 'full-remote' || job.optionTeletravail === 'hybride' 
                        ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                      {job.optionTeletravail === 'full-remote' || job.optionTeletravail === 'hybride' 
                        ? 'Télétravail' : 'Sur site'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Prochaines étapes</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Consultez votre email pour une confirmation détaillée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Suivez le statut de vos candidatures dans votre tableau de bord</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Préparez-vous pour d'éventuels entretiens</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mettez à jour votre profil avec toute information complémentaire pertinente</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retour au Job Board
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // RENDU PRINCIPAL
  // --------------------------------------------------
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 gap-6">
      {/* Notification */}
      {notification && <Notification />}

      {/* Modale de candidature */}
      {showApplicationModal && selectedJob && <ApplicationModal />}
      
      {/* Panier d'offres */}
      <JobCart />
      
      {/* Panneau de comparaison */}
      <ComparePanel />
      
      {/* Modal de succès */}
      <SuccessModal />

      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase color="#3B82F6" />
          <span>JobBoard Pro</span>
        </h1>
      </div>

      {/* Formulaire de recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Champ de recherche (mot-clé) */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3" color="#9CA3AF" size={18} />
            <input
              type="text"
              placeholder="Mot-clé, titre, compétence..."
              className="w-full p-2 pl-10 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Localisation */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3" color="#9CA3AF" size={18} />
            <input
              type="text"
              placeholder="Ville, département, région..."
              className="w-full p-2 pl-10 border rounded-md"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Bouton Rechercher */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
          >
            Rechercher
          </button>

          {/* Bouton Filtres */}
          <button
            type="button"
            className="flex items-center gap-1 text-blue-600 border border-blue-600 py-2 px-4 rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            <span>Filtres</span>
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Bloc de filtres (affichage conditionnel) */}
        {showFilters && (
          <div className="mt-4 p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type de contrat */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type de contrat
                </label>
                <div className="flex flex-wrap gap-2">
                  {['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance'].map(type => (
                    <div
                      key={type}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                        contractTypes.includes(type)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100'
                      }`}
                      onClick={() => {
                        if (contractTypes.includes(type)) {
                          setContractTypes(contractTypes.filter(t => t !== type));
                        } else {
                          setContractTypes([...contractTypes, type]);
                        }
                      }}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              {/* Télétravail */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Télétravail
                </label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={remoteOption}
                  onChange={(e) => setRemoteOption(e.target.value)}
                >
                  <option value="">Tous</option>
                  <option value="full-remote">100% Télétravail</option>
                  <option value="hybride">Hybride</option>
                  <option value="sur-site">Sur site</option>
                </select>
              </div>

              {/* Salaire annuel */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salaire annuel (€)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 p-2 border rounded-md"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 p-2 border rounded-md"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setContractTypes([]);
                  setRemoteOption('');
                  setSalaryMin('');
                  setSalaryMax('');
                }}
              >
                Réinitialiser tous les filtres
              </button>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
                onClick={applyFilters}
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Offre sélectionnée (détails) OU liste des offres */}
      {selectedJob ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <button
              className="text-blue-600 flex items-center gap-1"
              onClick={() => setSelectedJob(null)}
            >
              ← Retour aux résultats
            </button>
          </div>

          <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold mb-2">{selectedJob.titrePoste}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Briefcase size={18} />
                <span>{selectedJob.nomEntreprise}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span>{selectedJob.localisation.ville}, {selectedJob.localisation.pays}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={18} />
                <span>
                  {formatSalary(
                    selectedJob.salaireMin,
                    selectedJob.salaireMax,
                    selectedJob.salaireDevise,
                    selectedJob.salairePeriode
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>Publié le {formatDate(selectedJob.datePublication)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedJob.typesContratSelectionnes.map(type => (
                <span
                  key={type}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {type}
                </span>
              ))}
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedJob.optionTeletravail === 'full-remote'
                    ? 'bg-green-100 text-green-800'
                    : selectedJob.optionTeletravail === 'hybride'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedJob.optionTeletravail === 'full-remote'
                  ? 'Télétravail complet'
                  : selectedJob.optionTeletravail === 'hybride'
                  ? `Hybride (${selectedJob.joursTeletravail} jours/semaine)`
                  : 'Sur site'}
              </span>
            </div>

            <div className="flex gap-2">
              {hasApplied(selectedJob.identifiantOffre) ? (
                <button
                  className="bg-green-600 text-white font-semibold py-2 px-6 rounded-md flex items-center gap-2 cursor-default"
                >
                  <Check size={18} color="white" />
                  <span>Candidature envoyée</span>
                </button>
              ) : (
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
                  onClick={handleApply}
                >
                  Postuler
                </button>
              )}
              <button
                className="border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md flex items-center gap-1"
                onClick={(e) => toggleSaveJob(selectedJob.identifiantOffre, e)}
              >
                <Star size={18} />
                <span>
                  {savedJobs.includes(selectedJob.identifiantOffre)
                    ? 'Sauvegardée'
                    : 'Sauvegarder'}
                </span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description du poste</h2>
            <p className="text-gray-700 mb-4">{selectedJob.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Responsabilités</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedJob.responsabilites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Compétences requises</h2>
            <div className="flex flex-wrap gap-2">
              {selectedJob.competences.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Avantages</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedJob.avantages.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-gray-500 flex gap-4">
            <div>Référence: {selectedJob.identifiantOffre}</div>
            <div>{selectedJob.vues} vues</div>
            <div>{selectedJob.candidatures} candidatures</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">
              {filteredJobs.length} offre
              {filteredJobs.length !== 1 ? 's' : ''} trouvée
              {filteredJobs.length !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Trier par:</label>
              <select
                className="border rounded-md p-1"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="salary">Salaire</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <div
                  key={job.identifiantOffre}
                  className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-blue-700 hover:underline">
                        {job.titrePoste}
                      </h2>
                      <div className="text-gray-700 mt-1">{job.nomEntreprise}</div>
                      <div className="flex items-center text-gray-600 mt-2">
                        <MapPin size={16} className="mr-1" />
                        <span>
                          {job.localisation.ville}, {job.localisation.pays}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-700 font-medium">
                        {formatSalary(
                          job.salaireMin,
                          job.salaireMax,
                          job.salaireDevise,
                          job.salairePeriode
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Publié le {formatDate(job.datePublication)}
                      </div>
                      <button
                        className="mt-2 hover:bg-gray-100 p-1 rounded-full"
                        onClick={(e) => toggleSaveJob(job.identifiantOffre, e)}
                      >
                        <Bookmark
                          size={18}
                          color={savedJobs.includes(job.identifiantOffre) ? "#3B82F6" : "#9CA3AF"}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.typesContratSelectionnes.map(type => (
                      <span
                        key={type}
                        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                      >
                        {type}
                      </span>
                    ))}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        job.optionTeletravail === 'full-remote'
                          ? 'bg-green-100 text-green-800'
                          : job.optionTeletravail === 'hybride'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.optionTeletravail === 'full-remote'
                        ? 'Télétravail complet'
                        : job.optionTeletravail === 'hybride'
                        ? `Hybride (${job.joursTeletravail} jours)`
                        : 'Sur site'}
                    </span>
                    {hasApplied(job.identifiantOffre) && (
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                        <Check size={12} color="currentColor" className="mr-1" />
                        Candidature envoyée
                      </span>
                    )}
                    <button
                      className={`px-2 py-0.5 rounded-full text-xs flex items-center ml-auto ${
                        selectedJobs.includes(job.identifiantOffre) 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={(e) => toggleSelectJob(job.identifiantOffre, e)}
                    >
                      {selectedJobs.includes(job.identifiantOffre) ? 'Sélectionnée' : 'Sélectionner'}
                    </button>
                  </div>

                  <div className="mt-3 line-clamp-2 text-gray-600 text-sm">
                    {job.description}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.competences.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.competences.length > 3 && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        +{job.competences.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredJobs.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Aucune offre ne correspond à vos critères
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos filtres ou élargissez votre recherche
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Section de conseils si aucune offre n'est sélectionnée */}
      {!selectedJob && !loading && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Award size={20} color="#2563EB" />
            <span>Conseils pour votre recherche</span>
          </h2>
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Utilisez des mots-clés précis pour cibler les offres qui
                  correspondent à vos compétences
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Activez les alertes pour recevoir les nouvelles offres
                  correspondant à vos critères
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  Sauvegardez les offres intéressantes pour y revenir plus tard
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearchModule;