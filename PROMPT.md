# Rocky Mountain Aardvarks - Ralph Loop

@plan.md @activity.md @RALPH-PRD.md

## Your Mission

You are building a website for Rocky Mountain Aardvarks, a kids music class in Denver/Boulder. This is a React + Hono + Cloudflare D1 project.

**Linear Project:** [Rocky Mountain Aardvarks Website](https://linear.app/overphlowtank/project/rocky-mountain-aardvarks-website-308508a0195b)

## Instructions

1. **Read activity.md first** to understand current progress
2. **Read plan.md** to find the next task where `passes: false`
3. **Look up the Linear issue** for that task (see RALPH-PRD.md for mapping)
4. **Complete ONE task per iteration** (do not attempt multiple)
5. **Verify your work** - run `pnpm check` to ensure no TypeScript errors
6. **Update activity.md** with what you did
7. **Update plan.md** - change `passes: false` to `passes: true` for completed task
8. **Commit your changes** with a clear message including the issue ID
9. **Update Linear** - mark issue as Done and add completion comment
10. **If ALL tasks pass**, output: COMPLETE

## Linear Integration

When you complete a task, update Linear:

### Update Issue Status
Use `mcp__linear-server__update_issue` to mark as Done:
- Set `state` to "Done" or "Completed"
- Include the commit hash in a comment

### Add Completion Comment
Use `mcp__linear-server__create_comment` to log what was done:
```
Completed in commit `abc1234`

Changes:
- [list key changes]

Verified: pnpm check passes
```

### Issue ID Mapping (from RALPH-PRD.md)
| Phase | Task | Linear ID |
|-------|------|-----------|
| 1.1 | Wrangler D1 Setup | OPT-97 |
| 1.2 | Seed Database | OPT-98 |
| 2.1 | Auth Middleware | OPT-99 |
| 2.2 | Login UI | OPT-100 |
| 3.1 | AdminTeachers | OPT-101 |
| 3.2 | AdminTestimonials | OPT-102 |
| 3.3 | AdminLocations | OPT-103 |
| 3.4 | AdminClasses | OPT-104 |
| 3.5 | AdminSessions | OPT-105 |
| 3.6 | AdminPages | OPT-106 |
| 4.1 | Teachers Page | OPT-107 |
| 4.2 | Classes Page | OPT-108 |
| 4.3 | Locations Page | OPT-109 |
| 4.4 | About Page | OPT-110 |

## Technical Constraints

- React 19 with TypeScript strict mode
- Use existing shadcn/ui components from `client/src/components/ui/`
- Use react-hook-form + zod for forms
- Use the existing useApi hook for GET requests
- Use fetch for mutations (POST/PUT/DELETE)
- Match existing code style (see `client/src/pages/Home.tsx`)
- TailwindCSS for styling (no inline styles)

## Key Files

- `shared/schema.ts` - Drizzle schema and types
- `functions/api/[[route]].ts` - Hono API routes
- `client/src/pages/` - Page components
- `client/src/components/` - Shared components

## Quality Checks

Before marking a task as complete:
1. `pnpm check` passes (no TypeScript errors)
2. `pnpm dev` runs without errors
3. The feature works as described

## DO NOT

- Attempt multiple tasks in one iteration
- Commit if TypeScript errors exist
- Add new npm dependencies without clear need
- Skip updating activity.md
- Modify unrelated files
- Skip loading/error states in UI
- Skip updating Linear issue status

## Escape Hatch

If stuck after 3 attempts on same task:
1. Document the blocker in activity.md
2. Add a comment to the Linear issue explaining the blocker
3. List what you tried
4. Move to next task OR output: COMPLETE

## Git Workflow

- One commit per completed task
- Include Linear issue ID in commit message
- Format: "OPT-XXX: Add [feature]" or "OPT-XXX: Fix [issue]"
- Example: "OPT-97: Configure wrangler.toml for local D1"
- Do NOT: init repos, change remotes, or force push

## Completion Signal

When ALL tasks in plan.md have `passes: true`, output exactly:

COMPLETE
