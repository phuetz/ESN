import React, { useState, useEffect } from 'react';
import { Send, Check, AlertCircle, X, ChevronRight, ChevronLeft, Calendar, MapPin, DollarSign, Briefcase, Users, Award, Edit3, Monitor, Smartphone, AtSign, Star, Plus, Minus, Clipboard, Download, Clock } from 'lucide-react';

// Composant principal
const JobCreation = () => {
  // État pour l'étape active
  const [etapeActive, setEtapeActive] = useState(1);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [showTooltip, setShowTooltip] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');

  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    titrePoste: '',
    nomEntreprise: '',
    localisation: {
      pays: 'France',
      region: '',
      departement: '',
      codePostal: '',
      ville: '',
      rue: '',
      numero: '',
      complementAdresse: '',
      batimentEtage: '',
      coordonneesGPS: { lat: null, lng: null }
    },
    optionTeletravail: 'hybride', // 'full-remote', 'hybride', 'sur-site'
    joursTeletravail: 2,
    masquerEntreprise: false,
    masquerAdresse: false,
    typesContratSelectionnes: ['temps-plein'],
    salaireMin: '',
    salaireMax: '',
    salaireDevise: '€',
    salairePeriode: 'annuel',
    dateDebut: '',
    visibilite: 'publique',
    description: '',
    exigences: [],
    responsabilites: [],
    competences: [],
    avantages: []
  });

  // États pour les champs temporaires
  const [exigenceTemp, setExigenceTemp] = useState('');
  const [responsabiliteTemp, setResponsabiliteTemp] = useState('');
  const [competenceTemp, setCompetenceTemp] = useState('');
  const [avantageTemp, setAvantageTemp] = useState('');
  const [descriptionEditeur, setDescriptionEditeur] = useState(false);

  // Modèles prédéfinis
  const modeles = [
    { id: 1, nom: 'Développeur Full-Stack', categorie: 'Tech' },
    { id: 2, nom: 'Chef de Projet Digital', categorie: 'Management' },
    { id: 3, nom: 'Responsable Marketing', categorie: 'Marketing' },
    { id: 4, nom: 'Ingénieur DevOps', categorie: 'Tech' },
    { id: 5, nom: 'Designer UX/UI', categorie: 'Design' }
  ];

  // Compétences suggerées par catégorie
  const competencesSuggerees = {
    tech: ['React', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'Python', 'Java', 'SQL', 'GraphQL', 'Kubernetes'],
    soft: ['Communication', 'Travail d\'équipe', 'Gestion du temps', 'Adaptabilité', 'Leadership', 'Résolution de problèmes'],
    langues: ['Anglais', 'Français', 'Allemand', 'Espagnol', 'Italien', 'Chinois']
  };

  // Types de contrats disponibles
  const typesContratDisponibles = [
    { id: 'temps-plein', libelle: 'Temps plein' },
    { id: 'temps-partiel', libelle: 'Temps partiel' },
    { id: 'cdd', libelle: 'CDD' },
    { id: 'cdi', libelle: 'CDI' },
    { id: 'stage', libelle: 'Stage' },
    { id: 'alternance', libelle: 'Alternance' },
    { id: 'freelance', libelle: 'Freelance' },
    { id: 'interim', libelle: 'Intérim' }
  ];

  // Avantages communs
  const avantagesCommuns = [
    'Télétravail', 'Mutuelle', 'RTT', 'Tickets restaurant', 'Prime annuelle', 
    'Formation continue', 'Plan d\'épargne', 'Salle de sport'
  ];

  // Définition des étapes
  const etapes = [
    { id: 1, titre: 'Informations générales' },
    { id: 2, titre: 'Description & Responsabilités' },
    { id: 3, titre: 'Exigences & Compétences' },
    { id: 4, titre: 'Avantages & Finalisation' }
  ];

  // Fonction pour naviguer entre les étapes
  const changerEtape = (nouvelleEtape) => {
    if (nouvelleEtape >= 1 && nouvelleEtape <= etapes.length) {
      if (validerEtapeActuelle()) {
        setEtapeActive(nouvelleEtape);
      }
      window.scrollTo(0, 0);
    }
  };

  // Validation de l'étape actuelle
  const validerEtapeActuelle = () => {
    const nouveauxErreurs = {};
    
    if (etapeActive === 1) {
      if (!formData.titrePoste.trim()) nouveauxErreurs.titrePoste = "Le titre du poste est requis";
      if (!formData.nomEntreprise.trim()) nouveauxErreurs.nomEntreprise = "Le nom de l'entreprise est requis";
      if (formData.typesContratSelectionnes.length === 0) nouveauxErreurs.typeContrat = "Sélectionnez au moins un type de contrat";
      
      // Validation du lieu de travail
      if (formData.optionTeletravail !== 'full-remote') {
        if (!formData.localisation.ville) nouveauxErreurs.ville = "La ville est requise";
        if (!formData.localisation.codePostal) nouveauxErreurs.codePostal = "Le code postal est requis";
      }
    } 
    else if (etapeActive === 2) {
      if (!formData.description.trim()) nouveauxErreurs.description = "La description du poste est requise";
      if (formData.responsabilites.length === 0) nouveauxErreurs.responsabilites = "Ajoutez au moins une responsabilité";
    }
    else if (etapeActive === 3) {
      if (formData.exigences.length === 0) nouveauxErreurs.exigences = "Ajoutez au moins une exigence";
      if (formData.competences.length === 0) nouveauxErreurs.competences = "Ajoutez au moins une compétence";
    }

    setErreurs(nouveauxErreurs);
    return Object.keys(nouveauxErreurs).length === 0;
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Gérer les champs imbriqués (pour la localisation)
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
    if (element.trim() !== '') {
      setFormData({
        ...formData,
        [liste]: [...formData[liste], element.trim()]
      });
      setTemp('');
      
      // Auto-save après modification
      declencherAutoSave();
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

  // Fonction pour gérer la sélection des types de contrat
  const gererSelectionTypeContrat = (typeId) => {
    let nouveauxTypes;
    
    if (formData.typesContratSelectionnes.includes(typeId)) {
      // Si déjà sélectionné, on le retire (sauf s'il n'y a qu'un seul type sélectionné)
      if (formData.typesContratSelectionnes.length > 1) {
        nouveauxTypes = formData.typesContratSelectionnes.filter(id => id !== typeId);
      } else {
        nouveauxTypes = formData.typesContratSelectionnes;
      }
    } else {
      // Si pas encore sélectionné, on l'ajoute
      nouveauxTypes = [...formData.typesContratSelectionnes, typeId];
    }
    
    setFormData({
      ...formData,
      typesContratSelectionnes: nouveauxTypes
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

  // Fonction pour appliquer un modèle
  const appliquerModele = (modeleId) => {
    // Simuler le chargement d'un modèle (dans un vrai système, ce serait un appel API)
    setSaveStatus('loading');
    
    setTimeout(() => {
      const modele = modeles.find(m => m.id === modeleId);
      
      if (modele) {
        if (modele.id === 1) { // Développeur Full-Stack
          setFormData({
            titrePoste: 'Développeur Full-Stack Senior',
            nomEntreprise: formData.nomEntreprise || 'Votre Entreprise',
            localisation: {
              pays: 'France',
              region: 'Île-de-France',
              departement: 'Paris (75)',
              codePostal: '75011',
              ville: 'Paris',
              rue: 'rue du Faubourg Saint-Antoine',
              numero: '130',
              complementAdresse: '',
              batimentEtage: 'Bâtiment A, 3ème étage',
              coordonneesGPS: { lat: 48.8534, lng: 2.3856 }
            },
            optionTeletravail: 'hybride',
            joursTeletravail: 3,
            masquerEntreprise: false,
            masquerAdresse: false,
            typesContratSelectionnes: ['cdi', 'temps-plein'],
            salaireMin: '45000',
            salaireMax: '65000',
            salaireDevise: '€',
            salairePeriode: 'annuel',
            dateDebut: '',
            visibilite: 'publique',
            description: 'Nous recherchons un développeur Full-Stack senior pour rejoindre notre équipe de développement produit. Vous travaillerez sur notre plateforme SaaS en pleine croissance et participerez à toutes les phases du cycle de développement.',
            exigences: ['5+ ans d\'expérience en développement web', 'Diplôme en informatique ou équivalent', 'Expérience avec les architectures microservices'],
            responsabilites: [
              'Développer de nouvelles fonctionnalités sur notre plateforme web',
              'Collaborer avec les équipes produit et design',
              'Participer à la revue de code et au mentorat',
              'Maintenir et améliorer les systèmes existants',
              'Participer aux cérémonies agiles'
            ],
            competences: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Git', 'SQL', 'NoSQL', 'Docker'],
            avantages: ['Télétravail partiel', 'Mutuelle d\'entreprise', 'RTT', 'Formation continue']
          });
        } else if (modele.id === 5) { // Designer UX/UI
          setFormData({
            titrePoste: 'Designer UX/UI Senior',
            nomEntreprise: formData.nomEntreprise || 'Votre Entreprise',
            localisation: {
              pays: 'France',
              region: 'Auvergne-Rhône-Alpes',
              departement: 'Rhône (69)',
              codePostal: '69002',
              ville: 'Lyon',
              rue: 'rue de la République',
              numero: '45',
              complementAdresse: '',
              batimentEtage: '4ème étage',
              coordonneesGPS: { lat: 45.7640, lng: 4.8357 }
            },
            optionTeletravail: 'full-remote',
            joursTeletravail: 5,
            masquerEntreprise: false,
            masquerAdresse: false,
            typesContratSelectionnes: ['cdi'],
            salaireMin: '40000',
            salaireMax: '55000',
            salaireDevise: '€',
            salairePeriode: 'annuel',
            dateDebut: '',
            visibilite: 'publique',
            description: 'Nous recherchons un designer UX/UI talentueux pour concevoir des interfaces utilisateur intuitives et attrayantes pour nos produits numériques. Vous travaillerez en étroite collaboration avec les équipes produit et développement.',
            exigences: ['3+ ans d\'expérience en design UX/UI', 'Portfolio démontrant vos compétences', 'Expérience dans le secteur SaaS appréciée'],
            responsabilites: [
              'Créer des wireframes, prototypes et maquettes haute fidélité',
              'Réaliser des recherches utilisateurs et tests d\'usabilité',
              'Collaborer avec les développeurs pour implémenter les designs',
              'Contribuer au système de design et à sa documentation',
              'Participer aux ateliers de conception produit'
            ],
            competences: ['Figma', 'Adobe Creative Suite', 'Design Systems', 'Prototypage', 'UI Animation', 'Design Responsive', 'HTML/CSS'],
            avantages: ['Télétravail', 'Équipement haut de gamme', 'Budget formation', 'Tickets restaurant']
          });
        } else {
          // Modèle générique pour les autres
          setFormData({
            ...formData,
            titrePoste: modele.nom,
            localisation: {
              pays: 'France',
              region: '',
              departement: '',
              codePostal: '',
              ville: '',
              rue: '',
              numero: '',
              complementAdresse: '',
              batimentEtage: '',
              coordonneesGPS: { lat: null, lng: null }
            },
            description: `Description pour le poste de ${modele.nom}...`,
            responsabilites: ['Responsabilité 1', 'Responsabilité 2', 'Responsabilité 3'],
            exigences: ['Exigence 1', 'Exigence 2'],
            competences: modele.categorie === 'Tech' ? 
              ['JavaScript', 'React', 'Node.js'] : 
              ['Communication', 'Organisation', 'Autonomie']
          });
        }
      }
      
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus(null);
      }, 1500);
    }, 1000);
  };

  // Fonction pour publier l'offre d'emploi
  const publierOffre = () => {
    // Validation de tous les champs requis
    const nouveauxErreurs = {};
    
    if (!formData.titrePoste.trim()) nouveauxErreurs.titrePoste = "Le titre du poste est requis";
    if (!formData.nomEntreprise.trim()) nouveauxErreurs.nomEntreprise = "Le nom de l'entreprise est requis";
    if (!formData.description.trim()) nouveauxErreurs.description = "La description du poste est requise";
    if (formData.responsabilites.length === 0) nouveauxErreurs.responsabilites = "Ajoutez au moins une responsabilité";
    if (formData.exigences.length === 0) nouveauxErreurs.exigences = "Ajoutez au moins une exigence";
    if (formData.competences.length === 0) nouveauxErreurs.competences = "Ajoutez au moins une compétence";
    
    // Validation de localisation
    if (formData.optionTeletravail !== 'full-remote') {
      if (!formData.localisation.ville) nouveauxErreurs.ville = "La ville est requise";
      if (!formData.localisation.codePostal) nouveauxErreurs.codePostal = "Le code postal est requis";
    }
    
    setErreurs(nouveauxErreurs);
    
    if (Object.keys(nouveauxErreurs).length === 0) {
      setSaveStatus('publishing');
      
      // Simuler une publication (dans un vrai système, ce serait un appel API)
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
      if (nouveauxErreurs.titrePoste || nouveauxErreurs.nomEntreprise || nouveauxErreurs.typeContrat || nouveauxErreurs.ville || nouveauxErreurs.codePostal) {
        setEtapeActive(1);
      } else if (nouveauxErreurs.description || nouveauxErreurs.responsabilites) {
        setEtapeActive(2);
      } else if (nouveauxErreurs.exigences || nouveauxErreurs.competences) {
        setEtapeActive(3);
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

  // Met à jour les coordonnées GPS lorsque les champs d'adresse sont modifiés
  useEffect(() => {
    if (formData.localisation.ville && formData.localisation.codePostal && formData.localisation.rue) {
      // Simuler un appel à une API de géocodage
      const updateGeoCode = setTimeout(() => {
        // Valeurs simulées basées sur la ville
        let baseLat = 48.8566; // Paris par défaut
        let baseLng = 2.3522;
        
        if (formData.localisation.ville === 'Lyon') {
          baseLat = 45.7640;
          baseLng = 4.8357;
        } else if (formData.localisation.ville === 'Marseille') {
          baseLat = 43.2965;
          baseLng = 5.3698;
        } else if (formData.localisation.ville === 'Bordeaux') {
          baseLat = 44.8378;
          baseLng = -0.5792;
        } else if (formData.localisation.ville === 'Toulouse') {
          baseLat = 43.6047;
          baseLng = 1.4442;
        }
        
        // Ajouter une petite variation basée sur la rue et le numéro
        const variationLat = (formData.localisation.numero ? parseInt(formData.localisation.numero) % 100 : 0) * 0.0001;
        const variationLng = formData.localisation.rue.length * 0.0001;
        
        setFormData({
          ...formData,
          localisation: {
            ...formData.localisation,
            coordonneesGPS: {
              lat: baseLat + variationLat,
              lng: baseLng + variationLng
            }
          }
        });
      }, 1000);
      
      return () => clearTimeout(updateGeoCode);
    }
  }, [
    formData.localisation.ville, 
    formData.localisation.codePostal, 
    formData.localisation.rue,
    formData.localisation.numero
  ]);

  // Effet pour simuler le chargement initial des données
  useEffect(() => {
    setSaveStatus('loading');
    setTimeout(() => {
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
              <h3 className="text-lg font-semibold mb-4">Modèles d'offres</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {modeles.map(modele => (
                  <div 
                    key={modele.id}
                    className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                    onClick={() => appliquerModele(modele.id)}
                  >
                    <div>
                      <div className="font-medium">{modele.nom}</div>
                      <div className="text-xs text-gray-500">{modele.categorie}</div>
                    </div>
                    <div className="text-blue-500">
                      <Clipboard size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Titre du poste <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titrePoste"
                    value={formData.titrePoste}
                    onChange={handleInputChange}
                    placeholder="ex: Développeur Full-Stack Senior"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                      erreurs.titrePoste ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {erreurs.titrePoste && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {erreurs.titrePoste}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomEntreprise"
                    value={formData.nomEntreprise}
                    onChange={handleInputChange}
                    placeholder="ex: Tech Innovations SAS"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                      erreurs.nomEntreprise ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {erreurs.nomEntreprise && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {erreurs.nomEntreprise}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Option de télétravail
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFormData({...formData, optionTeletravail: 'full-remote'})}
                      className={`px-3 py-2 rounded-md border transition-all ${
                        formData.optionTeletravail === 'full-remote'
                          ? 'bg-green-100 text-green-700 border-green-300 font-medium'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      100% Télétravail
                    </button>
                    <button
                      onClick={() => setFormData({...formData, optionTeletravail: 'hybride'})}
                      className={`px-3 py-2 rounded-md border transition-all ${
                        formData.optionTeletravail === 'hybride'
                          ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      Hybride
                    </button>
                    <button
                      onClick={() => setFormData({...formData, optionTeletravail: 'sur-site'})}
                      className={`px-3 py-2 rounded-md border transition-all ${
                        formData.optionTeletravail === 'sur-site'
                          ? 'bg-gray-100 text-gray-700 border-gray-300 font-medium'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      Sur site
                    </button>
                  </div>
                  
                  {formData.optionTeletravail === 'hybride' && (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1">Jours de télétravail par semaine</label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={formData.joursTeletravail}
                          onChange={(e) => setFormData({...formData, joursTeletravail: parseInt(e.target.value)})}
                          className="w-48 mr-2"
                        />
                        <span className="text-blue-600 font-medium">{formData.joursTeletravail} jour{formData.joursTeletravail > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lieu de travail
                  </label>
                  
                  <div className="bg-white p-4 border border-gray-300 rounded-md mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Pays</label>
                        <select
                          name="localisation.pays"
                          value={formData.localisation.pays}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="France">France</option>
                          <option value="Belgique">Belgique</option>
                          <option value="Suisse">Suisse</option>
                          <option value="Luxembourg">Luxembourg</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Code postal <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="localisation.codePostal"
                          value={formData.localisation.codePostal}
                          onChange={handleInputChange}
                          placeholder="ex: 75001"
                          className={`w-full p-2 border rounded-md ${
                            erreurs.codePostal ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {erreurs.codePostal && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={12} className="mr-1" /> {erreurs.codePostal}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Région</label>
                        <input
                          type="text"
                          name="localisation.region"
                          value={formData.localisation.region}
                          onChange={handleInputChange}
                          placeholder="ex: Île-de-France"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          list="suggestions-regions"
                        />
                        <datalist id="suggestions-regions">
                          <option value="Île-de-France" />
                          <option value="Auvergne-Rhône-Alpes" />
                          <option value="Provence-Alpes-Côte d'Azur" />
                          <option value="Occitanie" />
                          <option value="Hauts-de-France" />
                          <option value="Nouvelle-Aquitaine" />
                        </datalist>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Département</label>
                        <input
                          type="text"
                          name="localisation.departement"
                          value={formData.localisation.departement}
                          onChange={handleInputChange}
                          placeholder="ex: Paris (75)"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Ville <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin size={16} className="absolute top-2.5 left-2 text-gray-400" />
                          <input
                            type="text"
                            name="localisation.ville"
                            value={formData.localisation.ville}
                            onChange={handleInputChange}
                            placeholder="ex: Paris"
                            className={`w-full p-2 pl-7 border rounded-md ${
                              erreurs.ville ? 'border-red-500 bg-red-50' : 'border-gray-300'
                            }`}
                            list="suggestions-villes"
                          />
                          <datalist id="suggestions-villes">
                            <option value="Paris" />
                            <option value="Lyon" />
                            <option value="Marseille" />
                            <option value="Bordeaux" />
                            <option value="Toulouse" />
                            <option value="Lille" />
                            <option value="Nantes" />
                            <option value="Strasbourg" />
                          </datalist>
                          {erreurs.ville && (
                            <p className="text-red-500 text-xs mt-1 flex items-center">
                              <AlertCircle size={12} className="mr-1" /> {erreurs.ville}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {formData.localisation.ville && formData.optionTeletravail !== 'full-remote' && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-1">
                            <input
                              type="text"
                              name="localisation.numero"
                              value={formData.localisation.numero}
                              onChange={handleInputChange}
                              placeholder="N°"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <input
                              type="text"
                              name="localisation.rue"
                              value={formData.localisation.rue}
                              onChange={handleInputChange}
                              placeholder="Nom de la rue"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          <div>
                            <input
                              type="text"
                              name="localisation.complementAdresse"
                              value={formData.localisation.complementAdresse}
                              onChange={handleInputChange}
                              placeholder="Complément d'adresse"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              name="localisation.batimentEtage"
                              value={formData.localisation.batimentEtage}
                              onChange={handleInputChange}
                              placeholder="Bâtiment / Étage"
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.localisation.coordonneesGPS.lat && (
                      <div className="mt-3 p-2 bg-gray-50 border rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                          <p className="text-xs text-gray-600">Coordonnées GPS enregistrées</p>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-mono">
                            lat: {formData.localisation.coordonneesGPS.lat.toFixed(6)}, lng: {formData.localisation.coordonneesGPS.lng.toFixed(6)}
                          </span>
                          <button className="ml-2 text-blue-500 hover:underline text-xs">
                            Vérifier sur la carte
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.masquerEntreprise}
                          onChange={(e) => setFormData({...formData, masquerEntreprise: e.target.checked})}
                          className="mr-2"
                        />
                        Masquer le nom de l'entreprise dans l'annonce
                      </label>
                      
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={formData.masquerAdresse}
                          onChange={(e) => setFormData({...formData, masquerAdresse: e.target.checked})}
                          className="mr-2"
                        />
                        Masquer l'adresse exacte (afficher uniquement la ville)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type de contrat <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {typesContratDisponibles.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => gererSelectionTypeContrat(type.id)}
                        className={`px-3 py-2 rounded-md border transition-all ${
                          formData.typesContratSelectionnes.includes(type.id)
                            ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {type.libelle}
                      </button>
                    ))}
                  </div>
                  {erreurs.typeContrat && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" /> {erreurs.typeContrat}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rémunération
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-grow">
                      <DollarSign size={18} className="absolute top-3.5 left-3 text-gray-400" />
                      <input
                        type="text"
                        name="salaireMin"
                        value={formData.salaireMin}
                        onChange={handleInputChange}
                        placeholder="Min"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        name="salaireMax"
                        value={formData.salaireMax}
                        onChange={handleInputChange}
                        placeholder="Max"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                    <select
                      name="salaireDevise"
                      value={formData.salaireDevise}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                    >
                      <option value="€">€</option>
                      <option value="$">$</option>
                      <option value="£">£</option>
                    </select>
                    <select
                      name="salairePeriode"
                      value={formData.salairePeriode}
                      onChange={handleInputChange}
                      className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                    >
                      <option value="annuel">Annuel</option>
                      <option value="mensuel">Mensuel</option>
                      <option value="journalier">Journalier</option>
                      <option value="horaire">Horaire</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date de début
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Visibilité
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibilite"
                        value="publique"
                        checked={formData.visibilite === 'publique'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Publique
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibilite"
                        value="privee"
                        checked={formData.visibilite === 'privee'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Privée
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="visibilite"
                        value="brouillon"
                        checked={formData.visibilite === 'brouillon'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Brouillon
                    </label>
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
              <h3 className="text-lg font-semibold mb-4">Description du poste <span className="text-red-500">*</span></h3>
              
              <div className="mb-4">
                {descriptionEditeur ? (
                  <div className="border rounded-md">
                    <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="px-2 py-1 hover:bg-gray-200 rounded font-bold">B</button>
                        <button className="px-2 py-1 hover:bg-gray-200 rounded italic">I</button>
                        <button className="px-2 py-1 hover:bg-gray-200 rounded underline">U</button>
                        <button className="px-2 py-1 hover:bg-gray-200 rounded">•</button>
                        <button className="px-2 py-1 hover:bg-gray-200 rounded">1.</button>
                      </div>
                      <button 
                        onClick={() => setDescriptionEditeur(false)}
                        className="px-2 py-1 text-blue-500 hover:bg-gray-200 rounded"
                      >
                        Terminer
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Décrivez le poste en détail. Incluez le contexte de l'entreprise, les missions principales, et l'environnement de travail..."
                      className={`w-full p-3 h-48 outline-none resize-none ${
                        erreurs.description ? 'bg-red-50' : ''
                      }`}
                    />
                  </div>
                ) : (
                  <div 
                    onClick={() => setDescriptionEditeur(true)}
                    className={`p-3 border rounded-md cursor-text min-h-32 hover:bg-gray-50 transition-all ${
                      erreurs.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    {formData.description ? (
                      <div className="whitespace-pre-line">{formData.description}</div>
                    ) : (
                      <p className="text-gray-400">Cliquez pour ajouter une description...</p>
                    )}
                  </div>
                )}
                
                {erreurs.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {erreurs.description}
                  </p>
                )}
                
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <Edit3 size={14} className="mr-1" /> 
                  L'IA peut suggérer des améliorations pour votre description
                  <button className="ml-2 text-blue-500 hover:underline">Améliorer</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Responsabilités <span className="text-red-500">*</span></h3>
              
              <div className="mb-4">
                {formData.responsabilites.map((resp, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center mb-2 ${
                      isDragging && dragItem?.liste === 'responsabilites' ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'responsabilites')}
                    onDragOver={(e) => handleDragOver(e, index, 'responsabilites')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="mr-2 text-gray-400">::</div>
                    <div className="flex-grow p-2 bg-blue-50 border border-blue-200 rounded-md">
                      {resp}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'responsabilites')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {erreurs.responsabilites && formData.responsabilites.length === 0 && (
                  <p className="text-red-500 text-sm mb-2 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {erreurs.responsabilites}
                  </p>
                )}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={responsabiliteTemp}
                  onChange={(e) => setResponsabiliteTemp(e.target.value)}
                  placeholder="Ajouter une responsabilité"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(responsabiliteTemp, 'responsabilites', setResponsabiliteTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(responsabiliteTemp, 'responsabilites', setResponsabiliteTemp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Glisser-déposer pour réorganiser les responsabilités
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Exigences <span className="text-red-500">*</span></h3>
              
              <div className="mb-4">
                {formData.exigences.map((exig, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center mb-2 ${
                      isDragging && dragItem?.liste === 'exigences' ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'exigences')}
                    onDragOver={(e) => handleDragOver(e, index, 'exigences')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="mr-2 text-gray-400">::</div>
                    <div className="flex-grow p-2 bg-green-50 border border-green-200 rounded-md">
                      {exig}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'exigences')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {erreurs.exigences && formData.exigences.length === 0 && (
                  <p className="text-red-500 text-sm mb-2 flex items-center">
                    <AlertCircle size={14} className="mr-1" /> {erreurs.exigences}
                  </p>
                )}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={exigenceTemp}
                  onChange={(e) => setExigenceTemp(e.target.value)}
                  placeholder="Ajouter une exigence (ex: formation, expérience...)"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(exigenceTemp, 'exigences', setExigenceTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(exigenceTemp, 'exigences', setExigenceTemp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Glisser-déposer pour réorganiser les exigences
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Compétences <span className="text-red-500">*</span></h3>
              
              <div className="mb-4 flex flex-wrap">
                {formData.competences.map((comp, index) => (
                  <div key={index} className="inline-block m-1 p-2 pr-1 bg-gray-200 rounded-md flex items-center">
                    {comp}
                    <button 
                      onClick={() => supprimerElement(index, 'competences')}
                      className="ml-1 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              {erreurs.competences && formData.competences.length === 0 && (
                <p className="text-red-500 text-sm mb-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" /> {erreurs.competences}
                </p>
              )}
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={competenceTemp}
                  onChange={(e) => setCompetenceTemp(e.target.value)}
                  placeholder="Ajouter une compétence"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(competenceTemp, 'competences', setCompetenceTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(competenceTemp, 'competences', setCompetenceTemp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Compétences techniques</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.tech.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competences.includes(comp)) {
                            setFormData({
                              ...formData,
                              competences: [...formData.competences, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competences.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competences.includes(comp) 
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
                  <h4 className="text-sm font-medium mb-2">Compétences comportementales</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.soft.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competences.includes(comp)) {
                            setFormData({
                              ...formData,
                              competences: [...formData.competences, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competences.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competences.includes(comp) 
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
                  <h4 className="text-sm font-medium mb-2">Langues</h4>
                  <div className="flex flex-wrap">
                    {competencesSuggerees.langues.map((comp, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!formData.competences.includes(comp)) {
                            setFormData({
                              ...formData,
                              competences: [...formData.competences, comp]
                            });
                            declencherAutoSave();
                          }
                        }}
                        disabled={formData.competences.includes(comp)}
                        className={`m-1 px-3 py-1 rounded-md text-sm border ${
                          formData.competences.includes(comp) 
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
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Avantages</h3>
              
              <div className="mb-4">
                {formData.avantages.map((avantage, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center mb-2 ${
                      isDragging && dragItem?.liste === 'avantages' ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'avantages')}
                    onDragOver={(e) => handleDragOver(e, index, 'avantages')}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="mr-2 text-gray-400">::</div>
                    <div className="flex-grow p-2 bg-purple-50 border border-purple-200 rounded-md">
                      {avantage}
                    </div>
                    <button 
                      onClick={() => supprimerElement(index, 'avantages')}
                      className="ml-2 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex mb-4">
                <input
                  type="text"
                  value={avantageTemp}
                  onChange={(e) => setAvantageTemp(e.target.value)}
                  placeholder="Ajouter un avantage"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterElement(avantageTemp, 'avantages', setAvantageTemp);
                    }
                  }}
                />
                <button 
                  onClick={() => ajouterElement(avantageTemp, 'avantages', setAvantageTemp)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Avantages courants</h4>
                <div className="flex flex-wrap">
                  {avantagesCommuns.map((avantage, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!formData.avantages.includes(avantage)) {
                          setFormData({
                            ...formData,
                            avantages: [...formData.avantages, avantage]
                          });
                          declencherAutoSave();
                        }
                      }}
                      disabled={formData.avantages.includes(avantage)}
                      className={`m-1 px-3 py-1 rounded-md text-sm border ${
                        formData.avantages.includes(avantage) 
                          ? 'bg-purple-100 text-purple-700 border-purple-300' 
                          : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                      }`}
                    >
                      {avantage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Finalisation</h3>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Check size={20} className="text-blue-500 mr-2" />
                  <span className="font-medium">Dernière vérification avant publication</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vérifiez que toutes les informations sont correctes. Une fois publiée, 
                  votre offre sera visible pour tous les candidats potentiels.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="checkVisiblite" 
                    className="mr-2"
                    checked={formData.visibilite === 'publique'}
                    onChange={() => {
                      setFormData({
                        ...formData,
                        visibilite: formData.visibilite === 'publique' ? 'privee' : 'publique'
                      });
                    }}
                  />
                  <label htmlFor="checkVisiblite">
                    Rendre cette offre publique immédiatement
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="checkNotifs" className="mr-2" defaultChecked />
                  <label htmlFor="checkNotifs">
                    Recevoir des notifications pour les nouvelles candidatures
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input type="checkbox" id="checkCopie" className="mr-2" defaultChecked />
                  <label htmlFor="checkCopie">
                    Recevoir une copie de l'offre par email
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Étape inconnue</div>;
    }
  };
  
  // Fonction pour afficher l'offre prévisualisée
  const rendrePrevisualisation = () => {
    return (
      <div className="border rounded-lg bg-white overflow-hidden h-full flex flex-col">
        <div className="flex items-center justify-center p-2 bg-gray-100 border-b">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded-md ml-2 ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>
        
        <div className="p-2 flex-grow overflow-auto">
          <div className={`mx-auto bg-white transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm border' : ''
          }`}>
            {/* En-tête de l'offre */}
            <div className="bg-blue-50 border-b border-blue-100 p-4">
              <div className="mb-2">
                <h1 className="text-xl md:text-2xl font-bold leading-tight">
                  {formData.titrePoste || 'Titre du poste'}
                </h1>
                <div className="flex items-center mt-1">
                  <Briefcase size={16} className="text-gray-500 mr-1" />
                  <span className="text-gray-700 font-medium">
                    {formData.masquerEntreprise ? (
                      <span className="italic">Entreprise confidentielle</span>
                    ) : (
                      formData.nomEntreprise || 'Nom de l\'entreprise'
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-y-1">
                <div className="flex items-center text-sm mr-4">
                  <MapPin size={14} className="text-gray-500 mr-1" />
                  <span>
                    {formData.optionTeletravail === 'full-remote' ? (
                      <span className="font-medium text-green-600">100% Télétravail</span>
                    ) : formData.optionTeletravail === 'hybride' ? (
                      <>
                        {formData.localisation.ville ? (
                          <>
                            {formData.masquerAdresse ? (
                              <>
                                {formData.localisation.ville}
                                {formData.localisation.codePostal && ` (${formData.localisation.codePostal})`}
                              </>
                            ) : (
                              <>
                                {formData.localisation.numero && `${formData.localisation.numero} `}
                                {formData.localisation.rue && `${formData.localisation.rue}, `}
                                {formData.localisation.ville}
                                {formData.localisation.codePostal && ` (${formData.localisation.codePostal})`}
                              </>
                            )}
                          </>
                        ) : 'Lieu non spécifié'}
                        <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 rounded-sm text-xs">
                          {formData.joursTeletravail} j. télétravail
                        </span>
                      </>
                    ) : (
                      formData.localisation.ville ? (
                        formData.masquerAdresse ? (
                          <>
                            {formData.localisation.ville}
                            {formData.localisation.codePostal && ` (${formData.localisation.codePostal})`}
                          </>
                        ) : (
                          <>
                            {formData.localisation.numero && `${formData.localisation.numero} `}
                            {formData.localisation.rue && `${formData.localisation.rue}, `}
                            {formData.localisation.ville}
                            {formData.localisation.codePostal && ` (${formData.localisation.codePostal})`}
                          </>
                        )
                      ) : 'Lieu non spécifié'
                    )}
                  </span>
                </div>
                
                {(formData.salaireMin || formData.salaireMax) && (
                  <div className="flex items-center text-sm mr-4">
                    <DollarSign size={14} className="text-gray-500 mr-1" />
                    <span>
                      {formData.salaireMin && formData.salaireMax 
                        ? `${parseInt(formData.salaireMin).toLocaleString()} - ${parseInt(formData.salaireMax).toLocaleString()} ${formData.salaireDevise} ${formData.salairePeriode}`
                        : formData.salaireMin 
                          ? `${parseInt(formData.salaireMin).toLocaleString()}+ ${formData.salaireDevise} ${formData.salairePeriode}`
                          : formData.salaireMax
                            ? `Jusqu'à ${parseInt(formData.salaireMax).toLocaleString()} ${formData.salaireDevise} ${formData.salairePeriode}`
                            : '0 €'
                      }
                    </span>
                  </div>
                )}
                
                {formData.dateDebut && (
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="text-gray-500 mr-1" />
                    <span>Début: {formData.dateDebut}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap mt-3">
                {formData.typesContratSelectionnes.map((typeId) => {
                  const type = typesContratDisponibles.find(t => t.id === typeId);
                  return type ? (
                    <span key={typeId} className="mr-2 mb-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {type.libelle}
                    </span>
                  ) : null;
                })}
                
                {formData.optionTeletravail === 'full-remote' && (
                  <span className="mr-2 mb-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded flex items-center">
                    <Check size={12} className="mr-1" /> 100% Télétravail
                  </span>
                )}
                
                {formData.optionTeletravail === 'hybride' && (
                  <span className="mr-2 mb-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded flex items-center">
                    <Check size={12} className="mr-1" /> Hybride ({formData.joursTeletravail}j télétravail)
                  </span>
                )}
                
                {formData.visibilite === 'publique' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded flex items-center">
                    <Check size={12} className="mr-1" /> Publique
                  </span>
                )}
              </div>
            </div>
            
            {/* Corps de l'offre */}
            <div className="p-4">
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <Edit3 size={18} className="mr-2 text-blue-500" /> 
                  Description du poste
                </h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {formData.description || (
                    <span className="text-gray-400 italic">Aucune description fournie</span>
                  )}
                </div>
              </div>
              
              {/* Responsabilités */}
              {formData.responsabilites.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Clipboard size={18} className="mr-2 text-blue-500" /> 
                    Responsabilités
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.responsabilites.map((resp, index) => (
                      <li key={index} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Exigences */}
              {formData.exigences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Award size={18} className="mr-2 text-blue-500" /> 
                    Exigences
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.exigences.map((exig, index) => (
                      <li key={index} className="text-gray-700">{exig}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Compétences */}
              {formData.competences.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Star size={18} className="mr-2 text-blue-500" /> 
                    Compétences requises
                  </h2>
                  <div className="flex flex-wrap">
                    {formData.competences.map((comp, index) => (
                      <span key={index} className="m-1 px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Avantages */}
              {formData.avantages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2 flex items-center">
                    <Users size={18} className="mr-2 text-blue-500" /> 
                    Avantages
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.avantages.map((avantage, index) => (
                      <li key={index} className="text-gray-700">{avantage}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Pied de page */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" /> 
                    Publié le {new Date().toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <button className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
                      <AtSign size={14} className="mr-1" /> 
                      Postuler
                    </button>
                    
                    <button className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                      <Download size={14} className="mr-1" /> 
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-gray-100">
      {/* Barre de statut et actions */}
      <div className="bg-white border-b shadow-sm py-2 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold mr-4">Création d'offre d'emploi</h1>
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
                  Offre publiée avec succès
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
          <button 
            className="px-3 py-2 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center relative"
            onClick={() => publierOffre()}
          >
            <Send size={14} className="mr-2" />
            Publier
            {showTooltip && (
              <div className="absolute top-full mt-2 right-0 bg-white p-3 shadow-lg rounded-md border text-gray-800 z-10 whitespace-nowrap animate-fade-in">
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Offre publiée et partageable</span>
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
                  onClick={() => publierOffre()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                >
                  <Send size={18} className="mr-1" />
                  Publier l'offre
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

export default JobCreation;