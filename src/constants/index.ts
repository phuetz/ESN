/**
 * Application constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Application Info
export const APP_INFO = {
  NAME: 'ESN Manager Pro',
  VERSION: '1.0.0',
  DESCRIPTION: 'Enterprise Service Network Management',
  AUTHOR: 'ESN Team',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  LIMIT_OPTIONS: [10, 20, 50, 100],
  MAX_LIMIT: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  TIME: 'HH:mm',
} as const;

// Status Options
export const CONSULTANT_STATUSES = {
  ACTIVE: 'active',
  BENCH: 'bench',
  INACTIVE: 'inactive',
} as const;

export const CLIENT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PROSPECT: 'prospect',
} as const;

export const PROJECT_STATUSES = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const CLIENT_TYPES = {
  ENTERPRISE: 'enterprise',
  PUBLIC_SECTOR: 'public_sector',
  STARTUP: 'startup',
  SME: 'sme',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CONSULTANT: 'consultant',
  CLIENT: 'client',
} as const;

// Status Labels (for UI display)
export const STATUS_LABELS = {
  [CONSULTANT_STATUSES.ACTIVE]: 'Actif',
  [CONSULTANT_STATUSES.BENCH]: 'Intercontrat',
  [CONSULTANT_STATUSES.INACTIVE]: 'Inactif',
  [CLIENT_STATUSES.ACTIVE]: 'Actif',
  [CLIENT_STATUSES.INACTIVE]: 'Inactif',
  [CLIENT_STATUSES.PROSPECT]: 'Prospect',
  [PROJECT_STATUSES.PLANNED]: 'Planifié',
  [PROJECT_STATUSES.IN_PROGRESS]: 'En cours',
  [PROJECT_STATUSES.ON_HOLD]: 'En pause',
  [PROJECT_STATUSES.COMPLETED]: 'Terminé',
  [PROJECT_STATUSES.CANCELLED]: 'Annulé',
} as const;

// Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  [CONSULTANT_STATUSES.ACTIVE]: 'bg-green-100 text-green-800',
  [CONSULTANT_STATUSES.BENCH]: 'bg-yellow-100 text-yellow-800',
  [CONSULTANT_STATUSES.INACTIVE]: 'bg-gray-100 text-gray-800',
  [CLIENT_STATUSES.ACTIVE]: 'bg-green-100 text-green-800',
  [CLIENT_STATUSES.INACTIVE]: 'bg-gray-100 text-gray-800',
  [CLIENT_STATUSES.PROSPECT]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUSES.PLANNED]: 'bg-purple-100 text-purple-800',
  [PROJECT_STATUSES.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [PROJECT_STATUSES.ON_HOLD]: 'bg-orange-100 text-orange-800',
  [PROJECT_STATUSES.COMPLETED]: 'bg-green-100 text-green-800',
  [PROJECT_STATUSES.CANCELLED]: 'bg-red-100 text-red-800',
} as const;

// Role Labels
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrateur',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.CONSULTANT]: 'Consultant',
  [USER_ROLES.CLIENT]: 'Client',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 100,
  PHONE_PATTERN: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  SIRET_LENGTH: 14,
  POSTAL_CODE_LENGTH: 5,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    SPREADSHEET: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  },
} as const;

// Timeouts and Delays
export const TIMEOUTS = {
  DEBOUNCE_SEARCH: 300,
  DEBOUNCE_INPUT: 500,
  TOAST_DURATION: 5000,
  NOTIFICATION_DURATION: 3000,
  AUTO_SAVE: 2000,
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CONSULTANTS: '/consultants',
  CONSULTANT_DETAIL: '/consultants/:id',
  CLIENTS: '/clients',
  CLIENT_DETAIL: '/clients/:id',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true,
} as const;

// Breakpoints (match Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Non autorisé. Veuillez vous reconnecter.',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides',
  TIMEOUT: 'Délai de connexion dépassé',
  UNKNOWN: 'Une erreur inattendue est survenue',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATE: 'Créé avec succès',
  UPDATE: 'Mis à jour avec succès',
  DELETE: 'Supprimé avec succès',
  SAVE: 'Enregistré avec succès',
  COPY: 'Copié dans le presse-papiers',
  EXPORT: 'Export réussi',
  IMPORT: 'Import réussi',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Export all as a single object for convenience
export const CONSTANTS = {
  API_CONFIG,
  APP_INFO,
  PAGINATION,
  DATE_FORMATS,
  CONSULTANT_STATUSES,
  CLIENT_STATUSES,
  PROJECT_STATUSES,
  CLIENT_TYPES,
  USER_ROLES,
  STATUS_LABELS,
  STATUS_COLORS,
  ROLE_LABELS,
  VALIDATION_RULES,
  FILE_UPLOAD,
  TIMEOUTS,
  STORAGE_KEYS,
  ROUTES,
  FEATURES,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_STATUS,
} as const;

export default CONSTANTS;
