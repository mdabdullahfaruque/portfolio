# Planning Guide

An interactive, modern portfolio website showcasing MD Abdullah Faruque as a Senior Full Stack Developer with dynamic sections, admin panel for content management, multi-language support, and professional presentation inspired by contemporary portfolio designs.

**Experience Qualities**: 
1. **Dynamic** - Interactive elements, smooth animations, and engaging user experience that showcases technical expertise
2. **Professional** - Modern, polished design with sophisticated visual hierarchy that commands attention
3. **Manageable** - Owner-accessible admin panel for updating all content without redeployment, making the portfolio always current

**Complexity Level**: Complex Application (advanced functionality with multiple views and admin capabilities)
- Features comprehensive admin panel, real-time content editing, multi-language support, project showcase, interactive hero section, contact form, and dynamic PDF generation

## Essential Features

### Multi-Language Support
- **Functionality**: Toggle between English and German languages with potential for additional EU languages
- **Purpose**: Makes the resume accessible to international employers in Europe and English-speaking markets
- **Trigger**: Language selector in header
- **Progression**: User clicks language toggle → Content instantly switches → Language preference persists → All sections update simultaneously
- **Success criteria**: All text content updates without page reload, selected language persists across sessions

### Editable Content Management
- **Functionality**: All resume data stored in KV store and editable without redeployment
- **Purpose**: Allows easy updates to experience, skills, projects, and contact information
- **Trigger**: Admin mode accessed by the owner
- **Progression**: Owner clicks edit mode → Sections become editable → Changes saved to KV store → Content updates live
- **Success criteria**: All content can be modified and persists, including profile photo, experience entries, skills, and projects

### Professional Photo Display
- **Functionality**: Large, professional headshot with elegant presentation
- **Purpose**: Personalizes the resume and creates connection with viewers
- **Trigger**: Loads on page view
- **Progression**: Page loads → Photo displays with subtle animation → Maintains aspect ratio responsively
- **Success criteria**: Photo loads quickly, looks professional, scales appropriately on all devices

### Structured Resume Sections
- **Functionality**: Clear sections for Summary, Experience, Education, Skills, Projects, Certifications
- **Purpose**: Organizes 6 years of experience into scannable, digestible sections
- **Trigger**: Page scroll or section navigation
- **Progression**: User scrolls → Sections smoothly reveal → Navigation highlights current section → Easy jump between sections
- **Success criteria**: All career information is logically organized and easy to navigate

### PDF Download
- **Functionality**: Download formatted resume as PDF matching original resume style
- **Purpose**: Provides traditional format for application systems and offline viewing
- **Trigger**: Download button click
- **Progression**: User clicks download → PDF generates with current language → Opens/downloads with proper formatting → Matches professional resume layout
- **Success criteria**: PDF generated successfully with all content properly formatted

## Edge Case Handling

- **Missing Profile Photo**: Display placeholder avatar with initials until photo loads
- **Empty Content Sections**: Show "Coming Soon" state for sections without data
- **Failed PDF Generation**: Show error toast with option to retry or print page
- **Language Switch During Edit**: Preserve edit mode state when switching languages
- **Incomplete Translations**: Fall back to English if German translation missing
- **Long Skill Lists**: Organize into collapsible categories to prevent overwhelming view
- **Mobile PDF Download**: Adapt download experience for mobile browsers

## Design Direction

The design should evoke **trust, expertise, and modern professionalism** - like a senior architect's portfolio. It should feel refined, confident, and technically sophisticated without being flashy. Think clean lines, generous whitespace, and typography that commands respect. The aesthetic should communicate "I build enterprise systems at scale" through visual restraint and precision.

## Color Selection

A sophisticated, corporate palette with deep navy as the foundation, conveying technical expertise and trustworthiness.

- **Primary Color**: Deep Navy Blue (oklch(0.25 0.08 250)) - Represents technical depth, professionalism, and corporate trust
- **Secondary Colors**: 
  - Slate Gray (oklch(0.45 0.02 250)) - Supporting neutral for less prominent content
  - Cool Gray (oklch(0.85 0.01 250)) - Card backgrounds and subtle separations
- **Accent Color**: Electric Blue (oklch(0.65 0.15 245)) - CTAs, links, and interactive elements that draw attention
- **Foreground/Background Pairings**: 
  - Primary Navy (oklch(0.25 0.08 250)): White text (oklch(0.98 0 0)) - Ratio 11.2:1 ✓
  - Accent Blue (oklch(0.65 0.15 245)): White text (oklch(0.98 0 0)) - Ratio 5.8:1 ✓
  - Background (oklch(0.98 0 0)): Navy text (oklch(0.25 0.08 250)) - Ratio 11.2:1 ✓
  - Muted Gray (oklch(0.85 0.01 250)): Slate text (oklch(0.45 0.02 250)) - Ratio 4.9:1 ✓

## Font Selection

Typography should convey technical precision and modern professionalism with excellent readability for dense information.

- **Typographic Hierarchy**: 
  - H1 (Name/Title): Space Grotesk Bold / 48px / -0.02em letter-spacing
  - H2 (Section Headers): Space Grotesk SemiBold / 32px / -0.01em
  - H3 (Job Titles): Space Grotesk Medium / 24px / normal
  - H4 (Company Names): IBM Plex Sans SemiBold / 18px / normal
  - Body (Descriptions): IBM Plex Sans Regular / 16px / 0.01em / 1.6 line-height
  - Small (Dates/Meta): IBM Plex Mono Regular / 14px / normal

Primary: **Space Grotesk** for headers - geometric precision with warmth, conveys modern technical expertise
Secondary: **IBM Plex Sans** for body - designed for tech, excellent readability in long-form content
Monospace: **IBM Plex Mono** for technical details like dates and code references

## Animations

Animations should be subtle and purposeful, reinforcing the professional nature while providing smooth, satisfying interactions.

**Functional Animations:**
- Section reveal: Gentle fade-up (opacity + translateY) as sections enter viewport
- Language toggle: Quick cross-fade (200ms) between content versions
- Button interactions: Subtle scale (0.98) on press with smooth shadow transitions
- Navigation: Smooth scroll with easing when jumping between sections
- Photo entrance: Soft fade-in with slight scale (1.02 → 1.0) on page load

**Moments of Delight:**
- Skill pills: Gentle hover lift with shadow depth increase
- PDF download: Progress indicator with success checkmark animation
- Edit mode toggle: Smooth panel slide-in for editing interface

## Component Selection

- **Components**: 
  - `Card` for experience entries, education, and project showcases with subtle shadow elevation
  - `Badge` for skills, technologies, and tags with hover states
  - `Button` for primary actions (Download PDF, Contact, Edit Mode) with solid fills for primary, ghost for secondary
  - `Separator` for section divisions with subtle gradient fades
  - `Tabs` for organizing dense skill categories
  - `Dialog` for edit mode panels when owner makes changes
  - `ScrollArea` for potentially long skill lists or project details
  - `Avatar` for professional photo with fallback
  - Custom navigation dots for section jumping
  
- **Customizations**: 
  - Custom timeline component for experience history with connecting lines
  - Language switcher component with flag icons (EN/DE)
  - Custom PDF generation layout component
  - Profile header component with photo, name, title, and contact icons
  
- **States**: 
  - Buttons: Default navy, hover with slight brightness increase, active with press effect, disabled with reduced opacity
  - Inputs (edit mode): Clear borders, focus with accent blue ring, filled state with subtle background
  - Links: Accent blue with underline on hover, visited state same as default
  - Cards: Subtle elevation by default, increased shadow on hover for interactive cards
  
- **Icon Selection**: 
  - `@phosphor-icons/react` for all icons
  - `EnvelopeSimple` for email
  - `LinkedinLogo` for LinkedIn
  - `MapPin` for location
  - `Phone` for phone number
  - `GithubLogo` for GitHub
  - `DownloadSimple` for PDF download
  - `Globe` for language switcher
  - `PencilSimple` for edit mode
  - `Check` for achievements/checkmarks
  - `Buildings` for companies
  - `GraduationCap` for education
  
- **Spacing**: 
  - Section padding: `py-16 md:py-24`
  - Card padding: `p-6 md:p-8`
  - Element gaps: `gap-6` for loose groupings, `gap-4` for related items, `gap-2` for tight groups
  - Container max-width: `max-w-5xl` for optimal readability
  - Consistent `space-y-8` between major section elements
  
- **Mobile**: 
  - Single column layout below 768px
  - Sticky header with condensed navigation
  - Profile photo reduces to 120px on mobile
  - Skill badges wrap gracefully with maintained spacing
  - PDF download button becomes fixed bottom bar on mobile
  - Timeline simplifies to vertical with smaller connecting elements
  - Language switcher remains in header but condensed
  - Touch-friendly button sizes (min 44px height)
