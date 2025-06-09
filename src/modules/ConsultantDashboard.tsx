import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Users, UserX, UserCheck, User, Briefcase, Star, Award, Calendar,
  Clock, Euro, ArrowUpRight, ArrowDownRight, Check, AlertTriangle,
  Zap, Book, GraduationCap, Target, FileText, Filter, Download,
  X, Search, ChevronDown, Plus, Laptop, Menu
} from 'lucide-react';

// Tableau de bord des consultants
const ConsultantsDashboard = () => {
  // Données simulées pour les consultants
  const [consultants, setConsultants] = useState([
    {
      id: 1,
      firstName: "Jean",
      lastName: "Dupont",
      role: "Développeur Full Stack",
      status: "assigned", // assigned, bench, training, leave
      experience: 5,
      skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
      level: "senior",
      dailyRate: 650,
      utilization: 85,
      currentClient: "TechSolutions SA",
      projectName: "Refonte SI",
      projectEndDate: "2024-09-30",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 4.5, feedback: "Excellent travail sur le projet client" },
        { period: "2024-Q1", score: 4.2, feedback: "Continue à progresser sur les compétences cloud" }
      ],
      certifications: ["AWS Certified Developer", "MongoDB Professional"],
      joinDate: "2019-06-15",
      photo: null
    },
    {
      id: 2,
      firstName: "Sophie",
      lastName: "Martin",
      role: "DevOps Engineer",
      status: "assigned",
      experience: 7,
      skills: ["Docker", "Kubernetes", "Terraform", "AWS", "CI/CD", "Jenkins"],
      level: "senior",
      dailyRate: 700,
      utilization: 92,
      currentClient: "AssurTech International",
      projectName: "Migration Cloud",
      projectEndDate: "2024-11-15",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 4.8, feedback: "Performance exceptionnelle" },
        { period: "2024-Q1", score: 4.7, feedback: "Continue sur cette lancée" }
      ],
      certifications: ["AWS Certified DevOps Engineer", "CKA (Certified Kubernetes Administrator)"],
      joinDate: "2018-03-10",
      photo: null
    },
    {
      id: 3,
      firstName: "Thomas",
      lastName: "Petit",
      role: "Data Engineer",
      status: "bench",
      experience: 3,
      skills: ["Python", "Spark", "Hadoop", "SQL", "Airflow", "Databricks"],
      level: "intermediate",
      dailyRate: 580,
      utilization: 78,
      currentClient: null,
      projectName: null,
      projectEndDate: null,
      benchStartDate: "2024-03-05",
      evaluations: [
        { period: "2023-Q4", score: 3.9, feedback: "Bonne progression technique" },
        { period: "2024-Q1", score: 4.1, feedback: "À continuer à développer les soft skills" }
      ],
      certifications: ["Azure Data Engineer"],
      joinDate: "2021-05-20",
      photo: null
    },
    {
      id: 4,
      firstName: "Marie",
      lastName: "Dubois",
      role: "UX/UI Designer",
      status: "assigned",
      experience: 4,
      skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
      level: "intermediate",
      dailyRate: 550,
      utilization: 88,
      currentClient: "BanqueDigitale",
      projectName: "Application Mobile",
      projectEndDate: "2024-08-15",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 4.2, feedback: "Excellente créativité" },
        { period: "2024-Q1", score: 4.3, feedback: "Très bonne collaboration avec les développeurs" }
      ],
      certifications: ["UX Design Professional"],
      joinDate: "2020-09-12",
      photo: null
    },
    {
      id: 5,
      firstName: "Pierre",
      lastName: "Leroy",
      role: "Architecte Cloud",
      status: "assigned",
      experience: 9,
      skills: ["AWS", "Azure", "GCP", "Microservices", "Serverless", "Terraform"],
      level: "expert",
      dailyRate: 850,
      utilization: 95,
      currentClient: "HôpitalPlus",
      projectName: "Système de Gestion Patients",
      projectEndDate: "2024-12-20",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 4.9, feedback: "Leadership technique exceptionnel" },
        { period: "2024-Q1", score: 4.8, feedback: "Continue à servir de mentor pour l'équipe" }
      ],
      certifications: ["AWS Solutions Architect Professional", "Azure Solutions Architect Expert"],
      joinDate: "2016-04-05",
      photo: null
    },
    {
      id: 6,
      firstName: "Julie",
      lastName: "Bernard",
      role: "Product Owner",
      status: "bench",
      experience: 6,
      skills: ["Scrum", "Agile", "User Stories", "Backlog Management", "Jira", "Confluence"],
      level: "senior",
      dailyRate: 620,
      utilization: 82,
      currentClient: null,
      projectName: null,
      projectEndDate: null,
      benchStartDate: "2024-03-20",
      evaluations: [
        { period: "2023-Q4", score: 4.3, feedback: "Très bonne gestion du produit" },
        { period: "2024-Q1", score: 4.2, feedback: "À continuer à renforcer les relations clients" }
      ],
      certifications: ["Professional Scrum Product Owner", "SAFe Product Owner"],
      joinDate: "2019-02-18",
      photo: null
    },
    {
      id: 7,
      firstName: "Alexandre",
      lastName: "Moreau",
      role: "Développeur Java",
      status: "assigned",
      experience: 2,
      skills: ["Java", "Spring Boot", "Hibernate", "SQL", "JUnit", "Maven"],
      level: "junior",
      dailyRate: 450,
      utilization: 90,
      currentClient: "Mairie de Lyon",
      projectName: "Plateforme Services Citoyens",
      projectEndDate: "2024-07-10",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 3.7, feedback: "Bonne progression technique" },
        { period: "2024-Q1", score: 3.9, feedback: "Continue à développer l'autonomie" }
      ],
      certifications: ["Oracle Certified Professional: Java SE"],
      joinDate: "2022-09-01",
      photo: null
    },
    {
      id: 8,
      firstName: "Camille",
      lastName: "Robert",
      role: "Data Scientist",
      status: "training",
      experience: 3,
      skills: ["Python", "R", "Machine Learning", "TensorFlow", "Pandas", "SQL"],
      level: "intermediate",
      dailyRate: 570,
      utilization: 75,
      currentClient: null,
      projectName: null,
      projectEndDate: null,
      benchStartDate: "2024-04-01",
      evaluations: [
        { period: "2023-Q4", score: 4.0, feedback: "Bon potentiel en data science" },
        { period: "2024-Q1", score: 4.1, feedback: "Montée en compétence à poursuivre" }
      ],
      certifications: ["TensorFlow Developer Certificate"],
      joinDate: "2021-07-15",
      photo: null
    },
    {
      id: 9,
      firstName: "Lucas",
      lastName: "Simon",
      role: "Ingénieur QA",
      status: "assigned",
      experience: 4,
      skills: ["Selenium", "Cypress", "Jest", "Automated Testing", "CI/CD", "JIRA"],
      level: "intermediate",
      dailyRate: 520,
      utilization: 87,
      currentClient: "TechSolutions SA",
      projectName: "Application Mobile",
      projectEndDate: "2024-06-15",
      benchStartDate: null,
      evaluations: [
        { period: "2023-Q4", score: 4.1, feedback: "Très bonne rigueur dans les tests" },
        { period: "2024-Q1", score: 4.3, feedback: "Excellente contribution à la qualité des livrables" }
      ],
      certifications: ["ISTQB Certified Tester"],
      joinDate: "2020-10-05",
      photo: null
    },
    {
      id: 10,
      firstName: "Aurélie",
      lastName: "Lemaire",
      role: "Scrum Master",
      status: "bench",
      experience: 5,
      skills: ["Agile", "Scrum", "Kanban", "Facilitation", "Coaching", "Confluence"],
      level: "senior",
      dailyRate: 600,
      utilization: 80,
      currentClient: null,
      projectName: null,
      projectEndDate: null,
      benchStartDate: "2024-03-10",
      evaluations: [
        { period: "2023-Q4", score: 4.4, feedback: "Excellente animation des cérémonies agiles" },
        { period: "2024-Q1", score: 4.2, feedback: "Continue à renforcer le coaching d'équipe" }
      ],
      certifications: ["Professional Scrum Master", "SAFe Scrum Master"],
      joinDate: "2019-08-12",
      photo: null
    }
  ]);

  // Données simulées pour les projets
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Refonte SI",
      client: "TechSolutions SA",
      startDate: "2023-01-15",
      endDate: "2024-09-30",
      status: "active",
      consultantsNeeded: 5,
      consultantsAssigned: 4,
      skills: ["React", "Node.js", "TypeScript", "Java"]
    },
    {
      id: 2,
      name: "Migration Cloud",
      client: "AssurTech International",
      startDate: "2023-08-10",
      endDate: "2024-11-15",
      status: "active",
      consultantsNeeded: 4,
      consultantsAssigned: 3,
      skills: ["AWS", "Terraform", "Docker", "Kubernetes"]
    },
    {
      id: 3,
      name: "Plateforme Services Citoyens",
      client: "Mairie de Lyon",
      startDate: "2023-09-20",
      endDate: "2024-07-10",
      status: "active",
      consultantsNeeded: 6,
      consultantsAssigned: 5,
      skills: ["Java", "Spring Boot", "Angular", "SQL"]
    },
    {
      id: 4,
      name: "Application Mobile",
      client: "BanqueDigitale",
      startDate: "2023-10-05",
      endDate: "2024-08-15",
      status: "active",
      consultantsNeeded: 4,
      consultantsAssigned: 3,
      skills: ["React Native", "Node.js", "UX/UI"]
    },
    {
      id: 5,
      name: "Système de Gestion Patients",
      client: "HôpitalPlus",
      startDate: "2023-07-15",
      endDate: "2024-12-20",
      status: "active",
      consultantsNeeded: 7,
      consultantsAssigned: 6,
      skills: ["Java", "Spring Boot", "React", "AWS", "Architecture"]
    },
    {
      id: 6,
      name: "BI & Data Analytics",
      client: "DataFlow",
      startDate: "2024-06-01",
      endDate: "2025-03-31",
      status: "planned",
      consultantsNeeded: 4,
      consultantsAssigned: 0,
      skills: ["Python", "Data Engineering", "Spark", "Tableau"]
    }
  ]);

  // État des filtres et des vues
  const [activeView, setActiveView] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [consultantDetailId, setConsultantDetailId] = useState(null);
  const [skillFilter, setSkillFilter] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Function to calculate various KPIs
  const calculateKPIs = () => {
    const totalConsultants = consultants.length;
    
    const assigned = consultants.filter(c => c.status === "assigned").length;
    const onBench = consultants.filter(c => c.status === "bench").length;
    const inTraining = consultants.filter(c => c.status === "training").length;
    const onLeave = consultants.filter(c => c.status === "leave").length;
    
    const staffingRate = totalConsultants > 0 ? (assigned / totalConsultants) * 100 : 0;
    const benchRate = totalConsultants > 0 ? (onBench / totalConsultants) * 100 : 0;
    
    const avgDailyRate = consultants.reduce((sum, c) => sum + c.dailyRate, 0) / totalConsultants;
    const avgUtilizationRate = consultants.reduce((sum, c) => sum + c.utilization, 0) / totalConsultants;
    
    const juniors = consultants.filter(c => c.level === "junior").length;
    const intermediates = consultants.filter(c => c.level === "intermediate").length;
    const seniors = consultants.filter(c => c.level === "senior").length;
    const experts = consultants.filter(c => c.level === "expert").length;
    
    return {
      totalConsultants,
      assigned,
      onBench,
      inTraining,
      onLeave,
      staffingRate,
      benchRate,
      avgDailyRate,
      avgUtilizationRate,
      juniors,
      intermediates,
      seniors,
      experts
    };
  };

  // Calculate skills distribution
  const calculateSkillsData = () => {
    const skillsCount = {};
    
    consultants.forEach(consultant => {
      consultant.skills.forEach(skill => {
        if (skillsCount[skill]) {
          skillsCount[skill]++;
        } else {
          skillsCount[skill] = 1;
        }
      });
    });
    
    return Object.entries(skillsCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 skills
  };

  // Calculate experience distribution
  const calculateExperienceData = () => {
    const experienceGroups = {
      "0-2 ans": 0,
      "3-5 ans": 0,
      "6-9 ans": 0,
      "10+ ans": 0
    };
    
    consultants.forEach(consultant => {
      if (consultant.experience < 3) {
        experienceGroups["0-2 ans"]++;
      } else if (consultant.experience < 6) {
        experienceGroups["3-5 ans"]++;
      } else if (consultant.experience < 10) {
        experienceGroups["6-9 ans"]++;
      } else {
        experienceGroups["10+ ans"]++;
      }
    });
    
    return Object.entries(experienceGroups).map(([name, value]) => ({ name, value }));
  };

  // Calculate client distribution
  const calculateClientData = () => {
    const clientCount = {};
    const assignedConsultants = consultants.filter(c => c.status === "assigned");
    
    assignedConsultants.forEach(consultant => {
      if (consultant.currentClient) {
        if (clientCount[consultant.currentClient]) {
          clientCount[consultant.currentClient]++;
        } else {
          clientCount[consultant.currentClient] = 1;
        }
      }
    });
    
    return Object.entries(clientCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate staffing trends (simulated data)
  const calculateStaffingTrends = () => {
    // Generate simulated historical data
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep'];
    
    return months.map((month, index) => {
      // Simulate slightly varying staffing rates
      const baseStaffingRate = 75 + Math.sin(index) * 8;
      const benchRate = 100 - baseStaffingRate;
      
      return {
        name: month,
        "Taux de Staffing": Math.round(baseStaffingRate),
        "Taux d'Intercontrat": Math.round(benchRate)
      };
    });
  };

  // Calculate needed skills vs available
  const calculateSkillsGap = () => {
    // Extract all skills needed for projects
    const neededSkills = {};
    projects.forEach(project => {
      project.skills.forEach(skill => {
        if (neededSkills[skill]) {
          neededSkills[skill]++;
        } else {
          neededSkills[skill] = 1;
        }
      });
    });
    
    // Count available skills among consultants on bench
    const availableSkills = {};
    consultants
      .filter(c => c.status === "bench")
      .forEach(consultant => {
        consultant.skills.forEach(skill => {
          if (availableSkills[skill]) {
            availableSkills[skill]++;
          } else {
            availableSkills[skill] = 1;
          }
        });
      });
    
    // Combine data
    return Object.keys({...neededSkills, ...availableSkills})
      .map(skill => ({
        name: skill,
        needed: neededSkills[skill] || 0,
        available: availableSkills[skill] || 0,
        gap: (availableSkills[skill] || 0) - (neededSkills[skill] || 0)
      }))
      .sort((a, b) => a.gap - b.gap) // Sort by gap (negative first)
      .slice(0, 8); // Top 8 skills with gaps
  };

  // Apply filters to consultants list
  const getFilteredConsultants = () => {
    return consultants.filter(consultant => {
      // Filter by status
      if (filterStatus !== "all" && consultant.status !== filterStatus) {
        return false;
      }
      
      // Filter by level
      if (selectedLevel !== "all" && consultant.level !== selectedLevel) {
        return false;
      }
      
      // Filter by skill
      if (skillFilter && !consultant.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      )) {
        return false;
      }
      
      // Filter by search term (name, role)
      if (searchTerm) {
        const fullName = `${consultant.firstName} ${consultant.lastName}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return fullName.includes(searchLower) || 
               consultant.role.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  };

  // Get consultant by ID
  const getConsultantById = (id) => {
    return consultants.find(c => c.id === id) || null;
  };

  // Calculate metrics
  const kpis = calculateKPIs();
  const skillsData = calculateSkillsData();
  const experienceData = calculateExperienceData();
  const clientData = calculateClientData();
  const staffingTrendData = calculateStaffingTrends();
  const skillsGapData = calculateSkillsGap();
  const filteredConsultants = getFilteredConsultants();
  const selectedConsultant = consultantDetailId ? getConsultantById(consultantDetailId) : null;

  // Format a date with a better UI
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate days on bench
  const calculateDaysOnBench = (benchStartDate) => {
    if (!benchStartDate) return 0;
    
    const start = new Date(benchStartDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Custom color palette
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
  
  // Get status badge color class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'bench': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'assigned': return 'En mission';
      case 'bench': return 'Intercontrat';
      case 'training': return 'Formation';
      case 'leave': return 'Congé';
      default: return status;
    }
  };
  
  // Get level label
  const getLevelLabel = (level) => {
    switch(level) {
      case 'junior': return 'Junior';
      case 'intermediate': return 'Confirmé';
      case 'senior': return 'Senior';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Top navigation for different views */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'overview'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('overview')}
          >
            Vue d'ensemble
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'list'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('list')}
          >
            Liste des consultants
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'skills'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('skills')}
          >
            Compétences
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              activeView === 'projections'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('projections')}
          >
            Besoins & Projections
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Filter size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Download size={18} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            <Plus size={16} />
            <span>Ajouter un consultant</span>
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow overflow-auto p-4">
        {/* Overview dashboard */}
        {activeView === 'overview' && (
          <div className="space-y-4">
            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consultants</p>
                    <h3 className="text-2xl font-bold">{kpis.totalConsultants}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <UserCheck size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">En mission</p>
                    <h3 className="text-2xl font-bold">{kpis.assigned}</h3>
                    <p className="text-xs text-green-600">
                      {Math.round(kpis.staffingRate)}% de staffing
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <UserX size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Intercontrat</p>
                    <h3 className="text-2xl font-bold">{kpis.onBench}</h3>
                    <p className="text-xs text-red-600">
                      {Math.round(kpis.benchRate)}% de l'effectif
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Euro size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">TJM moyen</p>
                    <h3 className="text-2xl font-bold">{Math.round(kpis.avgDailyRate)} €</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taux d'occupation</p>
                    <h3 className="text-2xl font-bold">{Math.round(kpis.avgUtilizationRate)}%</h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overview charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Staffing trends */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Évolution du taux de staffing</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={staffingTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Taux de Staffing"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Taux d'Intercontrat"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Skills distribution */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Compétences principales</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6">
                        {skillsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Secondary charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Experience distribution */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Répartition par expérience</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={experienceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {experienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Level distribution */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Répartition par niveau</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Junior', value: kpis.juniors },
                        { name: 'Confirmé', value: kpis.intermediates },
                        { name: 'Senior', value: kpis.seniors },
                        { name: 'Expert', value: kpis.experts }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        <Cell fill="#94A3B8" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#10B981" />
                        <Cell fill="#8B5CF6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Client distribution */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Répartition par client</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clientData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          name.length > 10 
                            ? `${name.substring(0, 10)}... (${(percent * 100).toFixed(0)}%)`
                            : `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {clientData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Consultants list view */}
        {activeView === 'list' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 border flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 flex-grow">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un consultant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  className="px-3 py-2 border rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="assigned">En mission</option>
                  <option value="bench">Intercontrat</option>
                  <option value="training">Formation</option>
                  <option value="leave">Congé</option>
                </select>
                
                <select
                  className="px-3 py-2 border rounded-md"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="junior">Junior</option>
                  <option value="intermediate">Confirmé</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Compétence..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  />
                  {skillFilter && (
                    <button
                      className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setSkillFilter('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {filteredConsultants.length} consultant{filteredConsultants.length !== 1 ? 's' : ''} trouvé{filteredConsultants.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            {/* Consultants list or detail view */}
            <div className="bg-white rounded-lg shadow-sm border">
              {consultantDetailId ? (
                // Consultant detail view
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={() => setConsultantDetailId(null)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ChevronDown className="rotate-90 mr-1 h-4 w-4" />
                      Retour à la liste
                    </button>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50">
                        Modifier
                      </button>
                      <button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50">
                        <Menu size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {selectedConsultant && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left column - Personal info */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                            {selectedConsultant.firstName[0]}{selectedConsultant.lastName[0]}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">
                              {selectedConsultant.firstName} {selectedConsultant.lastName}
                            </h2>
                            <p className="text-gray-600">{selectedConsultant.role}</p>
                            <div className="mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedConsultant.status)}`}>
                                {getStatusLabel(selectedConsultant.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Informations générales</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Niveau</span>
                              <span className="font-medium">{getLevelLabel(selectedConsultant.level)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Expérience</span>
                              <span className="font-medium">{selectedConsultant.experience} ans</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">TJM</span>
                              <span className="font-medium">{selectedConsultant.dailyRate} €</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Taux d'occupation</span>
                              <span className="font-medium">{selectedConsultant.utilization}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Date d'arrivée</span>
                              <span className="font-medium">{formatDate(selectedConsultant.joinDate)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Certifications</h3>
                          <div className="space-y-2">
                            {selectedConsultant.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Award size={16} className="text-yellow-500" />
                                <span>{cert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Middle column - Skills and Project */}
                      <div className="space-y-6">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Compétences</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedConsultant.skills.map((skill, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Mission actuelle</h3>
                          {selectedConsultant.status === 'assigned' ? (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Client</span>
                                <span className="font-medium">{selectedConsultant.currentClient}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Projet</span>
                                <span className="font-medium">{selectedConsultant.projectName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Fin prévue</span>
                                <span className="font-medium">{formatDate(selectedConsultant.projectEndDate)}</span>
                              </div>
                            </div>
                          ) : selectedConsultant.status === 'bench' ? (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">En intercontrat depuis</span>
                                <span className="font-medium">
                                  {calculateDaysOnBench(selectedConsultant.benchStartDate)} jours
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Date de début</span>
                                <span className="font-medium">{formatDate(selectedConsultant.benchStartDate)}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">Pas de mission en cours</p>
                          )}
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Évaluations récentes</h3>
                          <div className="space-y-4">
                            {selectedConsultant && selectedConsultant.evaluations && Array.isArray(selectedConsultant.evaluations) ? 
                              selectedConsultant.evaluations.map((evaluation, index) => (
                                <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{evaluation.period}</span>
                                    <div className="flex items-center">
                                      <span className="text-gray-700 mr-1">{evaluation.score.toFixed(1)}</span>
                                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600">{evaluation.feedback}</p>
                                </div>
                              )) : <p className="text-gray-500 italic">Aucune évaluation disponible</p>
                            }
                          </div>
                        </div>
                      </div>
                      
                      {/* Right column - Performance dashboard */}
                      <div className="space-y-6">
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Niveau de compétences</h3>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'Technique', value: 4.2 },
                                { subject: 'Soft Skills', value: 3.8 },
                                { subject: 'Autonomie', value: 4.5 },
                                { subject: 'Communication', value: 3.9 },
                                { subject: 'Leadership', value: 3.5 }
                              ]}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                                <Radar name="Compétences" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Évolution du TJM</h3>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={[
                                  { name: '2021', tjm: 450 },
                                  { name: '2022', tjm: 500 },
                                  { name: '2023', tjm: 550 },
                                  { name: '2024', tjm: selectedConsultant.dailyRate }
                                ]}
                                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[400, 'dataMax + 50']} />
                                <Tooltip formatter={(value) => [`${value} €`, 'TJM']} />
                                <Line type="monotone" dataKey="tjm" stroke="#3B82F6" strokeWidth={2} dot={{ r: 5 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Actions</h3>
                          <div className="space-y-2">
                            <button className="w-full py-2 px-3 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                              <Briefcase size={16} />
                              <span>Affecter à un projet</span>
                            </button>
                            <button className="w-full py-2 px-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                              <FileText size={16} />
                              <span>Générer un CV</span>
                            </button>
                            <button className="w-full py-2 px-3 flex items-center justify-center gap-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                              <GraduationCap size={16} />
                              <span>Planifier une formation</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Consultants list
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consultant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle & Niveau
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compétences
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mission / Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TJM
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredConsultants.map((consultant) => (
                        <tr 
                          key={consultant.id} 
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setConsultantDetailId(consultant.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                                {consultant.firstName[0]}{consultant.lastName[0]}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {consultant.firstName} {consultant.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {consultant.experience} ans d'expérience
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{consultant.role}</div>
                            <div className="text-sm text-gray-500">{getLevelLabel(consultant.level)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(consultant.status)}`}>
                              {getStatusLabel(consultant.status)}
                            </span>
                            {consultant.status === 'bench' && (
                              <div className="text-xs text-gray-500 mt-1">
                                {calculateDaysOnBench(consultant.benchStartDate)} jours
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {consultant.skills.slice(0, 3).map((skill, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {consultant.skills.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{consultant.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {consultant.status === 'assigned' ? (
                              <div>
                                <div className="text-sm text-gray-900">{consultant.projectName}</div>
                                <div className="text-sm text-gray-500">{consultant.currentClient}</div>
                                <div className="text-xs text-gray-500">
                                  Fin: {formatDate(consultant.projectEndDate)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 italic">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {consultant.dailyRate} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Skills dashboard view */}
        {activeView === 'skills' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Skills distribution */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Répartition des compétences</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillsData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6">
                        {skillsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Skills gap analysis */}
              <div className="bg-white rounded-lg shadow-sm p-4 border">
                <h3 className="text-lg font-medium mb-4">Écart compétences requises vs disponibles</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillsGapData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="needed" name="Besoin projets" fill="#EF4444" />
                      <Bar dataKey="available" name="Disponible (bench)" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Skill categories breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-medium mb-4">Répartition par catégories de compétences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Laptop size={16} className="text-blue-600" />
                    </div>
                    <span>Front-End</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">React</span>
                      <span className="text-sm font-medium">6 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Angular</span>
                      <span className="text-sm font-medium">4 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Vue.js</span>
                      <span className="text-sm font-medium">2 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">TypeScript</span>
                      <span className="text-sm font-medium">5 consultants</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <Laptop size={16} className="text-green-600" />
                    </div>
                    <span>Back-End</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Node.js</span>
                      <span className="text-sm font-medium">5 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Java</span>
                      <span className="text-sm font-medium">3 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Python</span>
                      <span className="text-sm font-medium">3 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spring Boot</span>
                      <span className="text-sm font-medium">2 consultants</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-purple-100">
                      <Laptop size={16} className="text-purple-600" />
                    </div>
                    <span>Cloud & DevOps</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AWS</span>
                      <span className="text-sm font-medium">4 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Docker</span>
                      <span className="text-sm font-medium">3 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kubernetes</span>
                      <span className="text-sm font-medium">2 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Terraform</span>
                      <span className="text-sm font-medium">2 consultants</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-yellow-100">
                      <Laptop size={16} className="text-yellow-600" />
                    </div>
                    <span>Data</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SQL</span>
                      <span className="text-sm font-medium">7 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">MongoDB</span>
                      <span className="text-sm font-medium">3 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Science</span>
                      <span className="text-sm font-medium">2 consultants</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spark</span>
                      <span className="text-sm font-medium">1 consultant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Projections view */}
        {activeView === 'projections' && (
          <div className="space-y-4">
            {/* Resource capacity */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-medium mb-4">Capacité de staffing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-medium mb-2">Consultants disponibles</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Intercontrat</span>
                    <span className="font-medium">{kpis.onBench}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">En formation</span>
                    <span className="font-medium">{kpis.inTraining}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Fin de mission &lt; 30j</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">{kpis.onBench + kpis.inTraining + 3}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h4 className="font-medium mb-2">Besoins projets</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Projets actifs</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Projets planifiés</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Opportunités (&gt;70%)</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-yellow-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium mb-2">Besoin en recrutement</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Disponibles</span>
                    <span className="font-medium">{kpis.onBench + kpis.inTraining + 3}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Besoins projets</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Écart</span>
                    <span className={`font-medium ${
                      kpis.onBench + kpis.inTraining + 3 - 12 >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {kpis.onBench + kpis.inTraining + 3 - 12}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Recrutements</span>
                      <span className="font-bold">{Math.max(0, 12 - (kpis.onBench + kpis.inTraining + 3))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upcoming project needs */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Besoins projets à venir</h3>
                <button className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50">
                  Voir tous les projets
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Période
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Staffing
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Compétences requises
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{project.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {project.consultantsAssigned} / {project.consultantsNeeded}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="h-1.5 rounded-full bg-blue-600"
                              style={{ width: `${(project.consultantsAssigned / project.consultantsNeeded) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {project.skills.map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            project.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status === 'active' ? 'Actif' : 'Planifié'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-medium mb-4">Recommandations de staffing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-blue-100">
                      <Target size={16} className="text-blue-600" />
                    </div>
                    <span>Consultants recommandés pour "BI & Data Analytics"</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                          TD
                        </div>
                        <div>
                          <div className="text-sm font-medium">Thomas Petit</div>
                          <div className="text-xs text-gray-500">Data Engineer</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium">90% match</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                          CR
                        </div>
                        <div>
                          <div className="text-sm font-medium">Camille Robert</div>
                          <div className="text-xs text-gray-500">Data Scientist</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-green-600 font-medium">85% match</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                          AL
                        </div>
                        <div>
                          <div className="text-sm font-medium">Aurélie Lemaire</div>
                          <div className="text-xs text-gray-500">Scrum Master</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-yellow-600 font-medium">60% match</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-green-100">
                      <Zap size={16} className="text-green-600" />
                    </div>
                    <span>Recommandations de montée en compétences</span>
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                            AM
                          </div>
                          <div className="text-sm font-medium">Alexandre Moreau</div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">Junior → Confirmé</div>
                      </div>
                      <div className="text-xs text-gray-600 ml-10">
                        Recommandations: Formation Spring Boot avancé, Certification Java
                      </div>
                    </div>
                    
                    <div className="border-b pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                            TP
                          </div>
                          <div className="text-sm font-medium">Thomas Petit</div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">Confirmé → Senior</div>
                      </div>
                      <div className="text-xs text-gray-600 ml-10">
                        Recommandations: Certification Databricks, Mentoring Junior
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                            SM
                          </div>
                          <div className="text-sm font-medium">Sophie Martin</div>
                        </div>
                        <div className="text-xs text-blue-600 font-medium">Senior → Expert</div>
                      </div>
                      <div className="text-xs text-gray-600 ml-10">
                        Recommandations: Formation architecture, Responsabilité technique
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantsDashboard;