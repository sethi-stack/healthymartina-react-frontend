# AGENTS.md

This file defines how coding agents should work in `/Users/dj/Documents/Programming/healthymartina/healthymartina_app/react-front-app`.

## Goal

Make the React app cleaner, more consistent, and easier to maintain without introducing workaround-heavy code, styling noise, or new architectural drift.

## Stack To Respect

- Vite + React 18
- React Router
- TanStack Query for server state
- Zustand for shared client state
- SCSS for styling
- Jest + Testing Library for tests

## Core Working Rules

- Match the existing architecture before introducing anything new.
- Prefer improving the current pattern over adding a parallel pattern.
- Keep changes focused and local.
- Do not add dependencies unless they are clearly justified.
- Do not leave TODO-only solutions, temporary shims, or “we can fix later” workarounds.
- Fix root causes when reasonably possible, not symptoms.
- Do not rewrite large areas when a small targeted change will solve the problem.

## State Management

Use the right home for each kind of state.

### TanStack Query

Use React Query for server-backed data:

- Fetching API data
- Caching backend responses
- Mutations that create, update, or delete backend data
- Loading, error, and stale-data handling tied to API requests

Standards:

- Keep query logic close to `src/lib/api` and feature hooks when possible.
- Use stable query keys.
- Invalidate or update queries intentionally after mutations.
- Avoid duplicating server data in Zustand or component state unless there is a clear UI-only reason.

### Zustand

Use Zustand for shared client state that is not the backend source of truth:

- Auth session state
- Selected calendar context
- Cross-page UI state that genuinely needs to persist

Standards:

- Keep stores small and focused.
- Do not turn Zustand into a general dumping ground.
- Store derived values outside the store when practical.
- Persist only what the app truly needs across reloads.
- Prefer explicit actions over ad hoc direct state shape changes.

### Local Component State

Use local state for:

- Form inputs
- Modal open/close state
- Temporary UI selections
- Presentational toggles

Standards:

- Keep state as close as possible to where it is used.
- Lift state only when multiple siblings actually need shared ownership.
- Avoid prop drilling by refactoring structure before introducing global state.

## API And Data Flow

- Keep API calls in `src/lib/api`.
- Keep transformation logic out of JSX when it becomes non-trivial.
- Normalize awkward API responses in one place instead of spreading defensive checks across components.
- Prefer small feature hooks when they improve readability, but do not create hooks that only rename obvious logic.
- Handle loading, empty, error, and success states intentionally.

## Component Standards

- Components should have one clear responsibility.
- Split large files when they mix data fetching, business logic, and dense presentation.
- Prefer composition over deeply nested conditional JSX.
- Keep render functions readable.
- Extract repeated UI patterns only after the repetition is real.
- Avoid “god components” that own too many unrelated concerns.

## CSS And SCSS Standards

The app already uses SCSS tokens and mixins. Build on that instead of introducing noisy styling.

### Styling Principles

- Prefer calm, purposeful styling.
- No noisy styles: avoid excessive shadows, arbitrary gradients, stacked borders, over-animation, or decorative effects that do not serve the UI.
- Use spacing, typography, and contrast intentionally.
- Preserve the Healthy Martina visual language unless the task explicitly asks for redesign.

### SCSS Rules

- Reuse tokens and mixins from `src/assets/scss`.
- Avoid hardcoded colors, spacing, radii, and z-index values when tokens already exist.
- Prefer component-scoped SCSS files near the component when following the existing pattern.
- Keep selectors shallow and predictable.
- Avoid high-specificity selectors and `!important` unless there is a real documented reason.
- Do not patch layout issues with arbitrary negative margins or fragile pixel offsets when structure can be fixed cleanly.
- Do not duplicate style rules across multiple files if a shared token or mixin is the right solution.

### Responsive Behavior

- Ensure layouts work on mobile and desktop.
- Solve responsive issues with clear layout rules, not one-off overrides piled at the bottom of files.
- Test common breakpoints whenever changing layout-heavy components.

## No Workarounds

Do not ship “temporary” code as the real solution.

Avoid:

- Duplicated state to make timing bugs disappear
- DOM querying when React state/props should drive behavior
- Arbitrary `setTimeout` fixes for rendering issues without a documented necessity
- Copy-pasted logic between pages or components
- Boolean flags that hide a deeper state-model problem
- CSS hacks that compensate for incorrect markup structure

If a real fix would be too large, choose the smallest honest solution and leave the code in a cleaner state than before.

## File And Code Hygiene

- Keep naming consistent with surrounding files.
- Prefer small pure helper functions for reusable logic.
- Remove dead code, unused imports, and stale comments in touched areas.
- Add comments only when they explain intent or a non-obvious constraint.
- Do not add comment noise for obvious code.
- Keep functions readable before trying to make them clever.

## Testing Expectations

When behavior changes, add or update tests when the area already supports testing or the logic is important.

Prioritize tests for:

- Utility logic
- Data transformations
- State transitions
- Bug fixes that could regress

Do not add brittle tests that only mirror implementation details.

## Editing Rules For Agents

- Use `apply_patch` for manual file edits.
- Do not overwrite unrelated user changes.
- Check the current file contents before patching.
- Keep diffs tight and intentional.
- If a file is already in flux, integrate carefully instead of resetting or reformatting unrelated sections.
- Do not perform broad cleanup outside the task unless it directly improves the touched code safely.

## Decision Heuristics

When choosing between options, prefer the one that:

1. Fits the current architecture
2. Reduces long-term complexity
3. Keeps state ownership clear
4. Reuses the design tokens and SCSS patterns already present
5. Fixes the cause instead of layering another patch on top

## Definition Of Done

A task is not done unless:

- The solution is understandable
- The state ownership is appropriate
- The styling is consistent and not noisy
- The change does not rely on a fragile workaround
- The touched code is cleaner than it was before
