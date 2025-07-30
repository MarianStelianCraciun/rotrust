# Branch Protection Bypass Demonstration

This document demonstrates how the branch protection bypass for the repository owner works in practice.

## Scenario 1: Repository Owner Pushes Directly to Main

When the repository owner (MarianStelianCraciun) pushes directly to the main branch, the following happens:

1. The push event triggers the branch protection workflow
2. The workflow checks if the actor (user who initiated the workflow) is "MarianStelianCraciun"
3. Since the actor matches the repository owner, the workflow allows the push with a message:
   ```
   Repository owner detected. Allowing direct push to main branch.
   ```
4. The push completes successfully, and the changes are applied to the main branch

### Example Terminal Session:

```bash
# Repository owner makes changes
git checkout main
git add some-file.txt
git commit -m "Update some file"

# Repository owner pushes directly to main
git push origin main

# GitHub Actions workflow runs and allows the push
# Output in GitHub Actions logs:
# "Repository owner detected. Allowing direct push to main branch."
```

## Scenario 2: Other User Pushes Directly to Main

When any other user (not the repository owner) pushes directly to the main branch, the following happens:

1. The push event triggers the branch protection workflow
2. The workflow checks if the actor (user who initiated the workflow) is "MarianStelianCraciun"
3. Since the actor does not match the repository owner, the workflow fails with an error message:
   ```
   Direct pushes to main branch are not allowed!
   Please create a pull request instead.
   ```
4. The push is rejected, and the changes are not applied to the main branch

### Example Terminal Session:

```bash
# Another user makes changes
git checkout main
git add some-file.txt
git commit -m "Update some file"

# Another user tries to push directly to main
git push origin main

# GitHub Actions workflow runs and blocks the push
# Output in GitHub Actions logs:
# "Direct pushes to main branch are not allowed!
# Please create a pull request instead."
# 
# The push is rejected with an error
```

## How to Properly Contribute (for non-owners)

If you are not the repository owner, you should follow these steps to contribute:

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes, commit them, and push to your branch:
   ```bash
   git add .
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

3. Create a pull request from your branch to the main branch
4. Wait for the repository owner to review and approve your pull request
5. Once approved, your changes can be merged to the main branch

## Technical Implementation

The bypass is implemented in the `.github/workflows/branch-protection.yml` file with the following code:

```yaml
- name: Check if push is direct to main
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  run: |
    # Allow the repository owner to push directly to main
    if [ "${{ github.actor }}" == "MarianStelianCraciun" ]; then
      echo "Repository owner detected. Allowing direct push to main branch."
    else
      echo "Direct pushes to main branch are not allowed!"
      echo "Please create a pull request instead."
      exit 1
    fi
```

This implementation uses the `github.actor` context variable to check if the user who triggered the workflow is the repository owner. If it is, the workflow allows the push; otherwise, it fails with an error message.