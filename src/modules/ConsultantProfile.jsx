import React, { useState, useEffect } from 'react';
import { 
  User, Send, Check, AlertCircle, X, ChevronRight, ChevronLeft, Calendar, 
  MapPin, DollarSign, Briefcase, Users, Award, Edit3, Phone, Mail, Clock,
  Star, Plus, Minus, Clipboard, Download, FileText, Cpu, Book, Globe,
  PieChart, BarChart, ArrowUpRight, UserCheck, UserX, Percent, Layers, 
  Shield, Building, Wrench, Settings, Paperclip, Upload, Save, Eye, Search
} from 'lucide-react';

// Composant principal
const ConsultantProfile = () => {
  // État pour l'étape active
  const [etapeActive, setEtapeActive] = useState(1);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [showTooltip, setShowTooltip] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [previewMode, setPreviewMode] = useState('full');

  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    // Informations personnelles
    photo: null,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: {
      rue: '',
      codePostal: '',
      ville: '',
      pays: 'France'
    },
    
    // Informations professionnelles
    titre: '',
    niveau: '',
    anneeExperience: '',
    biographie: '',
    tauxJournalier: '',
    disponibilite: 'staffed', // 'staffed', 'available', 'soon_available', 'leave'
    dateDisponibilite: '',
    
    // Client actuel
    clientActuel: {
      nom: '',
      projet: '',
      dateDebut: '',
      dateFin: '',
      adresse: ''
    },
    
    // Compétences
    competencesTechniques: [],
    competencesTransverses: [],
    langues: [],
    certifications: [],
    
    // Formation
    formations: [],
    
    // Expériences
    experiences: [],
    
    // Évaluations
    evaluations: []
  });

  // États pour les champs temporaires
  const [competenceTechniqueTemp, setCompetenceTechniqueTemp] = useState('');
  const [competenceTransverseTemp, setCompetenceTransverseTemp] = useState('');
  const [langueTemp, setLangueTemp] = useState({ langue: '', niveau: 'intermediaire' });
  const [certificationTemp, setCertificationTemp] = useState({ nom: '', annee: '', organisme: '' });
  const [formationTemp, setFormationTemp] = useState({ diplome: '', etablissement: '', annee: '' });
  const [experienceTemp, setExperienceTemp] = useState({ 
    poste: '', 
    entreprise: '', 
    debut: '', 
    fin: '', 
    description: '',
    technologies: ''
  });
  const [evaluationTemp, setEvaluationTemp] = useState({ 
    date: '',
    evaluateur: '',
    technique: 3,
    communication: 3,
    autonomie: 3,
    problemSolving: 3,
    commentaire: ''
  });

  // Définition des niveaux d'expérience disponibles
  const niveauxExperience = [
    { id: 'junior', libelle: 'Junior (0-2 ans)' },
    { id: 'confirme', libelle: 'Confirmé (3-5 ans)' },
    { id: 'senior', libelle: 'Senior (6-9 ans)' },
    { id: 'expert', libelle: 'Expert (10+ ans)' }
  ];

  // Compétences suggérées
  const competencesSuggerees = {
    frontend: ['React', 'Angular', 'Vue.js', 'HTML/CSS', 'JavaScript', 'TypeScript', 'Redux', 'Next.js'],
    backend: ['Node.js', 'Java', 'Spring', 'Python', 'C#', '.NET', 'PHP', 'Ruby on Rails', 'GraphQL', 'REST'],
    database: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQL Server', 'Oracle', 'Redis', 'Elasticsearch'],
    devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible'],
    methodologies: ['Agile', 'Scrum', 'Kanban', 'DevOps', 'TDD', 'BDD', 'DDD', 'Clean Architecture']
  };

  // Langues disponibles
  const languesDisponibles = [
    'Français', 'Anglais', 'Allemand', 'Espagnol', 'Italien', 'Portugais', 'Néerlandais', 'Arabe', 'Russe', 'Chinois'
  ];

  // Niveaux de langue
  const niveauxLangue = [
    { id: 'debutant', libelle: 'Débutant (A1/A2)' },
    { id: 'intermediaire', libelle: 'Intermédiaire (B1/B2)' },
    { id: 'avance', libelle: 'Avancé (C1)' },
    { id: 'natif', libelle: 'Natif/Bilingue (C2)' }
  ];

  // Statuts de disponibilité
  const statutsDisponibilite = [
    { id: 'staffed', libelle: 'En mission', couleur: 'blue' },
    { id: 'available', libelle: 'Disponible', couleur: 'green' },
    { id: 'soon_available', libelle: 'Bientôt disponible', couleur: 'yellow' },
    { id: 'leave', libelle: 'En congé', couleur: 'gray' }
  ];

  // Définition des étapes
  const etapes = [
    { id: 1, titre: 'Informations de base' },
    { id: 2, titre: 'Compétences & Certifications' },
    { id: 3, titre: 'Expériences & Formation' },
    { id: 4, titre: 'Évaluations & Finalisation' }
  ];

  // Fonction pour naviguer entre les étapes
  const changerEtape = (nouvelleEtape) => {
    if (nouvelleEtape >= 1 && nouvelleEtape <= etapes.length) {
      validerEtapeActuelle() && setEtapeActive(nouvelleEtape);
      window.scrollTo(0, 0);
    }
  };

  // Validation de l'étape actuelle
  const validerEtapeActuelle = () => {
    const nouveauxErreurs = {};
    
    if (etapeActive === 1) {
      if (!formData.nom.trim()) nouveauxErreurs.nom = "Le nom est requis";
      if (!formData.prenom.trim()) nouveauxErreurs.prenom = "Le prénom est requis";
      if (!formData.email.trim()) nouveauxErreurs.email = "L'email est requis";
      if (!formData.titre.trim()) nouveauxErreurs.titre = "Le titre professionnel est requis";
    } 
    else if (etapeActive === 2) {
      if (formData.competencesTechniques.length === 0) nouveauxErreurs.competencesTechniques = "Ajoutez au moins une compétence technique";
    }
    else if (etapeActive === 3) {
      // Validation optionnelle pour les expériences et formations
    }

    setErreurs(nouveauxErreurs);
    return Object.keys(nouveauxErreurs).length === 0;
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gérer les champs imbriqués
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Auto-save après modification
    declencherAutoSave();
  };

  // Ajouter un élément à une liste
  const ajouterElement = (element, liste, setTemp) => {
    if (typeof element === 'string' && element.trim() !== '') {
      setFormData({
        ...formData,
        [liste]: [...formData[liste], element.trim()]
      });
      setTemp('');
      
      // Auto-save après modification
      declencherAutoSave();
    } else if (typeof element === 'object') {
      const isValid = Object.values(element).some(val => 
        typeof val === 'string' && val.trim() !== ''
      );
      
      if (isValid) {
        setFormData({
          ...formData,
          [liste]: [...formData[liste], element]
        });
        
        // Réinitialiser l'objet temporaire en conservant sa structure
        const emptyObject = Object.keys(element).reduce((acc, key) => {
          acc[key] = typeof element[key] === 'number' ? 3 : '';
          return acc;
        }, {});
        
        setTemp(emptyObject);
        
        // Auto-save après modification
        declencherAutoSave();
      }
    }
  };

  // Supprimer un élément d'une liste
  const supprimerElement = (index, liste) => {
    const nouvelleListe = [...formData[liste]];
    nouvelleListe.splice(index, 1);
    setFormData({
      ...formData,
      [liste]: nouvelleListe
    });
    
    // Auto-save après modification
    declencherAutoSave();
  };

  // Auto-save
  const declencherAutoSave = () => {
    setSaveStatus('saving');
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setSaveStatus('saved');
      
      // Masquer l'indicateur après quelques secondes
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }, 800);
  };

  // Fonction pour enregistrer le profil du consultant
  const enregistrerProfil = () => {
    // Validation de tous les champs requis
    const nouveauxErreurs = {};
    
    if (!formData.nom.trim()) nouveauxErreurs.nom = "Le nom est requis";
    if (!formData.prenom.trim()) nouveauxErreurs.prenom = "Le prénom est requis";
    if (!formData.email.trim()) nouveauxErreurs.email = "L'email est requis";
    if (!formData.titre.trim()) nouveauxErreurs.titre = "Le titre professionnel est requis";
    if (formData.competencesTechniques.length === 0) nouveauxErreurs.competencesTechniques = "Ajoutez au moins une compétence technique";
    
    setErreurs(nouveauxErreurs);
    
    if (Object.keys(nouveauxErreurs).length === 0) {
      setSaveStatus('publishing');
      
      // Simuler un enregistrement (dans un vrai système, ce serait un appel API)
      setTimeout(() => {
        setSaveStatus('published');
        setShowTooltip(true);
        
        setTimeout(() => {
          setSaveStatus(null);
          setShowTooltip(false);
        }, 3000);
      }, 1500);
    } else {
      // Trouver la première étape avec erreur et y aller
      if (nouveauxErreurs.nom || nouveauxErreurs.prenom || nouveauxErreurs.email || nouveauxErreurs.titre) {
        setEtapeActive(1);
      } else if (nouveauxErreurs.competencesTechniques) {
        setEtapeActive(2);
      }
    }
  };

  // Gestion du drag and drop pour les listes
  const handleDragStart = (e, index, liste) => {
    setIsDragging(true);
    setDragItem({ index, liste });
  };

  const handleDragOver = (e, index, liste) => {
    e.preventDefault();
    if (dragItem && dragItem.liste === liste && dragItem.index !== index) {
      // Réorganiser la liste
      const items = [...formData[liste]];
      const draggedItem = items[dragItem.index];
      
      // Créer une nouvelle liste sans l'élément déplacé
      const newItems = items.filter((_, idx) => idx !== dragItem.index);
      
      // Insérer l'élément à la nouvelle position
      newItems.splice(index, 0, draggedItem);
      
      // Mettre à jour l'état
      setFormData({
        ...formData,
        [liste]: newItems
      });
      
      // Mettre à jour la référence de l'élément déplacé
      setDragItem({ index, liste });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragItem(null);
    declencherAutoSave();
  };

  // Gérer le changement de la photo
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData({
          ...formData,
          photo: event.target.result
        });
        declencherAutoSave();
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Effet pour simuler le chargement initial des données
  useEffect(() => {
    setSaveStatus('loading');
    setTimeout(() => {
      // Simuler le chargement d'un consultant existant
      setFormData({
        // Informations personnelles
        photo: null,
        nom: 'Dubois',
        prenom: 'Thomas',
        email: 'thomas.dubois@exemple.com',
        telephone: '06 12 34 56 78',
        dateNaissance: '1990-05-15',
        adresse: {
          rue: '15 rue de la République',
          codePostal: '69001',
          ville: 'Lyon',
          pays: 'France'
        },
        
        // Informations professionnelles
        titre: 'Développeur Full Stack Senior',
        niveau: 'senior',
        anneeExperience: '8',
        biographie: 'Développeur passionné avec une solide expérience en développement full stack. Spécialisé dans les technologies JavaScript modernes et les architectures cloud.',
        tauxJournalier: '550',
        disponibilite: 'staffed',
        dateDisponibilite: '2024-07-15',
        
        // Client actuel
        clientActuel: {
          nom: 'Banque Nationale',
          projet: 'Refonte application mobile',
          dateDebut: '2023-09-01',
          dateFin: '2024-07-15',
          adresse: 'Paris'
        },
        
        // Compétences
        competencesTechniques: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB'],
        competencesTransverses: ['Gestion de projet', 'Communication', 'Travail d\'équipe', 'Leadership'],
        langues: [
          { langue: 'Français', niveau: 'natif' },
          { langue: 'Anglais', niveau: 'avance' }
        ],
        certifications: [
          { nom: 'AWS Solutions Architect', annee: '2022', organisme: 'Amazon Web Services' },
          { nom: 'Professional Scrum Master I', annee: '2021', organisme: 'Scrum.org' }
        ],
        
        // Formation
        formations: [
          { diplome: 'Master en Informatique', etablissement: 'Université Claude Bernard Lyon 1', annee: '2013' },
          { diplome: 'Licence en Informatique', etablissement: 'Université Claude Bernard Lyon 1', annee: '2011' }
        ],
        
        // Expériences
        experiences: [
          { 
            poste: 'Développeur Full Stack Senior', 
            entreprise: 'Votre ESN', 
            debut: '2020-01', 
            fin: '', 
            description: 'Missions de conseil auprès de grands comptes dans le secteur bancaire et e-commerce.',
            technologies: 'React, Node.js, AWS, TypeScript'
          },
          { 
            poste: 'Développeur Full Stack', 
            entreprise: 'PreviousCompany', 
            debut: '2017-03', 
            fin: '2019-12', 
            description: 'Développement d\'applications web pour le secteur de la santé.',
            technologies: 'Angular, Java Spring, PostgreSQL'
          },
          { 
            poste: 'Développeur Frontend', 
            entreprise: 'FirstCompany', 
            debut: '2014-06', 
            fin: '2017-02', 
            description: 'Création d\'interfaces utilisateur pour applications mobiles et web.',
            technologies: 'JavaScript, HTML5, CSS3, jQuery'
          }
        ],
        
        // Évaluations
        evaluations: [
          { 
            date: '2023-11-15',
            evaluateur: 'Julien Martin (Chef de projet)',
            technique: 4,
            communication: 5,
            autonomie: 4,
            problemSolving: 5,
            commentaire: 'Thomas s\'est montré très efficace sur ce projet, avec d\'excellentes capacités de communication et de résolution de problèmes.'
          },
          { 
            date: '2022-06-30',
            evaluateur: 'Sophie Bernard (Directrice technique)',
            technique: 4,
            communication: 4,
            autonomie: 5,
            problemSolving: 4,
            commentaire: 'Excellent travail sur le projet de refonte. Grande autonomie et expertise technique.'
          }
        ]
      });
      setSaveStatus(null);
    }, 800);
  }, []);

  // Rendu du composant selon l'étape active
  const rendreEtapeActive = () => {
    switch (etapeActive) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              
              <div className="mb-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/4">
                  <div className="relative w-40 h-40 mx-auto md:mx-0 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Photo du consultant" className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} className="text-gray-400" />
                    )}
                    
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="text-white text-center">
                        <Upload size={24} className="mx-auto mb-1" />
                        <span className="text-sm">Changer la photo</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  
                  <div className="mt-2 text-center md:text-left">
                    <button className="text-sm text-blue-500 hover:underline">
                      Supprimer la photo
                    </button>
                  </div>
                </div>
                
                <div className="w-full md:w-3/4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Nom de famille"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                          erreurs.nom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {erreurs.nom && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {erreurs.nom}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="Prénom"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                          erreurs.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {erreurs.prenom && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {erreurs.prenom}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute top-3.5 left-3 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="exemple@email.com"
                          className={`w-full p-3 pl-9 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                            erreurs.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {erreurs.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {erreurs.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute top-3.5 left-3 text-gray-400" />
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          placeholder="06 xx xx xx xx"
                          className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date de naissance
                      </label>
                      <div className="relative">
                        <Calendar size={16} className="absolute top-3.5 left-3 text-gray-400" />
                        <input
                          type="date"
                          name="dateNaissance"
                          value={formData.dateNaissance}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Adresse
                    </label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="adresse.rue"
                        value={formData.adresse.rue}
                        onChange={handleInputChange}
                        placeholder="Rue et numéro"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="adresse.codePostal"
                          value={formData.adresse.codePostal}
                          onChange={handleInputChange}
                          placeholder="Code postal"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                        />
                        
                        <input
                          type="text"
                          name="adresse.ville"
                          value={formData.adresse.ville}
                          onChange={handleInputChange}
                          placeholder="Ville"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                        />
                      </div>
                      
                      <select
                        name="adresse.pays"
                        value={formData.adresse.pays}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Titre professionnel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    placeholder="ex: Développeur Full Stack Senior"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                      erreurs.titre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {erreurs.titre && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {erreurs.titre}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Niveau d'expérience
                    </label>
                    <select
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                    >
                      <option value="">Sélectionner un niveau</option>
                      {niveauxExperience.map(niveau => (
                        <option key={niveau.id} value={niveau.id}>{niveau.libelle}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Années d'expérience
                    </label>
                    <input
                      type="number"
                      name="anneeExperience"
                      value={formData.anneeExperience}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      placeholder="ex: 8"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Taux journalier moyen (TJM)
                  </label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="number"
                      name="tauxJournalier"
                      value={formData.tauxJournalier}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="ex: 550"
                      className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Biographie / Présentation
                  </label>
                  <textarea
                    name="biographie"
                    value={formData.biographie}
                    onChange={handleInputChange}
                    placeholder="Décrivez brièvement le profil professionnel du consultant..."
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all resize-y"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Statut de disponibilité
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statutsDisponibilite.map(statut => (
                      <button
                        key={statut.id}
                        onClick={() => setFormData({...formData, disponibilite: statut.id})}
                        className={`px-3 py-2 rounded-md border transition-all ${
                          formData.disponibilite === statut.id
                            ? `bg-${statut.couleur}-100 text-${statut.couleur}-700 border-${statut.couleur}-300 font-medium`
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {statut.libelle}
                      </button>
                    ))}
                  </div>
                </div>
                
                {(formData.disponibilite === 'soon_available' || formData.disponibilite === 'staffed') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date de disponibilité
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute top-3.5 left-3 text-gray-400" />
                      <input
                        type="date"
                        name="dateDisponibilite"
                        value={formData.dateDisponibilite}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Client actuel</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom du client
                    </label>
                    <input
                      type="text"
                      name="clientActuel.nom"
                      value={formData.clientActuel.nom}
                      onChange={handleInputChange}
                      placeholder="ex: Société XYZ"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Projet
                    </label>
                    <input
                      type="text"
                      name="clientActuel.projet"
                      value={formData.clientActuel.projet}
                      onChange={handleInputChange}
                      placeholder="ex: Refonte du site e-commerce"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date de début
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute top-3.5 left-3 text-gray-400" />
                      <input
                        type="date"
                        name="clientActuel.dateDebut"
                        value={formData.clientActuel.dateDebut}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date de fin prévue
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute top-3.5 left-3 text-gray-400" />
                      <input
                        type="date"
                        name="clientActuel.dateFin"
                        value={formData.clientActuel.dateFin}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Localisation
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="clientActuel.adresse"
                      value={formData.clientActuel.adresse}
                      onChange={handleInputChange}
                      placeholder="ex: Paris"
                      className="w-full p-3 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Compétences techniques <span className="text-red-500">*</span></h3>
              
              <div className="mb-4 flex flex-wrap">
                {formData.competencesTechniques.map((comp, index) => (
                  <div key={index} className="inline-block m-1 p-2 pr-1 bg-blue-100 rounded-md flex items-center">
                    {comp}
                    <button 
                      onClick={() => supprimerElement(index, 'competencesTechniques')}
                      className="ml-1 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {erreurs.competencesTechniques && formData.competencesTechniques.length === 0 && (
                <p className="text-red-500 text-sm mb-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {erreurs.competencesTechniques}
                </p>
              )}
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={competenceTechniqueTemp}
                  onChange={(e) => setCompetenceTechniqueTemp(e.target.value)}
                  placeholder="Ajouter une compétence technique"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(competenceTechniqueTemp, 'competencesTechniques', setCompetenceTechniqueTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(competenceTechniqueTemp, 'competencesTechniques', setCompetenceTechniqueTemp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Frontend</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.frontend.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competencesTechniques.includes(comp)) {
                            setFormData({
                              ...formData,
                              competencesTechniques: [...formData.competencesTechniques, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competencesTechniques.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competencesTechniques.includes(comp) 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Backend</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.backend.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competencesTechniques.includes(comp)) {
                            setFormData({
                              ...formData,
                              competencesTechniques: [...formData.competencesTechniques, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competencesTechniques.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competencesTechniques.includes(comp) 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Base de données</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.database.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competencesTechniques.includes(comp)) {
                            setFormData({
                              ...formData,
                              competencesTechniques: [...formData.competencesTechniques, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competencesTechniques.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competencesTechniques.includes(comp) 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">DevOps & Cloud</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.devops.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competencesTechniques.includes(comp)) {
                            setFormData({
                              ...formData,
                              competencesTechniques: [...formData.competencesTechniques, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competencesTechniques.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competencesTechniques.includes(comp) 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Méthodologies</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.methodologies.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competencesTechniques.includes(comp)) {
                            setFormData({
                              ...formData,
                              competencesTechniques: [...formData.competencesTechniques, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competencesTechniques.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competencesTechniques.includes(comp) 
                            ? 'bg-blue-100 text-blue-700 border-blue-300' 
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Compétences transverses</h3>
              
              <div className="mb-4 flex flex-wrap">
                {formData.competencesTransverses.map((comp, index) => (
                  <div key={index} className="inline-block m-1 p-2 pr-1 bg-green-100 rounded-md flex items-center">
                    {comp}
                    <button 
                      onClick={() => supprimerElement(index, 'competencesTransverses')}
                      className="ml-1 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={competenceTransverseTemp}
                  onChange={(e) => setCompetenceTransverseTemp(e.target.value)}
                  placeholder="Ajouter une compétence transverse"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(competenceTransverseTemp, 'competencesTransverses', setCompetenceTransverseTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(competenceTransverseTemp, 'competencesTransverses', setCompetenceTransverseTemp)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="flex flex-wrap">
                {['Gestion de projet', 'Communication', 'Travail d\'équipe', 'Leadership', 'Résolution de problèmes', 'Gestion du temps', 'Adaptabilité', 'Créativité', 'Esprit analytique', 'Prise de décision'].map((comp, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!formData.competencesTransverses.includes(comp)) {
                        setFormData({
                          ...formData,
                          competencesTransverses: [...formData.competencesTransverses, comp]
                        });
                        declencherAutoSave();
                      }
                    }}
                    disabled={formData.competencesTransverses.includes(comp)}
                    className={`m-1 px-3 py-1 rounded-md text-sm border ${
                      formData.competencesTransverses.includes(comp) 
                        ? 'bg-green-100 text-green-700 border-green-300' 
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Langues</h3>
              
              <div className="mb-4">
                {formData.langues.map((langueObj, index) => (
                  <div 
                    key={index} 
                    className="flex items-center mb-2"
                  >
                    <div className="flex-grow p-2 bg-purple-50 border border-purple-200 rounded-md flex justify-between items-center">
                      <div className="flex items-center">
                        <Globe size={16} className="text-purple-500 mr-2" />
                        <span>{langueObj.langue}</span>
                      </div>
                      <span className="text-sm px-2 py-0.5 bg-purple-100 rounded">
                        {niveauxLangue.find(n => n.id === langueObj.niveau)?.libelle || langueObj.niveau}
                      </span>
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'langues')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="col-span-2">
                  <select
                    value={langueTemp.langue}
                    onChange={(e) => setLangueTemp({...langueTemp, langue: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                  >
                    <option value="">Sélectionner une langue</option>
                    {languesDisponibles
                      .filter(langue => !formData.langues.some(l => l.langue === langue))
                      .map((langue, index) => (
                        <option key={index} value={langue}>{langue}</option>
                      ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={langueTemp.niveau}
                    onChange={(e) => setLangueTemp({...langueTemp, niveau: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                  >
                    {niveauxLangue.map(niveau => (
                      <option key={niveau.id} value={niveau.id}>{niveau.id.charAt(0).toUpperCase() + niveau.id.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                onClick={() => langueTemp.langue && ajouterElement(langueTemp, 'langues', () => setLangueTemp({ langue: '', niveau: 'intermediaire' }))}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full"
                disabled={!langueTemp.langue}
              >
                <Plus size={20} className="mr-2" />
                Ajouter cette langue
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Certifications</h3>
              
              <div className="mb-4">
                {formData.certifications.map((certif, index) => (
                  <div 
                    key={index} 
                    className="flex items-center mb-2"
                  >
                    <div className="flex-grow p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Award size={16} className="text-yellow-600 mr-2" />
                          <span className="font-medium">{certif.nom}</span>
                        </div>
                        <span className="text-sm">{certif.annee}</span>
                      </div>
                      {certif.organisme && (
                        <div className="text-sm text-gray-600 mt-1 ml-6">
                          {certif.organisme}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'certifications')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-2 mb-2">
                <input
                  type="text"
                  value={certificationTemp.nom}
                  onChange={(e) => setCertificationTemp({...certificationTemp, nom: e.target.value})}
                  placeholder="Nom de la certification"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={certificationTemp.organisme}
                    onChange={(e) => setCertificationTemp({...certificationTemp, organisme: e.target.value})}
                    placeholder="Organisme certificateur"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                  
                  <input
                    type="text"
                    value={certificationTemp.annee}
                    onChange={(e) => setCertificationTemp({...certificationTemp, annee: e.target.value})}
                    placeholder="Année d'obtention"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => certificationTemp.nom && ajouterElement(certificationTemp, 'certifications', () => setCertificationTemp({ nom: '', annee: '', organisme: '' }))}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full"
                disabled={!certificationTemp.nom}
              >
                <Plus size={20} className="mr-2" />
                Ajouter cette certification
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Expériences professionnelles</h3>
              
              <div className="mb-4">
                {formData.experiences.map((exp, index) => (
                  <div 
                    key={index} 
                    className="flex items-start mb-4"
                  >
                    <div className="flex-grow p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-lg">{exp.poste}</div>
                        <div className="text-sm bg-blue-100 px-2 py-0.5 rounded">
                          {exp.debut} {exp.fin ? `- ${exp.fin}` : '- présent'}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-700 mb-2">
                        <Briefcase size={16} className="mr-2 text-blue-500" />
                        {exp.entreprise}
                      </div>
                      
                      {exp.description && (
                        <div className="mb-2 text-gray-600">
                          {exp.description}
                        </div>
                      )}
                      
                      {exp.technologies && (
                        <div className="flex flex-wrap">
                          {exp.technologies.split(',').map((tech, techIndex) => (
                            <span key={techIndex} className="bg-white border border-blue-200 rounded-md px-2 py-0.5 text-sm text-blue-700 mr-1 mb-1">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'experiences')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="border border-gray-300 rounded-md p-4 mb-4">
                <h4 className="font-medium mb-3">Ajouter une expérience</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={experienceTemp.poste}
                    onChange={(e) => setExperienceTemp({...experienceTemp, poste: e.target.value})}
                    placeholder="Intitulé du poste"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                  
                  <input
                    type="text"
                    value={experienceTemp.entreprise}
                    onChange={(e) => setExperienceTemp({...experienceTemp, entreprise: e.target.value})}
                    placeholder="Nom de l'entreprise"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm mb-1">Date de début</label>
                    <input
                      type="month"
                      value={experienceTemp.debut}
                      onChange={(e) => setExperienceTemp({...experienceTemp, debut: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Date de fin (vide si en cours)</label>
                    <input
                      type="month"
                      value={experienceTemp.fin}
                      onChange={(e) => setExperienceTemp({...experienceTemp, fin: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <textarea
                    value={experienceTemp.description}
                    onChange={(e) => setExperienceTemp({...experienceTemp, description: e.target.value})}
                    placeholder="Description des responsabilités et réalisations"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all resize-y"
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="text"
                    value={experienceTemp.technologies}
                    onChange={(e) => setExperienceTemp({...experienceTemp, technologies: e.target.value})}
                    placeholder="Technologies utilisées (séparées par des virgules)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
                
                <button 
                  onClick={() => (experienceTemp.poste && experienceTemp.entreprise && experienceTemp.debut) && 
                    ajouterElement(experienceTemp, 'experiences', () => setExperienceTemp({ 
                      poste: '', 
                      entreprise: '', 
                      debut: '', 
                      fin: '', 
                      description: '',
                      technologies: ''
                    }))}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full"
                  disabled={!experienceTemp.poste || !experienceTemp.entreprise || !experienceTemp.debut}
                >
                  <Plus size={20} className="mr-2" />
                  Ajouter cette expérience
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Formation</h3>
              
              <div className="mb-4">
                {formData.formations.map((formation, index) => (
                  <div 
                    key={index} 
                    className="flex items-center mb-2"
                  >
                    <div className="flex-grow p-2 bg-indigo-50 border border-indigo-200 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Book size={16} className="text-indigo-600 mr-2" />
                          <span className="font-medium">{formation.diplome}</span>
                        </div>
                        <span className="text-sm">{formation.annee}</span>
                      </div>
                      {formation.etablissement && (
                        <div className="text-sm text-gray-600 mt-1 ml-6">
                          {formation.etablissement}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'formations')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-2 mb-2">
                <input
                  type="text"
                  value={formationTemp.diplome}
                  onChange={(e) => setFormationTemp({...formationTemp, diplome: e.target.value})}
                  placeholder="Diplôme ou formation"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formationTemp.etablissement}
                    onChange={(e) => setFormationTemp({...formationTemp, etablissement: e.target.value})}
                    placeholder="Établissement"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                  
                  <input
                    type="text"
                    value={formationTemp.annee}
                    onChange={(e) => setFormationTemp({...formationTemp, annee: e.target.value})}
                    placeholder="Année d'obtention"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => formationTemp.diplome && ajouterElement(formationTemp, 'formations', () => setFormationTemp({ diplome: '', etablissement: '', annee: '' }))}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full"
                disabled={!formationTemp.diplome}
              >
                <Plus size={20} className="mr-2" />
                Ajouter cette formation
              </button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Évaluations du consultant</h3>
              
              <div className="mb-4">
                {formData.evaluations.map((evaluation, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-50 border border-gray-200 rounded-md mb-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Évaluation du {evaluation.date}</div>
                      <button 
                        onClick={() => supprimerElement(index, 'evaluations')}
                        className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      Par {evaluation.evaluateur}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">Technique</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <Star 
                              key={rating} 
                              size={16} 
                              className={`${
                                rating <= evaluation.technique ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">Communication</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <Star 
                              key={rating} 
                              size={16} 
                              className={`${
                                rating <= evaluation.communication ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">Autonomie</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <Star 
                              key={rating} 
                              size={16} 
                              className={`${
                                rating <= evaluation.autonomie ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-2 rounded border">
                        <span className="text-sm text-gray-700">Résolution de problèmes</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(rating => (
                            <Star 
                              key={rating} 
                              size={16} 
                              className={`${
                                rating <= evaluation.problemSolving ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {evaluation.commentaire && (
                      <div className="bg-white p-2 rounded border text-sm">
                        {evaluation.commentaire}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="border border-gray-300 rounded-md p-4 mb-4">
                <h4 className="font-medium mb-3">Ajouter une évaluation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm mb-1">Date d'évaluation</label>
                    <input
                      type="date"
                      value={evaluationTemp.date}
                      onChange={(e) => setEvaluationTemp({...evaluationTemp, date: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Évaluateur</label>
                    <input
                      type="text"
                      value={evaluationTemp.evaluateur}
                      onChange={(e) => setEvaluationTemp({...evaluationTemp, evaluateur: e.target.value})}
                      placeholder="Nom et fonction"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm mb-1">Niveau technique</label>
                    <div className="flex bg-white p-2 rounded border">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Star 
                          key={rating} 
                          size={24} 
                          className={`cursor-pointer ${
                            rating <= evaluationTemp.technique ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                          onClick={() => setEvaluationTemp({...evaluationTemp, technique: rating})}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Communication</label>
                    <div className="flex bg-white p-2 rounded border">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Star 
                          key={rating} 
                          size={24} 
                          className={`cursor-pointer ${
                            rating <= evaluationTemp.communication ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                          onClick={() => setEvaluationTemp({...evaluationTemp, communication: rating})}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Autonomie</label>
                    <div className="flex bg-white p-2 rounded border">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Star 
                          key={rating} 
                          size={24} 
                          className={`cursor-pointer ${
                            rating <= evaluationTemp.autonomie ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                          onClick={() => setEvaluationTemp({...evaluationTemp, autonomie: rating})}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Résolution de problèmes</label>
                    <div className="flex bg-white p-2 rounded border">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <Star 
                          key={rating} 
                          size={24} 
                          className={`cursor-pointer ${
                            rating <= evaluationTemp.problemSolving ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                          onClick={() => setEvaluationTemp({...evaluationTemp, problemSolving: rating})}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm mb-1">Commentaires</label>
                  <textarea
                    value={evaluationTemp.commentaire}
                    onChange={(e) => setEvaluationTemp({...evaluationTemp, commentaire: e.target.value})}
                    placeholder="Commentaires et observations"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all resize-y"
                  />
                </div>
                
                <button 
                  onClick={() => (evaluationTemp.date && evaluationTemp.evaluateur) && 
                    ajouterElement(evaluationTemp, 'evaluations', () => setEvaluationTemp({ 
                      date: '',
                      evaluateur: '',
                      technique: 3,
                      communication: 3,
                      autonomie: 3,
                      problemSolving: 3,
                      commentaire: ''
                    }))}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center w-full"
                  disabled={!evaluationTemp.date || !evaluationTemp.evaluateur}
                >
                  <Plus size={20} className="mr-2" />
                  Ajouter cette évaluation
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Finalisation</h3>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Check size={20} className="text-blue-500 mr-2" />
                  <span className="font-medium">Dernière vérification</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vérifiez que toutes les informations sont correctes avant d'enregistrer le profil de ce consultant.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="checkVisible" className="mr-2" defaultChecked />
                  <label htmlFor="checkVisible">
                    Consultant visible dans le système (actif)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="checkNotifs" className="mr-2" defaultChecked />
                  <label htmlFor="checkNotifs">
                    Envoyer les notifications aux managers
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="checkEmails" className="mr-2" defaultChecked />
                  <label htmlFor="checkEmails">
                    Envoyer un e-mail au consultant
                  </label>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Dernière modification: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <User size={14} className="text-gray-500" />
                  </div>
                  <div className="text-sm">
                    <div>Modifié par</div>
                    <div className="font-medium">Admin ESN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Étape inconnue</div>;
    }
  };
  
  // Rendu de la prévisualisation du profil consultant
  const rendrePrevisualisation = () => {
    // Calculer la note moyenne
    const calculerNoteMoyenne = () => {
      if (formData.evaluations.length === 0) return 0;
      
      const somme = formData.evaluations.reduce((total, eval) => {
        return total + eval.technique + eval.communication + eval.autonomie + eval.problemSolving;
      }, 0);
      
      return (somme / (formData.evaluations.length * 4)).toFixed(1);
    };
    
    // Déterminer l'icône de disponibilité
    const getDisponibiliteIcon = () => {
      switch (formData.disponibilite) {
        case 'available':
          return <UserCheck size={16} className="text-green-500" />;
        case 'soon_available':
          return <Clock size={16} className="text-yellow-500" />;
        case 'leave':
          return <UserX size={16} className="text-gray-500" />;
        default:
          return <Briefcase size={16} className="text-blue-500" />;
      }
    };
    
    // Déterminer le texte de disponibilité
    const getDisponibiliteText = () => {
      const statut = statutsDisponibilite.find(s => s.id === formData.disponibilite);
      if (!statut) return 'Statut inconnu';
      
      if (formData.disponibilite === 'staffed' || formData.disponibilite === 'soon_available') {
        return `${statut.libelle}${formData.dateDisponibilite ? ` jusqu'au ${formData.dateDisponibilite}` : ''}`;
      }
      
      return statut.libelle;
    };
    
    // Déterminer la couleur de disponibilité
    const getDisponibiliteCouleur = () => {
      const statut = statutsDisponibilite.find(s => s.id === formData.disponibilite);
      return statut ? statut.couleur : 'gray';
    };
    
    // Générer une classe pour la couleur de fond selon le statut
    const getBgColor = () => {
      switch (formData.disponibilite) {
        case 'available':
          return 'bg-green-50';
        case 'soon_available':
          return 'bg-yellow-50';
        case 'leave':
          return 'bg-gray-50';
        default:
          return 'bg-blue-50';
      }
    };
    
    return (
      <div className="border rounded-lg bg-white overflow-hidden h-full flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
          <span className="font-medium ml-2">Prévisualisation du profil</span>
          <div className="flex items-center">
            <button 
              onClick={() => setPreviewMode('full')}
              className={`p-2 rounded-md ${previewMode === 'full' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => setPreviewMode('search')}
              className={`p-2 rounded-md ml-2 ${previewMode === 'search' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Search size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-2 flex-grow overflow-auto">
          {previewMode === 'full' ? (
            // Vue détaillée du profil
            <div className="p-4">
              {/* En-tête du profil */}
              <div className={`p-4 rounded-lg mb-4 ${getBgColor()} border border-${getDisponibiliteCouleur()}-200`}>
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-3 md:mb-0 md:mr-4 border-4 border-white shadow">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Photo du consultant" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-center md:text-left">
                      <h1 className="text-xl md:text-2xl font-bold">
                        {formData.prenom} {formData.nom || 'Sans nom'}
                      </h1>
                      <p className="text-gray-600">{formData.titre || 'Titre non spécifié'}</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start mt-2 gap-2">
                      <div className={`px-2 py-1 rounded-md text-sm bg-${getDisponibiliteCouleur()}-100 text-${getDisponibiliteCouleur()}-700 flex items-center border border-${getDisponibiliteCouleur()}-200`}>
                        {getDisponibiliteIcon()}
                        <span className="ml-1">{getDisponibiliteText()}</span>
                      </div>
                      
                      {formData.niveau && (
                        <div className="px-2 py-1 rounded-md text-sm bg-purple-100 text-purple-700 border border-purple-200">
                          {niveauxExperience.find(n => n.id === formData.niveau)?.libelle || formData.niveau}
                        </div>
                      )}
                      
                      {formData.tauxJournalier && (
                        <div className="px-2 py-1 rounded-md text-sm bg-green-100 text-green-700 border border-green-200 flex items-center">
                          <DollarSign size={14} className="mr-1" />
                          {formData.tauxJournalier} € / jour
                        </div>
                      )}
                      
                      {calculerNoteMoyenne() > 0 && (
                        <div className="px-2 py-1 rounded-md text-sm bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center">
                          <Star size={14} className="mr-1" />
                          {calculerNoteMoyenne()} / 5
                        </div>
                      )}
                      
                      {formData.anneeExperience && (
                        <div className="px-2 py-1 rounded-md text-sm bg-blue-100 text-blue-700 border border-blue-200 flex items-center">
                          <Briefcase size={14} className="mr-1" />
                          {formData.anneeExperience} {formData.anneeExperience > 1 ? 'ans' : 'an'} d'expérience
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 md:mt-0 flex flex-col items-center">
                    {formData.disponibilite === 'staffed' && formData.clientActuel.nom && (
                      <div className="text-center md:text-right mb-2">
                        <span className="text-sm text-gray-500">Client actuel</span>
                        <div className="font-medium">{formData.clientActuel.nom}</div>
                        <div className="text-sm text-gray-600">{formData.clientActuel.projet}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
                  {formData.email && (
                    <div className="flex items-center text-sm">
                      <Mail size={14} className="text-gray-500 mr-1 flex-shrink-0" />
                      <span className="truncate">{formData.email}</span>
                    </div>
                  )}
                  
                  {formData.telephone && (
                    <div className="flex items-center text-sm">
                      <Phone size={14} className="text-gray-500 mr-1 flex-shrink-0" />
                      <span>{formData.telephone}</span>
                    </div>
                  )}
                  
                  {formData.adresse.ville && (
                    <div className="flex items-center text-sm">
                      <MapPin size={14} className="text-gray-500 mr-1 flex-shrink-0" />
                      <span>{formData.adresse.ville}, {formData.adresse.pays}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Biographie */}
              {formData.biographie && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">À propos</h2>
                  <p className="text-gray-700">{formData.biographie}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Compétences techniques */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Cpu size={18} className="mr-2 text-blue-500" />
                    Compétences techniques
                  </h2>
                  <div className="flex flex-wrap">
                    {formData.competencesTechniques.map((comp, index) => (
                      <span key={index} className="m-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                        {comp}
                      </span>
                    ))}
                    {formData.competencesTechniques.length === 0 && (
                      <span className="text-gray-400 italic">Aucune compétence technique spécifiée</span>
                    )}
                  </div>
                </div>
                
                {/* Compétences transverses */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Users size={18} className="mr-2 text-green-500" />
                    Compétences transverses
                  </h2>
                  <div className="flex flex-wrap">
                    {formData.competencesTransverses.map((comp, index) => (
                      <span key={index} className="m-1 px-3 py-1 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                        {comp}
                      </span>
                    ))}
                    {formData.competencesTransverses.length === 0 && (
                      <span className="text-gray-400 italic">Aucune compétence transverse spécifiée</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Langues */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Globe size={18} className="mr-2 text-purple-500" />
                    Langues
                  </h2>
                  <div className="space-y-2">
                    {formData.langues.map((langueObj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-md">
                        <span>{langueObj.langue}</span>
                        <span className="text-sm px-2 py-0.5 bg-purple-100 rounded">
                          {niveauxLangue.find(n => n.id === langueObj.niveau)?.libelle || langueObj.niveau}
                        </span>
                      </div>
                    ))}
                    {formData.langues.length === 0 && (
                      <span className="text-gray-400 italic">Aucune langue spécifiée</span>
                    )}
                  </div>
                </div>
                
                {/* Certifications */}
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Award size={18} className="mr-2 text-yellow-500" />
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {formData.certifications.map((certif, index) => (
                      <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{certif.nom}</span>
                          <span className="text-sm">{certif.annee}</span>
                        </div>
                        {certif.organisme && (
                          <div className="text-sm text-gray-600 mt-1">
                            {certif.organisme}
                          </div>
                        )}
                      </div>
                    ))}
                    {formData.certifications.length === 0 && (
                      <span className="text-gray-400 italic">Aucune certification spécifiée</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expériences professionnelles */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase size={18} className="mr-2 text-blue-500" />
                  Expériences professionnelles
                </h2>
                
                <div className="border-l-2 border-blue-200 pl-4 ml-2 space-y-4">
                  {formData.experiences.map((exp, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">{exp.poste}</div>
                          <div className="text-sm bg-blue-100 px-2 py-0.5 rounded">
                            {exp.debut} {exp.fin ? `- ${exp.fin}` : '- présent'}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-700 mb-1">
                          <Building size={14} className="mr-1 text-blue-500" />
                          {exp.entreprise}
                        </div>
                        
                        {exp.description && (
                          <div className="mb-2 text-gray-600 text-sm">
                            {exp.description}
                          </div>
                        )}
                        
                        {exp.technologies && (
                          <div className="flex flex-wrap">
                            {exp.technologies.split(',').map((tech, techIndex) => (
                              <span key={techIndex} className="bg-white border border-blue-200 rounded-md px-2 py-0.5 text-sm text-blue-700 mr-1 mb-1">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {formData.experiences.length === 0 && (
                    <span className="text-gray-400 italic">Aucune expérience professionnelle spécifiée</span>
                  )}
                </div>
              </div>
              
              {/* Formation */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <Book size={18} className="mr-2 text-indigo-500" />
                  Formation
                </h2>
                <div className="space-y-2">
                  {formData.formations.map((formation, index) => (
                    <div key={index} className="p-2 bg-indigo-50 border border-indigo-200 rounded-md">
                      <div className="flex justify-between">
                        <span className="font-medium">{formation.diplome}</span>
                        <span className="text-sm">{formation.annee}</span>
                      </div>
                      {formation.etablissement && (
                        <div className="text-sm text-gray-600 mt-1">
                          {formation.etablissement}
                        </div>
                      )}
                    </div>
                  ))}
                  {formData.formations.length === 0 && (
                    <span className="text-gray-400 italic">Aucune formation spécifiée</span>
                  )}
                </div>
              </div>
              
              {/* Évaluations */}
              {formData.evaluations.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Star size={18} className="mr-2 text-yellow-500" />
                    Évaluations
                  </h2>
                  
                  <div className="space-y-3">
                    {formData.evaluations.map((evaluation, index) => (
                      <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium">{evaluation.date}</div>
                          <div className="text-sm text-gray-500">{evaluation.evaluateur}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm text-gray-700">Technique</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <Star 
                                  key={rating} 
                                  size={14} 
                                  className={`${
                                    rating <= evaluation.technique ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm text-gray-700">Communication</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <Star 
                                  key={rating} 
                                  size={14} 
                                  className={`${
                                    rating <= evaluation.communication ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm text-gray-700">Autonomie</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <Star 
                                  key={rating} 
                                  size={14} 
                                  className={`${
                                    rating <= evaluation.autonomie ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm text-gray-700">Résolution de problèmes</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map(rating => (
                                <Star 
                                  key={rating} 
                                  size={14} 
                                  className={`${
                                    rating <= evaluation.problemSolving ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {evaluation.commentaire && (
                          <div className="bg-white p-2 rounded border text-sm">
                            {evaluation.commentaire}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Vue de recherche (mode compact)
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Photo du consultant" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{formData.prenom} {formData.nom}</h3>
                      <p className="text-sm text-gray-600">{formData.titre}</p>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-md text-xs bg-${getDisponibiliteCouleur()}-100 text-${getDisponibiliteCouleur()}-700 flex items-center border border-${getDisponibiliteCouleur()}-200`}>
                      {getDisponibiliteIcon()}
                      <span className="ml-1">{getDisponibiliteText()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {formData.competencesTechniques.slice(0, 5).map((comp, index) => (
                  <span key={index} className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700">
                    {comp}
                  </span>
                ))}
                {formData.competencesTechniques.length > 5 && (
                  <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600">
                    +{formData.competencesTechniques.length - 5}
                  </span>
                )}
              </div>
              
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center">
                  <Briefcase size={12} className="text-gray-500 mr-1" />
                  <span>{formData.anneeExperience || 0} ans</span>
                </div>
                
                <div className="flex items-center">
                  <DollarSign size={12} className="text-gray-500 mr-1" />
                  <span>{formData.tauxJournalier || 0} €/j</span>
                </div>
                
                {formData.clientActuel.nom && (
                  <div className="flex items-center">
                    <Building size={12} className="text-gray-500 mr-1" />
                    <span className="truncate">{formData.clientActuel.nom}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-2 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {formData.evaluations.length > 0 
                    ? <div className="flex items-center">
                        <Star size={12} className="text-yellow-500 fill-yellow-500 mr-1" />
                        {calculerNoteMoyenne()} / 5
                      </div>
                    : <span>Aucune évaluation</span>
                  }
                </span>
                
                <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded flex items-center">
                  <Eye size={12} className="mr-1" />
                  Voir profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-gray-100">
      {/* Barre de statut et actions */}
      <div className="bg-white border-b shadow-sm py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold mr-4">Profil consultant</h1>
          {saveStatus && (
            <div className="flex items-center">
              {saveStatus === 'saving' && (
                <div className="text-yellow-600 text-sm flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Enregistrement...
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="text-green-600 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  Enregistré
                </div>
              )}
              {saveStatus === 'loading' && (
                <div className="text-blue-600 text-sm flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Chargement...
                </div>
              )}
              {saveStatus === 'publishing' && (
                <div className="text-yellow-600 text-sm flex items-center animate-pulse">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Publication en cours...
                </div>
              )}
              {saveStatus === 'published' && (
                <div className="text-green-600 text-sm flex items-center">
                  <Check size={16} className="mr-1" />
                  Profil enregistré avec succès
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="text-red-600 text-sm flex items-center">
                  <AlertCircle size={16} className="mr-1" />
                  Erreur lors de l'enregistrement
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors flex items-center">
            <X size={14} className="mr-2" />
            Annuler
          </button>
          
          <button 
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
            onClick={() => declencherAutoSave()}
          >
            <Save size={14} className="mr-2" />
            Enregistrer
          </button>
          
          <button 
            className="px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center relative"
            onClick={() => enregistrerProfil()}
          >
            <Send size={14} className="mr-2" />
            Enregistrer et publier
            {showTooltip && (
              <div className="absolute top-full mt-2 right-0 bg-white p-3 shadow-lg rounded-md border text-gray-800 z-10 whitespace-nowrap animate-fade-in">
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Profil publié avec succès</span>
                </div>
              </div>
            )}
          </button>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-grow flex overflow-hidden">
        {/* Panneau de gauche - Étapes et formulaire */}
        <div className="w-7/12 flex flex-col bg-gray-100 overflow-hidden">
          {/* Navigation entre étapes */}
          <div className="bg-white border-b p-4">
            <div className="flex items-center justify-between">
              {etapes.map((etape) => (
                <div 
                  key={etape.id} 
                  className={`flex flex-col items-center ${
                    etape.id < etapeActive ? 'text-green-500' : 
                    etape.id === etapeActive ? 'text-blue-500' : 'text-gray-400'
                  }`}
                  style={{ width: `${100 / etapes.length}%` }}
                >
                  <div className="relative w-full mb-2">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
                    <div 
                      className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-500 ${
                        etape.id < etapeActive ? 'bg-green-500' : 
                        etape.id === etapeActive ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      style={{ 
                        width: etape.id < etapeActive ? '100%' : 
                                etape.id === etapeActive ? '50%' : '0%' 
                      }}
                    ></div>
                    <div 
                      className={`relative z-10 w-8 h-8 rounded-full mx-auto flex items-center justify-center border-2 transition-colors ${
                        etape.id < etapeActive ? 'bg-green-100 border-green-500 text-green-700' : 
                        etape.id === etapeActive ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-100 border-gray-300'
                      }`}
                      onClick={() => etape.id <= etapeActive && changerEtape(etape.id)}
                      style={{ cursor: etape.id <= etapeActive ? 'pointer' : 'not-allowed' }}
                    >
                      {etape.id < etapeActive ? (
                        <Check size={16} />
                      ) : (
                        etape.id
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{etape.titre}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Formulaire - changement selon l'étape */}
          <div className="flex-grow overflow-y-auto p-4">
            {rendreEtapeActive()}
            
            {/* Boutons de navigation */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => changerEtape(etapeActive - 1)}
                className={`px-4 py-2 flex items-center rounded-md transition-colors ${
                  etapeActive > 1 ? 'bg-white border hover:bg-gray-50' : 'opacity-50 cursor-not-allowed bg-gray-100'
                }`}
                disabled={etapeActive === 1}
              >
                <ChevronLeft size={18} className="mr-1" />
                Précédent
              </button>
              
              {etapeActive < etapes.length ? (
                <button
                  onClick={() => changerEtape(etapeActive + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  Suivant
                  <ChevronRight size={18} className="ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => enregistrerProfil()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                >
                  <Save size={18} className="mr-1" />
                  Enregistrer le profil
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Panneau de droite - Prévisualisation */}
        <div className="w-5/12 border-l">
          <div className="h-full overflow-hidden">
            {rendrePrevisualisation()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfile;