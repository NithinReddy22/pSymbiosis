# Contributing to Perf Insight — Frontend

This guide ensures that all contributors can collaborate on the frontend repo without code loss or merge conflicts.

---

## Repo Ownership

| Repo | Owner GitHub Account | Primary Dev(s) |
|------|---------------------|----------------|
| `NithinReddy22/pSymbiosis` (frontend) | NithinReddy22 | Nithin |
| `Nithish23003/pSymbiosis` (backend) | Nithish23003 | Nithish |

---

## Branch Strategy

```
main            ← always stable, deployable
  └── feat/<short-description>     ← new views or features
  └── fix/<short-description>      ← bug fixes
  └── docs/<short-description>     ← documentation only
  └── chore/<short-description>    ← dependency bumps, config
```

**Never commit directly to `main`.** Always use a branch + Pull Request.

---

## Day-to-Day Workflow

### Before starting any work

```bash
git checkout main
git pull origin main          # get latest changes first
git checkout -b feat/my-feature
```

### While working

```bash
git add src/components/views/MyView.tsx
git commit -m "feat: add monthly trend chart to AssociateView"
```

### Before opening a PR

```bash
git fetch origin
git rebase origin/main        # replay your commits on top of latest main
# resolve any conflicts, then:
git push origin feat/my-feature
```

### Staying in sync (daily habit)

```bash
git fetch origin
git rebase origin/main
```

---

## Commit Message Format

Use **Conventional Commits**:

```
<type>: <short description>
```

| Type | When to use |
|------|-------------|
| `feat` | New view, component, or service |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | CSS / layout changes (no logic change) |
| `refactor` | Restructuring without behaviour change |
| `chore` | Dependency updates, config |

**Examples:**
```
feat: add SprintTrendChart sparkline to ExecutiveOverview
fix: correct anti-gaming flag count badge display
docs: add component architecture diagram to docs/
style: tighten sidebar navigation padding on mobile
chore: bump lucide-react to v0.470
```

---

## Pull Request Rules

1. **Target `main`** for all PRs.
2. Title = same Conventional Commits format.
3. Description must include: what changed, how to verify it visually, any backend API dependency.
4. **Minimum 1 review** — no self-merges.
5. Run `npm run build` locally before opening PR — ensure zero TypeScript errors.
6. Delete branch after merge.

---

## Avoiding Conflicts

### `src/types/index.ts`
This is the shared contract between all components and services. **Coordinate before changing types** — a type rename touches many files. Use find-and-replace carefully, never just rename in one place.

### `src/context/AppContext.tsx`
Only one person should change the context shape at a time. If you need a new state slice, open a PR first so others can rebase cleanly.

### `src/data/initialSeedData.ts` / `defaultModels.ts`
Treat these as shared fixtures. Changes here affect every screen. Discuss before modifying.

### `src/services/scoringEngine.ts`
The scoring algorithm must stay in sync with the backend Java `ScoringService`. If you change a formula or add a dimension:
1. Update `scoring-engine.md` in `docs/`
2. Notify the backend dev (Nithish) so the Java implementation stays aligned

---

## Running Locally

```bash
npm install
npm run dev           # http://localhost:5173
npm run build         # verify 0 TypeScript errors before PR
npm run preview       # preview the production build
```

**Backend:** Expects the Perf Insight API at `http://localhost:8080`. See the backend repo for setup instructions.

---

## TypeScript Rules

- **No `any`** — use proper types from `src/types/index.ts`.
- Keep all shared interfaces in `src/types/index.ts`, not inline.
- If you add a new data model, add it to types first, then implement.

---

## Component Guidelines

- One component per file.
- Keep components under ~200 lines — extract logic to a service if it grows larger.
- Use the common components (`ScoreBadge`, `RadarChart`, `SprintTrendChart`) rather than reimplementing.
- `AppContext` is the single source of truth — don't create local state for data that exists there.

---

## Coordinating With the Backend

| Situation | What to do |
|-----------|-----------|
| Backend adds a new endpoint | Update `src/services/connectorService.ts` or `syncService.ts` to consume it |
| Backend changes a DTO shape | Update matching interface in `src/types/index.ts` |
| Scoring algorithm changes | Update `src/services/scoringEngine.ts` AND `docs/scoring-engine.md` |
| New auth role or role mapping | Update role checks in `AppContext.tsx` and relevant view guards |

---

## If You Get Stuck

```bash
# Discard local uncommitted changes to a file
git restore src/path/to/file.tsx

# View what's different from main
git diff origin/main

# Stash work-in-progress before switching
git stash
git stash pop

# Undo last commit, keep changes
git reset --soft HEAD~1
```

Contact the repo owner (Nithin, NithinReddy22) before doing any force-push to `main`.
