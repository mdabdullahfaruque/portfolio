# How to Push This Portfolio to Your GitHub Account

Since you're using the account **mdabdullahfaruque** and want this code in a GitHub repository, follow these steps:

## Prerequisites
- You need to be logged into your GitHub account (mdabdullahfaruque)
- You should have Git installed on your local machine

## Steps to Create and Push to GitHub Repository

### 1. Create a New Repository on GitHub
1. Go to https://github.com/new
2. Enter a repository name (e.g., `portfolio` or `my-portfolio-website`)
3. Choose **Public** or **Private** visibility
4. **DO NOT** initialize with README, .gitignore, or license (since this project already has code)
5. Click **Create repository**

### 2. Initialize Git in Your Project (If Not Already Done)
Open your terminal in the project directory and run:

```bash
cd /workspaces/spark-template
git init
```

### 3. Add All Files to Git
```bash
git add .
```

### 4. Create Your First Commit
```bash
git commit -m "Initial commit: Portfolio website with resume download functionality"
```

### 5. Add Your GitHub Repository as Remote
Replace `YOUR-REPO-NAME` with the repository name you created in step 1:

```bash
git remote add origin https://github.com/mdabdullahfaruque/YOUR-REPO-NAME.git
```

### 6. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

### Alternative: Use GitHub CLI (if available)
If you have GitHub CLI installed and authenticated:

```bash
cd /workspaces/spark-template
gh repo create my-portfolio-website --public --source=. --remote=origin
git push -u origin main
```

## Troubleshooting

### Authentication Issues
If you encounter authentication problems:
1. You might need to use a Personal Access Token (PAT) instead of your password
2. Generate a PAT at: https://github.com/settings/tokens
3. Use the PAT as your password when prompted

### Repository Already Has Content
If you see an error about the remote repository not being empty:
```bash
git pull origin main --rebase
git push -u origin main
```

## What's Fixed in This Version
✅ **Resume Download**: Now properly downloads the PDF file when clicking "Download Resume"
✅ **Profile Picture**: Uses your uploaded profile image from assets
✅ **All Portfolio Data**: Persists using Spark's KV storage

## Next Steps After Pushing
1. Update the repository description on GitHub
2. Add topics/tags to make it discoverable
3. Consider enabling GitHub Pages if you want to host it there
4. Add a proper README.md describing your portfolio

---

**Note**: This Spark application uses special runtime features (like `spark.kv` for data persistence) that won't work outside the Spark environment. If you want to deploy this elsewhere, you'll need to replace the KV storage with an alternative solution like localStorage or a backend database.
