export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface ProfessionalInfo {
  title: string;
  level: string;
  experienceYears: number;
}

export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
}

export interface Project {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface Consultant
  extends PersonalInfo,
    ProfessionalInfo {
  id: string;
  skills: Skill[];
  contact: ContactInfo;
  experiences: Experience[];
  projects: Project[];
  status: 'active' | 'bench' | 'inactive';
}
