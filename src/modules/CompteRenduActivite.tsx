import React, { useState, useEffect, useRef } from 'react';

// Composant de recherche et sélection de projet amélioré
const ImprovedProjectSelector = ({ value, onChange, options, codeMap }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fonction pour trouver le code d'un projet
  function findCodeForProject(name, codeMap) {
    for (const [code, projectName] of Object.entries(codeMap)) {
      if (projectName === name) {
        return code;
      }
    }
    return "";
  }

  // Filtrer les options lorsque le terme de recherche change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options);
      setHighlightedIndex(-1);
      return;
    }

    // Simuler un léger délai pour montrer l'indicateur de chargement
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      const searchTermLower = searchTerm.toLowerCase();

      // Filtrer les options par nom de projet ou code
      const filtered = options.filter(option => {
        const optionLower = option.toLowerCase();
        const codeLower = findCodeForProject(option, codeMap).toLowerCase();

        return optionLower.includes(searchTermLower) ||
               codeLower.includes(searchTermLower);
      });

      // Trier les résultats : options commençant par le terme de recherche en premier
      const sortedFiltered = [...filtered].sort((a, b) => {
        const aStartsWithQuery = a.toLowerCase().startsWith(searchTermLower);
        const bStartsWithQuery = b.toLowerCase().startsWith(searchTermLower);

        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (!aStartsWithQuery && bStartsWithQuery) return 1;
        return 0;
      });

      setFilteredOptions(sortedFiltered);
      setHighlightedIndex(sortedFiltered.length > 0 ? 0 : -1);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, options, codeMap]);

  // Gérer les touches du clavier pour la navigation dans le dropdown
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          e.preventDefault();
          onChange(filteredOptions[highlightedIndex]);
          setSearchTerm('');
          setIsFocused(false);
          setIsDropdownOpen(false);
          inputRef.current?.blur();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  // Faire défiler l'option mise en surbrillance dans la vue
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  // Fonction pour mettre en surbrillance le texte qui correspond au terme de recherche
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? <mark key={i} className="bg-yellow-200 px-0">{part}</mark> : part
        )}
      </>
    );
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            className="w-full border rounded p-2 pr-8"
            placeholder="Rechercher un projet par nom ou code..."
            value={isFocused ? searchTerm : (value || '')}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setSearchTerm('');
              setIsDropdownOpen(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              // Délai pour permettre de cliquer sur une option avant de fermer le dropdown
              setTimeout(() => setIsDropdownOpen(false), 200);
            }}
            onKeyDown={handleKeyDown}
          />
          {isLoading && (
            <div className="absolute right-2 top-2 animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          )}
        </div>
        <button
          className="ml-2 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label={isDropdownOpen ? "Fermer la liste" : "Ouvrir la liste"}
        >
          {isDropdownOpen ? "▲" : "▼"}
        </button>
      </div>

      {/* Dropdown des options filtrées */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full bg-white shadow-lg border rounded mt-1 max-h-60 overflow-y-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => {
              const projectCode = findCodeForProject(option, codeMap);

              return (
                <div
                  key={index}
                  data-index={index}
                  className={`p-3 cursor-pointer border-b hover:bg-blue-50 flex justify-between ${
                    highlightedIndex === index ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => {
                    onChange(option);
                    setSearchTerm('');
                    setIsFocused(false);
                    setIsDropdownOpen(false);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="font-medium">
                    {highlightMatch(option, searchTerm)}
                  </div>
                  <div className="text-gray-600 ml-2">
                    {highlightMatch(projectCode, searchTerm)}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-gray-500 text-center">Aucun projet trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

// Obtenir le jour de la semaine abrégé en français
const getDayAbbreviation = (year, month, day) => {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  const dayAbbreviations = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  return dayAbbreviations[dayOfWeek];
};

const CompteRenduActivite = () => {
  // Base configuration
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(4); // Avril (1-indexed for user display)
  const [workDays, setWorkDays] = useState(21);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [weekendDays, setWeekendDays] = useState([]);
  const [workingDays, setWorkingDays] = useState([]);
  const [activeTab, setActiveTab] = useState(1); // 1 = jours 1-15, 2 = jours 16-31, 3 = mois complet

  // User info
  const [company, setCompany] = useState("ATS Conseil");
  const [provider, setProvider] = useState("HUETZ Patrice");
  const [assignment, setAssignment] = useState("Réalisation/Dev");
  const [validator, setValidator] = useState("Delestaing Florent");

  // Activity data - empty by default
  const [projects, setProjects] = useState([]);
  const [absenceRows, setAbsenceRows] = useState([
    { id: 1, type: "", days: Array(31).fill(0) }
  ]);
  const [surveillance, setSurveillance] = useState(Array(31).fill(0));
  const [interventionHors, setInterventionHors] = useState(Array(31).fill(0));
  const [interventionSur, setInterventionSur] = useState(Array(31).fill(0));
  const [heuresSup, setHeuresSup] = useState(Array(31).fill(0));

  // Project code to label mapping
  const projectCodeMap = {
    "IS50": "ALISE - Gestion aides d'urgence",
    "IS51": "Refonte de l'architecture SI",
    "IH10": "CHEOPS - Administration système",
    "IH11": "Migration base de données",
    "IH20": "Maintenance serveurs production",
    "IT30": "Développement interfaces REST",
    "IT31": "Modernisation backend",
    "IT40": "Support utilisateurs N2"
  };

  // Liste complète des projets pour l'autocomplétion
  const projectOptions = Object.values(projectCodeMap);

  // Find code from project name
  const findProjectCode = (projectName) => {
    for (const [code, name] of Object.entries(projectCodeMap)) {
      if (name === projectName) {
        return code;
      }
    }
    return "";
  };

  // Update days in month and weekend days when year/month changes
  useEffect(() => {
    const days = new Date(year, month, 0).getDate();
    setDaysInMonth(days);

    // Calculate weekend days and working days
    const weekends = [];
    const working = [];

    for (let i = 1; i <= days; i++) {
      const dayDate = new Date(year, month - 1, i);
      const dayOfWeek = dayDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(i);
      } else {
        working.push(i);
      }
    }

    setWeekendDays(weekends);
    setWorkingDays(working);

    // Calculate work days (excluding weekends)
    setWorkDays(working.length);
  }, [year, month]);

  // Handle project day input change
  const handleDayChange = (projectIndex, dayIndex, value) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;

    const updatedProjects = [...projects];
    updatedProjects[projectIndex].days[dayIndex] = numValue;
    setProjects(updatedProjects);
  };

  // Handle project code change with automatic label lookup
  const handleCodeChange = (projectIndex, code) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].code = code;

    // Automatically update project name if code exists in mapping
    if (projectCodeMap[code]) {
      updatedProjects[projectIndex].name = projectCodeMap[code];
    }

    setProjects(updatedProjects);
  };

  // Handle project name change with autocomplete
  const handleNameChange = (projectIndex, name) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].name = name;

    // Try to find and update the code if it exists
    const code = findProjectCode(name);
    if (code) {
      updatedProjects[projectIndex].code = code;
    }

    setProjects(updatedProjects);
  };

  // Auto-fill a project row with 1's for all working days
  const autoFillRow = (projectIndex) => {
    const updatedProjects = [...projects];
    const newDays = Array(31).fill(0);

    // Fill with 1's for working days only
    workingDays.forEach(day => {
      newDays[day - 1] = 1; // -1 because days are 1-indexed but array is 0-indexed
    });

    updatedProjects[projectIndex].days = newDays;
    setProjects(updatedProjects);
  };

  // Delete a project row
  const deleteRow = (projectIndex) => {
    const updatedProjects = [...projects];
    updatedProjects.splice(projectIndex, 1);
    setProjects(updatedProjects);
  };

  // Add a new empty project row
  const addProjectRow = () => {
    const newProject = {
      id: projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      name: "",
      code: "",
      phase: "Réalis",
      days: Array(31).fill(0),
      checked: true
    };
    setProjects([...projects, newProject]);
  };
  
  // Add a new absence row
  const addAbsenceRow = () => {
    const newAbsence = {
      id: absenceRows.length ? Math.max(...absenceRows.map(a => a.id)) + 1 : 1,
      type: "",
      days: Array(31).fill(0)
    };
    setAbsenceRows([...absenceRows, newAbsence]);
  };
  
  // Handle absence type change
  const handleAbsenceTypeChange = (absenceIndex, value) => {
    const updatedAbsences = [...absenceRows];
    updatedAbsences[absenceIndex].type = value;
    setAbsenceRows(updatedAbsences);
  };
  
  // Handle absence day change
  const handleAbsenceDayChange = (absenceIndex, dayIndex, value) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (isNaN(numValue) || numValue < 0) return;

    const updatedAbsences = [...absenceRows];
    updatedAbsences[absenceIndex].days[dayIndex] = numValue;
    setAbsenceRows(updatedAbsences);
  };

  // Reset the form
  const resetForm = () => {
    // Dans cette démo, on ne montre pas la confirmation
    setProjects([]);
    setAbsenceRows([{ id: 1, type: "", days: Array(31).fill(0) }]);
    setSurveillance(Array(31).fill(0));
    setInterventionHors(Array(31).fill(0));
    setInterventionSur(Array(31).fill(0));
    setHeuresSup(Array(31).fill(0));
  };

  // Save the form data (pour la démo, on ne fait qu'afficher un message)
  const saveCRA = () => {
    alert('Le CRA a été enregistré avec succès!');
  };

  // Calculate mission totals
  const calculateTotals = () => {
    // Daily totals
    const dayTotals = Array(31).fill(0);
    projects.forEach(project => {
      project.days.forEach((value, index) => {
        if (index < daysInMonth) dayTotals[index] += value;
      });
    });

    // Project totals
    const projectSums = projects.map(project =>
      project.days.reduce((sum, day) => sum + day, 0)
    );

    // Grand total
    const missionSum = dayTotals.reduce((sum, day) => sum + day, 0);
    
    // Calculate absence sum from all absence rows
    const absenceSum = absenceRows.reduce((total, absence) => 
      total + absence.days.reduce((sum, day) => sum + day, 0), 0);

    // Astreintes totals - Make sure we handle numbers correctly
    const surveillanceSum = surveillance.reduce((sum, hours) => {
      const value = parseFloat(hours) || 0;
      return sum + value;
    }, 0);

    const interventionHorsSum = interventionHors.reduce((sum, hours) => {
      const value = parseFloat(hours) || 0;
      return sum + value;
    }, 0);

    const interventionSurSum = interventionSur.reduce((sum, hours) => {
      const value = parseFloat(hours) || 0;
      return sum + value;
    }, 0);

    const heuresSupSum = heuresSup.reduce((sum, hours) => {
      const value = parseFloat(hours) || 0;
      return sum + value;
    }, 0);

    const astreintesTotal = surveillanceSum + interventionHorsSum + interventionSurSum + heuresSupSum;

    // Format decimal values with 2 decimal places
    return {
      dayTotals,
      projectSums,
      missionSum,
      absenceSum,
      grandTotal: missionSum,
      surveillanceSum: parseFloat(surveillanceSum.toFixed(2)),
      interventionHorsSum: parseFloat(interventionHorsSum.toFixed(2)),
      interventionSurSum: parseFloat(interventionSurSum.toFixed(2)),
      heuresSupSum: parseFloat(heuresSupSum.toFixed(2)),
      astreintesTotal: parseFloat(astreintesTotal.toFixed(2))
    };
  };

  // Calculate daily astreintes totals
  const calculateAstreintesTotals = () => {
    const totals = [];

    for (let i = 0; i < 31; i++) {
      if (i < daysInMonth) {
        const dayTotal =
          parseFloat(surveillance[i] || 0) +
          parseFloat(interventionHors[i] || 0) +
          parseFloat(interventionSur[i] || 0) +
          parseFloat(heuresSup[i] || 0);

        totals.push(parseFloat(dayTotal.toFixed(2)));
      } else {
        totals.push(0);
      }
    }

    return totals;
  };

  // Calculate all the totals
  const totals = calculateTotals();
  const astreintesTotals = calculateAstreintesTotals();

  // Helper function to handle decimal input
  const handleDecimalInput = (value, setter, index) => {
    // Remplacer la virgule par un point pour la décimale si nécessaire
    const inputVal = value.replace(',', '.');

    // Valider que c'est un nombre valide
    const val = inputVal === '' ? 0 : parseFloat(inputVal);
    if (isNaN(val) || val < 0) return;

    const updated = [...setter];
    updated[index] = val;
    return updated;
  };

  // Add a demo project with a selected value for better visualization
  useEffect(() => {
    if (projects.length === 0) {
      const newProject = {
        id: 1,
        name: "ALISE - Gestion aides d'urgence",
        code: "IS50",
        phase: "Réalis",
        days: Array(31).fill(0),
        checked: true
      };
      setProjects([newProject]);
    }
  }, [projects.length]);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Compte Rendu d'Activité</h2>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          {/* Period Reference Box */}
          <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/2">
            <h3 className="font-bold mb-2 text-blue-700 border-b pb-2">Période de référence</h3>
            <div className="flex justify-between mb-3 items-center">
              <label htmlFor="year" className="font-medium">Année</label>
              <select
                id="year"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={year}
                onChange={e => setYear(parseInt(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            <div className="flex justify-between mb-3 items-center">
              <label htmlFor="month" className="font-medium">Mois</label>
              <select
                id="month"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={month}
                onChange={e => setMonth(parseInt(e.target.value))}
              >
                <option value={1}>Janvier</option>
                <option value={2}>Février</option>
                <option value={3}>Mars</option>
                <option value={4}>Avril</option>
                <option value={5}>Mai</option>
                <option value={6}>Juin</option>
                <option value={7}>Juillet</option>
                <option value={8}>Août</option>
                <option value={9}>Septembre</option>
                <option value={10}>Octobre</option>
                <option value={11}>Novembre</option>
                <option value={12}>Décembre</option>
              </select>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <label className="font-medium">Jours ouvrés du mois :</label>
              <span className="font-bold text-blue-700">{workDays}</span>
            </div>
          </div>

          {/* Company/Provider Info Box */}
          <div className="bg-white shadow rounded-lg p-4 w-full md:w-1/2">
            <h3 className="font-bold mb-2 text-blue-700 border-b pb-2">Informations</h3>
            <div className="flex justify-between mb-3 items-center">
              <label htmlFor="company" className="font-medium">Entreprise</label>
              <select
                id="company"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={company}
                onChange={e => setCompany(e.target.value)}
              >
                <option value="ATS Conseil">ATS Conseil</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="flex justify-between mb-3 items-center">
              <label htmlFor="provider" className="font-medium">Prestataire</label>
              <select
                id="provider"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={provider}
                onChange={e => setProvider(e.target.value)}
              >
                <option value="HUETZ Patrice">HUETZ Patrice</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="flex justify-between mb-3 items-center">
              <label htmlFor="assignment" className="font-medium">Affectation</label>
              <input
                type="text"
                id="assignment"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={assignment}
                onChange={e => setAssignment(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="validator" className="font-medium">Valideur</label>
              <input
                type="text"
                id="validator"
                className="p-2 border rounded bg-white focus:outline-none focus:ring-blue-300"
                value={validator}
                onChange={e => setValidator(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Button Bar */}
        <div className="flex flex-wrap gap-2 mb-4 bg-white shadow rounded-lg p-3">
          <button
            className="flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={addProjectRow}
          >
            <span className="mr-1">+</span> Ajouter une ligne d'imputation
          </button>
          <button
            className="flex items-center p-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            onClick={addAbsenceRow}
          >
            <span className="mr-1">+</span> Ajouter une ligne d'absence
          </button>
          <button
            className="flex items-center p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            onClick={resetForm}
          >
            <span className="mr-1">↺</span> Réinitialiser le CRA
          </button>
          <button
            className="flex items-center p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={saveCRA}
          >
            <span className="mr-1">💾</span> Enregistrer le CRA
          </button>
          <button className="flex items-center p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            <span className="mr-1">↩</span> Retour
          </button>
          <button className="flex items-center p-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors">
            <span className="mr-1">↻</span> Charger mois précédent
          </button>
        </div>

        {/* Jours tab selector */}
        <div className="flex justify-center mt-4 mb-2">
          <div className="inline-flex rounded-md shadow-sm bg-white">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(1)}
            >
              Jours 1-15
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 2 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(2)}
            >
              Jours 16-{daysInMonth}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 3 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(3)}
            >
              Mois complet
            </button>
          </div>
        </div>

        {/* CRA Table */}
        <div className="bg-white shadow rounded-lg p-3 overflow-hidden">
          <div className="overflow-x-auto" style={activeTab === 3 ? {maxWidth: '100%', overflowX: 'scroll'} : {}}>
            <table className="w-full border-collapse text-sm" style={activeTab === 3 ? {width: 'max-content', minWidth: '100%'} : {}}>
              <thead>
                <tr>
                  <th className="border bg-blue-600 text-white p-2" rowSpan={2}>Mission </th>
                  <th className="border bg-blue-600 text-white p-2 w-16" rowSpan={2}>CPB</th>
                  <th className="border bg-blue-600 text-white p-2" rowSpan={2}>Phase</th>
                  <th className="border bg-blue-600 text-white p-2 text-center" colSpan={activeTab === 3 ? daysInMonth : 15}>
                    {activeTab === 3 
                      ? 'Jours du mois complet' 
                      : `Jours du mois ${activeTab === 1 ? '1-15' : `16-${daysInMonth}`}`}
                  </th>
                  <th className="border bg-blue-600 text-white p-2" rowSpan={2}>Total</th>
                </tr>
                <tr>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return Array.from({ length: end - start }).map((_, index) => {
                      const dayNumber = start + index + 1;
                      return (
                        <th
                          key={index}
                          className={`border p-1 w-10 text-center ${
                            weekendDays.includes(dayNumber)
                              ? 'bg-gray-500 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <div>
                            <div>{dayNumber}</div>
                            <div className="text-xs">{getDayAbbreviation(year, month, dayNumber)}</div>
                          </div>
                        </th>
                      );
                    });
                  })()}
                </tr>
              </thead>

              {/* Mission CCAS Section */}
              <tbody>
                <tr>
                  <td colSpan={18} className="border bg-blue-800 text-white p-2 font-bold">
                    <input type="checkbox" className="mr-2" checked readOnly /> Imputation mission
                  </td>
                </tr>

                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="border p-4 text-center text-gray-500">
                      Aucun projet ajouté. Cliquez sur "Ajouter une ligne d'imputation" pour commencer.
                    </td>
                  </tr>
                ) : (
                  projects.map((project, projectIndex) => (
                    <tr key={project.id} className="hover:bg-blue-50">
                      <td className="border p-2 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={project.checked}
                            onChange={e => {
                              const updatedProjects = [...projects];
                              updatedProjects[projectIndex].checked = e.target.checked;
                              setProjects(updatedProjects);
                            }}
                          />
                          <div className="flex-grow w-full">
                            <ImprovedProjectSelector
                              value={project.name}
                              onChange={(value) => handleNameChange(projectIndex, value)}
                              options={projectOptions}
                              codeMap={projectCodeMap}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="border p-2 text-center">
                        <input
                          type="text"
                          className="w-full text-center border p-1 rounded"
                          value={project.code}
                          onChange={e => handleCodeChange(projectIndex, e.target.value)}
                          placeholder="Code"
                        />
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <select
                            className="w-full p-1 border rounded"
                            value={project.phase}
                            onChange={e => {
                              const updatedProjects = [...projects];
                              updatedProjects[projectIndex].phase = e.target.value;
                              setProjects(updatedProjects);
                            }}
                          >
                            <option value="Réalis">Réalis</option>
                            <option value="Concept">Concept</option>
                            <option value="Test">Test</option>
                          </select>

                          <div className="flex ml-2">
                            <button
                              className="mr-1 bg-blue-500 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                              onClick={() => autoFillRow(projectIndex)}
                              title="Remplir automatiquement cette ligne"
                            >
                              Auto
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                              onClick={() => deleteRow(projectIndex)}
                              title="Supprimer cette ligne"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </td>

                      {(() => {
                        // Définir la plage de jours à afficher selon l'onglet actif
                        let start, end;
                        if (activeTab === 1) {
                          start = 0;
                          end = 15;
                        } else if (activeTab === 2) {
                          start = 15;
                          end = daysInMonth;
                        } else { // activeTab === 3 (mois complet)
                          start = 0;
                          end = daysInMonth;
                        }
                        
                        return Array.from({ length: end - start }).map((_, indexOffset) => {
                          const dayIndex = start + indexOffset;
                          
                          return (
                            <td
                              key={indexOffset}
                              className={`border p-1 text-center ${
                                weekendDays.includes(dayIndex + 1)
                                  ? 'bg-gray-100'
                                  : project.days[dayIndex] > 1
                                    ? 'bg-red-200'
                                    : ''
                              }`}
                            >
                              <input
                                type="text"
                                className="w-8 text-center border rounded p-1"
                                value={project.days[dayIndex] || ''}
                                onChange={e => handleDayChange(projectIndex, dayIndex, e.target.value)}
                                maxLength={1}
                              />
                            </td>
                          );
                        });
                      })()}

                      <td className={`border p-2 text-center font-bold ${totals.projectSums[projectIndex] > workDays ? 'bg-red-200' : 'bg-blue-50'}`}>
                        {totals.projectSums[projectIndex]}
                      </td>
                    </tr>
                  ))
                )}

                {projects.length > 0 && (
                  <tr className="bg-blue-100 font-bold">
                    <td colSpan={3} className="border p-2">Sous-Total</td>
                    {(() => {
                      // Définir la plage de jours à afficher selon l'onglet actif
                      let start, end;
                      if (activeTab === 1) {
                        start = 0;
                        end = 15;
                      } else if (activeTab === 2) {
                        start = 15;
                        end = daysInMonth;
                      } else { // activeTab === 3 (mois complet)
                        start = 0;
                        end = daysInMonth;
                      }
                      
                      return totals.dayTotals.slice(start, end).map((total, indexOffset) => {
                        const index = start + indexOffset;
                        return (
                          <td
                            key={indexOffset}
                            className={`border p-1 text-center
                              ${weekendDays.includes(index + 1) ? 'bg-gray-200' : ''}
                              ${total > 1 ? 'bg-red-200' : ''}`}
                          >
                            {total > 0 ? total : ''}
                          </td>
                        );
                      });
                    })()}
                    <td className={`border p-2 text-center font-bold ${totals.missionSum > workDays ? 'bg-red-200' : ''}`}>
                      {totals.missionSum}
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Hors Section */}
              <tbody>
                <tr>
                  <td colSpan={18} className="border bg-blue-800 text-white p-2 font-bold">
                    Hors du client
                  </td>
                </tr>
                {absenceRows.map((absence, absenceIndex) => (
                  <tr key={absence.id} className="hover:bg-blue-50">
                    <td className="border p-2">
                      {absenceIndex === 0 ? "Absences" : ""}
                    </td>
                    <td colSpan={2} className="border p-2">
                      <div className="flex items-center">
                        <select
                          className="w-full p-1 border rounded"
                          value={absence.type}
                          onChange={e => handleAbsenceTypeChange(absenceIndex, e.target.value)}
                        >
                          <option value="">-- Type d'absence --</option>
                          <option value="CP">Congés payés</option>
                          <option value="RTT">RTT</option>
                          <option value="Maladie">Maladie</option>
                          <option value="Formation">Formation</option>
                        </select>
                        
                        {absenceRows.length > 1 && (
                          <button
                            className="ml-2 text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                            onClick={() => {
                              const updatedRows = [...absenceRows];
                              updatedRows.splice(absenceIndex, 1);
                              setAbsenceRows(updatedRows);
                            }}
                            title="Supprimer cette ligne"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>

                    {(() => {
                      // Définir la plage de jours à afficher selon l'onglet actif
                      let start, end;
                      if (activeTab === 1) {
                        start = 0;
                        end = 15;
                      } else if (activeTab === 2) {
                        start = 15;
                        end = daysInMonth;
                      } else { // activeTab === 3 (mois complet)
                        start = 0;
                        end = daysInMonth;
                      }
                      
                      return Array.from({ length: end - start }).map((_, indexOffset) => {
                        const dayIndex = start + indexOffset;
                        
                        return (
                          <td
                            key={indexOffset}
                            className={`border p-1 text-center ${
                              weekendDays.includes(dayIndex + 1)
                                ? 'bg-gray-100'
                                : ''
                            }`}
                          >
                            <input
                              type="text"
                              className="w-8 text-center border rounded p-1"
                              value={absence.days[dayIndex] || ''}
                              onChange={e => handleAbsenceDayChange(absenceIndex, dayIndex, e.target.value)}
                              maxLength={1}
                            />
                          </td>
                        );
                      });
                    })()}

                    <td className="border p-2 text-center bg-blue-50 font-bold">
                      {absence.days.reduce((sum, val) => sum + val, 0)}
                    </td>
                  </tr>
                ))}

                {projects.length > 0 && (
                  <tr className="bg-blue-100 font-bold">
                    <td colSpan={3} className="border p-2">Total</td>
                    {(() => {
                      // Définir la plage de jours à afficher selon l'onglet actif
                      let start, end;
                      if (activeTab === 1) {
                        start = 0;
                        end = 15;
                      } else if (activeTab === 2) {
                        start = 15;
                        end = daysInMonth;
                      } else { // activeTab === 3 (mois complet)
                        start = 0;
                        end = daysInMonth;
                      }
                      
                      return Array.from({ length: end - start }).map((_, indexOffset) => {
                        const dayIndex = start + indexOffset;
                        
                        // Calculate total absences for this day from all absence rows
                        const absenceTotal = absenceRows.reduce((sum, absence) => sum + (absence.days[dayIndex] || 0), 0);
                        const dayTotal = totals.dayTotals[dayIndex] + absenceTotal;
                        
                        return (
                          <td
                            key={indexOffset}
                            className={`border p-1 text-center
                              ${weekendDays.includes(dayIndex + 1) ? 'bg-gray-200' : ''}
                              ${dayTotal > 1 ? 'bg-red-200' : ''}`}
                          >
                            {dayTotal > 0 ? dayTotal : ''}
                          </td>
                        );
                      });
                    })()}
                    <td className={`border p-2 text-center font-bold ${(totals.grandTotal + totals.absenceSum) > workDays ? 'bg-red-200' : ''}`}>
                      {totals.grandTotal + totals.absenceSum}
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Heures Astreintes Section */}
              <tbody>
                <tr>
                  <td colSpan={18} className="border bg-blue-800 text-white p-2 font-bold">
                    Heures Astreintes
                  </td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border p-2">Surveillance</td>
                  <td colSpan={2} className="border p-2"></td>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return Array.from({ length: end - start }).map((_, indexOffset) => {
                      const dayIndex = start + indexOffset;
                      
                      return (
                        <td
                          key={indexOffset}
                          className={`border p-1 text-center ${weekendDays.includes(dayIndex + 1) ? 'bg-gray-100' : ''}`}
                        >
                          <input
                            type="text"
                            className="w-8 text-center border rounded p-1"
                            value={surveillance[dayIndex] || ''}
                            onChange={e => {
                              const updated = handleDecimalInput(e.target.value, surveillance, dayIndex);
                              if (updated) setSurveillance(updated);
                            }}
                          />
                        </td>
                      );
                    });
                  })()}
                  <td className="border p-2 text-center bg-blue-50 font-bold">{totals.surveillanceSum}</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border p-2">Intervention hors site</td>
                  <td colSpan={2} className="border p-2"></td>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return Array.from({ length: end - start }).map((_, indexOffset) => {
                      const dayIndex = start + indexOffset;
                      
                      return (
                        <td
                          key={indexOffset}
                          className={`border p-1 text-center ${weekendDays.includes(dayIndex + 1) ? 'bg-gray-100' : ''}`}
                        >
                          <input
                            type="text"
                            className="w-8 text-center border rounded p-1"
                            value={interventionHors[dayIndex] || ''}
                            onChange={e => {
                              const updated = handleDecimalInput(e.target.value, interventionHors, dayIndex);
                              if (updated) setInterventionHors(updated);
                            }}
                          />
                        </td>
                      );
                    });
                  })()}
                  <td className="border p-2 text-center bg-blue-50 font-bold">{totals.interventionHorsSum}</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border p-2">Intervention sur site</td>
                  <td colSpan={2} className="border p-2"></td>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return Array.from({ length: end - start }).map((_, indexOffset) => {
                      const dayIndex = start + indexOffset;
                      
                      return (
                        <td
                          key={indexOffset}
                          className={`border p-1 text-center ${weekendDays.includes(dayIndex + 1) ? 'bg-gray-100' : ''}`}
                        >
                          <input
                            type="text"
                            className="w-8 text-center border rounded p-1"
                            value={interventionSur[dayIndex] || ''}
                            onChange={e => {
                              const updated = handleDecimalInput(e.target.value, interventionSur, dayIndex);
                              if (updated) setInterventionSur(updated);
                            }}
                          />
                        </td>
                      );
                    });
                  })()}
                  <td className="border p-2 text-center bg-blue-50 font-bold">{totals.interventionSurSum}</td>
                </tr>
                <tr className="hover:bg-blue-50">
                  <td className="border p-2">Heures supplémentaires</td>
                  <td colSpan={2} className="border p-2"></td>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return Array.from({ length: end - start }).map((_, indexOffset) => {
                      const dayIndex = start + indexOffset;
                      
                      return (
                        <td
                          key={indexOffset}
                          className={`border p-1 text-center ${weekendDays.includes(dayIndex + 1) ? 'bg-gray-100' : ''}`}
                        >
                          <input
                            type="text"
                            className="w-8 text-center border rounded p-1"
                            value={heuresSup[dayIndex] || ''}
                            onChange={e => {
                              const updated = handleDecimalInput(e.target.value, heuresSup, dayIndex);
                              if (updated) setHeuresSup(updated);
                            }}
                          />
                        </td>
                      );
                    });
                  })()}
                  <td className="border p-2 text-center bg-blue-50 font-bold">{totals.heuresSupSum}</td>
                </tr>
                <tr className="bg-blue-100 font-bold">
                  <td colSpan={3} className="border p-2">Total Astreintes (heures)</td>
                  {(() => {
                    // Définir la plage de jours à afficher selon l'onglet actif
                    let start, end;
                    if (activeTab === 1) {
                      start = 0;
                      end = 15;
                    } else if (activeTab === 2) {
                      start = 15;
                      end = daysInMonth;
                    } else { // activeTab === 3 (mois complet)
                      start = 0;
                      end = daysInMonth;
                    }
                    
                    return astreintesTotals.slice(start, end).map((total, indexOffset) => {
                      const index = start + indexOffset;
                      return (
                        <td key={indexOffset} className={`border p-1 text-center ${weekendDays.includes(index + 1) ? 'bg-gray-200' : ''}`}>
                          {total > 0 ? total : ''}
                        </td>
                      );
                    });
                  })()}
                  <td className="border p-2 text-center">{totals.astreintesTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompteRenduActivite;