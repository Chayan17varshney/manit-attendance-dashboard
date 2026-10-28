# MANIT Attendance Report System — Frontend

Role-based attendance analytics web app built as a final-year group project at **MANIT Bhopal** (Aug 2024 – May 2025). Faculty, Heads of Department, the Director and admins use it to view attendance reports, export them, and manage academic data.

**Stack:** React 18 · TypeScript · Vite · React Router · Zustand · Tailwind CSS (+ MUI) · TanStack Table · Recharts · Axios · xlsx / jsPDF · PWA (service worker)

## Team and credits

This repository continues the team's frontend. The original repository, with its full commit history, is
**[Yogananda1504/Frontend-ReportGeneration](https://github.com/Yogananda1504/Frontend-ReportGeneration)**.

| Person | Role |
|---|---|
| Chayan Varshney | Frontend developer (UI, user flows, API integration). Commits were pushed through team accounts |
| Yogananda Reddy | Team member, repository owner |
| Palak Agrawal | Team member |
| Pranjal Jain | Team member |

The two backend services, `AttendanceMain` and `AttendanceReport2`, were built by the team and live in separate repositories.

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

`npm run build` produces a production build in `dist/`.

Demo login: the login is still **mocked on the client**. `password123` works for any role. See "Known limitations".

## What I added in this fork

| Change | Why |
|---|---|
| Imported the snapshot with secrets and personal data removed | The original hardcoded a JWT, and it contained real staff and student details |
| Declared `lodash` and `jspdf` as direct dependencies | Both were imported but only installed through other packages |
| Fixed case-sensitive `pages/Admin` imports | The build failed on Linux (CI and hosting) |
| Moved API URLs and the token into environment variables (`.env.example`) | No environment details or secrets in source |

Planned next:
- A Vitest and React Testing Library test suite: route guards, bulk-import validation and cascading forms.
- GitHub Actions CI.
- Merge the duplicated HOD and Director components.

## Known limitations (inherited, being worked on)

- Authentication is mocked on the client, and the role is kept in `localStorage`. It should use the backend JWT flow, with roles checked on the server.
- No automated tests yet.
- About 50 `any` types. The HOD and Director field components are near-duplicates.
- Large image assets in `public/`, and the main JS bundle is about 2.4 MB unminified.
