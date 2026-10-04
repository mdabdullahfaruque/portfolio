// Parser for the resume Markdown files in public/resume/. Ported from the
// ResumeBuilder repo (resume-pdf-generator/src/resumeParser.js); keep both in sync
// so the downloads here match the PDFs tuned there (exactly 1 and 2 pages).

export interface ResumeJob {
  title: string
  company: string
  location: string
  period: string
  description: string
  achievements: string[]
  technologies: string
}

export interface ResumeEducation {
  degree: string
  school: string
  location: string
  period: string
  details: string[]
}

export interface ResumeProject {
  name: string
  organization: string
  period: string
  description: string
  link: string
  linkDisplay: string
  highlights: string[]
  technologies: string
}

export interface ResumeMarkdownData {
  name: string
  title: string
  photo: string
  contact: Record<string, string>
  summary: { text: string; highlights: string[] }
  experience: ResumeJob[]
  education: ResumeEducation[]
  skills: Record<string, string[]>
  keyAchievements: { title: string; items: string[] }[]
  languages: { language: string; proficiency: string }[]
  certifications: { title: string; url: string; meta: string }[]
  projects: ResumeProject[]
}

export const parseResumeMarkdown = (markdown: string): ResumeMarkdownData => {
  const lines = markdown.split('\n');
  const data: ResumeMarkdownData = {
    name: '',
    title: '',
    photo: '',
    contact: {},
    summary: { text: '', highlights: [] },
    experience: [],
    education: [],
    skills: {},
    keyAchievements: [],
    languages: [],
    certifications: [],
    projects: [],
  };

  let currentSection = '';
  let currentJob: ResumeJob | null = null;
  let currentEducation: ResumeEducation | null = null;
  let currentSkillCategory = '';
  let currentAchievement: { title: string; items: string[] } | null = null;
  let currentProject: ResumeProject | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse name (first H1)
    if (line.startsWith('# ') && !data.name) {
      const match = line.match(/# (.+?) - (.+)/);
      if (match) {
        data.name = match[1].trim();
        data.title = match[2].trim();
      }
      continue;
    }

    // Parse photo URL
    if (line.startsWith('**Photo URL:**')) {
      data.photo = line.replace('**Photo URL:**', '').trim();
      continue;
    }

    // Detect sections
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      continue;
    }

    // Parse Contact Information
    if (currentSection === 'Contact Information' && line.startsWith('- **')) {
      const match = line.match(/- \*\*(.+?):\*\* (.+)/);
      if (match) {
        const key = match[1].toLowerCase();
        let value = match[2];
        // Extract URL from markdown link format [text](url)
        const urlMatch = value.match(/\[(.*?)\]\((.*?)\)/);
        if (urlMatch) {
          // Store both display text and URL for links
          data.contact[key] = urlMatch[2].trim(); // URL
          data.contact[key + '_display'] = urlMatch[1].trim(); // Display text
        } else {
          data.contact[key] = value.trim();
        }
      }
      continue;
    }

    // Parse Summary
    if (currentSection === 'Summary') {
      if (line && !line.startsWith('**') && !line.startsWith('- ') && !line.startsWith('---')) {
        data.summary.text += (data.summary.text ? ' ' : '') + line;
      }
      if (line.startsWith('- 🚀') || line.startsWith('- ☁️') || line.startsWith('- 🎯') || line.startsWith('- 🌐')) {
        data.summary.highlights.push(line.replace(/^- /, '').trim());
      }
      continue;
    }

    // Parse Professional Experience
    if (currentSection === 'Professional Experience') {
      if (line.startsWith('### ')) {
        if (currentJob) data.experience.push(currentJob);
        currentJob = {
          title: line.replace('### ', '').trim(),
          company: '',
          location: '',
          period: '',
          description: '',
          achievements: [],
          technologies: '',
        };
      } else if (currentJob) {
        if (line.startsWith('**') && line.includes('|')) {
          const parts = line.split('|');
          currentJob.company = parts[0].replace(/\*\*/g, '').trim();
          currentJob.location = parts[1]?.trim() || '';
        } else if (line.startsWith('*') && !line.startsWith('**')) {
          // First italic line is period, subsequent ones are description
          if (!currentJob.period) {
            currentJob.period = line.replace(/\*/g, '').trim();
          } else {
            currentJob.description = line.replace(/\*/g, '').trim();
          }
        } else if (line.startsWith('- ✅')) {
          currentJob.achievements.push(line.replace('- ✅ ', '').trim());
        } else if (line.startsWith('**Technologies:**')) {
          currentJob.technologies = line.replace('**Technologies:** ', '').trim();
        }
      }
      continue;
    }

    // Parse Education
    if (currentSection === 'Education') {
      if (line.startsWith('### ')) {
        if (currentEducation) data.education.push(currentEducation);
        currentEducation = {
          degree: line.replace('### ', '').trim(),
          school: '',
          location: '',
          period: '',
          details: [],
        };
      } else if (currentEducation) {
        if (line.startsWith('**') && line.includes('|')) {
          const parts = line.split('|');
          currentEducation.school = parts[0].replace(/\*\*/g, '').trim();
          currentEducation.location = parts[1]?.trim() || '';
        } else if (line.startsWith('*')) {
          currentEducation.period = line.replace(/\*/g, '').trim();
        } else if (line.startsWith('- ')) {
          currentEducation.details.push(line.replace('- ', '').trim());
        }
      }
      continue;
    }

    // Parse Technical Skills
    if (currentSection === 'Technical Skills') {
      if (line.startsWith('### ')) {
        currentSkillCategory = line.replace('### ', '').trim();
        data.skills[currentSkillCategory] = [];
      } else if (line.startsWith('```') && i + 1 < lines.length) {
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          const skillLine = lines[i].trim();
          if (skillLine) {
            const skills = skillLine.split('•').map(s => s.trim()).filter(s => s);
            data.skills[currentSkillCategory].push(...skills);
          }
          i++;
        }
      }
      continue;
    }

    // Parse Key Achievements
    if (currentSection === 'Key Achievements & Highlights') {
      if (line.startsWith('### ')) {
        if (currentAchievement) data.keyAchievements.push(currentAchievement);
        currentAchievement = {
          title: line.replace('### ', '').trim(),
          items: [],
        };
      } else if (currentAchievement && line.startsWith('- ')) {
        currentAchievement.items.push(line.replace('- ', '').trim());
      }
      continue;
    }

    // Parse Certifications
    if (currentSection === 'Certifications') {
      if (line.startsWith('- **')) {
        // Match: - **[Title](url)** — Issuer · Date
        const linkMatch = line.match(/- \*\*\[(.+?)\]\((.+?)\)\*\*(.*)/);
        const plainMatch = line.match(/- \*\*(.+?)\*\*(.*)/);
        if (linkMatch) {
          const rest = linkMatch[3].replace(/^\s*[—-]\s*/, '').trim();
          data.certifications.push({ title: linkMatch[1].trim(), url: linkMatch[2].trim(), meta: rest });
        } else if (plainMatch) {
          const rest = plainMatch[2].replace(/^\s*[—-]\s*/, '').trim();
          data.certifications.push({ title: plainMatch[1].trim(), url: '', meta: rest });
        }
      }
      continue;
    }

    // Parse Projects
    if (currentSection === 'Projects & Portfolio') {
      if (line.startsWith('### ')) {
        if (currentProject) data.projects.push(currentProject);
        currentProject = {
          name: line.replace('### ', '').trim(),
          organization: '',
          period: '',
          description: '',
          link: '',
          linkDisplay: '',
          highlights: [],
          technologies: '',
        };
      } else if (currentProject) {
        if (line.startsWith('**') && line.includes('|')) {
          const parts = line.split('|');
          currentProject.organization = parts[0].replace(/\*\*/g, '').trim();
          currentProject.period = parts[1]?.trim() || '';
        } else if (line.startsWith('- ✅')) {
          currentProject.highlights.push(line.replace('- ✅ ', '').trim());
        } else if (line.startsWith('- **')) {
          const match = line.match(/- \*\*(.+?):\*\* (.+)/);
          if (match) {
            const key = match[1].toLowerCase();
            const value = match[2].trim();
            if (key === 'link') {
              const urlMatch = value.match(/\[(.*?)\]\((.*?)\)/);
              currentProject.link = urlMatch ? urlMatch[2].trim() : value;
              currentProject.linkDisplay = urlMatch ? urlMatch[1].trim() : value;
            } else if (key === 'description' || key === 'technologies') {
              currentProject[key] = value;
            }
          }
        }
      }
      continue;
    }

    // Parse Languages
    if (currentSection === 'Languages') {
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?):\*\* (.+)/);
        if (match) {
          data.languages.push({
            language: match[1].trim(),
            proficiency: match[2].trim(),
          });
        }
      }
      continue;
    }
  }

  // Push last items
  if (currentJob) data.experience.push(currentJob);
  if (currentEducation) data.education.push(currentEducation);
  if (currentAchievement) data.keyAchievements.push(currentAchievement);
  if (currentProject) data.projects.push(currentProject);

  return data;
};

/**
 * Load and parse one of the resume files served from public/resume/.
 * A root-relative photo path ("/Photo.JPG") is resolved inside that folder.
 */
export async function loadResumeMarkdown(file: 'resume-data.md' | 'resume-data-detailed.md'): Promise<ResumeMarkdownData> {
  const base = `${import.meta.env.BASE_URL}resume/`
  const response = await fetch(`${base}${file}`)
  if (!response.ok) {
    throw new Error(`Failed to load ${file} (${response.status})`)
  }
  const data = parseResumeMarkdown(await response.text())
  if (data.photo.startsWith('/')) {
    data.photo = `${base}${data.photo.slice(1)}`
  }
  return data
}
