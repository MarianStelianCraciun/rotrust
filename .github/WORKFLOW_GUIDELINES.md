# Workflow Guidelines for Rotrust

This document provides comprehensive guidelines for maintaining an accurate and concise workflow in the Rotrust project. Following these guidelines will help ensure consistency, quality, and efficiency in our development process.

## Table of Contents
- [Commit Message Guidelines](#commit-message-guidelines)
- [Branching Strategy](#branching-strategy)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)
- [Issue Management](#issue-management)
- [Release Process](#release-process)

## Commit Message Guidelines

Clear and consistent commit messages are essential for maintaining a readable git history and understanding changes over time.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type
Must be one of the following:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

#### Scope
The scope should be the name of the module or component affected (e.g., auth, properties, transactions).

#### Subject
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end

#### Body
- Use the imperative, present tense
- Include motivation for the change and contrast with previous behavior
- Wrap text at 72 characters

#### Footer
- Reference issues and pull requests that this commit addresses
- Use format: "Fixes #123" or "Closes #123"

### Examples

```
feat(auth): implement JWT authentication

Implement JWT-based authentication system with token refresh.
Add user login and registration endpoints.

Closes #45
```

```
fix(properties): correct property search filter

Fix issue where property search filter was not correctly applying
size constraints. Update query parameters to handle range values.

Fixes #78
```

## Branching Strategy

We follow a simplified Git Flow branching strategy:

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features (optional for smaller teams)

### Supporting Branches
- **feature/**: For new features (e.g., `feature/user-authentication`)
- **fix/**: For bug fixes (e.g., `fix/login-error`)
- **docs/**: For documentation changes (e.g., `docs/api-documentation`)
- **refactor/**: For code refactoring (e.g., `refactor/property-service`)
- **release/**: For release preparation (e.g., `release/v1.2.0`)
- **hotfix/**: For urgent production fixes (e.g., `hotfix/critical-auth-bug`)

### Branch Naming Conventions
- Use lowercase letters and hyphens
- Include a descriptive name after the prefix
- Example: `feature/user-profile-management`

### Branch Lifecycle
1. Create a branch from `main` (or `develop` if used)
2. Work on your changes
3. Create a pull request to merge back to the original branch
4. After review and approval, merge and delete the feature branch

## Pull Request Process

Pull requests (PRs) are the primary method of introducing changes to the codebase.

### PR Creation Guidelines
1. **Title**: Use the same format as commit messages: `<type>(<scope>): <subject>`
2. **Description**: Include:
   - Summary of changes
   - Motivation and context
   - List of specific changes
   - Screenshots for UI changes
   - Any breaking changes
   - Related issue numbers

### PR Template
```markdown
## Description
[Provide a brief description of the changes]

## Motivation and Context
[Why is this change required? What problem does it solve?]

## Types of changes
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Checklist:
- [ ] My code follows the code style of this project
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests passed
- [ ] My changes generate no new warnings
```

### PR Size Guidelines
- Keep PRs focused on a single issue or feature
- Aim for less than 500 lines of code changes
- Split large changes into multiple PRs when possible

### PR Review Requirements
- At least one approval from a team member
- All automated checks must pass
- All review comments must be resolved

## Code Review Guidelines

Code reviews are critical for maintaining code quality and knowledge sharing.

### Reviewer Responsibilities
1. **Timeliness**: Review PRs within 24 business hours
2. **Thoroughness**: Check for:
   - Code correctness
   - Test coverage
   - Documentation
   - Security concerns
   - Performance implications
   - Adherence to coding standards

### Review Comments
- Be specific and clear about what needs to be changed
- Explain why a change is needed, not just what
- Provide suggestions when possible
- Use a constructive and respectful tone

### Author Responsibilities
- Respond to all comments
- Make requested changes or explain why they shouldn't be made
- Keep the PR updated with the latest main branch changes
- Break down large PRs if requested

## Testing Requirements

Proper testing ensures code reliability and reduces regression bugs.

### Test Coverage Requirements
- Minimum 80% code coverage for new code
- All critical paths must be tested
- Edge cases should be covered

### Types of Tests Required
1. **Unit Tests**: For individual functions and methods
2. **Integration Tests**: For interactions between components
3. **API Tests**: For testing API endpoints
4. **UI Tests**: For frontend components (when applicable)

### Test Naming Conventions
- Test names should clearly describe what is being tested
- Format: `test_[what]_[expected behavior]`
- Example: `test_user_login_with_invalid_credentials_returns_error`

### Running Tests
- All tests must pass before merging
- Tests should be run locally before creating a PR
- CI pipeline will run tests automatically

## Documentation Standards

Good documentation is essential for project maintainability and onboarding new team members.

### Code Documentation
- All public functions, classes, and modules must have docstrings
- Complex algorithms should include inline comments
- Use clear variable and function names that reduce the need for comments

### API Documentation
- All API endpoints must be documented
- Include:
  - HTTP method
  - URL
  - Request parameters
  - Request body schema
  - Response schema
  - Error responses
  - Example requests and responses

### Project Documentation
- README.md should provide an overview of the project
- CONTRIBUTING.md should explain how to contribute
- WORKFLOW_GUIDELINES.md (this document) explains the development workflow
- Additional documentation should be placed in the `docs/` directory

## Issue Management

Effective issue tracking helps organize work and track progress.

### Issue Creation Guidelines
1. **Title**: Clear, concise description of the issue
2. **Description**: Include:
   - Detailed description of the problem or feature
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior (for bugs)
   - Screenshots or videos (if applicable)
   - Environment details (for bugs)

### Issue Types
- **Bug**: Something isn't working as expected
- **Feature**: New functionality
- **Enhancement**: Improvement to existing functionality
- **Documentation**: Documentation changes
- **Technical Debt**: Code improvements with no functional changes

### Issue Prioritization
- **Critical**: Must be fixed immediately
- **High**: Should be addressed in the current sprint
- **Medium**: Should be addressed in the next few sprints
- **Low**: Nice to have, no specific timeline

### Issue Lifecycle
1. **Open**: Issue is created
2. **Triage**: Issue is reviewed, categorized, and prioritized
3. **In Progress**: Work has started on the issue
4. **Review**: Solution is being reviewed
5. **Done**: Issue is resolved and closed

## Release Process

A structured release process ensures reliable and predictable software delivery.

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **Major version (X.0.0)**: Incompatible API changes
- **Minor version (0.X.0)**: Backwards-compatible new features
- **Patch version (0.0.X)**: Backwards-compatible bug fixes

### Release Preparation
1. Create a `release/vX.Y.Z` branch from `develop` or `main`
2. Update version numbers in relevant files
3. Update CHANGELOG.md with all changes since the last release
4. Perform final testing and bug fixes
5. Create a PR to merge into `main`

### Release Execution
1. Merge the release PR into `main`
2. Tag the release in git: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
3. Push the tag: `git push origin vX.Y.Z`
4. Create a GitHub release with release notes
5. Deploy to production

### Hotfix Process
1. Create a `hotfix/description` branch from `main`
2. Fix the issue
3. Create a PR to merge into `main`
4. After merging, create a new patch release

---

By following these guidelines, we can maintain a more accurate and concise workflow, resulting in higher quality code, better collaboration, and more efficient development processes.