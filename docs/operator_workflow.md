# Operator Workflow Documentation

This document records how we develop and maintain the EasyClock application, including past pain points and recommended processes.

## Development Philosophy

- **Prefer patches over full zips** whenever making improvements.
- Keep the project structure clean. Avoid versioned or nested folders.
- Document changes so future LLMs (or humans) can understand context quickly.
- Use `docs/repo_state.json` and `docs/Schema_drift.MD` as the source of truth when context is lost.

## Common Problems We Have Faced

### 1. Nested Folder Hell
- Repeatedly unzipping created folders like:
  - `employee-clock-improved (4)/employee-clock-improved`
- **Solution**: Always use `unzip -o filename.zip -d .` or clean the target folder first with `rm -rf`.

### 2. Patch vs Full Zip
- Full zips cause version fragmentation and confusion.
- Patches are smaller, faster, and preserve local changes.
- **Rule**: After the initial clean setup, all improvements should be delivered as `.patch` files.

### 3. Context Loss Between Threads
- When a new conversation starts, the LLM forgets the project structure.
- **Mitigation**: 
  - Maintain `docs/repo_state.json`
  - Maintain `docs/Schema_drift.MD`
  - Ask the user for their current working directory when unclear.

### 4. Terminal / Folder Navigation Issues
- Users often get lost between `Downloads`, `Applications`, and nested folders.
- **Recommendation**: Standardize on one clean location:
  ```bash
  ~/Applications/employee-clock-improved
  ```

## Recommended Daily Workflow

1. **Start of session**
   - Read `docs/repo_state.json`
   - Read `docs/Schema_drift.MD`
   - Confirm current working directory with user

2. **Making changes**
   - Make code changes in the clean project folder
   - Generate a `.patch` file
   - Provide the patch + clear apply instructions

3. **Delivering updates**
   - Prefer small, focused patches
   - Update `docs/repo_state.json` if architecture changes significantly
   - Update relevant `.md` files in `/docs`

4. **Testing**
   - Test on opBNB testnet
   - Verify geofence behavior
   - Check that balance and status refresh correctly

## Future Improvements to Process

- Create a small script (`apply-patch.sh`) that automates patch application + validation.
- Add automated checks (lint + build) before suggesting patches.
- Maintain a `CHANGELOG.md` in the root.

## Golden Rules

- Never assume the LLM remembers previous file changes across threads.
- Always clean up before giving new versions.
- Patches > Zips (after initial setup).
- Keep documentation in `/docs` up to date.
