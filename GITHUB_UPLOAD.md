# Uploading RoTrust to GitHub

This document provides instructions for uploading the RoTrust project to your GitHub account.

## Prerequisites

1. Make sure you have Git installed on your computer
2. Have a GitHub account
3. Have the GitHub CLI installed (optional, but makes authentication easier)

## Steps to Upload to GitHub

### 1. Initialize Git Repository

First, navigate to the project root directory and initialize a Git repository:

```powershell
cd C:\Users\maria\Documents\repos\Projects\rotrust
git init
```

### 2. Add Files to Git

Add all project files to the Git repository:

```powershell
git add .
```

### 3. Make Initial Commit

Commit the files with an initial commit message:

```powershell
git commit -m "Initial commit of RoTrust project"
```

### 4. Create a New Repository on GitHub

Go to GitHub (https://github.com) and create a new repository:

1. Click on the "+" icon in the top right corner
2. Select "New repository"
3. Enter "rotrust" as the repository name
4. Add a description: "A blockchain-based platform for real estate transactions in Romania"
5. Choose whether to make it public or private
6. Do NOT initialize the repository with a README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 5. Connect Local Repository to GitHub

After creating the repository, GitHub will show instructions. Use the commands for "push an existing repository":

```powershell
git remote add origin https://github.com/MarianStelianCraciun/rotrust.git
git branch -M main
git push -u origin main
```

Replace `MarianStelianCraciun` with your actual GitHub username.

### 6. Authentication

If you're prompted for authentication, you can:

- Use GitHub CLI: `gh auth login` (recommended)
- Use a personal access token
- Set up SSH keys

### 7. Verify Upload

After pushing, visit your GitHub repository at `https://github.com/MarianStelianCraciun/rotrust` to verify that all files have been uploaded correctly.

## Troubleshooting

### Large Files

If you encounter issues with large files, you may need to use Git LFS (Large File Storage):

1. Install Git LFS: `git lfs install`
2. Track large files: `git lfs track "*.extension"`
3. Add, commit, and push as usual

### Authentication Issues

If you have authentication issues:

1. Make sure you're using the correct GitHub credentials
2. Consider using a personal access token or SSH key
3. Use GitHub CLI for easier authentication: `gh auth login`

### Other Issues

For other issues, refer to GitHub's documentation or contact GitHub support.