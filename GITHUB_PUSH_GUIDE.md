# Guide: Push Portfolio to Your GitHub Account

This guide explains how to push this portfolio application to your own GitHub repository.

## Prerequisites

- GitHub account
- Git installed on your local machine
- GitHub Personal Access Token (PAT) or SSH key configured

## Option 1: Push to a New Repository (Recommended)

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `portfolio` (or any name you prefer)
3. Description: "Professional portfolio website built with React, TypeScript, and Tailwind CSS"
4. Choose Public or Private
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Update Remote and Push

```bash
# Navigate to the project directory
cd /workspaces/spark-template

# Remove existing remote (if any)
git remote remove origin

# Add your new repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or use SSH if you have SSH keys configured:
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Verify the remote
git remote -v

# Create and checkout a new branch (optional but recommended)
git checkout -b main

# Stage all changes
git add .

# Commit the changes
git commit -m "Initial commit: Professional portfolio with asset integration

- Added profile picture integration from assets
- Implemented direct PDF resume download
- Updated TypeScript declarations for assets
- Configured proper asset imports"

# Push to GitHub
git push -u origin main
```

## Option 2: Push to an Existing Repository

If you want to add this to an existing repository:

```bash
# Navigate to the project directory
cd /workspaces/spark-template

# Add your existing repository as remote
git remote add origin https://github.com/YOUR_USERNAME/EXISTING_REPO.git

# Fetch existing branches
git fetch origin

# Create a new branch for this work
git checkout -b portfolio-update

# Stage and commit changes
git add .
git commit -m "Add professional portfolio application"

# Push the branch
git push -u origin portfolio-update
```

Then create a Pull Request on GitHub if you want to review before merging.

## Option 3: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Navigate to the project directory
cd /workspaces/spark-template

# Create a new repository and push
gh repo create portfolio --public --source=. --remote=origin --push

# Or for private repository
gh repo create portfolio --private --source=. --remote=origin --push
```

## Verifying Your Push

After pushing, verify on GitHub:

1. Go to your repository: `https://github.com/YOUR_USERNAME/REPO_NAME`
2. Check that all files are present
3. Verify the assets are in `/src/assets/`
4. Check that the last commit message matches your push

## Setting Up GitHub Pages (Optional)

To deploy your portfolio as a live website:

### Method 1: Using GitHub Actions

1. In your repository, go to Settings → Pages
2. Under "Build and deployment", select "GitHub Actions"
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-modules 18
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

4. Push this workflow file
5. Your site will be available at `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Method 2: Manual Deployment

```bash
# Build the project
npm run build

# Install gh-pages package
npm install -g gh-pages

# Deploy
gh-pages -d dist
```

## Updating the Repository Information

Update these files with your information:

### `package.json`
```json
{
  "name": "your-portfolio",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/REPO_NAME.git"
  },
  "homepage": "https://YOUR_USERNAME.github.io/REPO_NAME"
}
```

### `README.md`
Update with:
- Your name
- Repository URL
- Live demo URL (if deployed)
- Any custom instructions

## Troubleshooting

### Authentication Issues

If you get authentication errors:

**Using HTTPS:**
```bash
# Use Personal Access Token
# When prompted for password, use your PAT instead
```

**Using SSH:**
```bash
# Test SSH connection
ssh -T git@github.com

# If needed, add your SSH key to GitHub
# Settings → SSH and GPG keys → New SSH key
```

### Large File Issues

If you have issues with large files (resume PDF, images):

```bash
# Check file sizes
du -sh src/assets/**/*

# If files are too large, consider using Git LFS
git lfs install
git lfs track "*.pdf"
git lfs track "*.jpg"
git add .gitattributes
git commit -m "Configure Git LFS"
git push
```

### Force Push (Use with Caution)

Only if absolutely necessary:

```bash
git push -f origin main
```

⚠️ **Warning**: Force push will overwrite remote history. Only use if you're sure.

## Next Steps

After pushing to GitHub:

1. ✅ Verify all files are present
2. ✅ Check that assets are accessible
3. ✅ Set up GitHub Pages (optional)
4. ✅ Add repository description and topics
5. ✅ Update README with your information
6. ✅ Configure branch protection rules (Settings → Branches)
7. ✅ Add collaborators if needed (Settings → Collaborators)

## Support

If you encounter issues:
- Check GitHub's documentation: https://docs.github.com
- Git documentation: https://git-scm.com/doc
- GitHub Community Forum: https://github.community/

---

**Your Repository Details:**
- Profile Picture: `/src/assets/images/PHOTO-PS-MD_ABDULLAH_FARUQUE.JPG`
- Resume PDF: `/src/assets/documents/MdAbdullahFaruque_Resume.pdf`
- Main Application: React + TypeScript + Tailwind CSS
- Node Version: 18+ recommended
