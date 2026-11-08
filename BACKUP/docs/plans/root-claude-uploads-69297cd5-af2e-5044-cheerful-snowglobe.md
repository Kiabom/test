# Plan: full backup (download and git)

## Context
The user wants a backup of everything done so far: code, docs, files, plans and notes. It has two forms:
- a downloadable archive,
- a `BACKUP/` folder pushed to git, with a `README.md` that has the requested headings.

Decisions:
- **Git target:** a new branch `backup/1403-04-17` in kiabom/test. The work branch stays untouched.
- **Contents:** everything.

## Steps
1. **Build `BACKUP/` in the scratchpad:**
   - `README.md` with exactly these sections, filled from the project:
     - `# How it was built`
     - `## Built with` (stack and versions)
     - `## Instructions` (install, run, login, presenter shortcut, tests, print/PDF)
     - `## To change it ✅` (where data, brand, users, filters, nav and dev labels live)
     - `## Never touch ❌` (audit chain, RBAC, clock anchor, seed determinism, legal weighing rules, no secrets)
   - `project.bundle`: a `git bundle` of all branches and history, restorable with `git clone project.bundle`.
   - `source/`: a snapshot of the current tree (no `node_modules`, no `.next`).
   - `docs/`: the repo docs, the plan file(s) from `/root/.claude/plans`, and the session notes and memory if a memory directory exists.
   - `artifacts/`: the latest PPTX/PDF decks and the sample report/ticket PDFs and screenshots that exist.
2. **Zip** it as `fanap-tozin-backup-1403-04-17.zip` and send it to the user (SendUserFile).
3. **Git:**
   - Create branch `backup/1403-04-17` from the current HEAD.
   - Add `BACKUP/` with `README.md`, `docs/` and `artifacts/`. Leave out the bundle and the zip if they are too large for git; the full source is already in the branch itself.
   - Commit and push. No PR.

## Verification
- `git clone project.bundle` into a temporary directory restores the code.
- The zip lists `BACKUP/README.md`.
- The pushed branch shows `BACKUP/README.md` with all five headings.
