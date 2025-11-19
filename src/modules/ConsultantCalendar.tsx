import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Calendar, ChevronDown, Filter, Download, Plus, Edit, Trash2, Eye,
  MoreHorizontal, ArrowLeft, ArrowRight, X, Building2, User, Phone,
  Mail, Globe, MapPin, FileText, AlertCircle, Bell, Target
} from 'lucide-react';
import logger from '@/utils/logger';

// Services
class DateService {
  static getHolidays(year) {
    const fixedHolidays = [
      new Date(year, 0, 1),   // Jour de l'An
      new Date(year, 4, 1),   // Fête du Travail
      new Date(year, 7, 15),  // Assomption
      new Date(year, 10, 1),  // Toussaint
      new Date(year, 11, 25)  // Noël
    ];

    const variableHolidays = [];

    const easterSunday = (year) => {
      const a = year % 19;
      const b = Math.floor(year / 100);
      const c = year % 100;
      const d = Math.floor(b / 4);
      const e = b % 4;
      const f = Math.floor((b + 8) / 25);
      const g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4);
      const k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const month = Math.floor((h + l - 7 * m + 114) / 31);
      const day = ((h + l - 7 * m + 114) % 31) + 1;
      return new Date(year, month - 1, day);
    };

    const easter = easterSunday(year);
    variableHolidays.push(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 1));
    variableHolidays.push(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 39));
    variableHolidays.push(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 50));
    variableHolidays.push(new Date(year, 4, 8));
    variableHolidays.push(new Date(year, 6, 14));
    variableHolidays.push(new Date(year, 10, 11));

    return [...fixedHolidays, ...variableHolidays];
  }

  static isHoliday(date) {
    const year = date.getFullYear();
    const holidays = DateService.getHolidays(year);
    return holidays.some(holiday =>
      holiday.getDate() === date.getDate() && holiday.getMonth() === date.getMonth()
    );
  }

  static getDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date.getTime()));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  static getWeekDays(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.getFullYear(), date.getMonth(), diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      weekDays.push(nextDay);
    }
    return weekDays;
  }

  static getTwoWeekDays(date) {
    const weekDays = DateService.getWeekDays(date);
    const secondWeekStart = new Date(weekDays[6]);
    secondWeekStart.setDate(secondWeekStart.getDate() + 1);

    const secondWeek = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(secondWeekStart);
      nextDay.setDate(secondWeekStart.getDate() + i);
      secondWeek.push(nextDay);
    }
    return [...weekDays, ...secondWeek];
  }

  static getMonthName(date) {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[date.getMonth()];
  }
}

// Storage Service
class LocalStorageService {
  static loadConsultants() {
    const savedConsultants = localStorage.getItem('consultants');
    return savedConsultants ? JSON.parse(savedConsultants) : [];
  }

  static saveConsultants(consultants) {
    localStorage.setItem('consultants', JSON.stringify(consultants));
  }

  static loadCalendarData() {
    const savedData = localStorage.getItem('calendarData');
    return savedData ? JSON.parse(savedData) : {};
  }

  static saveCalendarData(calendarData) {
    localStorage.setItem('calendarData', JSON.stringify(calendarData));
  }
}

// Calendar Utils
class CalendarUtils {
  static presenceTypes = [
    { id: 'feries',      label: 'Fériés',       color: '#888888', symbol: 'F' },
    { id: 'weekend',     label: 'Week-end',     color: '#cccccc', symbol: 'W' },
    { id: 'absence',     label: 'Absence',      color: '#FFA500', symbol: 'A' },
    { id: 'rtt',         label: 'RTT',          color: '#FFA500', symbol: 'R' },
    { id: 'teletravail', label: 'Télétravail',  color: '#4CA3DD', symbol: 'T' },
    { id: 'formation',   label: 'Formation',    color: '#2ECC71', symbol: 'Fo' },
    { id: 'autre',       label: 'Autre',        color: '#3E7CB1', symbol: 'X' }
  ];

  static formatDateRangeTitle(daysToDisplay) {
    if (!daysToDisplay || daysToDisplay.length === 0) return '';
    const firstDay = daysToDisplay[0];
    const lastDay = daysToDisplay[daysToDisplay.length - 1];
    return `${firstDay.getDate()} ${DateService.getMonthName(firstDay)} ${firstDay.getFullYear()} - ` +
           `${lastDay.getDate()} ${DateService.getMonthName(lastDay)} ${lastDay.getFullYear()}`;
  }

  static buildKey(consultantId, date) {
    const dateStr = date.toISOString().split('T')[0];
    return `${consultantId}-${dateStr}`;
  }
}

const ConsultantCalendar = () => {
  // État global du composant
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [consultants, setConsultants] = useState(() => LocalStorageService.loadConsultants());
  const [calendarData, setCalendarData] = useState(() => LocalStorageService.loadCalendarData());

  // Filtre et affichage
  const [filterText, setFilterText] = useState('');
  const [showAddConsultant, setShowAddConsultant] = useState(false);
  const [newConsultant, setNewConsultant] = useState({ name: '', role: '' });
  const [showVacances, setShowVacances] = useState(false);
  const [showOnlyWithEvents, setShowOnlyWithEvents] = useState(false);

  // Saisie d'absence
  const [selectedType, setSelectedType] = useState('absence');
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [selectedCell, setSelectedCell] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [entryDetails, setEntryDetails] = useState({
    type: '',
    description: '',
    startTime: '09:00',
    endTime: '18:00',
    isFullDay: true
  });

  // Infos de survol et toasts
  const [hoverInfo, setHoverInfo] = useState(null);
  const [toastMessages, setToastMessages] = useState([]);

  // Sauvegardes
  useEffect(() => {
    try {
      LocalStorageService.saveCalendarData(calendarData);
    } catch (error) {
      logger.error("Erreur lors de la sauvegarde des données", error, 'ConsultantCalendar');
      showToast("Erreur lors de la sauvegarde des données", "error");
    }
  }, [calendarData]);

  useEffect(() => {
    try {
      LocalStorageService.saveConsultants(consultants);
    } catch (error) {
      logger.error("Erreur lors de la sauvegarde des consultants", error, 'ConsultantCalendar');
      showToast("Erreur lors de la sauvegarde des consultants", "error");
    }
  }, [consultants]);

  const showToast = (message, type = 'success') => {
    const newToast = { id: Date.now(), message, type };
    setToastMessages(prev => [...prev, newToast]);
    setTimeout(() => {
      setToastMessages(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 3000);
  };

  const getDaysToDisplay = () => {
    switch (currentView) {
      case 'week':
        return DateService.getWeekDays(currentDate);
      case 'twoWeeks':
        return DateService.getTwoWeekDays(currentDate);
      case 'month':
      default:
        return DateService.getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    }
  };
  const daysToDisplay = getDaysToDisplay();

  const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  // Navigation
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === 'twoWeeks') {
      newDate.setDate(newDate.getDate() - 14);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === 'twoWeeks') {
      newDate.setDate(newDate.getDate() + 14);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Gestion des cellules
  const handleCellClick = (consultantId, date) => {
    if (!consultantId || !date || !(date instanceof Date)) return;

    if (isRangeSelection) {
      if (!selectedRange.start) {
        setSelectedRange({ start: { consultantId, date }, end: null });
      } else if (!selectedRange.end && selectedRange.start.consultantId === consultantId) {
        setSelectedRange({
          ...selectedRange,
          end: { consultantId, date }
        });
        setEntryDetails({
          type: selectedType,
          description: '',
          startTime: '09:00',
          endTime: '18:00',
          isFullDay: true
        });
        setShowEntryModal(true);
      }
    } else {
      const key = CalendarUtils.buildKey(consultantId, date);
      setSelectedCell({ consultantId, date });
      const existingData = calendarData[key] 
        ? (typeof calendarData[key] === 'object' ? calendarData[key] : { type: calendarData[key] })
        : null;
      setEntryDetails({
        type: existingData?.type || selectedType,
        description: existingData?.description || '',
        startTime: existingData?.startTime || '09:00',
        endTime: existingData?.endTime || '18:00',
        isFullDay: existingData?.isFullDay !== undefined ? existingData.isFullDay : true
      });
      setShowEntryModal(true);
    }
  };

  const handleCellHover = (consultantId, date) => {
    if (!date) return;
    const key = CalendarUtils.buildKey(consultantId, date);
    const cellData = calendarData[key];
    if (cellData && typeof cellData === 'object' && cellData.description) {
      setHoverInfo({
        consultantId,
        date,
        description: cellData.description,
        startDate: cellData.startTime ? new Date(`${date.toISOString().split('T')[0]}T${cellData.startTime}`) : null,
        endDate: cellData.endTime ? new Date(`${date.toISOString().split('T')[0]}T${cellData.endTime}`) : null
      });
    } else {
      setHoverInfo(null);
    }
  };

  // Sauvegarde des entrées
  const saveEntryDetails = () => {
    if (isRangeSelection && selectedRange.start && selectedRange.end) {
      let startDate = new Date(selectedRange.start.date);
      let endDate = new Date(selectedRange.end.date);
      if (startDate > endDate) [startDate, endDate] = [endDate, startDate];
      
      const consultantId = selectedRange.start.consultantId;
      const newData = { ...calendarData };

      const currentDateTemp = new Date(startDate);
      while (currentDateTemp <= endDate) {
        const key = CalendarUtils.buildKey(consultantId, currentDateTemp);
        newData[key] = {
          type: entryDetails.type,
          description: entryDetails.description,
          startTime: entryDetails.isFullDay ? null : entryDetails.startTime,
          endTime: entryDetails.isFullDay ? null : entryDetails.endTime,
          isFullDay: entryDetails.isFullDay
        };
        currentDateTemp.setDate(currentDateTemp.getDate() + 1);
      }

      setCalendarData(newData);
      setSelectedRange({ start: null, end: null });
      showToast('Plage mise à jour avec succès');
    } else if (selectedCell) {
      if (!entryDetails.isFullDay && (!entryDetails.startTime || !entryDetails.endTime)) {
        alert("Veuillez spécifier les heures de début et de fin");
        return;
      }
      if (!entryDetails.isFullDay && entryDetails.startTime >= entryDetails.endTime) {
        alert("L'heure de début doit être antérieure à l'heure de fin");
        return;
      }

      const { consultantId, date } = selectedCell;
      const key = CalendarUtils.buildKey(consultantId, date);
      setCalendarData(prev => ({
        ...prev,
        [key]: {
          type: entryDetails.type,
          description: entryDetails.description,
          startTime: entryDetails.isFullDay ? null : entryDetails.startTime,
          endTime: entryDetails.isFullDay ? null : entryDetails.endTime,
          isFullDay: entryDetails.isFullDay
        }
      }));
      showToast('Entrée mise à jour avec succès');
    }
    setShowEntryModal(false);
  };

  const deleteEntry = () => {
    if (isRangeSelection && selectedRange.start && selectedRange.end) {
      let startDate = new Date(selectedRange.start.date);
      let endDate = new Date(selectedRange.end.date);
      if (startDate > endDate) [startDate, endDate] = [endDate, startDate];
      
      const consultantId = selectedRange.start.consultantId;
      const newData = { ...calendarData };
      const currentDateTemp = new Date(startDate);
      
      while (currentDateTemp <= endDate) {
        const key = CalendarUtils.buildKey(consultantId, currentDateTemp);
        delete newData[key];
        currentDateTemp.setDate(currentDateTemp.getDate() + 1);
      }
      
      setCalendarData(newData);
      showToast('Plage supprimée', 'error');
    } else if (selectedCell) {
      const { consultantId, date } = selectedCell;
      const key = CalendarUtils.buildKey(consultantId, date);
      setCalendarData(prev => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
      showToast('Entrée supprimée', 'error');
    }
    setShowEntryModal(false);
  };

  // Gestion des consultants
  const handleAddConsultant = () => {
    if (!newConsultant.name.trim()) {
      alert("Veuillez saisir un nom pour le consultant");
      return;
    }
    if (!newConsultant.role.trim()) {
      alert("Veuillez saisir un rôle pour le consultant");
      return;
    }

    const newId = consultants.length > 0
      ? Math.max(...consultants.map(c => c.id)) + 1
      : 1;
    
    setConsultants(prev => [
      ...prev,
      { id: newId, name: newConsultant.name.trim(), role: newConsultant.role.trim() }
    ]);
    
    setNewConsultant({ name: '', role: '' });
    setShowAddConsultant(false);
    showToast('Consultant ajouté avec succès');
  };

  // Export / Import
  const exportData = () => {
    try {
      const jsonData = JSON.stringify(calendarData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar_data_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Données exportées avec succès');
    } catch (error) {
      logger.error("Erreur lors de l'exportation", error, 'ConsultantCalendar');
      showToast("Erreur lors de l'exportation", "error");
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          setCalendarData(importedData);
          showToast('Données importées avec succès');
        } catch (error) {
          logger.error("Erreur lors de l'importation", error, 'ConsultantCalendar');
          showToast("Erreur lors de l'importation", "error");
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  // Styles et contenu des cellules
  const getCellStyle = (consultantId, date) => {
    if (!date) return { backgroundColor: 'white' };
    
    const key = CalendarUtils.buildKey(consultantId, date);
    const cellData = calendarData[key];

    if (DateService.isHoliday(date)) {
      const feriesType = CalendarUtils.presenceTypes.find(t => t.id === 'feries');
      return { backgroundColor: feriesType?.color || '#888888' };
    }

    if (cellData) {
      const typeId = typeof cellData === 'object' ? cellData.type : cellData;
      const type = CalendarUtils.presenceTypes.find(t => t.id === typeId);
      if (type) {
        const style = {
          backgroundColor: type.color,
          position: 'relative'
        };
        if (typeof cellData === 'object' && cellData.description) {
          style.border = '2px solid darkblue';
        }
        return style;
      }
    }
    return { backgroundColor: 'white' };
  };

  const getCellContent = (consultantId, date) => {
    if (!date) return null;
    
    if (DateService.isHoliday(date)) {
      const feriesType = CalendarUtils.presenceTypes.find(t => t.id === 'feries');
      return (
        <div className="text-xs font-bold text-white">
          {feriesType.symbol}
        </div>
      );
    }

    const key = CalendarUtils.buildKey(consultantId, date);
    const cellData = calendarData[key];
    if (!cellData) return null;

    const typeId = typeof cellData === 'object' ? cellData.type : cellData;
    const type = CalendarUtils.presenceTypes.find(t => t.id === typeId);
    if (!type) return null;

    return (
      <div className="text-xs font-bold text-white">
        {type.symbol}
        {cellData.isFullDay === false && cellData.startTime && (
          <div className="text-xs mt-1">
            {cellData.startTime.substring(0, 5)}
          </div>
        )}
      </div>
    );
  };

  // Filtrage des consultants
  const consultantHasEventInDisplayedRange = (consultantId) => {
    for (const day of daysToDisplay) {
      const key = CalendarUtils.buildKey(consultantId, day);
      if (calendarData[key]) return true;
    }
    return false;
  };

  // Comptage des absences
  const getAbsenceCountForPeriod = () => {
    if (!daysToDisplay || daysToDisplay.length === 0) return 0;
    const firstDay = daysToDisplay[0];
    const lastDay = daysToDisplay[daysToDisplay.length - 1];

    return Object.keys(calendarData).filter(key => {
      const [, year, month, day] = key.split('-');
      const dateObj = new Date(`${year}-${month}-${day}`);
      return !isNaN(dateObj.getTime()) && dateObj >= firstDay && dateObj <= lastDay;
    }).length;
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendrier des Consultants
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <button
            onClick={exportData}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download size={16} className="mr-1 inline-block" />
            Exporter
          </button>
          <input
            type="file"
            id="import-file"
            accept=".json"
            className="hidden"
            onChange={importData}
          />
          <label
            htmlFor="import-file"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            <Plus size={16} className="mr-1 inline-block" />
            Importer
          </label>
        </div>
      </CardHeader>

      <CardContent>
        {/* Barre de navigation */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToPrevious}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-medium">
              {CalendarUtils.formatDateRangeTitle(daysToDisplay)}
            </span>
            <button
              onClick={goToNext}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1 rounded ${
                currentView === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setCurrentView('twoWeeks')}
              className={`px-3 py-1 rounded ${
                currentView === 'twoWeeks' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              2 Semaines
            </button>
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1 rounded ${
                currentView === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              Mois
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRangeSelection(!isRangeSelection)}
              className={`px-3 py-1 rounded ${
                isRangeSelection ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {isRangeSelection ? 'Mode plage activé' : 'Mode cellule unique'}
            </button>
            {isRangeSelection && (
              <span className="text-sm text-gray-700">
                {selectedRange.start
                  ? (selectedRange.end
                    ? 'Plage sélectionnée'
                    : 'Sélectionnez la date de fin')
                  : 'Sélectionnez la date de début'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Rechercher un consultant..."
              className="px-3 py-1 border rounded"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyWithEvents}
                onChange={(e) => setShowOnlyWithEvents(e.target.checked)}
              />
              <span className="text-sm">Avec événements uniquement</span>
            </label>
          </div>
        </div>

        {/* Types d'absence */}
        <div className="mb-4 p-2 bg-gray-50 rounded">
          <div className="flex flex-wrap gap-4">
            {CalendarUtils.presenceTypes.map(type => (
              <label
                key={type.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="absenceType"
                  checked={selectedType === type.id}
                  onChange={() => setSelectedType(type.id)}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full`}
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calendrier */}
        <div className="border rounded overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="divide-y">
            {consultants
              .filter(consultant => {
                if (filterText) {
                  return consultant.name.toLowerCase().includes(filterText.toLowerCase()) ||
                         consultant.role.toLowerCase().includes(filterText.toLowerCase());
                }
                if (showOnlyWithEvents) {
                  return consultantHasEventInDisplayedRange(consultant.id);
                }
                return true;
              })
              .map(consultant => (
                <div key={consultant.id} className="flex">
                  {/* Info consultant */}
                  <div className="w-48 p-2 bg-gray-50 border-r flex-shrink-0">
                    <div className="font-medium">{consultant.name}</div>
                    <div className="text-sm text-gray-500">{consultant.role}</div>
                  </div>
                  
                  {/* Cellules calendrier */}
                  <div className="flex-grow grid grid-cols-7">
                    {daysToDisplay.map((day, index) => (
                      <div
                        key={index}
                        className={`border-r last:border-r-0 p-2 min-h-[60px] cursor-pointer hover:bg-gray-50 relative ${
                          day.getDay() === 0 || day.getDay() === 6 ? 'bg-gray-50' : ''
                        }`}
                        style={getCellStyle(consultant.id, day)}
                        onClick={() => handleCellClick(consultant.id, day)}
                        onMouseEnter={() => handleCellHover(consultant.id, day)}
                        onMouseLeave={() => setHoverInfo(null)}
                      >
                        <div className="text-xs text-gray-500">
                          {day.getDate()}
                        </div>
                        {getCellContent(consultant.id, day)}
                        
                        {/* Tooltip */}
                        {hoverInfo &&
                          hoverInfo.consultantId === consultant.id &&
                          hoverInfo.date.toISOString().split('T')[0] === day.toISOString().split('T')[0] && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-50 min-w-[200px]">
                              <p className="font-medium mb-1">Description:</p>
                              <p>{hoverInfo.description}</p>
                              {hoverInfo.startDate && (
                                <p className="mt-1">
                                  Début: {hoverInfo.startDate.toLocaleTimeString()}
                                </p>
                              )}
                              {hoverInfo.endDate && (
                                <p>
                                  Fin: {hoverInfo.endDate.toLocaleTimeString()}
                                </p>
                              )}
                            </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Formulaire d'ajout consultant */}
        {showAddConsultant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Ajouter un consultant</h3>
                <button
                  onClick={() => setShowAddConsultant(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={newConsultant.name}
                    onChange={(e) => setNewConsultant({ ...newConsultant, name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Prénom NOM"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rôle / Technologie
                  </label>
                  <input
                    type="text"
                    value={newConsultant.role}
                    onChange={(e) => setNewConsultant({ ...newConsultant, role: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="ex: Développeur Full Stack"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddConsultant(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddConsultant}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition d'absence */}
        {showEntryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {isRangeSelection && selectedRange.start && selectedRange.end
                    ? 'Saisie sur une plage de dates'
                    : `Saisie du ${selectedCell?.date?.toLocaleDateString('fr-FR')}`
                  }
                </h3>
                <button
                  onClick={() => setShowEntryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type
                  </label>
                  <select
                    value={entryDetails.type}
                    onChange={e => setEntryDetails({ ...entryDetails, type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {CalendarUtils.presenceTypes
                      .filter(t => !['feries', 'weekend'].includes(t.id))
                      .map(type => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={entryDetails.description}
                    onChange={e => setEntryDetails({ ...entryDetails, description: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Détails supplémentaires (optionnel)"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={entryDetails.isFullDay}
                      onChange={e => setEntryDetails({ ...entryDetails, isFullDay: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Journée complète</span>
                  </label>
                </div>
                
                {!entryDetails.isFullDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Heure de début
                      </label>
                      <input
                        type="time"
                        value={entryDetails.startTime}
                        onChange={e => setEntryDetails({ ...entryDetails, startTime: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Heure de fin
                      </label>
                      <input
                        type="time"
                        value={entryDetails.endTime}
                        onChange={e => setEntryDetails({ ...entryDetails, endTime: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={deleteEntry}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {isRangeSelection && selectedRange.start && selectedRange.end
                    ? 'Supprimer la plage'
                    : 'Supprimer'
                  }
                </button>
                <div>
                  <button
                    onClick={() => setShowEntryModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded mr-2"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={saveEntryDetails}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="fixed top-4 right-4 z-50">
          {toastMessages.map(toast => (
            <div
              key={toast.id}
              className={`mb-2 p-3 rounded shadow-lg ${
                toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              } text-white`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultantCalendar;