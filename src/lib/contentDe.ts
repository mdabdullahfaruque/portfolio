import type { PortfolioData } from './types'

// German version of the portfolio content, shown when the site language is German
// and used for the German resume downloads. Entries are matched to initialData.ts
// by id; anything missing here falls back to the English text. Keep this file in
// step with initialData.ts when the English content changes.

interface ContentOverride {
  tagline?: string
  summary?: string
  aboutMe?: string
  highlights?: string[]
  languages?: { name: string; proficiency: string }[]
  experiences?: Record<string, { description?: string; companyType?: string; location?: string; achievements?: string[] }>
  education?: Record<string, { description?: string; location?: string }>
  projects?: Record<string, { name?: string; description?: string; market?: string; status?: string; features?: string[] }>
}

const de: ContentOverride = {
  tagline: 'Skalierbare, Cloud-native Anwendungen mit modernen Technologien',
  summary:
    'Senior Full Stack .NET Developer mit über 6 Jahren Erfahrung in der Entwicklung Cloud-nativer Systeme mit C#, .NET, Azure und AWS. Leitet derzeit die Entwicklung eines produktiven Multi-Tenant-SaaS-Marktplatzes mit Zahlungen, wiederkehrender Abrechnung, SSO und Microsoft-Marketplace-Integration. Versiert in Blazor WebAssembly, Angular, React und jQuery sowie in agentischer KI-Entwicklung mit Claude Code, GitHub Copilot, Cursor und MCP. Erfahrene Teamleitung mit Fokus auf skalierbare, leistungsstarke Systeme.',
  aboutMe:
    'Leidenschaftlicher Softwareentwickler mit nachweislicher Erfahrung in der Umsetzung von Unternehmensanwendungen in Branchen wie Fintech, E-Commerce und Technologie. Ich arbeite am liebsten im Team und setze auf sauberen, wartbaren Code – stets am Puls technologischer Innovation.',
  highlights: [
    'Leitet das Team hinter AG ONE, einem millionenschweren Software-Marktplatz',
    'Treibt schnelle, KI-gestützte Softwareentwicklung voran und führt das Team',
    'Migration globaler Webplattformen für Millionen Nutzer in über 12 Märkten geleitet',
    'Kritische Systeme auf .NET 8 migriert und die Performance um 40 % gesteigert',
    'Über 12 Märkte mit mehrsprachigen, mehrwährungsfähigen Systemen für 99,9 % Verfügbarkeit unterstützt',
    'Junior-Entwickler gecoacht und technische Teams bei Architekturentscheidungen geleitet',
  ],
  languages: [
    { name: 'Englisch', proficiency: 'Verhandlungssicher' },
    { name: 'Bengalisch', proficiency: 'Muttersprache' },
  ],
  experiences: {
    '1': {
      description: 'Multinationales Technologieunternehmen für innovative Softwarelösungen',
      companyType: 'Technologieunternehmen',
      achievements: [
        'Leitet das Team hinter AG ONE, einem millionenschweren Multi-Tenant-SaaS-Marktplatz; verantwortlich für Architektur, Aufwandsschätzung, Delivery-Reporting und Mitarbeitergespräche',
        'Führt das Team und treibt schnelle, KI-gestützte Softwareentwicklung mit Claude Code, GitHub Copilot und MCP voran',
        'Zahlungen über mehrere Gateways (Stripe, 2C2P) und eine Quartz.NET-Engine für wiederkehrende Abrechnung entwickelt',
        'Microsoft Marketplace SaaS Fulfillment und Pax8-Lizenzierung für Microsoft 365 integriert',
        'Entra ID SSO und 3-stufiges RBAC für mandantenfähige Zugriffskontrolle konzipiert',
        'Entwickelt KI-Funktionen mit RAG und Sentiment-Analyse',
      ],
    },
    '2': {
      description: "In Australien ansässig, größter Domino's-Franchisenehmer weltweit",
      companyType: 'Gastronomie',
      achievements: [
        'Globale Webplattformen von .NET Framework 4.8 auf .NET 8 migriert und Stabilität für Millionen Nutzer in 12 Märkten sichergestellt',
        'Skalierbare Anwendungen entwickelt und bereitgestellt, die das Kundenerlebnis in Europa, Australien und Südostasien verbessert haben',
        'Im multinationalen agilen Team Release-Zyklen, Systemzuverlässigkeit und marktübergreifende Konsistenz verbessert',
        'KI-Tools (GitHub Copilot, MCP-Server) eingesetzt und E2E-Tests mit Playwright automatisiert',
      ],
    },
    '3': {
      description: 'Führendes Bank- und Finanzdienstleistungsunternehmen in Malaysia',
      companyType: 'Finanzdienstleistungen',
      achievements: [
        'Migration von Legacy-Banksoftware auf .NET 8 geleitet, mit Modular-Monolith-Architektur und nahtloser Datenintegration in Microsoft SQL Server',
        'Leistungsstarke On-Premise-Bankanwendungen für Millionen Nutzer mit .NET Framework MVC, C#, jQuery und SQL Server entwickelt und erweitert',
      ],
    },
    '4': {
      description: 'Softwareentwicklungsunternehmen mit Fokus auf innovative IT-Lösungen',
      companyType: 'Softwareunternehmen',
      location: 'Dhaka, Bangladesch',
      achievements: [
        'Entwicklung von .NET 8/6-, Angular- und React-Anwendungen mit skalierbaren WebAPI- und MVC-Architekturen geleitet',
        'Plattformübergreifende Echtzeitkommunikation mit SignalR, AWS WebSocket und Twilio SDK konzipiert und entwickelt',
        'Microservice-Architekturmuster umgesetzt',
        'Junior-Entwickler in Best Practices gecoacht',
      ],
    },
    '5': {
      description: 'Softwareentwicklungsunternehmen mit Fokus auf innovative IT-Lösungen',
      companyType: 'Softwareunternehmen',
      location: 'Dhaka, Bangladesch',
      achievements: [
        'Serverless-Anwendungen mit AWS API Gateway und Lambda in C#, .NET 6/.NET Core 3.1 entwickelt',
        'Hybride Datenbanklösungen mit EF Core Code-First, MySQL und AWS DynamoDB für unterschiedliche Speicheranforderungen umgesetzt',
        'Ereignisgesteuerte Workflows mit AWS EventBridge und Step Functions orchestriert und so Automatisierung und Skalierbarkeit verbessert',
      ],
    },
  },
  education: {
    '1': {
      location: 'Cumilla, Bangladesch',
      description:
        'Fundierte Grundlagen der Informatik mit Schwerpunkt Software Engineering sowie Projekten in Webentwicklung und Cloud Computing.',
    },
  },
  projects: {
    'ag-one': {
      description:
        'Produktiver Multi-Tenant-SaaS-Marktplatz, auf dem Unternehmen einen Produktkatalog durchsuchen, Abonnements kaufen und AG ONE-Produkte starten (Work, Learn, Safe, Hire).',
      features: [
        'Lead Developer und Top-Contributor mit über 250 gemergten Pull Requests',
        'Anbieterunabhängige Zahlungsschicht mit währungsbasiertem Routing über Stripe und 2C2P',
        'Wiederkehrende Abrechnung mit Mahnwesen und idempotenten Wiederholungen',
        'Microsoft Marketplace SaaS Fulfillment und Pax8-Lizenzierung für Microsoft 365',
        'Entra ID SSO und 3-stufiges RBAC über alle Mandanten',
      ],
    },
    '1': {
      description: 'All-in-one-Plattform, die Käufer, Verkäufer, Bauunternehmen und vertrauenswürdige Baustofflieferanten verbindet.',
      market: 'Bangladesch & Malaysia',
      features: ['Immobilienanzeigen und -suche', 'Verzeichnis von Bauunternehmen', 'Marktplatz für Baustofflieferanten', 'Mehrsprachige Unterstützung'],
    },
    '2': {
      description:
        'Umfassende Gesundheitslösung, derzeit mit Fokus auf digitale Rezepterstellung, Patientenverwaltung und Praxisverwaltung für Ärzte.',
      market: 'Bangladesch',
      features: [
        'Digitale Rezepterstellung',
        'Patientenverwaltung',
        'Praxisverwaltung für Ärzte',
        'Terminplanung',
        'Geplant: Kliniken, Diagnosezentren, Apotheken, Telemedizin',
      ],
    },
    'dominos-migration': {
      name: "Globale Webplattform-Migration bei Domino's",
      description:
        'Kundenorientierte Webplattformen für Millionen Nutzer in 12 Märkten in Europa, Australien und Südostasien, migriert von .NET Framework 4.8 auf .NET 8.',
      market: 'Europa, Australien & Südostasien',
      features: [
        'Migration von .NET Framework 4.8 auf .NET 8',
        'Automatisierte Playwright-End-to-End-Tests sichern marktübergreifende Releases ab',
        'Stabile Releases für Millionen Nutzer in 12 Märkten',
      ],
    },
    'web-evv': {
      description:
        'Webplattform mit mobiler App, die die elektronische Besuchsverifizierung (EVV) für ambulante Pflegedienste vereinfacht und Terminplanung, Dokumentation und Abrechnung in Abstimmung mit Krankenversicherern integriert.',
      status: 'Jan. 2023 – Juli 2024',
    },
    'gateway-to-access': {
      description:
        'Web-, Desktop- und Mobile-Apps, über die Ärzte und Anwälte mit Dolmetschern in der Muttersprache ihrer Patienten und Mandanten kommunizieren – per Audio/Video oder persönlich, in Echtzeit oder zu geplanten Terminen.',
      status: 'Mai 2021 – Jan. 2023',
      features: [
        'F&E und Kernfunktionen in mehreren serverseitigen Projekten mit C# (.NET 6)',
        'AWS-Cloud-Services konfiguriert und verwaltet sowie Datenbankschemata entworfen',
        'Web-UI mit React entwickelt',
      ],
    },
  },
}

const MONTHS_DE: Record<string, string> = {
  January: 'Januar', February: 'Februar', March: 'März', May: 'Mai', June: 'Juni',
  July: 'Juli', October: 'Oktober', December: 'Dezember',
}

/** "January 2026" -> "Januar 2026", "Present" -> "Heute". */
const germanDate = (value?: string) =>
  value?.trim().toLowerCase() === 'present'
    ? 'Heute'
    : (value || '').replace(/\b(January|February|March|May|June|July|October|December)\b/g, (m) => MONTHS_DE[m])

/** The portfolio data in the given language. English is the stored base data. */
export function localizeData(data: PortfolioData, language: 'en' | 'de'): PortfolioData {
  if (language !== 'de') return data
  return {
    ...data,
    tagline: de.tagline ?? data.tagline,
    summary: de.summary ?? data.summary,
    aboutMe: de.aboutMe ?? data.aboutMe,
    highlights: de.highlights ?? data.highlights,
    languages: de.languages ?? data.languages,
    experiences: data.experiences.map((exp) => ({
      ...exp,
      ...de.experiences?.[exp.id],
      startDate: germanDate(exp.startDate),
      endDate: germanDate(exp.endDate),
    })),
    education: data.education.map((edu) => ({
      ...edu,
      ...de.education?.[edu.id],
      startDate: germanDate(edu.startDate),
      endDate: germanDate(edu.endDate),
    })),
    projects: data.projects.map((project) => ({
      ...project,
      ...de.projects?.[project.id],
      period: project.period?.split(' - ').map(germanDate).join(' - '),
    })),
    certifications: data.certifications.map((cert) => ({ ...cert, date: germanDate(cert.date) })),
  }
}
