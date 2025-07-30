# Pull Request Instructions

## Creating the Pull Request

1. Go to the following URL to create a new pull request:
   https://github.com/MarianStelianCraciun/rotrust/pull/new/fix-dependency-issues

2. Use the following information for your pull request:

### PR Title
Fix dependency issues: Pin bcrypt to version 3.2.2 for compatibility with passlib 1.7.4

### PR Description
```
## Problem
The application was failing to start with the following error:
```
error reading bcrypt version
Traceback (most recent call last):
  File "C:\Users\maria\AppData\Local\pypoetry\Cache\virtualenvs\rotrust-gD1LTbTO-py3.11\Lib\site-packages\passlib\handlers\bcrypt.py", line 620, in _load_backend_mixin
    version = _bcrypt.__about__.__version__
              ^^^^^^^^^^^^^^^^^
AttributeError: module 'bcrypt' has no attribute '__about__'
```

This error occurs because the latest version of bcrypt (4.x) is not compatible with the current version of passlib (1.7.4). The bcrypt package changed its internal structure, removing the `__about__` module that passlib depends on.

## Solution
This PR pins the bcrypt version to 3.2.2, which is known to be compatible with passlib 1.7.4. The following changes were made:

1. Updated `pyproject.toml` to specify bcrypt version 3.2.2
2. Updated `poetry.lock` to reflect the dependency change
3. Updated `requirements.txt` to specify the compatible version
4. Updated `setup.py` to ensure consistent dependency specifications

## Testing
The changes were tested by:
1. Installing the dependencies with the pinned version
2. Verifying that the application can start without the bcrypt version error

## Additional Notes
- This is a temporary fix until passlib is updated to support newer versions of bcrypt
- A more permanent solution would be to update passlib to a version that supports bcrypt 4.x, but that would require more extensive testing
```

3. Review the changes in the "Files changed" tab to ensure only the dependency-related files are included.

4. Submit the pull request by clicking the "Create pull request" button.

## After Creating the PR

1. Notify the team about the PR and request a review.
2. Once approved, the PR can be merged into the main branch.
3. After merging, the fix will be available to all team members who pull the latest changes.

## Future Considerations

Consider updating passlib to a version that supports newer versions of bcrypt when it becomes available. This would allow using the latest bcrypt version and potentially benefit from security improvements and bug fixes.