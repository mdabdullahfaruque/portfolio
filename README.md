# 🎯 Professional Portfolio - MD Abdullah Faruque

A modern, responsive portfolio website with comprehensive admin capabilities for managing all content without redeployment.

## 🌐 Live Portfolio

**Public URL:** `https://professional-portfol--mdabdullahfaruque.github.app`

✅ **Publicly accessible** - No GitHub login required for visitors  
✅ **Globally available** - Share with recruiters worldwide  
✅ **Multi-language** - English and German supported  
✅ **Mobile responsive** - Optimized for all devices  

## 🔐 Admin Dashboard

**Access:** Add `/admin` to the portfolio URL  
**Default Credentials:**
- Email: `admin@abdullahfaruque.com`
- Password: `Admin@123456`

### ✨ Complete Admin Features:

**Profile Management:**
- Upload and update profile picture
- Edit personal information (name, title, tagline)
- Update professional summary and about section
- Manage contact information
- Add/edit/delete statistics and highlights

**Content Management:**
- ✅ **Experiences** - Full CRUD for work history
- ✅ **Projects** - Manage project portfolio
- ✅ **Skills** - Update skill proficiency and experience
- ✅ **Education** - Manage education entries
- ✅ **Certifications** - Add and update certifications

**No Redeployment Needed!** All changes save instantly to persistent storage.

## 🚀 Quick Start Guide

### For Admins:

1. **Access Admin Panel:**
   ```
   Visit: https://professional-portfol--mdabdullahfaruque.github.app/admin
   Login with credentials above
   ```

2. **Update Content:**
   - Navigate through tabs (Profile, Experience, Projects, etc.)
   - Add, edit, or delete entries
   - Upload profile picture
   - Click "Save All Changes"

3. **View Changes:**
   - Changes appear immediately on public pages
   - No build or deployment required
   - Refresh public page to see updates

### For Visitors:

1. **View Portfolio:**
   ```
   Visit: https://professional-portfol--mdabdullahfaruque.github.app
   ```

2. **Navigate Sections:**
   - Home - Overview and highlights
   - Experience - Work history
   - Projects - Portfolio projects
   - Skills - Technical expertise
   - Contact - Get in touch

3. **Language Toggle:**
   - Click globe icon (🌐) in navbar
   - Switch between English and German

4. **Download Resume:**
   - Click "Download Resume" button
   - Print or save as PDF

## 📁 Documentation

- **[ADMIN_IMPLEMENTATION.md](./ADMIN_IMPLEMENTATION.md)** - Complete admin guide with all features
- **[PUBLIC_URL_INFO.md](./PUBLIC_URL_INFO.md)** - Detailed public access and sharing guide
- **[PRD.md](./PRD.md)** - Product requirements and design decisions
- **[SECURITY.md](./SECURITY.md)** - Security implementation details

## 🛠️ Technical Stack

**Frontend:**
- React 19 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn UI components

**State Management:**
- `useKV` hook for persistent storage
- React hooks for local state
- Session-based authentication

**Routing:**
- React Router v7
- Protected admin routes
- Multi-language support

**Security:**
- SHA-256 password hashing
- Secure credential storage
- Session-based auth

## 🎨 Features

### Public Portfolio:
- ✨ Modern, professional design
- 📱 Fully responsive layout
- 🌍 English/German language support
- 🎭 Smooth animations and transitions
- 📄 PDF resume download
- 🔗 Social media integration

### Admin Dashboard:
- 🖼️ Profile picture upload
- ✏️ Rich text editing
- 🗂️ Organized tabbed interface
- 💾 Auto-save functionality
- 🔔 Toast notifications
- 🔒 Secure authentication

## 📊 Content Structure

### Profile Section:
- Personal information
- Contact details
- Professional summary
- About me
- Statistics
- Key highlights

### Work Experience:
- Job title and company
- Location and dates
- Company description
- Achievements
- Technologies used

### Projects:
- Project name and URL
- Description and status
- Target market
- Features list
- Technologies
- Project images

### Skills:
- 8 Categories (Backend, Frontend, Cloud, etc.)
- Proficiency levels (0-100%)
- Years of experience
- Animated progress bars

### Education:
- Degree and institution
- Dates and location
- GPA (optional)
- Description

### Certifications:
- Certification name
- Issuing organization
- Date issued
- Credential URL

## 🔄 Updating Your Portfolio

### As Admin:

1. **Login to Dashboard:**
   ```
   /admin → Enter credentials → Access dashboard
   ```

2. **Update Profile Picture:**
   ```
   Profile tab → Upload image → Preview → Save
   ```

3. **Add New Experience:**
   ```
   Experience tab → Add Experience button → Fill form → Save
   ```

4. **Edit Existing Content:**
   ```
   Click on any tab → Edit button on item → Update → Save
   ```

5. **Delete Content:**
   ```
   Click Delete button on any item → Confirm → Save
   ```

### Best Practices:

- **Update regularly** - Keep content fresh and current
- **Use high-quality images** - Professional profile photo
- **Consistent formatting** - Follow date format patterns
- **Test changes** - View public pages after saving
- **Backup important data** - Keep records of achievements

## 🌍 Sharing Your Portfolio

### On Your Resume:
```
Portfolio: https://professional-portfol--mdabdullahfaruque.github.app
```

### On LinkedIn:
1. Profile → Featured → Add Link
2. Paste URL and add title
3. Or add to Contact Info → Website

### In Applications:
Include in cover letters and application forms when asked for "Portfolio URL" or "Website"

### Social Media:
- Twitter/X bio
- GitHub profile README
- Dev.to author bio
- Medium profile

## 🔐 Security

### Public Access:
- ✅ All portfolio content is public
- ✅ No login required to view
- ✅ Accessible from any device/location

### Admin Access:
- 🔒 Password-protected admin panel
- 🔒 Secure password hashing (SHA-256)
- 🔒 Session-based authentication
- 🔒 Protected routes for admin only

### Changing Admin Password:
Edit `src/lib/auth.ts`:
```typescript
export async function initializeAdminCredentials() {
  const adminEmail = 'your-new-email@example.com'
  const adminPassword = 'YourNewPassword'
  // ...
}
```

## 💡 Tips for Maximum Impact

1. **Before Job Applications:**
   - Update with latest projects
   - Refresh skills and technologies
   - Ensure contact info is current

2. **For Interviews:**
   - Review your portfolio content
   - Prepare to discuss projects
   - Have examples ready

3. **Regular Maintenance:**
   - Monthly content updates
   - Add new certifications
   - Update experience section

4. **Language Strategy:**
   - English for international roles
   - German for DACH region
   - Toggle available in navbar

## 🎯 Key Statistics

- **6+ Years** - Professional experience
- **12+ Markets** - Global reach
- **Multiple Technologies** - Full-stack expertise
- **Live Projects** - Real-world applications

## 📞 Contact

**Email:** mabdullahfaruque@gmail.com  
**LinkedIn:** [linkedin.com/in/mdabdullahfaruque](https://www.linkedin.com/in/mdabdullahfaruque)  
**GitHub:** [github.com/mdabdullahfaruque](https://github.com/mdabdullahfaruque)  
**Portfolio:** [professional-portfol--mdabdullahfaruque.github.app](https://professional-portfol--mdabdullahfaruque.github.app)

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

---

**Built with ❤️ using Spark Template**  
**Always up-to-date • Always accessible • Always professional**
