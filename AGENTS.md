# Repository Guidelines

## Project Structure & Module Organization
- Core TypeScript sources live at the repo root: `nexagent.ts` exposes the SDK entry point, `client.ts` wires HTTP helpers, `api.ts` houses the generated REST client, and `daily-guards.ts` contains Daily-specific guards.
- Tests reside in `__tests__/` with Jest specs named `*.test.ts`. Keep new integration stubs inside `example/`, which is a minimal Vite + React playground for validating local builds.
- Generated assets land in `dist/` after builds and should not be checked in. Regenerate API bindings with `generate-api.sh` whenever the backend Swagger schema shifts.

## Build, Test, and Development Commands
- `npm install` — install dependencies (Node 18+ is required).
- `npm run build` — compile TypeScript and emit declarations into `dist/`; builds fail on type errors.
- `npm test` — run the Jest suite in `__tests__/`.
- `npm run generate-api` — refresh `api.ts` using `swagger-typescript-api`; run this before commits that rely on API schema changes.
- `npm run dev:example` — pack the SDK locally and launch the example app for manual verification.

## Coding Style & Naming Conventions
- Use TypeScript, favoring explicit `type`/`interface` exports and async/await over raw promises.
- Follow the established two-space indentation and single quotes (except for template strings). Keep imports sorted by module path proximity.
- Export classes and React-style hooks in `PascalCase`; functions, constants, and variables in `camelCase`; environment flags in `UPPER_SNAKE_CASE`.
- Avoid introducing lint rules ad hoc—mirror existing patterns and keep public API signatures stable.

## Testing Guidelines
- Extend Jest specs in `__tests__/`, mirroring the file under test (e.g., `nexagent.test.ts` for `nexagent.ts`).
- Mock network and Daily APIs rather than hitting real services; assert observable behavior and event emission order.
- Target at least the same coverage touchpoints as neighboring tests. When adding features, include regression tests that fail if the new logic is removed.
- Run `npm test` before opening a pull request and note any skipped tests with justification.

## Commit & Pull Request Guidelines
- Match the repository history: use Conventional Commit prefixes (`feat:`, `fix:`, `chore:`) and add ticket IDs when applicable (e.g., `NA-1234: ...`).
- Limit commits to focused changes; prefer squashing fixups before merge.
- Pull requests should describe the problem, the solution, and testing performed. Link to relevant issues, attach logs or screen captures from the `example/` build when UI or call behavior changes, and confirm all commands above succeed locally.
