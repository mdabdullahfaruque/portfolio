import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  UserCircle,
  Briefcase,
  Code,
  GraduationCap,
  Certificate,
  ChartBar,
  Trash,
  Plus,
  FloppyDisk,
  Image as ImageIcon
} from '@phosphor-icons/react'
import { PortfolioData, Experience, Project, Skill, Education, Certification, StatItem } from '@/lib/types'
import { toast } from 'sonner'

interface AdminDashboardProps {
  data: PortfolioData
  onUpdate: (updatedData: PortfolioData) => void
  onLogout: () => void
}

export function AdminDashboard({ data, onUpdate, onLogout }: AdminDashboardProps) {
  const [editedData, setEditedData] = useState<PortfolioData>(data)

  useEffect(() => {
    setEditedData(data)
  }, [data])

  const handleSave = () => {
    onUpdate(editedData)
    toast.success('Changes saved successfully!')
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedData({ ...editedData, photoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateBasicInfo = (field: keyof PortfolioData, value: any) => {
    setEditedData({ ...editedData, [field]: value })
  }

  const updateContact = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      contact: { ...editedData.contact, [field]: value }
    })
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: 'New Position',
      company: 'Company Name',
      location: 'Location',
      startDate: 'Month Year',
      endDate: 'Present',
      description: 'Job description',
      achievements: [],
      technologies: [],
      companyType: ''
    }
    setEditedData({
      ...editedData,
      experiences: [...editedData.experiences, newExp]
    })
  }

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setEditedData({
      ...editedData,
      experiences: editedData.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    })
  }

  const deleteExperience = (id: string) => {
    setEditedData({
      ...editedData,
      experiences: editedData.experiences.filter(exp => exp.id !== id)
    })
    toast.success('Experience deleted')
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'New Project',
      url: '',
      description: 'Project description',
      status: 'Active',
      features: [],
      technologies: [],
      market: ''
    }
    setEditedData({
      ...editedData,
      projects: [...editedData.projects, newProject]
    })
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    })
  }

  const deleteProject = (id: string) => {
    setEditedData({
      ...editedData,
      projects: editedData.projects.filter(proj => proj.id !== id)
    })
    toast.success('Project deleted')
  }

  const updateSkill = (category: keyof PortfolioData['skills'], index: number, field: keyof Skill, value: any) => {
    const updatedSkills = [...editedData.skills[category]]
    updatedSkills[index] = { ...updatedSkills[index], [field]: value }
    setEditedData({
      ...editedData,
      skills: { ...editedData.skills, [category]: updatedSkills }
    })
  }

  const addSkill = (category: keyof PortfolioData['skills']) => {
    const newSkill: Skill = { name: 'New Skill', proficiency: 50, yearsOfExperience: 1 }
    setEditedData({
      ...editedData,
      skills: {
        ...editedData.skills,
        [category]: [...editedData.skills[category], newSkill]
      }
    })
  }

  const deleteSkill = (category: keyof PortfolioData['skills'], index: number) => {
    setEditedData({
      ...editedData,
      skills: {
        ...editedData.skills,
        [category]: editedData.skills[category].filter((_, i) => i !== index)
      }
    })
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: 'Degree Name',
      institution: 'Institution Name',
      location: 'Location',
      startDate: 'Month Year',
      endDate: 'Month Year',
      description: 'Description'
    }
    setEditedData({
      ...editedData,
      education: [...editedData.education, newEdu]
    })
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEditedData({
      ...editedData,
      education: editedData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    })
  }

  const deleteEducation = (id: string) => {
    setEditedData({
      ...editedData,
      education: editedData.education.filter(edu => edu.id !== id)
    })
    toast.success('Education deleted')
  }

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: 'Certification Name',
      issuer: 'Issuer',
      date: 'Month Year',
      credentialUrl: ''
    }
    setEditedData({
      ...editedData,
      certifications: [...editedData.certifications, newCert]
    })
  }

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    setEditedData({
      ...editedData,
      certifications: editedData.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    })
  }

  const deleteCertification = (id: string) => {
    setEditedData({
      ...editedData,
      certifications: editedData.certifications.filter(cert => cert.id !== id)
    })
    toast.success('Certification deleted')
  }

  const addStat = () => {
    const newStat: StatItem = {
      id: Date.now().toString(),
      label: 'New Stat',
      value: '0'
    }
    setEditedData({
      ...editedData,
      stats: [...(editedData.stats || []), newStat]
    })
  }

  const updateStat = (id: string, field: keyof StatItem, value: any) => {
    setEditedData({
      ...editedData,
      stats: (editedData.stats || []).map(stat =>
        stat.id === id ? { ...stat, [field]: value } : stat
      )
    })
  }

  const deleteStat = (id: string) => {
    setEditedData({
      ...editedData,
      stats: (editedData.stats || []).filter(stat => stat.id !== id)
    })
    toast.success('Stat deleted')
  }

  const addHighlight = () => {
    setEditedData({
      ...editedData,
      highlights: [...(editedData.highlights || []), 'New highlight']
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const highlights = [...(editedData.highlights || [])]
    highlights[index] = value
    setEditedData({ ...editedData, highlights })
  }

  const deleteHighlight = (index: number) => {
    setEditedData({
      ...editedData,
      highlights: (editedData.highlights || []).filter((_, i) => i !== index)
    })
    toast.success('Highlight deleted')
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your portfolio content</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} size="lg" className="gap-2">
                <FloppyDisk size={20} weight="bold" />
                Save All Changes
              </Button>
              <Button onClick={onLogout} variant="outline" size="lg">
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
              <TabsTrigger value="profile" className="gap-2">
                <UserCircle size={18} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="experience" className="gap-2">
                <Briefcase size={18} />
                Experience
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2">
                <Code size={18} />
                Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-2">
                <ChartBar size={18} />
                Skills
              </TabsTrigger>
              <TabsTrigger value="education" className="gap-2">
                <GraduationCap size={18} />
                Education
              </TabsTrigger>
              <TabsTrigger value="certifications" className="gap-2">
                <Certificate size={18} />
                Certifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-6 mt-3">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={editedData.photoUrl} alt={editedData.name} />
                        <AvatarFallback>{editedData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">Upload a new profile picture (PNG, JPG, or GIF)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedData.name}
                        onChange={(e) => updateBasicInfo('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={editedData.title}
                        onChange={(e) => updateBasicInfo('title', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={editedData.tagline}
                      onChange={(e) => updateBasicInfo('tagline', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={editedData.summary}
                      onChange={(e) => updateBasicInfo('summary', e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div>
                    <Label htmlFor="aboutMe">About Me</Label>
                    <Textarea
                      id="aboutMe"
                      value={editedData.aboutMe}
                      onChange={(e) => updateBasicInfo('aboutMe', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedData.contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedData.contact.location}
                      onChange={(e) => updateContact('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={editedData.contact.linkedin}
                      onChange={(e) => updateContact('linkedin', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      value={editedData.contact.github}
                      onChange={(e) => updateContact('github', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website (optional)</Label>
                    <Input
                      id="website"
                      value={editedData.contact.website || ''}
                      onChange={(e) => updateContact('website', e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Statistics</h2>
                  <Button onClick={addStat} size="sm" className="gap-2">
                    <Plus size={16} weight="bold" />
                    Add Stat
                  </Button>
                </div>
                <div className="space-y-4">
                  {(editedData.stats || []).map((stat) => (
                    <div key={stat.id} className="flex gap-3 items-start p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Value (e.g., 6+)"
                          value={stat.value}
                          onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                        />
                        <Input
                          placeholder="Label (e.g., Years Experience)"
                          value={stat.label}
                          onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteStat(stat.id)}
                      >
                        <Trash size={18} weight="bold" className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Key Highlights</h2>
                  <Button onClick={addHighlight} size="sm" className="gap-2">
                    <Plus size={16} weight="bold" />
                    Add Highlight
                  </Button>
                </div>
                <div className="space-y-3">
                  {(editedData.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="Enter a key highlight"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHighlight(index)}
                      >
                        <Trash size={18} weight="bold" className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Work Experience</h2>
                <Button onClick={addExperience} className="gap-2">
                  <Plus size={20} weight="bold" />
                  Add Experience
                </Button>
              </div>

              {editedData.experiences.map((exp) => (
                <Card key={exp.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Experience Entry</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExperience(exp.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} weight="bold" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="e.g., January 2024"
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="e.g., Present"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Company Type</Label>
                      <Input
                        value={exp.companyType || ''}
                        onChange={(e) => updateExperience(exp.id, 'companyType', e.target.value)}
                        placeholder="e.g., Technology Company, Financial Services"
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Achievements (one per line)</Label>
                      <Textarea
                        value={exp.achievements.join('\n')}
                        onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                        rows={5}
                        placeholder="Enter each achievement on a new line"
                      />
                    </div>

                    <div>
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={exp.technologies.join(', ')}
                        onChange={(e) => updateExperience(exp.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        placeholder="e.g., .NET, React, AWS"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Button onClick={addProject} className="gap-2">
                  <Plus size={20} weight="bold" />
                  Add Project
                </Button>
              </div>

              {editedData.projects.map((project) => (
                <Card key={project.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Project Entry</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} weight="bold" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>URL</Label>
                        <Input
                          value={project.url}
                          onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Status</Label>
                        <Input
                          value={project.status}
                          onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                          placeholder="e.g., Active, In Development"
                        />
                      </div>
                      <div>
                        <Label>Market</Label>
                        <Input
                          value={project.market || ''}
                          onChange={(e) => updateProject(project.id, 'market', e.target.value)}
                          placeholder="e.g., Bangladesh, Malaysia"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Features (one per line)</Label>
                      <Textarea
                        value={(project.features || []).join('\n')}
                        onChange={(e) => updateProject(project.id, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                        rows={4}
                        placeholder="Enter each feature on a new line"
                      />
                    </div>

                    <div>
                      <Label>Technologies (comma-separated)</Label>
                      <Input
                        value={(project.technologies || []).join(', ')}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                        placeholder="e.g., React, Node.js, PostgreSQL"
                      />
                    </div>

                    <div>
                      <Label>Image URL (optional)</Label>
                      <Input
                        value={project.image || ''}
                        onChange={(e) => updateProject(project.id, 'image', e.target.value)}
                        placeholder="URL to project image"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6">
              {Object.entries(editedData.skills).map(([category, skills]) => (
                <Card key={category} className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold capitalize">{category}</h3>
                    <Button onClick={() => addSkill(category as keyof PortfolioData['skills'])} size="sm" className="gap-2">
                      <Plus size={16} weight="bold" />
                      Add Skill
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3 items-center">
                        <Input
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) => updateSkill(category as keyof PortfolioData['skills'], index, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Proficiency %"
                          value={skill.proficiency}
                          onChange={(e) => updateSkill(category as keyof PortfolioData['skills'], index, 'proficiency', Number(e.target.value))}
                          min="0"
                          max="100"
                        />
                        <Input
                          type="number"
                          placeholder="Years"
                          value={skill.yearsOfExperience || ''}
                          onChange={(e) => updateSkill(category as keyof PortfolioData['skills'], index, 'yearsOfExperience', e.target.value ? Number(e.target.value) : undefined)}
                          min="0"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSkill(category as keyof PortfolioData['skills'], index)}
                        >
                          <Trash size={18} weight="bold" className="text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Education</h2>
                <Button onClick={addEducation} className="gap-2">
                  <Plus size={20} weight="bold" />
                  Add Education
                </Button>
              </div>

              {editedData.education.map((edu) => (
                <Card key={edu.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Education Entry</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEducation(edu.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} weight="bold" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Certifications</h2>
                <Button onClick={addCertification} className="gap-2">
                  <Plus size={20} weight="bold" />
                  Add Certification
                </Button>
              </div>

              {editedData.certifications.map((cert) => (
                <Card key={cert.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">Certification Entry</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCertification(cert.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} weight="bold" />
                      Delete
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Date Issued</Label>
                        <Input
                          value={cert.date}
                          onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Credential URL (optional)</Label>
                        <Input
                          value={cert.credentialUrl || ''}
                          onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center gap-3 mt-8">
            <Button onClick={handleSave} size="lg" className="gap-2">
              <FloppyDisk size={20} weight="bold" />
              Save All Changes
            </Button>
            <Button onClick={onLogout} variant="outline" size="lg">
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
