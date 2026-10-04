import { Fragment } from 'react';
import type { ResumeMarkdownData } from '@/lib/resumeMarkdown';
import { Document, Page, Text as PdfText, View, StyleSheet, Link } from '@react-pdf/renderer';

// ATS-friendly layout: one column, standard section headings, real text only.
// No photo, icons, badges, tables or multi-column flow — applicant tracking
// systems read those out of order or drop them. Helvetica is a built-in PDF
// font, so extracted text maps cleanly without embedding a web font.
//
// For the human reader, hierarchy comes from size, weight and colour only:
// name > headline > section > role > body > meta. `**bold**` in the markdown
// marks the few phrases a recruiter should catch on a 6-second scan.

// Never split words across lines: an ATS reads 'devel-opment' as two tokens and
// misses the keyword. Scoped to this document so the one-page layout is unchanged.
const noHyphenation = (word) => [word];
const Text = (props) => <PdfText hyphenationCallback={noHyphenation} {...props} />;

const COLORS = {
  ink: '#1a1a1a',
  body: '#333333',
  muted: '#666666',
  accent: '#1f4e79',
  rule: '#9fb3c8',
};

// No letterSpacing anywhere: spaced capitals extract as "E D U C A T I O N",
// which an ATS cannot match to a section heading.
//
// Every text style sets its own lineHeight: react-pdf inherits it as an
// absolute height, which collapses lines when the font size changes.
const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 44,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: COLORS.body,
  },

  // Header
  name: {
    fontSize: 22,
    lineHeight: 1.1,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },
  headline: {
    fontSize: 12,
    lineHeight: 1.3,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
    marginTop: 3,
  },
  contactLine: {
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.muted,
    marginTop: 4,
  },
  headerRule: {
    borderBottom: `1.5 solid ${COLORS.accent}`,
    marginTop: 8,
  },
  link: {
    color: COLORS.accent,
    textDecoration: 'none',
  },

  // Sections
  section: {
    marginTop: 11,
  },
  sectionTitle: {
    fontSize: 10.5,
    lineHeight: 1.2,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
    textTransform: 'uppercase',
    borderBottom: `0.75 solid ${COLORS.rule}`,
    paddingBottom: 2.5,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  strong: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },

  // Skills: aligned label column, values wrap in their own column
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillLabel: {
    width: 100,
    fontSize: 9,
    lineHeight: 1.35,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },
  skillValue: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.35,
  },

  // Experience / project entries
  entry: {
    marginBottom: 8,
  },
  // The section below supplies the gap after a section's last entry.
  entryLast: {
    marginBottom: 0,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  entryTitle: {
    flex: 1,
    paddingRight: 10,
    fontSize: 10.5,
    lineHeight: 1.3,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.ink,
  },
  entryOrg: {
    color: COLORS.accent,
  },
  entryDate: {
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.muted,
  },
  entryMeta: {
    fontSize: 8.5,
    lineHeight: 1.3,
    fontFamily: 'Helvetica-Oblique',
    color: COLORS.muted,
    marginTop: 0.5,
    marginBottom: 3,
  },
  description: {
    fontSize: 9.5,
    lineHeight: 1.35,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 9.5,
    lineHeight: 1.35,
    color: COLORS.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  techLine: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: COLORS.muted,
    marginTop: 1.5,
  },
  techLabel: {
    fontFamily: 'Helvetica-Bold',
  },
});

const MONTHS = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g;

// "January 2026 - Present" -> "Jan 2026 – Present"
const formatPeriod = (period = '') =>
  period.replace(MONTHS, (m) => m.slice(0, 3)).replace(/\s+-\s+/, ' – ');

const entryStyle = (index, list) =>
  index === list.length - 1 ? [styles.entry, styles.entryLast] : styles.entry;

const isPlaceholder = (value) => !value || value.trim().startsWith('[');

// Renders `**phrase**` as bold inline text.
const Rich = ({ text }) =>
  text.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <Text key={i} style={styles.strong}>{part.slice(2, -2)}</Text>
      : part
  );

const Bullet = ({ text }) => (
  <View style={styles.bulletRow} wrap={false}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}><Rich text={text} /></Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle} minPresenceAhead={40}>{title}</Text>
    {children}
  </View>
);

const EntryHeader = ({ title, org, period }: { title: string; org?: string; period?: string }) => (
  <View style={styles.entryHeader}>
    <Text style={styles.entryTitle}>
      {title}
      {org ? <Text style={styles.entryOrg}>{`  |  ${org}`}</Text> : null}
    </Text>
    {period ? <Text style={styles.entryDate}>{formatPeriod(period)}</Text> : null}
  </View>
);

const TechLine = ({ text }) => (
  <Text style={styles.techLine}>
    <Text style={styles.techLabel}>Tech: </Text>
    {text}
  </Text>
);

// Ported from ResumeBuilder resume-pdf-generator/src/ResumeDetailedPDF.js (two pages, ATS).
export const DetailedResumePDF = ({ data }: { data: ResumeMarkdownData | null }) => {
  if (!data) return null;

  const contact = data.contact || {};
  const skills = Object.entries(data.skills || {}).filter(([, list]) => list.length > 0);
  const achievements = (data.keyAchievements || []).flatMap((group) => group.items);
  const contactParts = [
    !isPlaceholder(contact.location) && <Text key="loc">{contact.location}</Text>,
    !isPlaceholder(contact.phone) && <Text key="phone">{contact.phone}</Text>,
    contact.email && (
      <Link key="email" src={`mailto:${contact.email}`} style={styles.link}>{contact.email}</Link>
    ),
    contact.linkedin && (
      <Link key="li" src={contact.linkedin} style={styles.link}>
        {contact.linkedin_display || contact.linkedin}
      </Link>
    ),
    !isPlaceholder(contact.github) && (
      <Text key="gh">{contact.github_display || contact.github}</Text>
    ),
  ].filter(Boolean);

  return (
    <Document
      title={`${data.name} - ${data.title} - Resume`}
      author={data.name}
      subject={`Resume of ${data.name}, ${data.title}`}
      creator={data.name}
      producer={data.name}
    >
      <Page size="A4" style={styles.page}>
        {/* Header: plain text in the page body, not a PDF header region */}
        <Text style={styles.name}>{data.name.toUpperCase()}</Text>
        <Text style={styles.headline}>{data.title}</Text>
        <Text style={styles.contactLine}>
          {contactParts.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && '   |   '}
              {part}
            </Fragment>
          ))}
        </Text>
        <View style={styles.headerRule} />

        {data.summary?.text && (
          <Section title="Professional Summary">
            <Text style={styles.paragraph}><Rich text={data.summary.text} /></Text>
          </Section>
        )}

        {achievements.length > 0 && (
          <Section title="Key Achievements">
            {achievements.map((item, idx) => (
              <Bullet key={idx} text={item} />
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Technical Skills">
            {skills.map(([category, list]) => (
              <View key={category} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillLabel}>{category}</Text>
                <Text style={styles.skillValue}>{list.join(', ')}</Text>
              </View>
            ))}
          </Section>
        )}

        {data.experience?.length > 0 && (
          <Section title="Professional Experience">
            {data.experience.map((job, index) => (
              <View key={index} style={entryStyle(index, data.experience)} wrap={false}>
                <EntryHeader title={job.title.trim()} org={job.company} period={job.period} />
                <Text style={styles.entryMeta}>
                  {[job.location, job.description].filter(Boolean).join('  ·  ')}
                </Text>
                {job.achievements.map((item, idx) => (
                  <Bullet key={idx} text={item} />
                ))}
                {job.technologies && <TechLine text={job.technologies} />}
              </View>
            ))}
          </Section>
        )}

        {data.projects?.length > 0 && (
          <Section title="Key Projects">
            {data.projects.map((project, index) => (
              <View key={index} style={entryStyle(index, data.projects)} wrap={false}>
                <EntryHeader title={project.name} org={project.organization} period={project.period} />
                {project.link ? (
                  <Text style={styles.entryMeta}>
                    <Link src={project.link} style={styles.link}>{project.linkDisplay}</Link>
                  </Text>
                ) : (
                  <View style={{ height: 3 }} />
                )}
                {project.description && (
                  <Text style={styles.description}><Rich text={project.description} /></Text>
                )}
                {project.highlights.map((item, idx) => (
                  <Bullet key={idx} text={item} />
                ))}
                {project.technologies && <TechLine text={project.technologies} />}
              </View>
            ))}
          </Section>
        )}

        {data.education?.length > 0 && (
          <Section title="Education">
            {data.education.map((edu, index) => (
              <View key={index} style={entryStyle(index, data.education)} wrap={false}>
                <EntryHeader title={edu.degree} period={edu.period} />
                <Text style={styles.entryMeta}>
                  {[edu.school, edu.location].filter(Boolean).join(', ')}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {data.certifications?.length > 0 && (
          <Section title="Certifications">
            {data.certifications.map((cert, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>
                  {cert.url ? (
                    <Link src={cert.url} style={[styles.link, styles.strong]}>{cert.title}</Link>
                  ) : (
                    <Text style={styles.strong}>{cert.title}</Text>
                  )}
                  {cert.meta ? `  —  ${cert.meta}` : ''}
                </Text>
              </View>
            ))}
          </Section>
        )}

        {data.languages?.length > 0 && (
          <Section title="Languages">
            <Text style={styles.paragraph}>
              {data.languages
                .filter((lang) => !isPlaceholder(lang.proficiency))
                .map((lang) => `${lang.language} (${lang.proficiency})`)
                .join('   |   ')}
            </Text>
          </Section>
        )}
      </Page>
    </Document>
  );
};

export default DetailedResumePDF;
