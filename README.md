# MANIT Attendance Report System — Frontend

Role-based attendance analytics web app built as a final-year group project at **MANIT Bhopal** (Aug 2024 – May 2025). Faculty, Heads of Department, the Director and admins use it to view attendance reports, export them, and manage academic data.

**Stack:** React 18 · TypeScript · Vite · React Router · Zustand · Tailwind CSS (+ MUI) · TanStack Table · Recharts · Axios · xlsx / jsPDF · PWA (service worker)

## About this repository

Built as a team project at MANIT. I developed the frontend: UI, user flows and API integration. The two backend services, `AttendanceMain` and `AttendanceReport2`, live in separate repositories.

## What the app does

| Role | Features |
|---|---|
| Faculty | Weekly timetable, class report, teaching report (scheduled vs taken, unmarked dates) |
| HOD / Director | Faculty, class and student reports for the department or the institution |
| Admin | Departments, courses, sessions, branches, semesters, students, users, an approvals inbox, and bulk XLSX/CSV/JSON import with row-by-row validation |
| Student | Overall and monthly attendance per subject, with a chart |

Reports export to PDF (as a DOM capture or a data-driven table), Excel and PNG. The app can be installed as a PWA.

## Run it

```bash
npm ci
cp .env.example .env.local   # point VITE_BACKEND / VITE_REPORT_BACKEND at the APIs
npm run dev
```

`npm run build` produces a production build in `dist/`. `npm test` runs the test suite, and `npm run test:coverage` adds a coverage report.

Demo login: the login is still **mocked on the client**. `password123` works for any role. See "Known limitations".

## What I added after the project

| Change | Why |
|---|---|
| Removed secrets and personal data from the codebase | It had a hardcoded JWT and real staff and student details |
| Declared `lodash` and `jspdf` as direct dependencies | Both were imported but only installed through other packages |
| Fixed case-sensitive `pages/Admin` imports | The build failed on Linux (CI and hosting) |
| Moved API URLs and the token into environment variables (`.env.example`) | No environment details or secrets in source |
| Upgraded `@vitejs/plugin-react` from 1.3 to 4.x | The old version doesn't support Vite 6 and broke the test runner |
| Added a test suite with Vitest and React Testing Library: **35 tests** | Covers route guards, bulk-import validation, the cascading class selectors, the auth store and Excel export. The five modules under test have 100% line coverage |
| Fixed 4 bugs, each found by a test that failed first | (1) A branch import row that was both duplicated and already existing got a mismatched error message. (2) Every copy of a repeated branch code was rejected, so none could be imported. (3) A failed faculty submit threw a `ReferenceError`, leaving the loading toast stuck. (4) HOD login produced a user with no role, so the HOD dashboard couldn't be reached |
| Added GitHub Actions CI on Linux: lint of the maintained files, tests and build | Every push is checked, including case-sensitive imports |

Planned next:
- Widen linting beyond the files maintained so far.
- Merge the duplicated HOD and Director components.

## Known limitations (inherited, being worked on)

- Authentication is mocked on the client, and the role is kept in `localStorage`. It should use the backend JWT flow, with roles checked on the server.
- Tests cover the modules listed above, not the whole app yet. `tsc` reports about 180 inherited type errors, and `npm run build` doesn't type-check.
- About 50 `any` types. The HOD and Director field components are near-duplicates.
- Large image assets in `public/`, and the main JS bundle is about 2.4 MB unminified.
