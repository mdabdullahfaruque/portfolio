export interface ContactInfo {
  email: string
  linkedin: string
  location: string
  phone: string
  github: string
  website?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
  technologies: string[]
  companyType?: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
  gpa?: string
}

export interface Project {
  id: string
  name: string
  url: string
  description: string
  status: string
  features?: string[]
  image?: string
  technologies?: string[]
  market?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl?: string
}

export interface Skill {
  name: string
  proficiency: number
  yearsOfExperience?: number
}

export interface CustomSection {
  id: string
  title: string
  slug: string
  content: string
  order: number
  visible: boolean
  icon?: string
  showInNav: boolean
}

export interface NavMenuItem {
  id: string
  label: string
  path: string
  order: number
  visible: boolean
  isCustom: boolean
  icon?: string
}

export interface PortfolioData {
  name: string
  title: string
  tagline: string
  photoUrl: string
  contact: ContactInfo
  summary: string
  aboutMe: string
  experiences: Experience[]
  education: Education[]
  skills: {
    backend: Skill[]
    frontend: Skill[]
    cloud: Skill[]
    databases: Skill[]
    testing: Skill[]
    tools: Skill[]
    cms: Skill[]
    ai: Skill[]
  }
  projects: Project[]
  certifications: Certification[]
  languages: { name: string; proficiency: string }[]
  testimonials?: Testimonial[]
  stats?: StatItem[]
  highlights?: string[]
  customSections?: CustomSection[]
  navMenuItems?: NavMenuItem[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

export interface StatItem {
  id: string
  label: string
  value: string
  icon?: string
  translationKey?: 'yearsExperience' | 'projectsCompleted' | 'liveProducts' | 'technologies'
}

export interface Translations {
  en: {
    nav: {
      about: string
      experience: string
      education: string
      skills: string
      projects: string
      certifications: string
      contact: string
    }
    labels: {
      downloadPDF: string
      editMode: string
      present: string
      languages: string
      summary: string
      keyAchievements: string
      technologies: string
      skillCategories: {
        backend: string
        frontend: string
        cloud: string
        databases: string
        testing: string
        tools: string
        cms: string
        ai: string
      }
    }
  }
  de: {
    nav: {
      about: string
      experience: string
      education: string
      skills: string
      projects: string
      certifications: string
      contact: string
    }
    labels: {
      downloadPDF: string
      editMode: string
      present: string
      languages: string
      summary: string
      keyAchievements: string
      technologies: string
      skillCategories: {
        backend: string
        frontend: string
        cloud: string
        databases: string
        testing: string
        tools: string
        cms: string
        ai: string
      }
    }
  }
}
