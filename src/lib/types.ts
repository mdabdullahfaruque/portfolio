export interface ContactInfo {
  email: string
  linkedin: string
  location: string
  phone: string
  github: string
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
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  url: string
  description: string
  status: string
  features?: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  credentialUrl?: string
}

export interface ResumeData {
  name: string
  title: string
  photoUrl: string
  contact: ContactInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  skills: {
    backend: string[]
    frontend: string[]
    cloud: string[]
    databases: string[]
    testing: string[]
    tools: string[]
    cms: string[]
    ai: string[]
  }
  projects: Project[]
  certifications: Certification[]
  languages: { name: string; proficiency: string }[]
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
