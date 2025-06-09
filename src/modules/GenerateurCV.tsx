import React, { useState, useEffect } from 'react';
import {
  Save, Eye, Download, Check, AlertCircle, X, ChevronRight,
  ChevronLeft, Calendar, MapPin, Phone, Mail, Globe,
  Briefcase, Users, Award, Edit3, Monitor, Smartphone,
  AtSign, Star, Plus, Minus, Clipboard, User,
  Code, ExternalLink, Book, Bookmark, Camera, Trash2, Printer
} from 'lucide-react';

const GenerateurCV = () => {
  const [etapeActive, setEtapeActive] = useState(1);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [templateActif, setTemplateActif] = useState('modern');

  const [experienceTemp, setExperienceTemp] = useState({
    poste: '',
    entreprise: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    description: '',
    estEmploiActuel: false
  });

  const [formationTemp, setFormationTemp] = useState({
    diplome: '',
    etablissement: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    description: ''
  });

  const [competenceTemp, setCompetenceTemp] = useState('');
  const [langueTemp, setLangueTemp] = useState({ langue: '', niveau: 'Intermédiaire' });
  const [interetTemp, setInteretTemp] = useState('');
  const [referenceTemp, setReferenceTemp] = useState({
    nom: '',
    entreprise: '',
    poste: '',
    email: '',
    telephone: ''
  });

  const [cvData, setCvData] = useState({
    informationsPersonnelles: {
      photo: null,
      prenom: '',
      nom: '',
      titre: '',
      email: '',
      telephone: '',
      adresse: '',
      codePostal: '',
      ville: '',
      dateNaissance: '',
      nationalite: '',
      linkedin: '',
      siteWeb: '',
      github: '',
      twitter: ''
    },
    resumeProfessionnel: '',
    experiences: [],
    formations: [],
    competences: [],
    langues: [],
    interets: [],
    references: [],
    afficherReferences: true
  });

  const templates = [
    { id: 'modern', nom: 'Moderne', couleur: '#2563eb' },
    { id: 'classic', nom: 'Classique', couleur: '#1e293b' },
    { id: 'creative', nom: 'Créatif', couleur: '#9333ea' },
    { id: 'minimal', nom: 'Minimaliste', couleur: '#64748b' },
    { id: 'executive', nom: 'Exécutif', couleur: '#0f766e' }
  ];

  const niveauxLangue = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Langue maternelle'];

  const etapes = [
    { id: 1, titre: 'Informations personnelles' },
    { id: 2, titre: 'Expériences professionnelles' },
    { id: 3, titre: 'Formation' },
    { id: 4, titre: 'Compétences & Langues' },
    { id: 5, titre: 'Finalisation' }
  ];

  const changerEtape = (nouvelleEtape) => {
    if (nouvelleEtape >= 1 && nouvelleEtape <= etapes.length) {
      validerEtapeActuelle() && setEtapeActive(nouvelleEtape);
      window.scrollTo(0, 0);
    }
  };

  const validerEtapeActuelle = () => {
    const nouveauxErreurs = {};

    if (etapeActive === 1) {
      if (!cvData.informationsPersonnelles.prenom.trim()) nouveauxErreurs.prenom = "Le prénom est requis";
      if (!cvData.informationsPersonnelles.nom.trim()) nouveauxErreurs.nom = "Le nom est requis";
      if (!cvData.informationsPersonnelles.email.trim()) nouveauxErreurs.email = "L'email est requis";
    }
    else if (etapeActive === 2) {
      // Validation optionnelle pour les expériences
    }
    else if (etapeActive === 3) {
      // Validation optionnelle pour la formation
    }
    else if (etapeActive === 4) {
      if (cvData.competences.length === 0) nouveauxErreurs.competences = "Ajoutez au moins une compétence";
    }

    setErreurs(nouveauxErreurs);
    return Object.keys(nouveauxErreurs).length === 0;
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData({
      ...cvData,
      informationsPersonnelles: {
        ...cvData.informationsPersonnelles,
        [name]: value
      }
    });
    declencherAutoSave();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCvData({
          ...cvData,
          informationsPersonnelles: {
            ...cvData.informationsPersonnelles,
            photo: event.target.result
          }
        });
        declencherAutoSave();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    setCvData({
      ...cvData,
      resumeProfessionnel: e.target.value
    });
    declencherAutoSave();
  };

  const ajouterExperience = () => {
    if (!experienceTemp.poste.trim() || !experienceTemp.entreprise.trim() || !experienceTemp.dateDebut) {
      return;
    }

    setCvData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        {
          ...experienceTemp,
          id: Date.now()
        }
      ]
    });

    setExperienceTemp({
      poste: '',
      entreprise: '',
      lieu: '',
      dateDebut: '',
      dateFin: '',
      description: '',
      estEmploiActuel: false
    });

    declencherAutoSave();
  };

  const supprimerExperience = (id) => {
    setCvData({
      ...cvData,
      experiences: cvData.experiences.filter(exp => exp.id !== id)
    });
    declencherAutoSave();
  };

  const ajouterFormation = () => {
    if (!formationTemp.diplome.trim() || !formationTemp.etablissement.trim()) {
      return;
    }

    setCvData({
      ...cvData,
      formations: [
        ...cvData.formations,
        {
          ...formationTemp,
          id: Date.now()
        }
      ]
    });

    setFormationTemp({
      diplome: '',
      etablissement: '',
      lieu: '',
      dateDebut: '',
      dateFin: '',
      description: ''
    });

    declencherAutoSave();
  };

  const supprimerFormation = (id) => {
    setCvData({
      ...cvData,
      formations: cvData.formations.filter(form => form.id !== id)
    });
    declencherAutoSave();
  };

  const ajouterCompetence = () => {
    if (competenceTemp.trim() !== '' && !cvData.competences.includes(competenceTemp.trim())) {
      setCvData({
        ...cvData,
        competences: [...cvData.competences, competenceTemp.trim()]
      });
      setCompetenceTemp('');
      declencherAutoSave();
    }
  };

  const supprimerCompetence = (index) => {
    const nouvelleListe = [...cvData.competences];
    nouvelleListe.splice(index, 1);
    setCvData({
      ...cvData,
      competences: nouvelleListe
    });
    declencherAutoSave();
  };

  const ajouterLangue = () => {
    if (langueTemp.langue.trim() !== '') {
      const nouvelleLangue = {
        ...langueTemp,
        id: Date.now()
      };

      setCvData({
        ...cvData,
        langues: [...cvData.langues, nouvelleLangue]
      });

      setLangueTemp({ langue: '', niveau: 'Intermédiaire' });
      declencherAutoSave();
    }
  };

  const supprimerLangue = (id) => {
    setCvData({
      ...cvData,
      langues: cvData.langues.filter(langue => langue.id !== id)
    });
    declencherAutoSave();
  };

  const ajouterInteret = () => {
    if (interetTemp.trim() !== '' && !cvData.interets.includes(interetTemp.trim())) {
      setCvData({
        ...cvData,
        interets: [...cvData.interets, interetTemp.trim()]
      });
      setInteretTemp('');
      declencherAutoSave();
    }
  };

  const supprimerInteret = (index) => {
    const nouvelleListe = [...cvData.interets];
    nouvelleListe.splice(index, 1);
    setCvData({
      ...cvData,
      interets: nouvelleListe
    });
    declencherAutoSave();
  };

  const ajouterReference = () => {
    if (referenceTemp.nom.trim() !== '' && referenceTemp.entreprise.trim() !== '') {
      const nouvelleReference = {
        ...referenceTemp,
        id: Date.now()
      };

      setCvData({
        ...cvData,
        references: [...cvData.references, nouvelleReference]
      });

      setReferenceTemp({
        nom: '',
        entreprise: '',
        poste: '',
        email: '',
        telephone: ''
      });
      declencherAutoSave();
    }
  };

  const supprimerReference = (id) => {
    setCvData({
      ...cvData,
      references: cvData.references.filter(ref => ref.id !== id)
    });
    declencherAutoSave();
  };

  const declencherAutoSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }, 800);
  };

  const appliquerModele = (modeleId) => {
    setSaveStatus('loading');
    setTimeout(() => {
      if (modeleId === 'dev') {
        setCvData({
          informationsPersonnelles: {
            prenom: 'Thomas',
            nom: 'Martin',
            titre: 'Développeur Web Front-End',
            email: 'thomas.martin@email.com',
            telephone: '06 12 34 56 78',
            adresse: '15 rue de la Paix',
            codePostal: '75001',
            ville: 'Paris',
            linkedin: 'linkedin.com/in/thomasmartin',
            github: 'github.com/thomasmartin',
            siteWeb: 'thomasmartin.dev'
          },
          resumeProfessionnel: 'Développeur Front-End avec 5 ans d\'expérience spécialisé dans la création d\'interfaces utilisateur réactives et intuitives. Expertise en React, TypeScript et NextJS. Passion pour l\'UX et le design system.',
          experiences: [
            {
              id: 1,
              poste: 'Développeur Front-End Senior',
              entreprise: 'WebTech Solutions',
              lieu: 'Paris',
              dateDebut: '2021-01',
              dateFin: '',
              estEmploiActuel: true,
              description: '• Développement d\'applications SPA avec React et TypeScript\n• Mise en place d\'une librairie de composants avec Storybook\n• Optimisation des performances et de l\'accessibilité\n• Mentorat de développeurs juniors'
            },
            {
              id: 2,
              poste: 'Développeur Front-End',
              entreprise: 'Digital Agency',
              lieu: 'Lyon',
              dateDebut: '2018-06',
              dateFin: '2020-12',
              estEmploiActuel: false,
              description: '• Création d\'interfaces utilisateur pour des clients de différents secteurs\n• Intégration responsive et compatible tous navigateurs\n• Travail en méthode Agile/Scrum'
            }
          ],
          formations: [
            {
              id: 1,
              diplome: 'Master en Développement Web',
              etablissement: 'Université Numérique',
              lieu: 'Paris',
              dateDebut: '2016',
              dateFin: '2018',
              description: 'Spécialisation en technologies front-end et UX design'
            },
            {
              id: 2,
              diplome: 'Licence Informatique',
              etablissement: 'Université de Lyon',
              lieu: 'Lyon',
              dateDebut: '2013',
              dateFin: '2016',
              description: 'Fondamentaux de la programmation et des algorithmes'
            }
          ],
          competences: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'SASS', 'Redux', 'Jest', 'Git', 'NextJS', 'Webpack', 'Responsive Design', 'API REST'],
          langues: [
            { id: 1, langue: 'Français', niveau: 'Langue maternelle' },
            { id: 2, langue: 'Anglais', niveau: 'Courant' },
            { id: 3, langue: 'Espagnol', niveau: 'Intermédiaire' }
          ],
          interets: ['Développement open source', 'UX Design', 'Photographie', 'Randonnée'],
          references: [
            {
              id: 1,
              nom: 'Julie Dupont',
              entreprise: 'WebTech Solutions',
              poste: 'CTO',
              email: 'julie.dupont@webtech.com',
              telephone: '06 98 76 54 32'
            }
          ],
          afficherReferences: true
        });
      }
      else if (modeleId === 'designer') {
        setCvData({
          informationsPersonnelles: {
            prenom: 'Sophie',
            nom: 'Laurent',
            titre: 'Designer UX/UI',
            email: 'sophie.laurent@email.com',
            telephone: '07 65 43 21 09',
            adresse: '8 avenue des Arts',
            codePostal: '69002',
            ville: 'Lyon',
            linkedin: 'linkedin.com/in/sophielaurent',
            siteWeb: 'sophielaurent.design'
          },
          resumeProfessionnel: 'Designer UX/UI passionnée avec 4 ans d\'expérience dans la conception d\'interfaces centrées utilisateur. Spécialisée dans la recherche utilisateur, le prototypage et la création de systèmes de design cohérents. Approche basée sur les données et l\'empathie.',
          experiences: [
            {
              id: 1,
              poste: 'Designer UX/UI Senior',
              entreprise: 'CreativeStudio',
              lieu: 'Lyon',
              dateDebut: '2020-03',
              dateFin: '',
              estEmploiActuel: true,
              description: '• Conception d\'interfaces pour applications mobiles et web\n• Animation d\'ateliers de design thinking\n• Création et maintenance d\'un design system\n• Tests utilisateurs et itérations basées sur les retours'
            },
            {
              id: 2,
              poste: 'Designer UI',
              entreprise: 'AgenceDigitale',
              lieu: 'Paris',
              dateDebut: '2018-09',
              dateFin: '2020-02',
              estEmploiActuel: false,
              description: '• Création de maquettes et prototypes haute-fidélité\n• Collaboration étroite avec les développeurs pour l\'implémentation\n• Conception d\'identités visuelles cohérentes'
            }
          ],
          formations: [
            {
              id: 1,
              diplome: 'Master en Design Numérique',
              etablissement: 'École de Design',
              lieu: 'Lyon',
              dateDebut: '2016',
              dateFin: '2018',
              description: 'Spécialisation en UX/UI et design d\'interaction'
            },
            {
              id: 2,
              diplome: 'Licence en Arts Appliqués',
              etablissement: 'Université des Arts',
              lieu: 'Bordeaux',
              dateDebut: '2013',
              dateFin: '2016',
              description: 'Formation en design graphique et communication visuelle'
            }
          ],
          competences: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototypage', 'Wireframing', 'Design System', 'User Research', 'HTML/CSS', 'Motion Design', 'Design Thinking'],
          langues: [
            { id: 1, langue: 'Français', niveau: 'Langue maternelle' },
            { id: 2, langue: 'Anglais', niveau: 'Courant' }
          ],
          interets: ['Art contemporain', 'Photographie', 'Typographie', 'Voyages'],
          references: [
            {
              id: 1,
              nom: 'Marc Dubois',
              entreprise: 'CreativeStudio',
              poste: 'Directeur Créatif',
              email: 'marc.dubois@creativestudio.com',
              telephone: '06 12 34 56 78'
            }
          ],
          afficherReferences: true
        });
      }
      else if (modeleId === 'junior') {
        setCvData({
          informationsPersonnelles: {
            prenom: 'Lucas',
            nom: 'Petit',
            titre: 'Développeur Web Junior',
            email: 'lucas.petit@email.com',
            telephone: '07 89 01 23 45',
            adresse: '25 rue des Écoles',
            codePostal: '33000',
            ville: 'Bordeaux',
            linkedin: 'linkedin.com/in/lucaspetit',
            github: 'github.com/lucaspetit'
          },
          resumeProfessionnel: 'Jeune développeur web passionné, récemment diplômé et à la recherche d\'une première expérience professionnelle. Autodidacte et curieux, j\'ai développé plusieurs projets personnels pour mettre en pratique mes connaissances en JavaScript, React et Node.js.',
          experiences: [
            {
              id: 1,
              poste: 'Développeur Web - Stage',
              entreprise: 'StartupTech',
              lieu: 'Bordeaux',
              dateDebut: '2023-04',
              dateFin: '2023-09',
              estEmploiActuel: false,
              description: '• Développement de fonctionnalités front-end avec React\n• Intégration d\'API REST\n• Participation aux daily meetings et à la méthode Agile\n• Optimisation du site pour le mobile'
            },
            {
              id: 2,
              poste: 'Projet étudiant - Application de gestion de tâches',
              entreprise: 'École du Numérique',
              lieu: 'Bordeaux',
              dateDebut: '2023-01',
              dateFin: '2023-03',
              estEmploiActuel: false,
              description: '• Développement full-stack d\'une application de to-do list\n• Utilisation de React pour le front-end et Express.js pour le back-end\n• Travail en équipe de 4 personnes'
            }
          ],
          formations: [
            {
              id: 1,
              diplome: 'Licence Professionnelle Développement Web',
              etablissement: 'IUT de Bordeaux',
              lieu: 'Bordeaux',
              dateDebut: '2022',
              dateFin: '2023',
              description: 'Formation en développement web front-end et back-end'
            },
            {
              id: 2,
              diplome: 'DUT Informatique',
              etablissement: 'IUT de Bordeaux',
              lieu: 'Bordeaux',
              dateDebut: '2020',
              dateFin: '2022',
              description: 'Formation générale en informatique et programmation'
            }
          ],
          competences: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'Bootstrap', 'Responsive Design'],
          langues: [
            { id: 1, langue: 'Français', niveau: 'Langue maternelle' },
            { id: 2, langue: 'Anglais', niveau: 'Intermédiaire' }
          ],
          interets: ['Développement de projets personnels', 'Participation à des hackathons', 'Jeux vidéo', 'Course à pied'],
          references: [],
          afficherReferences: false
        });
      }

      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus(null);
      }, 1500);
    }, 1000);
  };

  const handleDragStart = (e, index, liste) => {
    setIsDragging(true);
    setDragItem({ index, liste });
  };

  const handleDragOver = (e, index, liste) => {
    e.preventDefault();
    if (dragItem && dragItem.liste === liste && dragItem.index !== index) {
      const items = [...cvData[liste]];
      const draggedItem = items[dragItem.index];

      const newItems = items.filter((_, idx) => idx !== dragItem.index);
      newItems.splice(index, 0, draggedItem);

      setCvData({
        ...cvData,
        [liste]: newItems
      });

      setDragItem({ index, liste });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragItem(null);
    declencherAutoSave();
  };

  const imprimerCV = () => {
    setSaveStatus('preparing');
    setTimeout(() => {
      setSaveStatus('ready');
      window.print();
      setTimeout(() => {
        setSaveStatus(null);
      }, 1500);
    }, 1000);
  };

  useEffect(() => {
    setSaveStatus('loading');
    setTimeout(() => {
      setSaveStatus(null);
    }, 800);
  }, []);

  const rendreEtapeActive = () => {
    switch (etapeActive) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Modèles de CV</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div
                  className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                  onClick={() => appliquerModele('dev')}
                >
                  <div>
                    <div className="font-medium">Développeur Web</div>
                    <div className="text-xs text-gray-500">Front-End Senior</div>
                  </div>
                  <div className="text-blue-500">
                    <Clipboard size={16} />
                  </div>
                </div>
                <div
                  className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                  onClick={() => appliquerModele('designer')}
                >
                  <div>
                    <div className="font-medium">Designer UX/UI</div>
                    <div className="text-xs text-gray-500">Créatif et expérimenté</div>
                  </div>
                  <div className="text-blue-500">
                    <Clipboard size={16} />
                  </div>
                </div>
                <div
                  className="p-3 border rounded-md hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200 flex items-center justify-between"
                  onClick={() => appliquerModele('junior')}
                >
                  <div>
                    <div className="font-medium">Profil Débutant</div>
                    <div className="text-xs text-gray-500">Premier emploi</div>
                  </div>
                  <div className="text-blue-500">
                    <Clipboard size={16} />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Choisir un template</h4>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      onClick={() => setTemplateActif(template.id)}
                      className={`p-2 border rounded-md cursor-pointer transition-all min-w-24 text-center ${
                        templateActif === template.id
                          ? 'border-2 border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ borderColor: templateActif === template.id ? template.couleur : '' }}
                    >
                      <div className="w-full h-4 rounded mb-1" style={{ backgroundColor: template.couleur }}></div>
                      <div className="text-xs font-medium">{template.nom}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>

              <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-32 h-32 bg-gray-100 border rounded-md flex items-center justify-center overflow-hidden relative">
                  {cvData.informationsPersonnelles.photo ? (
                    <div className="relative w-full h-full">
                      <img
                        src={cvData.informationsPersonnelles.photo}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        onClick={() => {
                          setCvData({
                            ...cvData,
                            informationsPersonnelles: {
                              ...cvData.informationsPersonnelles,
                              photo: null
                            }
                          });
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera size={24} className="text-gray-400 mx-auto mb-2" />
                      <label className="text-xs text-blue-500 cursor-pointer hover:underline">
                        Ajouter photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={cvData.informationsPersonnelles.prenom}
                        onChange={handlePersonalInfoChange}
                        placeholder="Jean"
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
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={cvData.informationsPersonnelles.nom}
                        onChange={handlePersonalInfoChange}
                        placeholder="Dupont"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Titre professionnel
                    </label>
                    <input
                      type="text"
                      name="titre"
                      value={cvData.informationsPersonnelles.titre}
                      onChange={handlePersonalInfoChange}
                      placeholder="ex: Développeur Full Stack / Designer UX"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={cvData.informationsPersonnelles.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="jean.dupont@email.com"
                      className={`w-full p-3 pl-10 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
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
                    <Phone size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="tel"
                      name="telephone"
                      value={cvData.informationsPersonnelles.telephone}
                      onChange={handlePersonalInfoChange}
                      placeholder="06 12 34 56 78"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="adresse"
                    value={cvData.informationsPersonnelles.adresse}
                    onChange={handlePersonalInfoChange}
                    placeholder="15 rue de la Paix"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="codePostal"
                    value={cvData.informationsPersonnelles.codePostal}
                    onChange={handlePersonalInfoChange}
                    placeholder="75001"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={cvData.informationsPersonnelles.ville}
                    onChange={handlePersonalInfoChange}
                    placeholder="Paris"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date de naissance
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="date"
                      name="dateNaissance"
                      value={cvData.informationsPersonnelles.dateNaissance}
                      onChange={handlePersonalInfoChange}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Nationalité
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={cvData.informationsPersonnelles.nationalite}
                  onChange={handlePersonalInfoChange}
                  placeholder="Française"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                />
              </div>

              <h4 className="font-medium mb-2">Réseaux sociaux et liens</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <ExternalLink size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="linkedin"
                      value={cvData.informationsPersonnelles.linkedin}
                      onChange={handlePersonalInfoChange}
                      placeholder="linkedin.com/in/jeandupont"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Site Web
                  </label>
                  <div className="relative">
                    <Globe size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="siteWeb"
                      value={cvData.informationsPersonnelles.siteWeb}
                      onChange={handlePersonalInfoChange}
                      placeholder="jeandupont.com"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    GitHub
                  </label>
                  <div className="relative">
                    <Code size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="github"
                      value={cvData.informationsPersonnelles.github}
                      onChange={handlePersonalInfoChange}
                      placeholder="github.com/jeandupont"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Twitter / X
                  </label>
                  <div className="relative">
                    <AtSign size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      name="twitter"
                      value={cvData.informationsPersonnelles.twitter}
                      onChange={handlePersonalInfoChange}
                      placeholder="twitter.com/jeandupont"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Résumé professionnel</h3>
              <p className="text-sm text-gray-600 mb-4">Un court paragraphe résumant votre profil, vos compétences clés et vos objectifs professionnels.</p>

              <textarea
                name="resumeProfessionnel"
                value={cvData.resumeProfessionnel}
                onChange={handleResumeChange}
                placeholder="Ex: Développeur full-stack avec 5 ans d'expérience, spécialisé dans les technologies JavaScript modernes. Passion pour la création d'applications web performantes et intuitives..."
                className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-300 transition-all"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Expériences professionnelles</h3>

              {cvData.experiences.length > 0 && (
                <div className="mb-6 space-y-4">
                  {cvData.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border rounded-md p-4 bg-gray-50 relative hover:shadow-sm transition-all"
                    >
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => supprimerExperience(exp.id)}
                      >
                        <X size={18} />
                      </button>

                      <div className="flex flex-col sm:flex-row justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{exp.poste}</h4>
                          <p className="text-gray-600">{exp.entreprise}</p>
                        </div>
                        <div className="text-gray-500 text-sm mt-1 sm:mt-0 flex items-center sm:text-right">
                          <Calendar size={14} className="inline mr-1" />
                          <span>
                            {new Date(exp.dateDebut).toLocaleDateString('fr-FR', {year: 'numeric', month: 'short'})}
                            {' - '}
                            {exp.estEmploiActuel
                              ? "Aujourd'hui"
                              : exp.dateFin
                                ? new Date(exp.dateFin).toLocaleDateString('fr-FR', {year: 'numeric', month: 'short'})
                                : ''
                            }
                          </span>
                        </div>
                      </div>

                      {exp.lieu && (
                        <div className="text-gray-500 text-sm mb-2 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {exp.lieu}
                        </div>
                      )}

                      {exp.description && (
                        <div className="text-sm mt-2 whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <h4 className="font-medium mb-3">Ajouter une expérience</h4>
              <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Poste / Fonction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={experienceTemp.poste}
                      onChange={(e) => setExperienceTemp({...experienceTemp, poste: e.target.value})}
                      placeholder="ex: Développeur Front-End"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Entreprise <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={experienceTemp.entreprise}
                      onChange={(e) => setExperienceTemp({...experienceTemp, entreprise: e.target.value})}
                      placeholder="ex: Tech Solutions"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Lieu
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute top-3.5 left-3 text-gray-400" />
                      <input
                        type="text"
                        value={experienceTemp.lieu}
                        onChange={(e) => setExperienceTemp({...experienceTemp, lieu: e.target.value})}
                        placeholder="ex: Paris"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date de début <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        value={experienceTemp.dateDebut}
                        onChange={(e) => setExperienceTemp({...experienceTemp, dateDebut: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date de fin
                      </label>
                      <input
                        type="month"
                        value={experienceTemp.dateFin}
                        onChange={(e) => setExperienceTemp({...experienceTemp, dateFin: e.target.value})}
                        disabled={experienceTemp.estEmploiActuel}
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-300 transition-all ${
                          experienceTemp.estEmploiActuel ? 'bg-gray-100 text-gray-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={experienceTemp.estEmploiActuel}
                        onChange={(e) => setExperienceTemp({
                          ...experienceTemp,
                          estEmploiActuel: e.target.checked,
                          dateFin: e.target.checked ? '' : experienceTemp.dateFin
                        })}
                        className="mr-2"
                      />
                      C'est mon emploi actuel
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description et responsabilités
                    </label>
                    <textarea
                      value={experienceTemp.description}
                      onChange={(e) => setExperienceTemp({...experienceTemp, description: e.target.value})}
                      placeholder="Décrivez vos responsabilités et réalisations principales..."
                      className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Conseil: utilisez des puces (•) pour lister vos responsabilités et réalisations
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={ajouterExperience}
                      disabled={!experienceTemp.poste || !experienceTemp.entreprise || !experienceTemp.dateDebut}
                      className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                        !experienceTemp.poste || !experienceTemp.entreprise || !experienceTemp.dateDebut
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Plus size={18} className="mr-1" />
                      Ajouter cette expérience
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Formation</h3>

              {cvData.formations.length > 0 && (
                <div className="mb-6 space-y-4">
                  {cvData.formations.map((formation) => (
                    <div
                      key={formation.id}
                      className="border rounded-md p-4 bg-gray-50 relative hover:shadow-sm transition-all"
                    >
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => supprimerFormation(formation.id)}
                      >
                        <X size={18} />
                      </button>

                      <div className="flex flex-col sm:flex-row justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{formation.diplome}</h4>
                          <p className="text-gray-600">{formation.etablissement}</p>
                        </div>
                        <div className="text-gray-500 text-sm mt-1 sm:mt-0 flex items-center sm:text-right">
                          <Calendar size={14} className="inline mr-1" />
                          <span>
                            {formation.dateDebut}
                            {formation.dateFin ? ` - ${formation.dateFin}` : ''}
                          </span>
                        </div>
                      </div>

                      {formation.lieu && (
                        <div className="text-gray-500 text-sm mb-2 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {formation.lieu}
                        </div>
                      )}

                      {formation.description && (
                        <div className="text-sm mt-2">
                          {formation.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <h4 className="font-medium mb-3">Ajouter une formation</h4>
              <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Diplôme / Formation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formationTemp.diplome}
                      onChange={(e) => setFormationTemp({...formationTemp, diplome: e.target.value})}
                      placeholder="ex: Master en Informatique"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Établissement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formationTemp.etablissement}
                      onChange={(e) => setFormationTemp({...formationTemp, etablissement: e.target.value})}
                      placeholder="ex: Université de Paris"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Lieu
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute top-3.5 left-3 text-gray-400" />
                    <input
                      type="text"
                      value={formationTemp.lieu}
                      onChange={(e) => setFormationTemp({...formationTemp, lieu: e.target.value})}
                      placeholder="ex: Paris"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date de début
                    </label>
                    <input
                      type="text"
                      value={formationTemp.dateDebut}
                      onChange={(e) => setFormationTemp({...formationTemp, dateDebut: e.target.value})}
                      placeholder="ex: 2018"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date de fin
                    </label>
                    <input
                      type="text"
                      value={formationTemp.dateFin}
                      onChange={(e) => setFormationTemp({...formationTemp, dateFin: e.target.value})}
                      placeholder="ex: 2020 (ou 'En cours')"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (optionnelle)
                  </label>
                  <textarea
                    value={formationTemp.description}
                    onChange={(e) => setFormationTemp({...formationTemp, description: e.target.value})}
                    placeholder="Spécialisation, projets importants, mentions..."
                    className="w-full p-3 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={ajouterFormation}
                    disabled={!formationTemp.diplome || !formationTemp.etablissement}
                    className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                      !formationTemp.diplome || !formationTemp.etablissement
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Plus size={18} className="mr-1" />
                    Ajouter cette formation
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Compétences <span className="text-red-500">*</span></h3>

              <div className="mb-4 flex flex-wrap">
                {cvData.competences.map((comp, index) => (
                  <div key={index} className="inline-block m-1 p-2 pr-1 bg-gray-200 rounded-md flex items-center">
                    {comp}
                    <button
                      onClick={() => supprimerCompetence(index)}
                      className="ml-1 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {erreurs.competences && cvData.competences.length === 0 && (
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
                      ajouterCompetence();
                    }
                  }}
                />
                <button
                  onClick={ajouterCompetence}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Ajouter des compétences techniques (ex: JavaScript, Photoshop) et des soft skills (ex: Communication, Gestion de projet)
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Langues</h3>

              {cvData.langues.length > 0 && (
                <div className="mb-4 space-y-2">
                  {cvData.langues.map((langue) => (
                    <div key={langue.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                      <div className="flex items-center">
                        <Globe size={16} className="text-blue-500 mr-2" />
                        <span className="font-medium">{langue.langue}</span>
                        <span className="ml-2 text-sm text-gray-500">- {langue.niveau}</span>
                      </div>
                      <button
                        onClick={() => supprimerLangue(langue.id)}
                        className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Langue
                  </label>
                  <input
                    type="text"
                    value={langueTemp.langue}
                    onChange={(e) => setLangueTemp({...langueTemp, langue: e.target.value})}
                    placeholder="ex: Anglais"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Niveau
                  </label>
                  <select
                    value={langueTemp.niveau}
                    onChange={(e) => setLangueTemp({...langueTemp, niveau: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all bg-white"
                  >
                    {niveauxLangue.map((niveau) => (
                      <option key={niveau} value={niveau}>{niveau}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={ajouterLangue}
                  disabled={!langueTemp.langue.trim()}
                  className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                    !langueTemp.langue.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <Plus size={18} className="mr-1" />
                  Ajouter cette langue
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Centres d'intérêt</h3>

              <div className="mb-4 flex flex-wrap">
                {cvData.interets.map((interet, index) => (
                  <div key={index} className="inline-block m-1 p-2 pr-1 bg-purple-100 rounded-md flex items-center">
                    {interet}
                    <button
                      onClick={() => supprimerInteret(index)}
                      className="ml-1 p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex mb-2">
                <input
                  type="text"
                  value={interetTemp}
                  onChange={(e) => setInteretTemp(e.target.value)}
                  placeholder="Ajouter un centre d'intérêt"
                  className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-300 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      ajouterInteret();
                    }
                  }}
                />
                <button
                  onClick={ajouterInteret}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-md transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Ajouter des activités, hobbies ou passions qui vous définissent
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Références</h3>

              <div className="mb-4">
                <label className="flex items-center text-sm mb-4">
                  <input
                    type="checkbox"
                    checked={cvData.afficherReferences}
                    onChange={(e) => setCvData({...cvData, afficherReferences: e.target.checked})}
                    className="mr-2"
                  />
                  Afficher mes références sur mon CV
                </label>

                {cvData.references.length > 0 && (
                  <div className="mb-6 space-y-4">
                    {cvData.references.map((ref) => (
                      <div
                        key={ref.id}
                        className="border rounded-md p-4 bg-gray-50 relative hover:shadow-sm transition-all"
                      >
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                          onClick={() => supprimerReference(ref.id)}
                        >
                          <X size={18} />
                        </button>

                        <div className="mb-2">
                          <h4 className="font-medium">{ref.nom}</h4>
                          <p className="text-gray-600">{ref.poste} chez {ref.entreprise}</p>
                        </div>

                        {ref.email && (
                          <div className="text-gray-600 text-sm flex items-center">
                            <Mail size={14} className="mr-1" />
                            {ref.email}
                          </div>
                        )}

                        {ref.telephone && (
                          <div className="text-gray-600 text-sm flex items-center">
                            <Phone size={14} className="mr-1" />
                            {ref.telephone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {cvData.afficherReferences && (
                  <>
                    <h4 className="font-medium mb-3">Ajouter une référence</h4>
                    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={referenceTemp.nom}
                            onChange={(e) => setReferenceTemp({...referenceTemp, nom: e.target.value})}
                            placeholder="ex: Jean Dupont"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Entreprise <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={referenceTemp.entreprise}
                            onChange={(e) => setReferenceTemp({...referenceTemp, entreprise: e.target.value})}
                            placeholder="ex: Tech Solutions"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Poste
                        </label>
                        <input
                          type="text"
                          value={referenceTemp.poste}
                          onChange={(e) => setReferenceTemp({...referenceTemp, poste: e.target.value})}
                          placeholder="ex: Directeur technique"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <Mail size={18} className="absolute top-3.5 left-3 text-gray-400" />
                            <input
                              type="email"
                              value={referenceTemp.email}
                              onChange={(e) => setReferenceTemp({...referenceTemp, email: e.target.value})}
                              placeholder="ex: jean.dupont@email.com"
                              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Téléphone
                          </label>
                          <div className="relative">
                            <Phone size={18} className="absolute top-3.5 left-3 text-gray-400" />
                            <input
                              type="tel"
                              value={referenceTemp.telephone}
                              onChange={(e) => setReferenceTemp({...referenceTemp, telephone: e.target.value})}
                              placeholder="ex: 06 12 34 56 78"
                              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={ajouterReference}
                          disabled={!referenceTemp.nom || !referenceTemp.entreprise}
                          className={`px-4 py-2 rounded-md flex items-center transition-colors ${
                            !referenceTemp.nom || !referenceTemp.entreprise
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          <Plus size={18} className="mr-1" />
                          Ajouter cette référence
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Finalisation</h3>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-center mb-2">
                  <Check size={20} className="text-blue-500 mr-2" />
                  <span className="font-medium">Votre CV est prêt !</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vérifiez une dernière fois les informations sur la prévisualisation à droite,
                  puis téléchargez votre CV au format PDF ou imprimez-le directement.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={imprimerCV}
                    className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center mx-2"
                  >
                    <Download size={18} className="mr-2" />
                    Télécharger en PDF
                  </button>

                  <button
                    onClick={imprimerCV}
                    className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center mx-2"
                  >
                    <Printer size={18} className="mr-2" />
                    Imprimer
                  </button>
                </div>

                <div className="text-center text-gray-500 text-sm">
                  {saveStatus === 'preparing' && (
                    <div className="animate-pulse">Préparation du document...</div>
                  )}
                  {saveStatus === 'ready' && (
                    <div className="text-green-500">Document prêt !</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Étape inconnue</div>;
    }
  };

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
          <div
            className={`mx-auto bg-white transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-sm border' : 'max-w-2xl'
            }`}
          >
            <div className="bg-white shadow-lg border">
              <div className="bg-blue-600 text-white p-6">
                <div className="flex flex-col md:flex-row">
                  {cvData.informationsPersonnelles.photo && (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <img
                        src={cvData.informationsPersonnelles.photo}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {cvData.informationsPersonnelles.prenom || 'Prénom'} {cvData.informationsPersonnelles.nom || 'Nom'}
                    </h1>
                    <p className="text-xl text-blue-200 mt-1">{cvData.informationsPersonnelles.titre || 'Titre professionnel'}</p>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cvData.informationsPersonnelles.email && (
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-2" />
                          {cvData.informationsPersonnelles.email}
                        </div>
                      )}
                      {cvData.informationsPersonnelles.telephone && (
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-2" />
                          {cvData.informationsPersonnelles.telephone}
                        </div>
                      )}
                      {(cvData.informationsPersonnelles.adresse || cvData.informationsPersonnelles.ville) && (
                        <div className="flex items-center text-sm">
                          <MapPin size={14} className="mr-2" />
                          {cvData.informationsPersonnelles.ville}
                        </div>
                      )}
                      {cvData.informationsPersonnelles.linkedin && (
                        <div className="flex items-center text-sm">
                          <ExternalLink size={14} className="mr-2" />
                          {cvData.informationsPersonnelles.linkedin}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {cvData.resumeProfessionnel && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">Profil professionnel</h2>
                    <p className="text-gray-700">{cvData.resumeProfessionnel}</p>
                  </div>
                )}

                {cvData.experiences.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">
                      Expériences professionnelles
                    </h2>
                    <div className="space-y-4">
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id} className="mb-3">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <h3 className="font-semibold">{exp.poste}</h3>
                              <p className="text-gray-600">{exp.entreprise}{exp.lieu ? `, ${exp.lieu}` : ''}</p>
                            </div>
                            <div className="text-gray-500 text-sm mt-1 md:mt-0">
                              {exp.dateDebut && new Date(exp.dateDebut).toLocaleDateString('fr-FR', {year: 'numeric', month: 'short'})}
                              {' - '}
                              {exp.estEmploiActuel
                                ? "Aujourd'hui"
                                : exp.dateFin
                                  ? new Date(exp.dateFin).toLocaleDateString('fr-FR', {year: 'numeric', month: 'short'})
                                  : ''
                              }
                            </div>
                          </div>
                          {exp.description && (
                            <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                              {exp.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cvData.competences.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">
                      Compétences
                    </h2>
                    <div className="flex flex-wrap">
                      {cvData.competences.map((comp, index) => (
                        <span
                          key={index}
                          className="m-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {cvData.formations.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-1">
                      Formation
                    </h2>
                    {cvData.formations.map((formation) => (
                      <div key={formation.id} className="mb-3">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div>
                            <h3 className="font-semibold">{formation.diplome}</h3>
                            <p className="text-gray-600">{formation.etablissement}{formation.lieu ? `, ${formation.lieu}` : ''}</p>
                          </div>
                          <div className="text-gray-500 text-sm mt-1 md:mt-0">
                            {formation.dateDebut} - {formation.dateFin || "En cours"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-white">
      <div className="bg-white border-b py-4 px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Générateur de CV</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
          onClick={imprimerCV}
        >
          <Download size={16} className="mr-2" />
          Télécharger
        </button>
      </div>

      <div className="flex-grow flex overflow-hidden">
        <div className="w-7/12 flex flex-col overflow-hidden">
          <div className="border-b py-4">
            <div className="flex items-center justify-between px-4">
              {etapes.map((etape) => (
                <div
                  key={etape.id}
                  className={`flex flex-col items-center`}
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
                      className={`relative z-10 w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                        etape.id < etapeActive ? 'bg-green-500 text-white' :
                        etape.id === etapeActive ? 'border-2 border-blue-500 bg-white text-blue-500' : 'border border-gray-300 bg-white text-gray-400'
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
                  <div className={`text-xs font-medium ${
                    etape.id < etapeActive ? 'text-green-500' :
                    etape.id === etapeActive ? 'text-blue-500' : 'text-gray-400'
                  }`}>{etape.titre}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            {rendreEtapeActive()}

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
                  onClick={imprimerCV}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                >
                  <Download size={18} className="mr-1" />
                  Télécharger le CV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-5/12 p-4 bg-white border-l">
          {rendrePrevisualisation()}
        </div>
      </div>
    </div>
  );
};

export default GenerateurCV;