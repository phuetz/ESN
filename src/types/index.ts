// Shared TypeScript types for frontend

export interface Consultant {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
  status: ConsultantStatus;
  experience: number;
  skills?: string[];
  bio?: string;
  linkedin?: string;
  github?: string;
  dailyRate?: number;
  availability?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export enum ConsultantStatus {
  ACTIVE = 'active',
  BENCH = 'bench',
  INACTIVE = 'inactive',
}

export interface Client {
  id: number;
  name: string;
  type?: ClientType;
  sector?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  status: ClientStatus;
  projects?: Project[];
  createdAt: string;
  updatedAt: string;
}

export enum ClientType {
  ENTERPRISE = 'enterprise',
  PUBLIC_SECTOR = 'public_sector',
  STARTUP = 'startup',
  SME = 'sme',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  budget?: number;
  dailyRate?: number;
  technologies?: string[];
  location?: string;
  isRemote: boolean;
  notes?: string;
  client: Client;
  clientId: number;
  consultant?: Consultant;
  consultantId?: number;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CONSULTANT = 'consultant',
  CLIENT = 'client',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  [key: string]: any;
}

export interface ApiError {
  message: string;
  details?: any;
  statusCode?: number;
}
