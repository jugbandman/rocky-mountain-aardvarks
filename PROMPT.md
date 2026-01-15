# Rocky Mountain Aardvarks - Ralph Loop

@plan.md @activity.md

## Your Mission

You are building a website for Rocky Mountain Aardvarks, a kids music class in Denver/Boulder. This is a React + Hono + Cloudflare D1 project.

## Instructions

1. **Read activity.md first** to understand current progress
2. **Read plan.md** to find the next task where `passes: false`
3. **Complete ONE task per iteration** (do not attempt multiple)
4. **Verify your work** - run `pnpm check` to ensure no TypeScript errors
5. **Update activity.md** with what you did
6. **Update plan.md** - change `passes: false` to `passes: true` for completed task
7. **Commit your changes** with a clear message
8. **If ALL tasks pass**, output: COMPLETE

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

## Escape Hatch

If stuck after 3 attempts on same task:
1. Document the blocker in activity.md
2. List what you tried
3. Move to next task OR output: COMPLETE

## Git Workflow

- One commit per completed task
- Clear, single-line commit messages
- Do NOT: init repos, change remotes, or push
- Format: "Add: [feature]" or "Fix: [issue]"

## Completion Signal

When ALL tasks in plan.md have `passes: true`, output exactly:

COMPLETE
