import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Svg,
  Path,
  Circle,
  Image,
} from '@react-pdf/renderer'

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
})

// Resume data shape consumed by this component
export interface ResumeData {
  name: string
  title: string
  photo?: string
  contact?: {
    email?: string
    linkedin?: string
    linkedin_display?: string
    location?: string
  }
  summary?: {
    text?: string
  }
  experience?: Array<{
    title: string
    company: string
    location?: string
    period?: string
    description?: string
    achievements?: string[]
  }>
  education?: Array<{
    degree: string
    school: string
    location?: string
    period?: string
  }>
  skills?: Record<string, string[]>
  certifications?: Array<{
    title: string
    url?: string
    meta?: string
  }>
}

export interface ResumeSectionLabels {
  summary: string
  experience: string
  education: string
  skills: string
  certifications: string
}

const defaultLabels: ResumeSectionLabels = {
  summary: 'SUMMARY',
  experience: 'EXPERIENCE',
  education: 'EDUCATION',
  skills: 'SKILLS',
  certifications: 'CERTIFICATIONS',
}

// Icon Components
const EmailIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#0066cc" />
  </Svg>
)

const LinkedInIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#0066cc" />
  </Svg>
)

const LocationIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#0066cc" />
  </Svg>
)

const CalendarIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24">
    <Path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="#666666" />
  </Svg>
)

const MapPinIcon = () => (
  <Svg width="9" height="9" viewBox="0 0 24 24">
    <Circle cx="12" cy="10" r="3" fill="#666666" />
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="none" stroke="#666666" strokeWidth="2" />
  </Svg>
)

const styles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  profileImage: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 3,
  },
  mainLayout: {
    flexDirection: 'row',
    gap: 10,
  },
  leftColumn: {
    width: '60%',
  },
  rightColumn: {
    width: '40%',
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#0066cc',
    fontWeight: 600,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 14,
    marginBottom: 0,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
  },
  contactText: {
    fontSize: 9,
    color: '#444444',
  },
  contactLink: {
    fontSize: 9,
    color: '#0066cc',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 2,
    textTransform: 'uppercase',
    borderBottom: '1.5 solid #000000',
    paddingBottom: 2,
  },
  summaryText: {
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  educationBlock: {
    marginBottom: 2,
  },
  degree: {
    fontSize: 10,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 1.5,
    lineHeight: 1.2,
  },
  school: {
    fontSize: 9,
    color: '#444444',
    marginBottom: 1.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  dateText: {
    fontSize: 9,
    color: '#666666',
  },
  skillCategory: {
    marginBottom: 1.5,
  },
  skillTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#0066cc',
    marginBottom: 1.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  skillBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: '#ffffff',
    border: '0.5 solid #0066cc',
    borderRadius: 8,
    marginRight: 2,
    marginBottom: 2,
  },
  skillText: {
    fontSize: 8,
    color: '#444444',
  },
  experienceBlock: {
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#000000',
    marginBottom: 1,
  },
  company: {
    fontSize: 9,
    fontWeight: 600,
    color: '#0066cc',
    marginBottom: 1.5,
  },
  jobMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 1.5,
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 9,
    color: '#444444',
  },
  companyDescription: {
    fontSize: 8,
    color: '#666666',
    marginBottom: 1.5,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 1.2,
  },
  bullet: {
    width: 6,
    fontSize: 9,
    color: '#000000',
    marginRight: 4,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.3,
  },
})

interface ResumePDFProps {
  data: ResumeData
  labels?: ResumeSectionLabels
}

export function ResumePDF({ data, labels = defaultLabels }: ResumePDFProps) {
  if (!data) return null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.subtitle}>{data.title}</Text>
            <View style={styles.contactRow}>
              {data.contact?.email && (
                <View style={styles.contactItem}>
                  <View style={{ marginRight: 3 }}>
                    <EmailIcon />
                  </View>
                  <Link src={`mailto:${data.contact.email}`} style={styles.contactLink}>
                    {data.contact.email}
                  </Link>
                </View>
              )}
              {data.contact?.linkedin && (
                <View style={styles.contactItem}>
                  <View style={{ marginRight: 3 }}>
                    <LinkedInIcon />
                  </View>
                  <Link src={data.contact.linkedin} style={styles.contactLink}>
                    {data.contact.linkedin_display || data.contact.linkedin}
                  </Link>
                </View>
              )}
              {data.contact?.location && (
                <View style={styles.contactItem}>
                  <View style={{ marginRight: 3 }}>
                    <LocationIcon />
                  </View>
                  <Text style={styles.contactText}>{data.contact.location}</Text>
                </View>
              )}
            </View>
          </View>
          {data.photo && <Image src={data.photo} style={styles.profileImage} />}
        </View>

        {/* Summary - full-width above columns so Experience can start at top of left column */}
        {data.summary?.text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.summary}</Text>
            <Text style={styles.summaryText}>{data.summary.text}</Text>
          </View>
        )}

        {/* Main Two-Column Layout */}
        <View style={styles.mainLayout}>
          {/* Left Column - Experience */}
          <View style={styles.leftColumn}>
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{labels.experience}</Text>
                {data.experience.map((job, index) => (
                  <View key={index} style={styles.experienceBlock}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1.5 }}>
                      <Text style={styles.company}>{job.company}</Text>
                      {job.location && (
                        <>
                          <Text style={{ fontSize: 9, color: '#0066cc', marginHorizontal: 5 }}>|</Text>
                          <View style={{ marginRight: 3 }}>
                            <MapPinIcon />
                          </View>
                          <Text style={styles.metaText}>{job.location}</Text>
                        </>
                      )}
                    </View>
                    <View style={styles.jobMetaRow}>
                      <View style={styles.jobMetaItem}>
                        <View style={{ marginRight: 3 }}>
                          <CalendarIcon />
                        </View>
                        <Text style={styles.metaText}>{job.period}</Text>
                      </View>
                    </View>
                    {job.description && (
                      <Text style={styles.companyDescription}>{job.description}</Text>
                    )}
                    {job.achievements && job.achievements.length > 0 && (
                      <View>
                        {job.achievements.map((achievement, idx) => (
                          <View key={idx} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.bulletText}>{achievement}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {/* Education */}
            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{labels.education}</Text>
                {data.education.map((edu, index) => (
                  <View key={index} style={styles.educationBlock}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.school}>{edu.school}</Text>
                    {edu.location && (
                      <View style={styles.dateRow}>
                        <View style={{ marginRight: 3 }}>
                          <MapPinIcon />
                        </View>
                        <Text style={styles.dateText}>{edu.location}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {data.skills && Object.keys(data.skills).length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{labels.skills}</Text>
                {Object.entries(data.skills).map(([category, skills], index) => (
                  <View key={index} style={styles.skillCategory}>
                    <Text style={styles.skillTitle}>{category}</Text>
                    <View style={styles.skillsContainer}>
                      {skills.map((skill, idx) => (
                        <View key={idx} style={styles.skillBadge}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{labels.certifications}</Text>
                {data.certifications.map((cert, index) => (
                  <View key={index} style={{ marginBottom: 3 }}>
                    {cert.url ? (
                      <Link src={cert.url} style={{ fontSize: 9, color: '#0066cc', textDecoration: 'none', fontWeight: 600 }}>
                        {cert.title}
                      </Link>
                    ) : (
                      <Text style={{ fontSize: 9, fontWeight: 600, color: '#000000' }}>{cert.title}</Text>
                    )}
                    {cert.meta
                      ? cert.meta.split(' | ').map((line, i) => {
                          const dotParts = line.split(' · ')
                          if (dotParts.length > 1) {
                            return (
                              <Text key={i} style={{ fontSize: 8, color: '#666666' }}>
                                <Text style={{ fontWeight: 700 }}>{dotParts[0]}</Text>
                                {' · ' + dotParts.slice(1).join(' · ')}
                              </Text>
                            )
                          }
                          return (
                            <Text key={i} style={{ fontSize: 8, color: '#666666' }}>
                              {line}
                            </Text>
                          )
                        })
                      : null}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ResumePDF
