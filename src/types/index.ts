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

// ==================== CRM MODULE ====================

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone?: string;
  mobile?: string;
  role: ContactRole;
  isPrimary: boolean;
  linkedin?: string;
  notes?: string;
  preferences?: Record<string, any>;
  clientId: number;
  client?: Client;
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export enum ContactRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DECISION_MAKER = 'decision_maker',
  TECHNICAL = 'technical',
  BILLING = 'billing',
}

export interface Opportunity {
  id: number;
  title: string;
  description?: string;
  stage: OpportunityStage;
  priority: OpportunityPriority;
  estimatedValue?: number;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  source?: string;
  lostReason?: string;
  requirements?: string[];
  competitors?: string[];
  notes?: string;
  clientId?: number;
  client?: Client;
  ownerId: number;
  owner?: User;
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export enum OpportunityStage {
  LEAD = 'lead',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

export enum OpportunityPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Activity {
  id: number;
  subject: string;
  description?: string;
  type: ActivityType;
  status: ActivityStatus;
  scheduledAt?: string;
  completedAt?: string;
  duration?: number;
  location?: string;
  outcome?: string;
  attendees?: string[];
  isAllDay: boolean;
  ownerId: number;
  owner?: User;
  clientId?: number;
  client?: Client;
  contactId?: number;
  contact?: Contact;
  opportunityId?: number;
  opportunity?: Opportunity;
  createdAt: string;
  updatedAt: string;
}

export enum ActivityType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  TASK = 'task',
  NOTE = 'note',
}

export enum ActivityStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ==================== INVOICING MODULE ====================

export interface Quote {
  id: number;
  quoteNumber: string;
  title: string;
  description?: string;
  status: QuoteStatus;
  issueDate: string;
  validUntil: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  terms?: string;
  notes?: string;
  signatureUrl?: string;
  signedAt?: string;
  pdfUrl?: string;
  clientId: number;
  client?: Client;
  createdById: number;
  createdBy?: User;
  opportunityId?: number;
  opportunity?: Opportunity;
  items?: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export enum QuoteStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface QuoteItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
  order: number;
  quoteId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  paymentTerms?: string;
  notes?: string;
  pdfUrl?: string;
  paymentMethod?: string;
  paymentReference?: string;
  clientId: number;
  client?: Client;
  projectId?: number;
  project?: Project;
  createdById: number;
  createdBy?: User;
  items?: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum InvoiceType {
  STANDARD = 'standard',
  RECURRING = 'recurring',
  CREDIT_NOTE = 'credit_note',
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
  taxRate: number;
  order: number;
  invoiceId: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== RECRUITMENT MODULE ====================

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience: number;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resumeUrl?: string;
  status: CandidateStatus;
  source: CandidateSource;
  expectedSalary?: number;
  location?: string;
  willingToRelocate: boolean;
  availableFrom?: string;
  notes?: string;
  rating: number;
  rejectionReason?: string;
  recruiterId?: number;
  recruiter?: User;
  interviews?: Interview[];
  createdAt: string;
  updatedAt: string;
}

export enum CandidateStatus {
  NEW = 'new',
  SCREENING = 'screening',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum CandidateSource {
  LINKEDIN = 'linkedin',
  WEBSITE = 'website',
  REFERRAL = 'referral',
  JOBBOARD = 'jobboard',
  AGENCY = 'agency',
  OTHER = 'other',
}

export interface Interview {
  id: number;
  title: string;
  type: InterviewType;
  status: InterviewStatus;
  outcome: InterviewOutcome;
  scheduledAt: string;
  duration: number;
  location?: string;
  description?: string;
  feedback?: string;
  technicalScore?: number;
  cultureFitScore?: number;
  communicationScore?: number;
  overallScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  interviewers?: number[];
  candidateId: number;
  candidate?: Candidate;
  createdById: number;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  HR = 'hr',
  FINAL = 'final',
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum InterviewOutcome {
  PENDING = 'pending',
  PASS = 'pass',
  FAIL = 'fail',
  STRONG_YES = 'strong_yes',
  YES = 'yes',
  NO = 'no',
  STRONG_NO = 'strong_no',
}

// ==================== HR MODULE ====================

export interface Leave {
  id: number;
  type: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  days: number;
  isHalfDay: boolean;
  reason?: string;
  rejectionReason?: string;
  approvedAt?: string;
  supportingDocumentUrl?: string;
  notes?: string;
  consultantId: number;
  consultant?: Consultant;
  approvedById?: number;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  RTT = 'rtt',
  UNPAID = 'unpaid',
  PARENTAL = 'parental',
  COMPASSIONATE = 'compassionate',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface Expense {
  id: number;
  title: string;
  description?: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  amount: number;
  currency: string;
  expenseDate: string;
  receiptUrl?: string;
  mileage?: number;
  vendor?: string;
  paymentMethod?: string;
  isReimbursable: boolean;
  isBillable: boolean;
  rejectionReason?: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  consultantId: number;
  consultant?: Consultant;
  projectId?: number;
  project?: Project;
  approvedById?: number;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export enum ExpenseCategory {
  TRAVEL = 'travel',
  MEALS = 'meals',
  ACCOMMODATION = 'accommodation',
  TRANSPORTATION = 'transportation',
  SUPPLIES = 'supplies',
  TRAINING = 'training',
  OTHER = 'other',
}

export enum ExpenseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

// ==================== RESOURCE PLANNING MODULE ====================

export interface Mission {
  id: number;
  title: string;
  description?: string;
  status: MissionStatus;
  startDate: string;
  endDate?: string;
  dailyRate: number;
  clientRate?: number;
  allocatedPercentage: number;
  location?: string;
  isRemote: boolean;
  requiredSkills?: string[];
  objectives?: string;
  deliverables?: string;
  alertDaysBefore: number;
  renewalRequested: boolean;
  notes?: string;
  consultantId: number;
  consultant?: Consultant;
  projectId: number;
  project?: Project;
  clientId: number;
  client?: Client;
  timesheets?: Timesheet[];
  createdAt: string;
  updatedAt: string;
}

export enum MissionStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  ENDING_SOON = 'ending_soon',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Timesheet {
  id: number;
  date: string;
  hours: number;
  description?: string;
  status: TimesheetStatus;
  isBillable: boolean;
  isOvertime: boolean;
  rejectionReason?: string;
  submittedAt?: string;
  approvedAt?: string;
  invoicedAt?: string;
  invoiceId?: number;
  consultantId: number;
  consultant?: Consultant;
  missionId: number;
  mission?: Mission;
  approvedById?: number;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export enum TimesheetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INVOICED = 'invoiced',
}

// ==================== SKILLS MANAGEMENT MODULE ====================

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  description?: string;
  isActive: boolean;
  aliases?: string[];
  consultantSkills?: ConsultantSkill[];
  createdAt: string;
  updatedAt: string;
}

export enum SkillCategory {
  TECHNICAL = 'technical',
  FRAMEWORK = 'framework',
  LANGUAGE = 'language',
  TOOL = 'tool',
  SOFT_SKILL = 'soft_skill',
  METHODOLOGY = 'methodology',
  DOMAIN = 'domain',
}

export interface ConsultantSkill {
  id: number;
  level: ProficiencyLevel;
  yearsOfExperience: number;
  lastUsed?: string;
  isCertified: boolean;
  isEndorsed: boolean;
  notes?: string;
  consultantId: number;
  consultant?: Consultant;
  skillId: number;
  skill?: Skill;
  createdAt: string;
  updatedAt: string;
}

export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

// ==================== SUPPORTING MODULES ====================

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, any>;
  readAt?: string;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationCategory {
  SYSTEM = 'system',
  PROJECT = 'project',
  INVOICE = 'invoice',
  LEAVE = 'leave',
  EXPENSE = 'expense',
  MISSION = 'mission',
  OPPORTUNITY = 'opportunity',
  CANDIDATE = 'candidate',
}

export interface Document {
  id: number;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  version: number;
  isTemplate: boolean;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: number;
  uploadedById: number;
  uploadedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export enum DocumentType {
  CV = 'cv',
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
  INVOICE = 'invoice',
  QUOTE = 'quote',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  OTHER = 'other',
}

export enum DocumentCategory {
  CONSULTANT = 'consultant',
  CLIENT = 'client',
  PROJECT = 'project',
  HR = 'hr',
  FINANCE = 'finance',
  LEGAL = 'legal',
}
